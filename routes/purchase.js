const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');

router.get('/premiumMember', purchaseController.purchasePremium);
router.post('/updateTransactionStatus', purchaseController.updateTransactionStatus);

module.exports = router;