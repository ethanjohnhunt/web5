const mongoose = require('mongoose');

const GridItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true }, // URL to the image
}, { timestamps: true });

module.exports = mongoose.model('GridItem', GridItemSchema);
