const router = require('express').Router()
const UserController = require('../controllers/userController')
const {authenticate, authorize} = require('../middlewares/middleware')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/loginGoogle', UserController.loginGoogle)
router.get('/myProfile/:id', UserController.findOne)


router.use(authenticate)
router.patch('/follow/:id', UserController.follow)
router.patch('/unfollow/:id', UserController.unfollow)

module.exports = router