const { success } = require('../../utils/response')
const { Course: baseModel, Category, User, Chapter } = require('../../models')
const { Op } = require('sequelize')
const BaseDao = require('../../dao/base.dao')

class Controller {
	//admin
	async getList(req, res) {
		const query = req.query
		const { currentPage, pageSize } = req.query
		// 主体逻辑开始
		//定义查询条件
		const condition = {
			...getCondition(),
			order: [
				['id', 'DESC'] // 按照 id 字段降序排序
			],
			limit: Number(pageSize),
			offset: Number(currentPage)
		}

		if (query.categoryId) {
			condition.where = {
				categoryId: {
					[Op.eq]: query.categoryId
				}
			}
		}

		if (query.userId) {
			condition.where = {
				userId: {
					[Op.eq]: query.userId
				}
			}
		}

		if (query.name) {
			condition.where = {
				name: {
					[Op.like]: `%${query.name}%`
				}
			}
		}

		if (query.recommended) {
			condition.where = {
				recommended: {
					// 需要转布尔值
					[Op.eq]: query.recommended === 'true'
				}
			}
		}

		if (query.introductory) {
			condition.where = {
				introductory: {
					[Op.eq]: query.introductory === 'true'
				}
			}
		}
		const data = await BaseDao.getList(baseModel, condition)
		success(res, data)
		// 主体逻辑结束
	}
	async getOneById(req, res) {
		let id = req.params.id
		const condition = getCondition()
		const data = await BaseDao.getPkById(baseModel, id, condition)
		success(res, data)
	}
	async create(req, res) {
		let body = updateAndCreateBody(req.body)
		body.userId = req.user.id
		await BaseDao.create(baseModel, body)
		success(res, null)
	}
	async removeById(req, res) {
		let id = req.params.id
		const count = await Chapter.count({ where: { courseId: id } })
		if (count > 0) throw BadRequest('该课程下有章节，不能删除')
		await BaseDao.removeById(baseModel, id)
		success(res, null, '删除成功')
	}
	async updateById(req, res) {
		let id = req.params.id
		req.body.userId = req.user.id
		let body = updateAndCreateBody(req.body)
		await BaseDao.updateById(baseModel, id, body)
		success(res, null)
	}
}
function getCondition() {
	return {
		attributes: { exclude: ['CategoryId', 'UserId'] },
		include: [
			{
				model: Category,
				as: 'category',
				attributes: ['id', 'name']
			},
			{
				model: User,
				as: 'user',
				attributes: ['id', 'username', 'avatar']
			},
			{
				model: Chapter,
				as: 'chapters',
				attributes: {
					exclude: ['CourseId']
				}
			}
		]
	}
}
function updateAndCreateBody(body) {
	return {
		categoryId: body.categoryId,
		name: body.name,
		image: body.image,
		recommended: body.recommended,
		introductory: body.introductory,
		content: body.content
	}
}
module.exports = new Controller()
