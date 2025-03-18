var express = require('express')
var router = express.Router()
const UserController = require('../controllers/user.controller')
const BusinessController = require('../controllers/client/business.controller')
/* GET 首页数据 顶部banner 入门 人气  */

router.get('/', (req, res) => UserController.getMe(req, res))
router.put('/info', (req, res) => UserController.updateUserInfo(req, res))
router.put('/account', (req, res) => UserController.updateUserAccount(req, res))
router.post('/like', (req, res) => UserController.getCourseLike(req, res))

module.exports = router
