const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    type: { 
        type: String, 
        required: true, 
        enum: ['room', 'desk', 'device', 'hall']
    },
    capacity: { type: Number, required: true, default: 1 }, 
    status: {
        type: String,
        enum: ['available', 'maintenance'],
        default: 'available'
    },
}, {
    timestamps: true 
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;