var express = require('express')
var router = express.Router()
const AuthController = require('../controllers/auth.controller')
/* GET 首页数据 顶部banner 入门 人气  */
router.get('/sign-in', (req, res) => AuthController.signIn(req, res))
router.post('/sign-up', (req, res) => AuthController.signUp(req, res))

module.exports = router
