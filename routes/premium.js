const express = require('express');
const router = express.Router();

const premiumFeaturesController = require('../controllers/premium');

router.get('/get-leaderboard', premiumFeaturesController.getLeaderboard);
router.get('/status', premiumFeaturesController.getStatus)




module.exports = router;