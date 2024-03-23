const express = require('express');
const router = express.Router();

const premiumFeaturesController = require('../controllers/premium');

router.get('/get-leaderboard', premiumFeaturesController.getLeaderboard);

router.get('/status', premiumFeaturesController.getStatus);

router.get('/downloadExpenseReports', premiumFeaturesController.downloadExpenseReport);

router.get('/get-history', premiumFeaturesController.getPastHistoryURL)



module.exports = router;