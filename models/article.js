'use strict'
const { Model } = require('sequelize')
const { NotFoundError } = require('../utils/response')

module.exports = (sequelize, DataTypes) => {
	class Article extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Article.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: [2, 30],
					notEmpty: {
						msg: 'Title is required'
					},
					notNull: {
						msg: 'Title is required'
					}
				}
			},
			lastName: DataTypes.STRING,
			content: DataTypes.TEXT
		},
		{
			sequelize,
			modelName: 'Article'
		}
	)
	return Article
}
