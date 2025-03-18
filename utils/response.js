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
	// 默认响应为 500，服务器错误
	let statusCode = 500;
	let errors = '服务器错误';

	if (error.name === 'SequelizeValidationError') {  // Sequelize 验证错误
		statusCode = 400;
		errors = error.errors.map(e => e.message);
	} else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {  // Token 验证错误
		statusCode = 401;
		errors = '您提交的 token 错误或已过期。';
	} else if (error instanceof createError.HttpError) {  // http-errors 库创建的错误
		statusCode = error.status;
		errors = error.message;
	}
	console.log(error.stack)

	res.status(statusCode).json({
		status: false,
		message: `请求失败: ${error.name}`,
		errors: Array.isArray(errors) ? errors : [errors],
		...extra
	});


}

module.exports = {
	success,
	failure
}
