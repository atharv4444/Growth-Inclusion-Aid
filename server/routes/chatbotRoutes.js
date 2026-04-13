const router = require('express').Router();
const ctrl = require('../controllers/chatbotController');

router.get('/', ctrl.getAll);
router.get('/beneficiary/:beneficiaryId', ctrl.getByBeneficiary);
router.post('/', ctrl.create);

module.exports = router;
