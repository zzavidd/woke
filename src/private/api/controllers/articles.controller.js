/* eslint-disable jsdoc/require-param */
const async = require('async');

const { DIRECTORY, ENTITY } = require('../../../constants/strings');
const ERROR = require('../../errors');
const filer = require('../../filer');
const { respondToClient } = require('../../response');
const knex = require('../knex').getKnex();

const columns = [
  'articles.*',
  {
    authorName: knex.raw("CONCAT(members.firstname, ' ', members.lastname)")
  },
  { authorLevel: 'members.level' },
  { authorSlug: 'members.slug' },
  { authorImage: 'members.image' },
  { authorDescription: 'members.description' },
  { authorSocials: 'members.socials' }
];

/** Retrieve all articles */
exports.getAllArticles = (req, res) => {
  const query = knex
    .columns(columns)
    .select()
    .from('articles')
    .leftJoin('members', 'articles.authorId', 'members.id');
  query.asCallback(function (err, articles) {
    respondToClient(res, err, 200, articles);
  });
};

/** Retrieve individual article */
exports.getSingleArticle = (req, res) => {
  const { id } = req.params;
  const query = knex
    .columns(columns)
    .select()
    .from('articles')
    .leftJoin('members', 'articles.authorId', 'members.id')
    .where('articles.id', id);
  query.asCallback(function (err, [article] = []) {
    if (err) return respondToClient(res, err);
    if (!article) err = ERROR.INVALID_ENTITY_ID(ENTITY.ARTICLE, id);
    respondToClient(res, err, 200, article);
  });
};

/** Retrieve only published articles */
exports.getPublishedArticles = (req, res) => {
  const { exception, limit, order } = req.query;
  let query = knex
    .columns(columns)
    .select()
    .from('articles')
    .leftJoin('members', 'articles.authorId', 'members.id')
    .where('articles.status', 'PUBLISHED');

  if (exception) query.whereNot('articles.id', exception);
  if (limit) query = query.limit(limit);
  if (order) query = query.orderBy('datePublished', order);

  query.asCallback(function (err, articles) {
    respondToClient(res, err, 200, articles);
  });
};

/** Add new article to database */
exports.addArticle = (req, res) => {
  const article = req.body;

  async.waterfall(
    [
      function (callback) {
        // Upload image to cloud
        filer.uploadImage(article, DIRECTORY.ARTICLES, true, callback);
      },
      function (article, callback) {
        // Add article to database
        const query = knex.insert(article).into('articles');
        query.asCallback(function (err, [id] = []) {
          callback(err, id);
        });
      }
    ],
    function (err, id) {
      respondToClient(res, err, 201, {
        id
      });
    }
  );
};

/** Update details of existing articles in database */
exports.updateArticle = (req, res) => {
  const id = req.params.id;
  const { article, changed } = req.body;

  async.waterfall(
    [
      function (callback) {
        // Delete old image if changed.
        const query = knex.select().from('articles').where('id', id);
        query.asCallback(function (err, [article] = []) {
          if (err) return callback(err);
          if (!article)
            return callback(ERROR.INVALID_ENTITY_ID(ENTITY.ARTICLE, id));
          if (!changed) return callback(null);
          filer.destroyImage(article.image, callback);
        });
      },
      function (callback) {
        // Equally, upload new image if changed
        filer.uploadImage(article, DIRECTORY.ARTICLES, changed, callback);
      },
      function (article, callback) {
        // Update article in database
        const query = knex('articles').update(article).where('id', id);
        query.asCallback(function (err) {
          callback(err, article.slug);
        });
      }
    ],
    function (err, slug) {
      respondToClient(res, err, 200, {
        slug
      });
    }
  );
};

/** Increment number of claps for article */
exports.clapForArticle = (req, res) => {
  const { id } = req.params;
  async.waterfall(
    [
      function (callback) {
        // Increment claps
        const query = knex('articles').increment({ claps: 1 }).where('id', id);
        query.asCallback(function (err) {
          callback(err);
        });
      },
      function (callback) {
        // Retrieve new clap count
        const query = knex.select('claps').from('articles').where('id', id);
        query.asCallback(function (err, [claps] = []) {
          callback(err, claps);
        });
      }
    ],
    function (err, claps) {
      respondToClient(res, err, 200, { ...claps });
    }
  );
};

/** Delete the article */
exports.deleteArticle = (req, res) => {
  const id = req.params.id;

  async.waterfall(
    [
      function (callback) {
        // Delete image from cloud
        const query = knex.select().from('articles').where('id', id);
        query.asCallback(function (err, [article] = []) {
          if (err) return callback(err);
          if (!article)
            return callback(ERROR.INVALID_ENTITY_ID(ENTITY.ARTICLE, id));
          filer.destroyImage(article.image, callback);
        });
      },
      function (callback) {
        // Delete article from database
        const query = knex('articles').where('id', id).del();
        query.asCallback(function (err) {
          callback(err);
        });
      }
    ],
    function (err) {
      respondToClient(res, err, 204);
    }
  );
};
