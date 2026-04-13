const router = require('express').Router();
const ctrl = require('../controllers/paymentController');

router.get('/', ctrl.getAll);
router.get('/application/:applicationId', ctrl.getByApplication);
router.post('/', ctrl.create);
router.put('/:id/status', ctrl.updateStatus);

module.exports = router;
