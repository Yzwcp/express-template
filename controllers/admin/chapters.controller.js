const { success } = require('../../utils/response')
const { Chapter: baseModel, Course, Chapter } = require('../../models')
const { Op } = require('sequelize')
const BaseDao = require('../../dao/base.dao')

class Controller {
	async getList(req, res) {
		const query = req.query
		const { currentPage, pageSize } = req.query
		// 主体逻辑开始
		//定义查询条件
		if (!query.courseId) {
			throw BadRequest('获取章节列表失败，课程ID不能为空。')
		}

		const condition = {
			...getCondition(),
			order: [
				['rank', 'ASC'],
				['id', 'ASC']
			],
			limit: Number(pageSize),
			offset: Number(currentPage)
		}
		if (query.title) {
			condition.where = {
				title: {
					[Op.like]: `%${query.title}%`
				}
			}
		}
		condition.where = {
			courseId: {
				[Op.eq]: query.courseId
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
function getCondition() {
	return {
		attributes: { exclude: ['CourseId'] },
		include: [
			{
				model: Course,
				as: 'course',
				attributes: ['id', 'name']
			}
		]
	}
}
function updateAndCreateBody(body) {
	return {
		courseId: body.courseId,
		title: body.title,
		content: body.content,
		video: body.video,
		rank: body.rank
	}
}
module.exports = new Controller()
