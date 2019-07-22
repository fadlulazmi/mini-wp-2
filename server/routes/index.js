const router = require('express').Router()
const userRoutes = require('./userRoutes')
const articleRoutes = require('./articleRoute')

router.use('/users', userRoutes)
router.use('/articles', articleRoutes)
// router.post('/upload', 
//     images.multer.single('image'), 
//     images.sendUploadToGCS,
//     (req, res) => {
//             res.send({
//             status: 200,
//             message: 'Your file is successfully uploaded',
//             link: req.file.cloudStoragePublicUrl
//         })
//     })

module.exports = router