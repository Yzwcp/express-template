const { Category } = require('../models')
const { NotFoundError } = require('../utils/response')

class CategoriesDao {
	constructor() {}
	async getOneById(id) {
		const data = await Category.findByPk(id)
		if (!data) {
			throw new NotFoundError(`Article with id ${id} not found`)
		}
		return data
	}
}

module.exports = new CategoriesDao()
