const bcrypt = require('bcryptjs')
function hashPassword(password) {
	return bcrypt.hashSync(password, 10)
}
function comparePasswords(password1, password2) {
	return bcrypt.compareSync(password1, password2)
}
module.exports = {
	hashPassword,
	comparePasswords
}
