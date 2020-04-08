const SESSIONS = {
  /**
   * Constructs the SQL statement to create a session.
   * @param {object} session - The object containing the session details.
   * @returns {string} The constructed statement.
   */
  CREATE: (session) => {
    const sql = "INSERT INTO sessions (title, dateHeld, timeHeld, image, slug, description) VALUES ?";
    const values = [[session.title, session.dateHeld, session.timeHeld, session.image, session.slug, session.description]];
    return { sql, values };
  },

  READ: {
    /** The SQL statement to return all sessions. */
    ALL: "SELECT * FROM sessions",

    /**
     * Constructs the SQL statement to return information for a single session.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    SINGLE: (fields = '*') => {
      const sql = `SELECT ${fields} FROM sessions WHERE ID = ?`;
      return sql;
    },

    /** The SQL statement to return a random upcoming session. */
    UPCOMING: "SELECT * FROM sessions WHERE dateheld > NOW() ORDER BY RAND() LIMIT 1",

    /** The SQL statement to return the latest session. */
    LATEST: "SELECT * FROM sessions ORDER BY dateHeld DESC LIMIT 1",
  },

  /**
   * Constructs the SQL statement to update a session.
   * @param {number} id - The identifier of the session.
   * @param {object} session - The object containing the session details.
   * @param {boolean} imageHasChanged - Indicates whether the image has changed in this request.
   * @returns {string} The constructed statement.
   */
  UPDATE: (id, session, imageHasChanged) => {
    let sql = "UPDATE sessions SET title = ?, dateHeld = ?, timeHeld = ?, slug = ?, description = ? WHERE id = ?";
    let values = [session.title, session.dateHeld, session.timeHeld, session.slug, session.description, id];

    if (imageHasChanged){
      sql = appendFieldToUpdateQuery('image', sql);
      values = insertFieldInValues(session.image, values);
    }

    return { sql, values };
  },

  /** The SQL statement to delete a session. */
  DELETE: "DELETE FROM sessions WHERE id = ?"
};

const CANDIDATES = {
  /**
   * Constructs the SQL statement to create a candidate.
   * @param {object} candidate - The object containing the candidate details.
   * @returns {string} The constructed statement.
   */
  CREATE: (candidate) => {
    const sql = "INSERT INTO candidates (id, name, image, birthday, ethnicity, socials, occupation, description,author_id, date_written) VALUES ?";
    const values = [[candidate.id, candidate.name, candidate.image, candidate.birthday, candidate.ethnicity, candidate.socials, candidate.occupation, candidate.description, candidate.authorId, candidate.dateWritten]];
    return { sql, values };
  },
  READ: {

    /** The SQL statement to return all candidates. */
    ALL: "SELECT * FROM candidates",

    /** The SQL statement to return a random candidate. */
    RANDOM: "SELECT * FROM candidates ORDER BY RAND() LIMIT 1",

    /**
     * Constructs the SQL statement to return information for a single candidate.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    SINGLE: (fields = '*') => {
      const sql = `SELECT ${fields} FROM candidates WHERE ID = ?`;
      return sql;
    },

    /** The SQL statement to return the latest candidate. */
    LATEST: "SELECT * FROM candidates ORDER BY id DESC LIMIT 1",
  },

  /**
   * Constructs the SQL statement to update a candidate.
   * @param {number} id - The identifier of the candidate.
   * @param {object} candidate - The object containing the candidate details.
   * @param {boolean} imageHasChanged - Indicates whether the image has changed in this request.
   * @returns {string} The constructed statement.
   */
  UPDATE: (id, candidate, imageHasChanged) => {
    let sql = "UPDATE candidates SET id = ?, name = ?, birthday = ?, ethnicity = ?, socials = ?, occupation = ?, description = ?,author_id = ?, date_written = ? WHERE id = ?";
    let values = [candidate.id, candidate.name, candidate.birthday, candidate.ethnicity, candidate.socials, candidate.occupation, candidate.description, candidate.authorId, candidate.dateWritten, id];

    if (imageHasChanged){
      sql = appendFieldToUpdateQuery('image', sql);
      values = insertFieldInValues(candidate.image, values);
    }

    return { sql, values };
  },

  /** The SQL statement to delete a candidate. */
  DELETE: "DELETE FROM candidates WHERE id = ?"
};

