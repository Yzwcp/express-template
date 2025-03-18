const { success } = require('../../utils/response')
const { Article: baseModel } = require('../../models')
const { Op } = require('sequelize')
const BaseDao = require('../../dao/base.dao')

class ArticleController {
	async getList(req, res) {
		const { currentPage, pageSize } = req.query
		// 主体逻辑开始
		//定义查询条件
		const condition = {
			order: [
				['id', 'DESC'] // 按照 id 字段降序排序
			],
			limit: Number(pageSize),
			offset: Number(currentPage)
		}
		if (req.query.title) {
			condition.where = {
				title: {
					[Op.like]: '%' + req.query.title + '%'
				}
			}
		}
		const data = await BaseDao.getList(baseModel, condition)
		success(res, data)
		// 主体逻辑结束
	}
	async getOneById(req, res) {
		let id = req.params.id
		const data = await BaseDao.getPkById(baseModel, id)
		success(res, data)
	}
	async create(req, res) {
		let body = updateAndCreateBody(req.body)
		await BaseDao.create(baseModel, body)
		success(res, null)
	}
	async removeById(req, res) {
		let id = req.params.id
		await BaseDao.removeById(baseModel, id)
		success(res, null, '删除成功')
	}
	async updateById(req, res) {
		let id = req.params.id
		let body = updateAndCreateBody(req.body)
		await BaseDao.updateById(baseModel, id, body)
		success(res, null)
	}
}
function updateAndCreateBody(body) {
	return {
		name: body.name,
		rank: body.rank
	}
}
module.exports = new ArticleController()
