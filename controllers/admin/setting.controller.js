const { success } = require('../../utils/response')
const { Setting: baseModel } = require('../../models')
const { Op } = require('sequelize')
const BaseDao = require('../../dao/base.dao')

class Controller {
	async getOneById(req, res) {
		let id = 1
		const data = await BaseDao.getPkById(baseModel, id)
		success(res, data)
	}
	async updateById(req, res) {
		let id = 1
		let body = updateAndCreateBody(req.body)
		await BaseDao.updateById(baseModel, id, body)
		success(res, null)
	}
}
function updateAndCreateBody(body) {
	return {
		name: body.name,
		icp: body.icp,
		copyright: body.copyright
	}
}
module.exports = new Controller()
