const express = require('express')
const router = express.Router()
const { Setting } = require('../../models')
const { success, failure } = require('../../utils/response')


/**
 * 查看设置详情
 * GET /admin/settings/1
 */
router.get('/', async function (req, res) {
	let id = req.params.id

	try {
		const data = await Setting.findOne()
		success(res, data)
	} catch (e) {
		failure(res, e)
	}
}) 
/**
 *	更新设置
 * PUT /admin/settings
 */
router.put('/', async function (req, res) {
	let body = {
		name: req.body.name,
		icp: req.body.content,
		copyright: req.body.copyright,
	}
	try {
		const article = await Setting.findByPk(1)
		await article.update(body)
		success(res, null)
	} catch (e) {
		failure(res, e)
	}
})
module.exports = router
