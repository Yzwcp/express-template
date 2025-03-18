const { success } = require('../../utils/response')
const { User: baseModel } = require('../../models')
const { Op } = require('sequelize')
const BaseDao = require('../../dao/base.dao')
const { BadRequest, NotFound, Unauthorized } = require('http-errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Controller {
	async signIn(req, res) {
		const { login, password } = req.body

		if (!login) {
			throw new BadRequest('邮箱/用户名必须填写。')
		}

		if (!password) {
			throw new BadRequest('密码必须填写。')
		}

		const condition = {
			where: {
				[Op.or]: [{ email: login }, { username: login }]
			}
		}
		const user = await BaseDao.getRecord(baseModel, condition)
		if (!user) {
			throw new NotFound('用户不存在。')
		}
		const isPasswordValid = bcrypt.compareSync(password, user.password)
		if (!isPasswordValid) {
			throw new Unauthorized('密码不正确。')
		}
		if (user.role !== 100) {
			throw new Unauthorized('您没有权限登录管理员后台。')
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
			expiresIn: process.env.JWT_EXPIRES_TIME
		})
		success(res, token)
	}
}

module.exports = new Controller()
