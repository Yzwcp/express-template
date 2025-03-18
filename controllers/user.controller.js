const { User: baseModel, Course, Like } = require('../models')
const { Op } = require('sequelize')
const BaseDao = require('../dao/base.dao')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors')
const jwt = require('jsonwebtoken')
const { success } = require('../utils/response')
const { comparePasswords } = require('../utils/bcrypt')

class Controller {
	async getMe(req, res) {
		const userId = req.user.id
		if (!userId) {
			throw new UnauthorizedError('用户不存在。')
		}
		success(res, req.user)
	}
	async updateUserInfo(req, res) {
		const body = {
			nickname: req.body.nickname,
			sex: req.body.sex,
			company: req.body.company,
			introduce: req.body.introduce,
			avatar: req.body.avatar
		}
		const user = BaseDao.updateById(baseModel, req.userId, body)
		success(res, null, '更新用户信息成功。')
	}
	async updateUserAccount(req, res) {
		const body = {
			email: req.body.email,
			username: req.body.username,
			currentPassword: req.body.currentPassword,
			password: req.body.password,
			passwordConfirmation: req.body.passwordConfirmation || ''
		}
		if (!body.currentPassword) {
			throw new BadRequestError('当前密码必须填写。')
		}

		if (body.password !== body.passwordConfirmation) {
			throw new BadRequestError('两次输入的密码不一致。')
		}
		const user = await BaseDao.getPkById(baseModel, req.user.id)
		const isPasswordValid = comparePasswords(body.currentPassword, user.password)
		if (!isPasswordValid) {
			throw new BadRequestError('当前密码不正确。')
		}
		console.log(isPasswordValid)
		await user.update(body)
		success(res, null, '更新用户信息成功。')
	}
	//点赞和取消点赞
	async actionCourseLike(req, res) {
		const { courseId } = req.body
		if (!courseId) {
			throw new Error('课程id不能为空。')
		}
		console.log(courseId)
		const course = await BaseDao.getPkById(Course, courseId)
		if (!course) {
			throw new NotFoundError('课程不存在。')
		}
		const userId = req.user.id
		console.log(userId)
		// 检查课程之前是否已经点赞
		const like = await BaseDao.getRecord(Like, {
			where: {
				courseId,
				userId
			}
		})
		if (!like) {
			await Like.create({ courseId, userId })
			await course.increment('likesCount')
			success(res, null, '点赞成功。')
		} else {
			// 如果点赞过了，那就删除。并且课程的 likesCount - 1
			await like.destroy()
			await course.decrement('likesCount')
			success(res, null, '取消赞成功。')
		}
	}

	async getLikeListByCourse(req, res) {}
}

module.exports = new Controller()
