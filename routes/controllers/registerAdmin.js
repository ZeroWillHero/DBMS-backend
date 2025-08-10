const User = require('../../models/User');
const bcrypt = require('bcrypt');

const RegisterAdmin = async (req,res) => {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const user = new User ({
        firstname: "Admin",
        lastname: "Arduino",
        alYear: "none",
        password: hashedPassword,
        email: process.env.ADMIN_EMAIL,
        whatsappNumber: "0764251024",
        school: "None",
        role: "admin",
        paymentSlip: "none",
        verified: true,
        qrCode: "none",
        isQRUsede: false
    });

    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            console.log("Admin already exists. No Need to register again");
            return
        }

        await user.save();
        console.log("Admin registered successfully");

    }catch (error) {
        console.error("Error registering admin:", error);
    }
}

module.exports = RegisterAdmin;