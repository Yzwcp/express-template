const { Article } = require('../models')
const { NotFound } = require('http-errors')

class BaseDao {
	constructor() {}
	/**
	 * 获取列表数据
	 * @param {import('sequelize').ModelStatic<import('sequelize').Model>} db - 数据模型
	 * @param {{ offset: number, limit: number, where?: Object }} condition - 查询条件
	 *
	 * */
	async getList(db, condition) {
		if (condition.offset) {
			condition.offset = (condition.offset - 1) * condition.limit
			const data = await db.findAndCountAll(condition)
			return {
				total: data.count,
				rows: data.rows,
				pageSize: condition.limit,
				currentPage: condition.offset / condition.limit + 1
			}
		} else {
			return db.findAll(condition)
		}
	}
	/**
	 * 根据条件获取数据
	 * @param {import('sequelize').ModelStatic<import('sequelize').Model>} db - 数据模型
	 * @param {Object} condition - 查询条件
	 * @returns {Promise<import('sequelize').Model>}
	 *
	 * */
	async getRecord(db, condition = {}) {
		return await db.findOne(condition)
	}
	/**
	 * 根据id获取数据
	 * @param {import('sequelize').ModelStatic<import('sequelize').Model>} db - 数据模型
	 * @param {number} id - 数据id
	 * @param {Object} condition - 查询条件
	 * @returns {Promise<import('sequelize').Model>}
	 * @throws {NotFound}
	 *
	 * */
	async getPkById(db, id, condition = {}) {
		return await db.findByPk(id, condition)
	}

	/**
	 * 新增数据
	 * @param {import('sequelize').ModelStatic<import('sequelize').Model>} db - 数据模型
	 * @param {Object} body - 查询条件
	 * @returns {Promise<import('sequelize').Model>}
	 *
	 * */
	async create(db, body) {
		return db.create(body)
	}

	/**
	 * 根据id删除数据
	 * @param {import('sequelize').ModelStatic<import('sequelize').Model>} db - 数据模型
	 * @param {number} id - 数据id
	 * @param {Object} condition - 查询条件
	 * @returns {Promise<void>}
	 *
	 * */
	async removeById(db, id, condition = {}) {
		const data = await this.getPkById(db, id, condition)
		await data.destroy()
	}

	/**
	 * 根据id更新数据
	 * @param {import('sequelize').ModelStatic<import('sequelize').Model>} db - 数据模型
	 * @param {number} id - 数据id
	 * @param {Object} body - 要更新的数据
	 * @returns {Promise<void>}
	 *
	 * */
	async updateById(db, id, body) {
		const dbData = await this.getPkById(db, id)
		await dbData.update(body)
	}
}
module.exports = new BaseDao()
