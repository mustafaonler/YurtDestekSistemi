const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['şikayet', 'arz']
    },
    category: {
        type: String,
        required: true,
        enum: ['su', 'elektrik', 'temizlik', 'güvenlik', 'diğer']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['bekleniyor', 'ilgileniliyor', 'tamamlandı'],
        default: 'bekleniyor'
    },
    adminResponse: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema); 