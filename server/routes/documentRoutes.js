const router = require('express').Router();
const ctrl = require('../controllers/documentController');

router.get('/', ctrl.getAll);
router.get('/application/:applicationId', ctrl.getByApplication);
router.post('/', ctrl.create);

module.exports = router;
