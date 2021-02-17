const WalletController = require('../../controller/users/wallets');
const express = require('express');

const router = express.Router();

router.get('/', WalletController.getAccountDetails);

router.get('/transactions', WalletController.getTransactions);

router.get('/transactions/:id', WalletController.getTransaction);


module.exports = router;
