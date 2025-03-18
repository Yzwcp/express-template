const { User, Course, Like } = require('../models')
const { Op } = require('sequelize')
const BaseDao = require('../dao/base.dao')
const { BadRequest, NotFound, Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const { success } = require('../utils/response')
const { comparePasswords } = require('../utils/bcrypt')

class Controller {
	async getMe(req, res) {
		const userId = req.user.id
		if (!userId) {
			throw new Unauthorized('用户不存在。')
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
		const user = BaseDao.updateById(User, req.userId, body)
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
			throw new BadRequest('当前密码必须填写。')
		}

		if (body.password !== body.passwordConfirmation) {
			throw new BadRequest('两次输入的密码不一致。')
		}
		const user = await BaseDao.getPkById(User, req.user.id)
		const isPasswordValid = comparePasswords(body.currentPassword, user.password)
		if (!isPasswordValid) {
			throw new BadRequest('当前密码不正确。')
		}
		console.log(isPasswordValid)
		await user.update(body)
		success(res, null, '更新用户信息成功。')
	}
	//点赞和取消点赞
	async actionCourseLike(req, res) {
		const { courseId } = req.body
		if (!courseId) {
			throw BadRequest('课程id不能为空。')
		}
		const course = await BaseDao.getPkById(Course, courseId)
		if (!course) {
			throw new NotFound('课程不存在。')
		}
		const userId = req.user.id
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
	//获取课程的点赞列表
	async getLikeListByCourse(req, res) {
		const { courseId } = req.query
		if (!courseId) {
			throw new BadRequest('课程id不能为空。')
		}
		const course = await Course.findByPk(courseId, {
			include: {
				model: User,
				as: 'likeUsers'
			}
		});
		success(res, course)
	}
	//获取用户的点赞课程列表
	async courseLikeListByUser(req, res) {
		const query = req.query;
		const currentPage = Math.abs(Number(query.currentPage)) || 1;
		const pageSize = Math.abs(Number(query.pageSize)) || 10;
		const offset = (currentPage - 1) * pageSize;

		//我们这里没有用include来关联查询对应的课程，而是通过user.getLikeCourses，来查询对应的课程。当我们在模型中定义了likeCourses别名后，在Sequelize获取到的user对象上，就可以调用getLikeCourses方法。
		//可以看到区别就是在别名前面加了个get。这种做法在Sequelize 关联部分的文档里是有说明的。
		// 这么做的好处，就是可以加上各种参数了，当然包括分页的各种参数了。但这个方法，不能计算一共有多少条记录。所以我们还要计算下总数
		//仔细看看，还是有点美中不足，这里把中间表的数据也查出来了，但我们接口根本不需要这个。解决起来也非常简单

		// 查询当前用户
		const user = await User.findByPk(req.user.id);
		// 查询当前用户点赞过的课程
		const courses = await user.getLikeCourses({
			joinTableAttributes: [],
			attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
			order: [['id', 'DESC']],
			limit: pageSize,
			offset: offset
		})

		//这里也出现了一个神奇的方法，countLikeCourses()，这种写法，在文档里也有说明，专门供我们统计关联数据总数的。最后返回下数据
		// 查询当前用户点赞过的课程总数
		const count = await user.countLikeCourses();


		success(res, {
			rows: courses,
			total: count,
			currentPage,
			pageSize,
		})
	}
}

module.exports = new Controller()
