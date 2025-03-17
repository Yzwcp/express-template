const ArticlesDao = require("../dao/articles.dao");
const {success, failure, NotFoundError} = require("../utils/response");
const {Setting} = require("../models");


class SettingController {
    async put (req, res) {
        let body = {
            name: req.body.name,
            icp: req.body.content,
            copyright: req.body.copyright,
        }
        try {
            const article = await Setting.findByPk(1)
            await article.update(body)
            success(res, null)
        } catch (e) {
            failure(res, e)
        }
    }
    async get (req, res) {
        let id = req.params.id
        try {
            const data = await Setting.findByPk(id)
            if(!data){
                throw new NotFoundError(`Article with id ${id} not found`)
            }
            success(res, data)
        } catch (e) {
            failure(res, e)
        }
    }
}
module.exports = new SettingController();