const MEMBERS = {
  /**
   * Constructs the SQL statement to create a member.
   * @param {object} member - The object containing the member details.
   * @returns {string} The constructed statement.
   */
  CREATE: (member) => {
    const sql = "INSERT INTO members (firstname, lastname, image, level, birthday, sex, role, ethnicity, socials, slug, description, verified, slackID) VALUES ?";
    const values = [[member.firstname, member.lastname, member.image, member.level, member.birthday, member.sex, member.role, member.ethnicity, member.socials, member.slug, member.description, member.verified, member.slackID]];
    return { sql, values };
  },
  READ: {
    /**
     * Constructs the SQL statement to return information for all members.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    ALL: (fields = '*') => {
      return `SELECT ${fields} FROM members`;
    },

    /**
     * Constructs the SQL statement to return information for a single candidate.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    SINGLE: (fields = '*') => {
      const sql = `SELECT ${fields} FROM members WHERE ID = ?`;
      return sql;
    },

    /** The SQL statement to return a random verified member. */
    RANDOM: "SELECT * FROM members WHERE verified = 1 ORDER BY RAND() LIMIT 1",

    /** The SQL statement to retrieve all executive members. */
    EXECUTIVES: "SELECT * FROM members WHERE level = 'Executive' AND verified = 1"
  },
  /**
   * Constructs the SQL statement to update a member.
   * @param {number} id - The identifier of the member.
   * @param {object} member - The object containing the member details.
   * @param {boolean} imageHasChanged - Indicates whether the image has changed in this request.
   * @returns {string} The constructed statement.
   */
  UPDATE: (id, member, imageHasChanged) => {
    let sql = "UPDATE members SET firstname = ?, lastname = ?, image = ?, level = ?, birthday = ?, sex = ?, role = ?, ethnicity = ?, socials = ?, slug = ?, description = ?, verified = ?, slackID = ? WHERE id = ?";
    let values = [member.firstname, member.lastname, member.image, member.level, member.birthday, member.sex, member.role, member.ethnicity, member.socials, member.slug, member.description, member.verified, member.slackID, id];

    if (imageHasChanged){
      sql = appendFieldToUpdateQuery('image', sql);
      values = insertFieldInValues(member.image, values);
    }

    return { sql, values };
  },
  
  /** The SQL statement to delete a member. */
  DELETE: "DELETE FROM members WHERE id = ?"
};

const TOPICS = {
  /**
   * Constructs the SQL statement to create a topic.
   * @param {object} topic - The object containing the topic details.
   * @returns {string} The constructed statement.
   */
  CREATE: (topic) => {
    const sql = "INSERT INTO topics (headline, category, question, description, type, polarity, validated, sensitivity, option1, option2, user_id) VALUES ?";
    const values = [[topic.headline, topic.category, topic.question, topic.description, topic.type, topic.polarity, topic.validated, topic.sensitivity, topic.option1, topic.option2, topic.userId]];
    return { sql, values };
  },
  READ: {
    /**
     * Constructs the SQL statement to return information for all topics.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    ALL: (fields = '*') => {
      return `SELECT ${fields} FROM topics`;
    },

    /**
     * Constructs the SQL statement to return information for a single topic.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    SINGLE: (fields = '*') => {
      const sql = `SELECT ${fields} FROM topics WHERE ID = ?`;
      return sql;
    },

    /** The SQL statement to return a random topic. */
    RANDOM: "SELECT id, headline, category, question, option1, option2, yes, no FROM topics WHERE polarity = 1 AND category != 'Christian' AND category != 'Mental Health' ORDER BY RAND() LIMIT 1;",
  },

  /**
   * Constructs the SQL statement to update a topic.
   * @param {number} id - The identifier of the topic.
   * @param {object} topic - The object containing the topic details.
   * @param {boolean} imageHasChanged - Indicates whether the image has changed in this request.
   * @returns {string} The constructed statement.
   */
  UPDATE: {
    DETAILS: (id, topic) => {
      const sql = `UPDATE topics SET headline = ?, category = ?, question = ?, description = ?, type = ?, polarity = ?, validated = ?, sensitivity = ?, option1 = ?, option2 = ? WHERE id = ?`;
      const values = [topic.headline, topic.category, topic.question, topic.description, topic.type, topic.polarity, topic.validated, topic.sensitivity, topic.option1, topic.option2, id];
      return { sql, values };
    },
    VOTE: (id, option) => {
      const sql = `UPDATE topics SET ${option}=${option}+1 WHERE id = ${id}`;
      return sql;
    }
  },

  /** The SQL statement to delete a member. */
  DELETE: "DELETE FROM topics WHERE id = ?"
};

