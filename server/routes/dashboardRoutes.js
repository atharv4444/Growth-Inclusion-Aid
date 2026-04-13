const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');

router.get('/summary', ctrl.getSummary);
router.get('/fund-allocation', ctrl.getFundAllocation);
router.get('/application-flow', ctrl.getApplicationFlow);
router.get('/projected-vs-actual', ctrl.getProjectedVsActual);

module.exports = router;
