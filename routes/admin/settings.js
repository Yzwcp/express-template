const express = require('express')
const router = express.Router()
const { Setting } = require('../../models')
const { success, failure } = require('../../utils/response')
const SettingController = require('../../controllers/setting.controller')

/**
 * 查看设置详情
 * GET /admin/settings/1
 */
router.get('/:id', (req, res)=> SettingController.get(req, res))
/**
 *	更新设置
 * PUT /admin/settings
 */
router.put('/', (req, res)=> SettingController.put(req, res))
module.exports = router
