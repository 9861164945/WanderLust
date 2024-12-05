const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

// Add the passport-local-mongoose plugin to the userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
