const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    tcNo: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{11}$/.test(v);
            },
            message: 'TC Kimlik numarası 11 haneli olmalıdır'
        }
    },
    studentNo: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    roomNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema); 