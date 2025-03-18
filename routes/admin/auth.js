const express = require('express')
const router = express.Router()
const Controller = require('../../controllers/auth.controller')
/**
 * 查询列表
 * GET /admin/articles
 */
router.get('/', (req, res, next) => Controller.getList(req, res))

/**
 * 查看详情
 * GET /admin/articles/1
 */
router.get('/:id', (req, res) => Controller.getOneById(req, res))

/**
 * 登录
 * POST /admin/sign-in
 */
router.post('/sign-in', (req, res) => Controller.signIn(req, res))

/**
 *	删除
 * DELETE /admin/articles
 */
router.delete('/:id', (req, res) => Controller.removeById(req, res))

/**
 *	更新
 * PUT /admin/articles
 */
router.put('/:id', (req, res) => Controller.updateById(req, res))

module.exports = router
