const { User } = require('../models')
const { UnauthorizedError } = require('../utils/errors')
const { success, failure } = require('../utils/response')
const BaseDao = require('../dao/base.dao')
const { verifyToken } = require('../utils/jwt')

module.exports = async (req, res, next) => {
	const { token } = req.headers
	console.log(token)
	if (!token) {
		throw new UnauthorizedError('当前接口需要认证才能访问。')
	}
	// 验证 token 是否正确
	const decoded = verifyToken(token)

	// 从 jwt 中，解析出之前存入的 userId
	const { userId } = decoded
	const user = await BaseDao.getPkById(User, userId)
	if (!user) {
		throw new UnauthorizedError('用户不存在。')
	}

	req.user = user
	next()
}
