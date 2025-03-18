const express = require('express')
const router = express.Router()
const Controller = require('../../controllers/admin/setting.controller')

/**
 * 查看详情
 * GET /admin/settings
 */
router.get('/', (req, res) => Controller.getOneById(req, res))

/**
 *	更新
 * PUT /admin/settings
 */
router.put('/', (req, res) => Controller.updateById(req, res))

module.exports = router
