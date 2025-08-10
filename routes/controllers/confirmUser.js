const User = require('./../../models/User');
const generateQRCodePng = require('../../utils/generateQr');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const sharp = require('sharp');
const sendEmail = require('../../utils/emailSend'); // Adjust path as needed

const updateUserConfirmation = async (req, res) => {
    const userId = req.params.id;

    try {
        console.log('Updating user confirmation for ID:', userId);
        const user = await User.findOne({ _id: userId }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified === true) {
            return res.status(400).json({ message: 'User is already confirmed' });
        }

        // 1. Generate QR code PNG
        const qrPath = await generateQRCodePng(user);

        // 1.5. Resize QR code to fit ticket (e.g., 200x200)
        const resizedQrPath = `./tmp/qr_resized_${user._id}.png`;
        await sharp(qrPath)
            .resize(200, 200)
            .toFile(resizedQrPath);

        // 2. Overlay QR code on ticket background
        const ticketBgPath = './assets/Ticket.png'; // Path to your ticket background image
        const ticketOutputPath = `./tmp/ticket_${user._id}.png`;

        await sharp(ticketBgPath)
            .composite([
                {
                    input: resizedQrPath,
                    top: 89,   // Adjust as needed for your design
                    left: 700  // Adjust as needed for your design
                }
            ])
            .toFile(ticketOutputPath);

        // 3. Upload the ticket image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(ticketOutputPath, { folder: 'tickets' });
        const ticketUrl = uploadResult.secure_url;

        // 4. Save ticket URL to user
        user.qrCode = ticketUrl;
        user.verified = true;
        await user.save();

        // 5. Delete local files
        fs.unlinkSync(qrPath);
        fs.unlinkSync(resizedQrPath);
        fs.unlinkSync(ticketOutputPath);

        // 6. Send email with ticket image
        const html = `
            <h2>Your Event Ticket</h2>
            <p>Dear ${user.firstname}, your registration is confirmed. Please find your ticket below:</p>
            <img src="${ticketUrl}" alt="Your Ticket" style="max-width:100%;"/>
        `;
        await sendEmail({
            to: user.email,
            subject: 'Your Event Ticket',
            html
        });

        res.status(200).json({ message: 'User confirmed and ticket sent via email', ticketUrl });

    } catch (error) {
        console.error('Error updating user confirmation:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = updateUserConfirmation;