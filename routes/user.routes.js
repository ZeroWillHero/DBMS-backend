const router = require('express').Router();
const imageUploadMiddleware = require('../middleware/uploadImage');
const registerUser = require('./controllers/register');
const {
    getUsers,
    getUserById,
    getUserByEmail,
    getUserByWhatsapp
} = require('./controllers/getUsers');
const deleteUser = require('./controllers/deleteUser');
const { updateUser } = require('./controllers/updateUser');
const login = require('./controllers/login');
const generateNewAccessToken = require('../utils/refreshTokenHandler');
const checkIsAdmin  = require('../middleware/authenticate').checkIsAdmin;
const updateUserConfirmation = require('./controllers/confirmUser');
const getUserCount = require('./controllers/getUsers').getUserCount;
const updateQRusage = require('./controllers/updateQrUsage');

router.put('/update/qr',checkIsAdmin, updateQRusage);
// Route to get the count of all users
router.get('/count', getUserCount);
// Route to register a new user with image upload
router.post('/register', imageUploadMiddleware('paymentSlip'), registerUser);
// Route to get all users
router.get('/',checkIsAdmin, getUsers);
// Route to get a user by ID
router.get('/:id', getUserById);
// Route to get a user by email
router.get('/email/:email', getUserByEmail);
// Route to get a user by WhatsApp number
router.get('/whatsapp/:whatsapp', getUserByWhatsapp);
// Route to delete a user by ID
router.delete('/:id', deleteUser);
// Route to update a user by ID
router.put('/:id', updateUser);
// Route to update QR usage



// Login Route 
router.post('/login', login);

// Route to handle refresh token
router.post('/refresh-token', generateNewAccessToken);
// QR code generation and user confirmation
router.put('/confirm/:id', updateUserConfirmation); 


// Export the router
module.exports = router;
