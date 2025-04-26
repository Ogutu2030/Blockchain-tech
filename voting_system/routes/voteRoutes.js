const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware.protect);

router.post('/cast', voteController.castVote);
router.get('/results/:electionId', voteController.getResults);

module.exports = router;