const express = require('express')
const {
    signUp,
    logIn,
    logOut,
    logOutAll
} = require('../controllers/userController')
const {
    auth
} = require('../middlewares/auth')

const router = new express.Router()

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/logout', auth, logOut)
router.post('/logoutall', auth, logOutAll)



module.exports = router