var express = require('express')
var router = express.Router()
const BusinessController = require('../controllers/client/business.controller')
/* GET 首页数据 顶部banner 入门 人气  */
router.get('/home', (req, res) => BusinessController.getHomeData(req, res))
router.get('/categories', (req, res) => BusinessController.getCategoriesList(req, res))
router.get('/courses', (req, res) => BusinessController.getCoursesList(req, res))
router.get('/courses/:id', (req, res) => BusinessController.getCourseDetail(req, res))
router.get('/chapter/:id', (req, res) => BusinessController.getChapter(req, res))

module.exports = router
