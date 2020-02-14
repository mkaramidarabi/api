const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
userSchema.virtual('content', {
    ref: 'Content',
    localField: '_id',
    foreignField: 'creator'
})

userSchema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('Invalid information')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid information')
    }
    return user

}


userSchema.methods.generateToken = async function () {
    const user = this
    const token = await jwt.sign({
        _id: user._id.toString()
    }, 'alsdjflskjfg;asdjkflsfjmlskfjglsafgmjkl')
    user.tokens = user.tokens.concat({
        token
    })
    const decoded = jwt.verify(token, 'alsdjflskjfg;asdjkflsfjmlskfjglsafgmjkl')
    await user.save()
    return token
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User