const REVIEWS = {
  /**
   * Constructs the SQL statement to create a review.
   * @param {object} review - The object containing the review details.
   * @returns {string} The constructed statement.
   */
  CREATE: (review) => {
    const sql = "INSERT INTO reviews (referee, position, rating, image, description) VALUES ?";
    const values = [[review.referee, review.position, review.rating, review.image, review.description]];
    return { sql, values };
  },
  READ: {
    /**
     * Constructs the SQL statement to return information for all reviews.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    ALL: (fields = '*') => {
      return `SELECT ${fields} FROM reviews`;
    },

    /** The SQL statement to return three 5-star reviews with images. */
    FEATURED: "SELECT * FROM reviews WHERE (rating = 5 AND CHAR_LENGTH(image) > 0) ORDER BY RAND() LIMIT 3",

    /**
     * Constructs the SQL statement to return information for a single review.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    SINGLE: (fields = '*') => {
      const sql = `SELECT ${fields} FROM reviews WHERE ID = ?`;
      return sql;
    },
  },

  /**
   * Constructs the SQL statement to update a review.
   * @param {number} id - The identifier of the review.
   * @param {object} review - The object containing the review details.
   * @param {boolean} imageHasChanged - Indicates whether the image has changed in this request.
   * @returns {string} The constructed statement.
   */
  UPDATE: (id, review, imageHasChanged) => {
    let sql = "UPDATE reviews SET referee = ?, position = ?, rating = ?, image = ?, description = ? WHERE id = ?";
    let values = [review.referee, review.position, review.rating, review.image, review.description, id];

    if (imageHasChanged){
      sql = appendFieldToUpdateQuery('image', sql);
      values = insertFieldInValues(review.image, values);
    }

    return { sql, values };
  },

  /** The SQL statement to delete a member. */
  DELETE: "DELETE FROM reviews WHERE id = ?"
};

const USERS = {
  READ: {
    /**
     * Constructs the SQL statement to return information for all users.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    ALL: (fields = '*') => {
      return `SELECT ${fields} FROM users`;
    },

    /**
     * Constructs the SQL statement to return information for a single review.
     * @param {string} [fields] - The fields to be queried.
     * @returns {string} The constructed statement.
     */
    SINGLE: (fields = '*') => {
      const sql = `SELECT ${fields} FROM users WHERE ID = ?`;
      return sql;
    },
  },
  UPDATE: {
    /**
     * Constructs the SQL statement to update a user.
     * @param {number} id - The identifier of the user.
     * @param {number} clearance - The object containing the user details.
     * @returns {string} The constructed statement.
     */
    CLEARANCE: (id, clearance) => {
      const sql = "UPDATE users SET clearance = ? WHERE id = ?";
      const values = [clearance, id];
      return { sql, values };
    }
  }
}

module.exports = {
  SESSIONS,
  CANDIDATES,
  MEMBERS,
  TOPICS,
  REVIEWS,
  USERS
}

/**
 * Appends a new field to an existing UPDATE query.
 * @param {string} field - The name of the field to be appended.
 * @param {string} statement - The current SQL query statement.
 * @returns {string} The new query with the appended field.
 */
const appendFieldToUpdateQuery = (field, statement) => {
  const idx = statement.indexOf('? WHERE') + 1;
  const query = [
    statement.slice(0, idx),
    ', ',
    field,
    ' = ?',
    statement.slice(idx)
  ].join('');

  return query;
}

/**
 * Inserts a new field value into an array of values.
 * @param {any} value - The value to be inserted.
 * @param {any[]} array - The array of values.
 * @returns {any[]} The new array of values.
 */
const insertFieldInValues = (value, array) => {
  array.splice(array.length - 1, 0, value);
  return array;
}