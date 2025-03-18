/**
 * 请求成功
 * @param res
 * @param message
 * @param data
 * @param code
 */
function success(res, data = {}, message = '操作成功', code = 200) {
	res.status(code).json({
		status: true,
		message,
		data,
		code
	})
}

/**
 * 请求失败
 * @param res
 * @param error
 * @param req
 */
function failure(res, error, req) {
	const extra = {
		url: req.originalUrl,
		method: req.method,
		query: req.query,
		params: req.params
	}
	if (error.name === 'SequelizeValidationError') {
		const errors = error.errors.map((e) => e.message)
		return res.status(400).json({
			status: false,
			message: '请求参数错误',
			errors,
			...extra
		})
	}
	if (error.name === 'BadRequestError') {
		return res.status(400).json({
			status: false,
			message: '请求参数错误',
			errors: [error.message],
			...extra
		})
	}
	if (error.name === 'UnauthorizedError') {
		return res.status(401).json({
			status: false,
			message: '认证失败',
			errors: [error.message],
			...extra
		})
	}
	if (error.name === 'NotFoundError') {
		return res.status(404).json({
			status: false,
			message: '资源不存在',
			errors: [error.message],
			...extra
		})
	}
	if (error.name === 'JsonWebTokenError') {
		return res.status(401).json({
			status: false,
			message: '认证失败',
			errors: ['您提交的 token 错误。'],
			...extra
		})
	}

	if (error.name === 'TokenExpiredError') {
		return res.status(401).json({
			status: false,
			message: '认证失败',
			errors: ['您的 token 已过期。'],
			...extra
		})
	}
	console.log(error.stack)
	res.status(500).json({
		status: false,
		message: '服务器错误',
		errors: [error.message],
		...extra
	})
}

module.exports = {
	success,
	failure
}
