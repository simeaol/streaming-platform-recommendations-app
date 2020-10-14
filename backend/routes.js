const Router = require("express").Router
const SearchController = require('./controller/SearchController')

const routes = Router()

routes.get("/", SearchController.findTitle)
routes.post('/', SearchController.findRecommendation)
routes.get('/icon/:id', SearchController.findIcon)
routes.get('/providers', SearchController.findProviders)
routes.get('/providers/:id', SearchController.findProviderById)


module.exports = routes;
