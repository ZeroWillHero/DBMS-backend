const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generates a QR code PNG image file from user data (no encryption).
 * @param {Object} userData - The user data to encode.
 * @param {string} outputDir - Directory to save the PNG file.
 * @returns {Promise<string>} - The path to the generated PNG file.
 */
async function generateQRCodePng(userData, outputDir = './tmp') {
    try {
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const userString = JSON.stringify(userData._id);

        // Generate a unique filename
        const filename = `qr_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
        const filePath = path.join(outputDir, filename);

        // Generate QR code as PNG and save to file
        await QRCode.toFile(filePath, userString, {
            type: 'png',
            width:1000,
            errorCorrectionLevel: 'H'
        });

        return filePath;
    } catch (err) {
        throw new Error('Failed to generate QR code: ' + err.message);
    }
}

module.exports = generateQRCodePng;