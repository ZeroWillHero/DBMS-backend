const router = require('express').Router();
const createParent = require('./controllers/createParent');
const getAllParents = require('./controllers/getParents').getAllParents;
const getParent = require('./controllers/getParents').getParent;
const checkIsAdmin = require('./../../middleware/authenticate').checkIsAdmin;
// Route to create a new parent
router.post('/create', createParent);
router.get('/all', checkIsAdmin, getAllParents);
router.get('/:id', getParent );
// Add more parent-related routes here as needed

module.exports = router;