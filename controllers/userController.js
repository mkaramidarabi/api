const User = require('../models/user')
const chalk = require('chalk')

exports.signUp = (req, res, next) => {
    const user = new User(req.body)
    user.save()
        .then(user => {
            console.log(chalk.bgGreen.black("User Created"))
            res.status(201).send(user)
        })
        .catch(e => {
            console.log(chalk.bgRed.black(e.message))
            res.status(400).json({
                message: e.message
            })
        })
}


exports.logIn = async (req, res, next) => {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.status(200).json({
            id: user._id.toString(),
            token
        })
    } catch (e) {
        res.status(400).json({
            message: e.message
        })
    }
}

exports.logOut = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((obj) => {
            return obj.token !== req.token
        })
        await req.user.save()
        console.log(req.user.tokens)
        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

exports.logOutAll = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((obj) => {
            return obj.token === req.token
        })
        await req.user.save()
        console.log(req.user.tokens)
        res.status(200).json({
            id: req.user._id.toString(),
            token: req.token
        })
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
}