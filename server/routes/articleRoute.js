const router = require('express').Router()
const ArticleController = require('../controllers/articleController')
const {authenticate, authorize} = require('../middlewares/middleware')
const {multer, sendUploadToGCS} = require('../helpers/images')

router.post('/imageUpload', multer.single('image'), sendUploadToGCS, function(req, res, next){
    res.json({image : req.file.cloudStoragePublicUrl})
})
router.use('/', authenticate)

router.get('/search', ArticleController.search)
router.get('/', ArticleController.findAll)
router.get('/:userId', ArticleController.findByUser)
router.post('/add', multer.single('img'), sendUploadToGCS, ArticleController.add)
router.patch('/like/:id', ArticleController.like)
router.patch('/unlike/:id', ArticleController.unlike)
router.delete('/:id', authorize, ArticleController.delete)
router.patch('/:id', authorize, multer.single('img'), sendUploadToGCS, ArticleController.update)


module.exports = router