const LoanController = require('../../controllers/users/loans');
const express = require('express');

const router = express.Router();

router.get('/', LoanController.getLoans);

router.post('/', LoanController.createLoan);

router.get('/:id', LoanController.getLoan);

router.put('/:id', LoanController.updateLoan);

router.delete('/:id', LoanController.deleteLoan);

router.post('/:id/offset', LoanController.createOffset);

router.put('/:id/offset/:offsetId', LoanController.updateOffset);

router.delete('/:id/offset/:offsetId', LoanController.deleteOffset);

module.exports = router;
