const { Article } = require('../models')
const { NotFoundError } = require('../utils/response')

class ArticlesDao {
	constructor() {}
	async getOneById(id) {
		const article = await Article.findByPk(id)
		if (!article) {
			throw new NotFoundError(`Article with id ${id} not found`)
		}
		return article
	}
}

module.exports = new ArticlesDao()
