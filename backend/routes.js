const Router = require("express").Router
const SearchController = require('./controller/SearchController')

const routes = Router()

routes.get("/", SearchController.findTitle)
routes.get('/icon/:id', SearchController.findIcon)
routes.get('/providers', SearchController.findProviders)

module.exports = routes;
