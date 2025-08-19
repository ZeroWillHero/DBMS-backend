const User = require('../../models/User');


// Get all users
const getUsers = async (req, res) => {
    try {
        // Filters
        const { 
            role, 
            verified, 
            sortBy = 'createdAt', 
            sortDir = 'asc', 
            page = 1, 
            limit = 10, 
            search,
            isQRUsede,
        } = req.query;

        // Build filter object
        const filter = {};
        if (role) filter.role = role;
        if (verified !== undefined) filter.verified = verified === 'true';
        if (isQRUsede !== undefined) filter.isQRUsede = isQRUsede === 'true';

        // Search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { firstname: searchRegex },
                { lastname: searchRegex },
                { alYear: searchRegex },
                { email: searchRegex },
                { whatsappNumber: searchRegex },
                { school: searchRegex }
            ];
        }

        // Sorting
        const sortDirection = sortDir === 'desc' ? -1 : 1;
        const sort = {};
        sort[sortBy] = sortDirection;

        // Pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        // Fetch users with filters, sorting, and pagination
        const users = await User.find(filter)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Total count for pagination info
        const totalUsers = await User.countDocuments(filter);
        const qrScannedUsers = await User.countDocuments({ isQRUsede: true });

        res.status(200).json({
            users,
            total: totalUsers,
            qrScannedUsers,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalUsers / limitNum)
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

const getUserCount = async (req, res) => {
    try {
        let filter = {};
        // If isQRUsede query parameter is provided, filter by it
        if (req.query.isQRUsede !== undefined) {
            // Convert string to boolean
            filter.isQRUsede = req.query.isQRUsede === 'true';
        }
        const userCount = await User.countDocuments(filter);
        res.status(200).json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserByWhatsapp = async (req, res) => {
    try {
        const whatsappNumber = req.params.whatsapp;
        const user = await User.findOne({ whatsapp: whatsappNumber }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by WhatsApp number:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export the getUsers function
module.exports = { getUsers, getUserById, getUserByEmail, getUserByWhatsapp, getUserCount };