const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Ошибки в E-mail'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
