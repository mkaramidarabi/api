const chalk = require('chalk')
const mongoose = require('mongoose')
const {
    validationResult
} = require('express-validator')

const FileHelper = require('../utils/file')
const Content = require('../models/content')


exports.prodPost = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.')
        error.statusCode = 422
        throw error
    }
    if (!req.file) {
        const error = new Error('No image provided.')
        error.statusCode = 422
        throw error
    }
    const imgUrl = req.file.path
    const title = req.body.title
    const content = req.body.comment
    const post = new Content({
        title: title,
        comment: content,
        imgUrl: imgUrl,
        creator: req.user._id
    })
    try {
        await post.save()
        console.log(chalk.bgGreen.black('Post created successfully!'))
        return res.status(201).json({
            message: 'Post created successfully!',
            post: post,
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.prodsGet = (req, res, next) => {
    // res.status(200).json("Successful")
    Content.find().then((result => {
        if (result.length === 0) return res.status(404).json({
            "message": "DATABASE IS EMPTY OF PRODUCTS!"
        })
        return res.status(200).json(result)
    })).catch(error => next(error))
}

exports.prodGet = (req, res, next) => {
    prodId = req.params.prodId
    Content.findById(prodId).then(result => {
            if (!result) {
                const error = new Error('Invalid ID')
                error.statusCode = 404
                throw error
            }
            return res.status(200).json(result)
        })
        .catch(e => next(e))
}

exports.prodEdit = async (req, res, next) => {
    const prodId = req.params.prodId
    try {
        const content = await Content.findOne({
            _id: prodId,
            creator: req.user._id
        })
        if (!content) {
            res.status(403).send()
        }
        console.log(req.body)
        if (req.file) {
            FileHelper.deleteFile(content.imgUrl)
            content.imgUrl = req.file.path
            console.log(chalk.bgYellow.black('DESTROYED OLD PRODUCT PICTURE & REPLACED NEW ONE'));
        }
        if (req.body.comment) content.comment = req.body.comment
        if (req.body.comment) content.title = req.body.title
        await content.save()
        res.status(200).send(content)

    } catch (e) {
        console.log(e)
        res.status(500).send({
            message: 'Server Error'
        })
    }
    // const errors = validationResult(req)
    // const title = req.body.title
    // console.log(req.body.title)
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed, entered data is incorrect.')
    //     error.statusCode = 422
    //     throw error
    // }
    // Content.findById(prodId).then(result => {
    //         if (!result) {
    //             error = new Error('Invalid ID')
    //             error.statusCode = 404
    //             throw error
    //         }
    //         result.title = title
    // if (req.file) {
    //     FileHelper.deleteFile(result.imgUrl)
    //     result.imgUrl = req.file.path
    //     console.log(chalk.bgYellow.black('DESTROYED OLD PRODUCT PICTURE & REPLACED NEW ONE'));
    // }
    // if (req.body.comment) result.comment = req.body.comment
    //         if (req.user._id) result.creator = req.user._id

    //         return result.save()
    //     }).then(result => {
    //         console.log(chalk.bgGreen.black("Content Edited successfully"))
    //         return res.status(201).json({
    //             result: result,
    //             message: "Content Edited successfully"
    //         })
    //     })
    //     .catch(e => {
    //         e.statusCode = 400
    //         e.message = "ID Problem"
    //         next(e)
    //     })
}

exports.prodDelete = (req, res, next) => {
    const prodId = req.params.prodId
    Content.findById(prodId).then(content => {
        if (!content) {
            const error = new Error("The ID you'd sent wasn't there!! ")
            error.status = 404
            throw error
        }
        console.log(content.imgUrl)
        FileHelper.deleteFile(content.imgUrl)
        return Content.deleteOne({
            _id: prodId
        })
    }).then((result) => {
        console.log(chalk.bgYellow.black('DESTROYED PRODUCT'));
        return res.status(200).json({
            result,
            message: 'Success!'
        });
    }).catch(e => {
        e.statusCode = e.statusCode || 404
        e.message = "Wasn't there!!!!"
        next(e)
    })
}