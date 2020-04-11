module.exports = {
  SQL_DUP_CODE: 'ER_DUP_ENTRY',

  INVALID_SESSION_ID: (id) => {
    const err = new Error(`There exists no session with ID: '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_CANDIDATE_ID: (id) => {
    const err = new Error(`There exists no candidate with ID '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_MEMBER_ID: (id) => {
    const err = new Error(`There exists no team member with ID '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_TOPIC_ID: (id) => {
    const err = new Error(`There exists no topic with ID '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_REVIEW_ID: (id) => {
    const err = new Error(`There exists no review with ID '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_ARTICLE_ID: (id) => {
    const err = new Error(`There exists no article with ID '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_USER_ID: (id) => {
    const err = new Error(`There exists no user with ID '${id}'.`);
    err.status = 404;
    return err;
  },
  INVALID_PAGE_NAME: (name) => {
    const err = new Error(`A page with name '${name}' does not exist.`);
    err.status = 404;
    return err;
  },

  NONEXISTENT_CANDIDATE: () => {
    const err = new Error("This candidate does not exist.");
    err.status = 404;
    return err;
  },
  NONEXISTENT_SESSION: () => {
    const err = new Error("This session does not exist.");
    err.status = 404;
    return err;
  },
  NONEXISTENT_MEMBER: (isExecutive = false) => {
    const title = isExecutive ? 'executive' : 'member';
    const err = new Error(`This ${title} does not exist.`);
    err.status = 404;
    return err;
  },
  NONEXISTENT_REVIEW: () => {
    const err = new Error("This topic does not exist.");
    err.status = 404;
    return err;
  },
  NONEXISTENT_TOPIC: () => {
    const err = new Error("This topic does not exist.");
    err.status = 404;
    return err;
  },
  NONEXISTENT_ARTICLE: () => {
    const err = new Error("This article does not exist.");
    err.status = 404;
    return err;
  },
  NONEXISTENT_PAGE: () => {
    const err = new Error("This page does not exist.");
    err.status = 404;
    return err;
  },

  DUPLICATE_CANDIDATE_ID: (id) => {
    const err = new Error(`A candidate with ID '${id}' already exists in the database.`);
    err.status = 409;
    return err;
  },
  DUPLICATE_USERNAME: () => {
    const err = new Error("The submitted username already exists.");
    err.status = 409;
    return err;
  },
  DUPLICATE_EMAIL_ADDRESS: () => {
    const err = new Error("The submitted email address already exists.");
    err.status = 409;
    return err;
  },

  NONEXISTENT_CREDENTIALS: () => {
    const err = new Error("Your username or password is incorrect.");
    err.status = 404;
    return err;
  },
  NONEXISTENT_EMAIL_ADDRESS: () => {
    const err = new Error("The submitted email address does not exist.");
    err.status = 404;
    return err;
  },
  INVALID_EMAIL_ADDRESS: () => {
    const err = new Error(`Your email address is invalid.`)
    err.status = 400;
    return err;
  },
  INCORRECT_PASSWORD: () => {
    const err = new Error(`Your current password is incorrect.`)
    err.status = 401;
    return err;
  },
  PASSWORD_MISMATCH: () => {
    const err = new Error(`Your passwords do not match.`)
    err.status = 400;
    return err;
  },


  UNAUTHORIZED_REQUEST: () => {
    const err = new Error(`You are not authorized to perform this request.`);
    err.status = 403;
    return err;
  },
  NOT_AUTHENTICATED: () => {
    const err = new Error(`You are not authenticated.`);
    err.status = 401;
    return err;
  },
  JWT_FAILURE: (message) => {
    const err = new Error();
    err.status = 401;
    if (message === 'jwt expired'){
      err.message = `Your access token is expired.`;
      // `Awkward. The link you followed has expired. Don't say we didn't warn ya!`
    } else {
      err.message = message;
    }
    return err;
  },
  VERIFICATION_NOT_REQUIRED: () => {
    const err = new Error(`Verification not required.`);
    err.status = 403;
    return err;
  }
}