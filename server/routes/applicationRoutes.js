const router = require('express').Router();
const ctrl = require('../controllers/applicationController');

router.get('/', ctrl.getAll);
router.get('/kanban', ctrl.getByStatus);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id/status', ctrl.updateStatus);
router.post('/:id/verify', ctrl.verify);

module.exports = router;
