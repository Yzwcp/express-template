const { User: baseModel } = require('../models')
const { Op } = require('sequelize')
const BaseDao = require('../dao/base.dao')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors')
const { generateToken } = require('../utils/jwt')
const { success } = require('../utils/response')
const { comparePasswords } = require('../utils/bcrypt')

class Controller {
	async signIn(req, res) {
		const { login, password } = req.body

		if (!login) {
			throw new BadRequestError('邮箱/用户名必须填写。')
		}

		if (!password) {
			throw new BadRequestError('密码必须填写。')
		}

		const condition = {
			where: {
				[Op.or]: [{ email: login }, { username: login }]
			}
		}
		const user = await BaseDao.getRecord(baseModel, condition)
		if (!user) {
			throw new NotFoundError('用户不存在。')
		}
		const isPasswordValid = comparePasswords(password, user.password)
		if (!isPasswordValid) {
			throw new UnauthorizedError('密码不正确。')
		}
		// if (user.role !== 100) {
		// 	throw new UnauthorizedError('您没有权限登录管理员后台。')
		// }

		const token = generateToken({ userId: user.id })
		success(res, token)
	}
	async signUp(req, res) {
		const body = {
			email: req.body.email,
			username: req.body.username,
			nickname: req.body.nickname,
			password: req.body.password,
			sex: 2,
			role: 0
		}
		console.log(body)
		const condition = {
			where: {
				[Op.or]: [{ email: body.email }, { username: body.username }]
			}
		}
		const userRecord = await BaseDao.getRecord(baseModel, condition)
		if (userRecord) {
			throw new BadRequestError('邮箱或用户名已存在。')
		}
		const user = await BaseDao.create(baseModel, body)

		success(res, '创建用户成功。', null, 201)
	}
}

module.exports = new Controller()
