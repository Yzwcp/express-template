const { success } = require('../../utils/response')
const { Category: baseModel, Course } = require('../../models')
const { Op } = require('sequelize')
const BaseDao = require('../../dao/base.dao')

class Controller {
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
		if (req.query.name) {
			condition.where = {
				name: {
					[Op.like]: '%' + req.query.name + '%'
				}
			}
		}
		const data = await BaseDao.getList(baseModel, condition)
		success(res, data)
		// 主体逻辑结束
	}
	async getOneById(req, res) {
		let id = req.params.id
		const condition = {
			include: [
				{
					model: Course,
					attributes: ['id', 'name'],
					as: 'courses'
				}
			]
		}
		const data = await BaseDao.getPkById(baseModel, id, condition)
		success(res, data)
	}
	async create(req, res) {
		let body = updateAndCreateBody(req.body)
		await BaseDao.create(baseModel, body)
		success(res, null)
	}
	async removeById(req, res) {
		let id = req.params.id
		// 先查询是否有课程
		const courseCount = await Course.count({
			where: {
				categoryId: id
			}
		})
		if (courseCount > 0) {
			throw new Error('该分类下有课程，无法删除')
		}
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
module.exports = new Controller()
