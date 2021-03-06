const express = require('express');
const router = express.Router();

const CLEARANCES = require('../../../constants/clearances');
const { verifyToken, validateReq } = require('../../middleware');
const TopicsController = require('../controllers/topics.controller');

const authorize = verifyToken(CLEARANCES.ACTIONS.TOPICS.MODIFY);

/** GET all topics */
router.get(
  '/',
  verifyToken(CLEARANCES.ACTIONS.TOPICS.VIEW),
  TopicsController.getAllTopics
);

/** GET single topic by ID */
router.get('/:id([0-9]+)', validateReq, TopicsController.getSingleTopic);

/** GET random topic */
router.get('/random', validateReq, TopicsController.getRandomTopic);

/** GET; generate Topic Bank token */
router.get(
  '/token',
  verifyToken(CLEARANCES.ACTIONS.TOPICS.GENERATE_TOKEN),
  TopicsController.generateTopicBankToken
);

/** POST new topic */
router.post('/', authorize, TopicsController.addTopic);

/** PUT; update topic details */
router.put('/:id', authorize, TopicsController.updateTopic);

/** PUT; increment topic vote */
router.put(
  '/:id/vote/:option(yes|no)',
  validateReq,
  TopicsController.updateTopicVote
);

/** DELETE topic */
router.delete('/:id', authorize, TopicsController.deleteTopic);

module.exports = router;
