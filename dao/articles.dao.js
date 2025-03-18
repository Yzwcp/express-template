const { Article } = require('../models')
const { NotFound } = require('http-errors')

class ArticlesDao {
	constructor() {}
	async getOneById(id) {
		const article = await Article.findByPk(id)
		if (!article) {
			throw new NotFound(`Article with id ${id} not found`)
		}
		return article
	}
}

module.exports = new ArticlesDao()
