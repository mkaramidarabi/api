const express = require('express');
const router = express.Router();
const {
    check,
    validationResult,
    body
} = require('express-validator');
const upload = require('../utils/multer-util');
const {
    auth
} = require('../middlewares/auth')

const {
    prodPost,
    prodGet,
    prodEdit,
    prodDelete,
    prodsGet
} = require('../controllers/productController')

// the upload.single must be in first argument.
router.post('/',
    [auth,
        upload.single('picture'),
        check('title',
            'title must be sent')
        .not().isEmpty(),
        check('title',
            'title must be a string!')
        .not().isFloat(),
        check('title',
            'title must be a string!')
        .isLength({
            min: 5
        }),
    ], prodPost);


router.get('/', prodsGet)


router.get('/:prodId', prodGet)

router.put('/:prodId',
    [auth,
        upload.single('picture'),
        check('title',
            'title must be sent')
        .not().isEmpty(),
        check('title',
            'title must be a string!')
        .not().isFloat(),
        check('title',
            'title must be a string!')
        .isLength({
            min: 5
        }),
    ], prodEdit)

router.delete('/:prodId', auth, prodDelete)


module.exports = router;