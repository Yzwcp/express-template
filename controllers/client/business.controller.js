const BaseDao = require('../../dao/base.dao')
const { Course, Category, User, Chapter, Like } = require('../../models')
const { success, failure } = require('../../utils/response')
const { NotFoundError } = require('../../utils/errors')

class BusinessController {
	constructor() {}
	async getHomeData(req, res) {
		//推荐课程
		const condition = {
			attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name']
				},
				{
					model: User,
					as: 'user',
					attributes: ['id', 'username', 'nickname', 'avatar', 'company']
				}
			],
			where: { recommended: true },
			order: [['id', 'desc']],
			limit: 10
		}
		const recommendCourses = await BaseDao.getList(Course, condition)
		//热门课程
		const hotCourses = await BaseDao.getList(Course, {
			attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
			order: [
				['likesCount', 'desc'],
				['id', 'desc']
			],
			limit: 10
		})
		//最新课程
		const introductoryCourses = await BaseDao.getList(Course, {
			attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
			where: { introductory: true },
			order: [['id', 'desc']],
			limit: 10
		})
		success(res, {
			recommendCourses,
			hotCourses,
			introductoryCourses
		})
	}
	async getCategoriesList(req, res) {
		const categories = await BaseDao.getList(Category, {
			attributes: ['id', 'name']
		})
		success(res, categories)
	}
	//获取课程列表
	async getCoursesList(req, res) {
		if (!req.query.categoryId) throw new Error('课程id不能为空')

		const { currentPage, pageSize } = req.query

		const condition = {
			limit: Number(pageSize) || 10,
			offset: Number(currentPage) || 1,
			where: {
				categoryId: req.query.categoryId
			}
		}
		const categories = await BaseDao.getList(Course, condition)
		success(res, categories)
	}

	//获取课程详情
	async getCourseDetail(req, res) {
		const id = req.params.id
		if (!id) throw new Error('课程id不能为空')
		const condition = {
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name']
				},
				{
					model: Chapter,
					as: 'chapters'
				},
				{
					model: User,
					as: 'user',
					attributes: ['id', 'username', 'nickname', 'avatar', 'company']
				}
			],
			where: {
				id: req.params.id
			}
		}
		const categories = await BaseDao.getPkById(Course, id, condition)
		if (!categories) {
			throw new Error('课程不存在')
		}
		success(res, categories)
	}
}
module.exports = new BusinessController()
