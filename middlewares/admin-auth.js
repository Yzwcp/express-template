const { User } = require('../models')
const { Unauthorized } = require('http-errors')
const { success, failure } = require('../utils/response')
const BaseDao = require('../dao/base.dao')
const { verifyToken } = require('../utils/jwt')

module.exports = async (req, res, next) => {
	const { token } = req.headers
	console.log(token)
	if (!token) {
		throw new Unauthorized('当前接口需要认证才能访问。')
	}
	// 验证 token 是否正确
	const decoded = verifyToken(token)

	// 从 jwt 中，解析出之前存入的 userId
	const { userId } = decoded

	const user = await BaseDao.getPkById(User, userId)
	if (!user) {
		throw new Unauthorized('用户不存在。')
	}
	// 验证当前用户是否是管理员
	if (user.role !== 100) {
		throw new Unauthorized('您没有权限使用当前接口。')
	}
	req.user = user
	next()
}
