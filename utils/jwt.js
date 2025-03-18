const jwt = require('jsonwebtoken')

function generateToken(payload) {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_TIME
	})
}
function verifyToken(token) {
	return jwt.verify(token, process.env.JWT_SECRET_KEY)
}
module.exports = {
	generateToken,
	verifyToken
}
