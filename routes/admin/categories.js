const express = require('express')
const router = express.Router()
const { Category } = require('../../models')
const CategoriesDao = require('../../dao/categories.dao')
const { Op } = require('sequelize')
const { success, failure } = require('../../utils/response')

/**
 * 查询分类列表
 * GET /admin/categories
 */
router.get('/', async function (req, res) {
	// 定义结果信息
	const currentPage = Number(req.query.currentPage) || 1
	const pageSize = Number(req.query.pageSize) || 10
	const offset = (currentPage - 1) * pageSize
	const limit = pageSize
	// 主体逻辑开始
	//定义查询条件
	const condition = {
		order: [
			['id', 'DESC'] // 按照 id 字段降序排序
		],
		offset,
		limit
	}
	if (req.query.name) {
		condition.where = {
			name: {
				[Op.like]: '%' + req.query.name + '%'
			}
		}
	}
	try {
		const data = await Category.findAndCountAll(condition)

		success(res, {
			list: data.rows,
			currentPage,
			pageSize,
			total: data.count
		})
	} catch (error) {
		// 返回错误信息
		failure(res, error)
	}
	// 主体逻辑结束
})

/**
 * 查看分类详情
 * GET /admin/categories/1
 */
router.get('/:id', async function (req, res) {
	let id = req.params.id

	try {
		const data = await Category.findByPk(id)
		success(res, data)
	} catch (e) {
		failure(res, e)
	}
})

/**
 * 发布分类
 * POST /admin/categories
 */
router.post('/', async function (req, res) {
	let body = {
		name: req.body.name,
		rank: req.body.rank
	}

	try {
		const data = await Category.create(body)
		success(res, null, '操作成功')
	} catch (e) {
		failure(res, e)
	}
})

/**
 *	删除分类
 * DELETE /admin/categories
 */
router.delete('/:id', async function (req, res) {
	let id = req.params.id

	try {
		const article = await CategoriesDao.getOneById(id)
		await article.destroy()
		success(res, null, '删除成功')
	} catch (e) {
		failure(res, e)
	}
})

/**
 *	更新分类
 * PUT /admin/categories
 */
router.put('/:id', async function (req, res) {
	let id = req.params.id
	let body = {
		title: req.body.title,
		content: req.body.content
	}

	try {
		const article = await CategoriesDao.getOneById(id)
		await article.update(body)
		success(res, null)
	} catch (e) {
		failure(res, e)
	}
})
module.exports = router
