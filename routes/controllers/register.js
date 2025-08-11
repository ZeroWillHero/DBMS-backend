const User = require('../../models/User');
const sendEmail = require('../../utils/emailSend');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { 
      firstname, 
      lastname, 
      alYear, 
      whatsappNumber, 
      school, 
      email, 
      password,
      whristBandColor,
      whristBandSize,
      isAttendToClass
     } = req.body;
    const paymentSlip = req.fileUrl; // The URL of the uploaded image from Cloudinary

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Prepare new user object
    const newUserData = {
      firstname,
      lastname,
      alYear,
      whatsappNumber,
      school,
      email,
      paymentSlip,
      whristBandColor,
      whristBandSize,
      isAttendToClass
    };

    // Hash and set password only if provided
    if (password) {
      newUserData.password = await bcrypt.hash(password, 10);
    }

    // Create a new user
    const newUser = new User(newUserData);

    // Save the user to the database
    await newUser.save();

    // send verification email
    const html = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background: #f6f6f6; padding: 40px 0;">
  <tr>
    <td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 32px;">
        <tr>
          <td align="center" style="padding-bottom: 24px;">
            <img src="https://img.icons8.com/color/96/000000/checked--v1.png" alt="Welcome" width="64" height="64" />
          </td>
        </tr>
        <tr>
          <td style="font-size: 22px; font-weight: bold; color: #333; text-align: center; padding-bottom: 12px;">
            Welcome to DBMS Session, {{firstname}}!
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; color: #555; text-align: center; padding-bottom: 24px;">
            Thank you for registering. We have received your details and payment slip.<br>
            Our team will review your information and notify you once your account is approved Withing 24 Hours.
          </td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #aaa; text-align: center;">
            If you have any questions, reply to this email.<br>
            &copy; 2025 Lasitha Prasad. All rights reserved.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;

    // Replace {{firstname}} with actual name
    const personalizedHtml = html.replace('{{firstname}}', newUser.firstname);

    // Send the email
    await sendEmail({
      to: email,
      subject: 'Welcome to Arduino night',
      html: personalizedHtml
    });

    // Remove password before sending user data
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({ message: 'User registered successfully', user: userObj });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = registerUser;