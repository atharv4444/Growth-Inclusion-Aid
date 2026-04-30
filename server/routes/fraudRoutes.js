const router = require('express').Router();
const ctrl = require('../controllers/fraudController');

router.get('/', ctrl.getAll);
router.get('/high-risk', ctrl.getHighRisk);
router.get('/distribution', ctrl.getRiskDistribution);
router.get('/application/:applicationId', ctrl.getByApplication);
router.put('/:fraud_id/flag', ctrl.toggleFlag);
router.post('/', ctrl.create);

module.exports = router;
