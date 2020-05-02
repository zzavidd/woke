const async = require('async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require("email-validator");

const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

const emails = require('./emails.js');
const ERROR = require('./errors.js');
const filer = require('./filer.js');
const {
  verifyToken,
  validateReq,
  logUserActivity
} = require('./middleware.js');
const {
  respondToClient
} = require('./response.js');
const SQL = require('./sql.js');

const sessionsRoutes = require('./api/routes/sessions');
const candidatesRoutes = require('./api/routes/candidates');
const membersRoutes = require('./api/routes/members');
const topicsRoutes = require('./api/routes/topics');
const reviewsRoutes = require('./api/routes/reviews');
const articlesRoutes = require('./api/routes/articles');

const CLEARANCES = require('../constants/clearances.js');
const {
  DIRECTORY,
  ENTITY
} = require('../constants/strings.js');

const emailsOn = process.env.NODE_ENV === 'production' || process.argv.includes('--emails');
if (!emailsOn) console.warn("Emails are turned off.");

module.exports = function (app, conn) {

  /** Log user activity on each request */
  app.use('/api', logUserActivity(conn));

  // sessions routes
  app.use('/api/v1/sessions', sessionsRoutes);

  // candidates routes
  app.use('/api/v1/candidates', candidatesRoutes);

  // members routes
  app.use('/api/v1/members', membersRoutes);

  // topics routes
  app.use('/api/v1/topics', topicsRoutes);

  // reviews routes
  app.use('/api/v1/reviews', reviewsRoutes);

  // articles routes
  app.use('/api/v1/articles', articlesRoutes);

  /** Retrieve all users */
  app.get('/api/v1/users', verifyToken(CLEARANCES.ACTIONS.VIEW_USERS), function (req, res) {
    const sql = SQL.USERS.READ.ALL("id, firstname, lastname, clearance, username, email, createTime, lastActive");
    conn.query(sql, function (err, users) {
      respondToClient(res, err, 200, users);
    });
  });

  /** Retrieve individual user */
  app.get('/api/v1/users/:id', validateReq, function (req, res) {
    // TODO: Differentiate between self-reading and admin-reading.
    const id = req.params.id;
    const sql = SQL.USERS.READ.SINGLE("id, firstname, lastname, clearance, username, email, createTime, lastActive");

    conn.query(sql, id, function (err, [user] = []) {
      if (err) return respondToClient(res, err);
      if (!user) err = ERROR.INVALID_ENTITY_ID(ENTITY.USER, id);
      respondToClient(res, err, 200, user);
    });
  });

  /** Add or register a new user */
  app.post('/api/v1/users', validateReq, function (req, res) {
    const {
      firstname,
      lastname,
      email,
      username,
      password1,
      password2,
      subscribe
    } = req.body;

    if (!validator.validate(email)) return respondToClient(res, ERROR.INVALID_EMAIL_ADDRESS());
    if (password1 !== password2) return respondToClient(res, ERROR.PASSWORD_MISMATCH());

    async.waterfall([
      function (callback) {
        /** Hash entered password */
        bcrypt.hash(password1, 8, function (err, hash) {
          err ? callback(err) : callback(null, hash);
        });
      },
      function (hash, callback) {
        /** Insert new user into database */
        const {
          sql,
          values
        } = SQL.USERS.CREATE(req.body, hash);
        conn.query(sql, [values], function (err, result) {
          if (err) return callback(err);

          const user = {
            id: result.insertId,
            firstname,
            lastname,
            username,
            email,
            clearance: 1
          };

          // Subscribe user to mailing list if allowed
          if (subscribe) subscribeUserToMailingList(user);
          callback(null, user);
        });
      },
      function (user, callback) { // Generate verification token to be sent via email
        jwt.sign({
          user
        }, process.env.JWT_SECRET, {
          expiresIn: '24h'
        }, (err, token) => {
          if (err) return callback(err);
          if (emailsOn) emails().sendWelcomeEmail(user, token);
          callback(null, user)
        });
      },
      function (user, callback) { // Pass authenticated user information to client with access token
        jwt.sign({
          user
        }, process.env.JWT_SECRET, {
          expiresIn: '2h'
        }, (err, token) => {
          if (err) return callback(err);
          callback(null, {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            clearance: user.clearance,
            username: user.username,
            email: user.email,
            token
          });
        });
      }
    ], function (err, user) {
      if (err && err.code === ERROR.SQL_DUP_CODE) {
        if (err.sqlMessage.includes("email")) {
          err = ERROR.DUPLICATE_EMAIL_ADDRESS();
        } else if (err.sqlMessage.includes("username")) {
          err = ERROR.DUPLICATE_USERNAME();
        }
      }
      respondToClient(res, err, 201, user);
    });
  });

  /* Log in / authenticate user */
  app.post('/api/v1/users/login', validateReq, function (req, res) {
    const {
      username,
      password,
      remember
    } = req.body;

    async.waterfall([
      function (callback) { // Attempt to retrieve user
        const {
          sql,
          values
        } = SQL.USERS.READ.LOGIN(username);
        conn.query(sql, values, function (err, [user] = []) {
          if (err) return callback(err);
          if (!user) return callback(ERROR.NONEXISTENT_CREDENTIALS());

          const passwordIsIncorrect = !bcrypt.compareSync(password, user.password) && !(user.password == password);
          if (passwordIsIncorrect) return callback(ERROR.NONEXISTENT_CREDENTIALS());

          callback(null, user);
        });
      },
      function (user, callback) { // Assign access token to user
        jwt.sign({
          user
        }, process.env.JWT_SECRET, {
          expiresIn: remember ? '30d' : '2h'
        }, (err, token) => {
          if (err) return callback(err);
          user.token = token;
          callback(null, user);
        });
      }
    ], function (err, user) {
      respondToClient(res, err, 200, user);
    });
  });

  /** Change user's username in database */
  app.put('/api/v1/users/:id/username', verifyToken(CLEARANCES.ACTIONS.CHANGE_ACCOUNT), function (req, res) {
    const {
      id
    } = req.params;
    const {
      username
    } = req.body;

    const {
      sql,
      values
    } = SQL.USERS.UPDATE('username', id, username);
    conn.query(sql, values, function (err, result) {
      if (err) {
        const duplicateUsername = err.code === ERROR.SQL_DUP_CODE && err.sqlMessage.includes("username");
        if (duplicateUsername) return respondToClient(res, ERROR.DUPLICATE_USERNAME());
        return respondToClient(res, err);
      }
      if (result.affectedRows === 0) return respondToClient(res, ERROR.INVALID_ENTITY_ID(ENTITY.USER, id));

      respondToClient(res, err, 200);
    });
  });

  /** Change user's password in database */
  app.put('/api/v1/users/:id/password', verifyToken(CLEARANCES.ACTIONS.CHANGE_ACCOUNT), function (req, res) {
    const {
      id
    } = req.params;
    const {
      oldPassword,
      newPassword
    } = req.body;

    async.waterfall([
      function (callback) { // Get current password of user
        conn.query(SQL.USERS.READ.SINGLE(), id, function (err, [user] = []) {
          if (err) return callback(err);
          if (!user) return callback(ERROR.INVALID_ENTITY_ID(ENTITY.USER, id));
          callback(null, user.password);
        });
      },
      function (password, callback) { // Verify that current password is valid
        if (!(bcrypt.compareSync(oldPassword, password) || oldPassword === password)) {
          callback(ERROR.INCORRECT_PASSWORD());
        } else {
          callback(null);
        }
      },
      function (callback) { // Hash new password
        bcrypt.hash(newPassword, 8, function (err, hash) {
          err ? callback(err) : callback(null, hash);
        });
      },
      function (hash, callback) { // Store new hashed password
        const {
          sql,
          values
        } = SQL.USERS.UPDATE('password', id, hash);
        conn.query(sql, values, function (err) {
          err ? callback(err) : callback(null);
        });
      }
    ], function (err) {
      respondToClient(res, err, 200);
    });
  });

  /** Change user's clearance */
  app.put('/api/v1/users/:id/clearance/:value', verifyToken(CLEARANCES.ACTIONS.CRUD_USERS), function (req, res) {
    const {
      id,
      value
    } = req.params;
    const {
      sql,
      values
    } = SQL.USERS.UPDATE('clearance', id, value);
    conn.query(sql, values, function (err) {
      respondToClient(res, err, 200);
    });
  });

  /** Delete a user */
  app.delete('/api/v1/users/:id', verifyToken(CLEARANCES.ACTIONS.DELETE_ACCOUNT), function (req, res) {
    // TODO: Differentiate between self-deletion and admin-deletion.
    const id = req.params.id;
    conn.query(SQL.USERS.DELETE, id, function (err, result) {
      if (err) return respondToClient(res, err);
      if (result.affectedRows === 0) err = ERROR.INVALID_ENTITY_ID(ENTITY.USER, id);
      respondToClient(res, err, 204);
    });
  });

  /** Purge added users */
  app.purge('/api/v1/users', verifyToken(9), function (req, res) {
    if (process.env.NODE_ENV === 'production') return respondToClient(res, ERROR.UNAUTHORIZED_REQUEST());
    conn.query(SQL.USERS.CLEAR, function (err) {
      respondToClient(res, err, 204);
    });
  });

  /** Resend the verification email to user's email address */
  app.notify('/api/v1/users/:id/email/verify', validateReq, function (req, res) {
    const {
      id
    } = req.params;

    async.waterfall([
      function (callback) { // Retrieve user from database
        const sql = SQL.USERS.READ.SINGLE('id, firstname, lastname, clearance, username, email');
        conn.query(sql, id, function (err, [user] = []) {
          if (err) return callback(err);
          if (!user) return callback(ERROR.INVALID_USER_ID());
          callback(null, user);
        });
      },
      function (user, callback) { // Generate verification token to send via email
        jwt.sign({
          user
        }, process.env.JWT_SECRET, {
          expiresIn: '30m'
        }, (err, token) => {
          if (err) return callback(err);
          if (!emailsOn) return callback(null, {
            token
          });
          emails(callback, [{
            token
          }]).resendVerificationEmail(user, token);
        });
      },
    ], function (err, token) {
      respondToClient(res, err, 200, token);
    });
  });

  /** Verify a user's account */
  app.patch('/api/v1/users/:token/verify', function (req, res) {
    const {
      token
    } = req.params;

    async.waterfall([
      function (callback) { // Verify the given token
        jwt.verify(token, process.env.JWT_SECRET, (err, {
          user
        } = {}) => {
          err ? callback(err) : callback(null, user);
        });
      },
      function (user, callback) { // Change user's clearance to indicate verification
        if (user.clearance > 1) return callback(ERROR.VERIFICATION_NOT_REQUIRED());
        const {
          sql,
          values
        } = SQL.USERS.UPDATE('clearance', user.id, 2)
        conn.query(sql, values, function (err) {
          if (err) return callback(err);
          user.clearance = 2;
          callback(null, user);
        });
      }
    ], function (err, user) {
      respondToClient(res, err, 200, user);

      // TODO: Review when doing routes
      // err ? renderErrorPage(req, res, err, server) : res.redirect(`/account?verified=${token}`);
    });
  });

  /** Send account recovery email */
  app.notify('/api/v1/users/recovery', validateReq, function (req, res) {
    const {
      email
    } = req.body;

    async.waterfall([
      function (callback) { // Retrieve user using email address
        const sql = SQL.USERS.READ.RECOVERY('id, firstname, lastname, clearance, email, username');
        conn.query(sql, email, function (err, [user] = []) {
          if (err) return callback(err);
          if (!user) return callback(ERROR.NONEXISTENT_EMAIL_ADDRESS());
          callback(null, user);
        });
      },
      function (user, callback) { // Generate recovery token to be sent via email
        jwt.sign({
          user
        }, process.env.JWT_SECRET, {
          expiresIn: '30m'
        }, (err, token) => {
          if (err) return callback(err);
          if (!emailsOn) return callback(null, {
            token
          });
          emails(callback, [{
            token
          }]).sendAccountRecoveryEmail(user, token);
        });
      },
    ], function (err, token) {
      respondToClient(res, err, 200, token);
    });
  });

  /** Change a user's password from reset */
  app.patch('/api/v1/users/password/reset', function (req, res) {
    const {
      token,
      password
    } = req.body;

    async.waterfall([
      function (callback) { // Verify the given token
        jwt.verify(token, process.env.JWT_SECRET, (err, {
          user
        }) => {
          err ? callback(err) : callback(null, user);
        });
      },
      function (user, callback) { // Hash new password
        bcrypt.hash(password, 8, function (err, hash) {
          err ? callback(err) : callback(null, user.id, hash);
        });
      },
      function (id, hash, callback) { // Update user's password in database
        const {
          sql,
          values
        } = SQL.USERS.UPDATE('password', id, hash)
        conn.query(sql, values, function (err, result) {
          if (err) return callback(err);
          if (result.affectedRows === 0) err = ERROR.INVALID_ENTITY_ID(ENTITY.USER, id);
          err ? callback(err) : callback(null);
        });
      }
    ], function (err) {
      respondToClient(res, err, 200);
    });
  });

  /** Update information pages */
  app.put('/api/v1/pages', verifyToken(CLEARANCES.ACTIONS.EDIT_PAGE), function (req, res) {
    const {
      page,
      text
    } = req.body;
    const {
      sql,
      values
    } = SQL.PAGES.UPDATE(page, text);

    conn.query(sql, values, function (err, result) {
      if (err) return respondToClient(res, err);
      if (result.affectedRows === 0) err = ERROR.INVALID_PAGE_NAME(page);
      respondToClient(res, err, 200);
    });
  });
}

/** Subscribe new user to Mailchimp mailing list */
const subscribeUserToMailingList = (user) => {
  mailchimp.post(`/lists/${process.env.MAILCHIMP_LISTID}/members`, {
      email_address: user.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: user.firstname,
        LNAME: user.lastname
      }
    })
    .then(results => console.log(results))
    .catch(err => console.log(err.toString()));
}