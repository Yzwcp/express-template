const { Category } = require('../models')
const { NotFound } = require('http-errors')

class CategoriesDao {
	constructor() {}
	async getOneById(id) {
		const data = await Category.findByPk(id)
		if (!data) {
			throw new NotFound(`Article with id ${id} not found`)
		}
		return data
	}
}

module.exports = new CategoriesDao()
