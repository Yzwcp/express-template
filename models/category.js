'use strict'
const { Model ,DataTypes} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Category.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: { msg: '分类已存在' },
				validate: {
					len: { args: [2, 30], msg: '分类长度在2到30之间' }
				}
			},
			rank: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: '排序必须填写' },
					notEmpty: { msg: '排序必须填写' },
					isInt: { msg: '排序必须是整数' },
					isNumeric: { msg: '排序必须是数字' },
				},
				isPositive(v) {
					if (v <= 0) {
						throw new Error('排序必须大于0')
					}
				}

			}
		},
		{
			sequelize,
			modelName: 'Category'
		}
	)
	return Category
}
