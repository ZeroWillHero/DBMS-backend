const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    
    alYear: {
        type: String,
        required: true
    },
    password : {
        type: String,
        minlength: 6,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    whatsappNumber: {
        type: String,
        required: true
    },
    school: {
        type: String
    },
    role : {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    paymentSlip: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    qrCode: {
        type: String,
        default: null
    },
    isQRUsede : {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null
    },
    whristBandColor: {
        type: String,
        enum: ['white','black']
    },
    whristBandSize: {
        type: String,
        enum: ['S', 'M']
    },
    isAttendToClass:{
        type: Boolean,
        default: false
    }

},{ timestamps: true  });

module.exports = mongoose.model('User', userSchema);