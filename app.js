const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { failure } = require('./utils/response')

require('express-async-errors')
require('dotenv').config()

const adminAuth = require('./middlewares/admin-auth')
const userAuth = require('./middlewares/user-auth')

const homeRouter = require('./routes/home')

const adminArticlesRouter = require('./routes/admin/article')
const adminCategoryRouter = require('./routes/admin/categories')
const adminSettingRouter = require('./routes/admin/settings')
const adminUsersRouter = require('./routes/admin/users')
const adminCoursesRouter = require('./routes/admin/courses')
const adminChaptersRouter = require('./routes/admin/chapters')
const adminAuthRouter = require('./routes/auth')

const authRouter = require('./routes/user')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/client', homeRouter)

//管理员文章后台
app.use('/admin/articles', adminAuth, adminArticlesRouter)
app.use('/admin/categories', adminAuth, adminCategoryRouter)
app.use('/admin/settings', adminAuth, adminSettingRouter)
app.use('/admin/users', adminAuth, adminUsersRouter)
app.use('/admin/courses', adminAuth, adminCoursesRouter)
app.use('/admin/chapters', adminAuth, adminChaptersRouter)
app.use('/auth', adminAuthRouter)
app.use('/user', userAuth, authRouter)

// 全局错误处理中间件
app.use((err, req, res, next) => {
	failure(res, err, req)
})

module.exports = app
