const Router = require("express").Router
const bodyParser = require('body-parser')
const SearchController = require('./controller/SearchController')

const routes = Router()
const jsonParser = bodyParser.json();

routes.get("/", SearchController.findTitle)
routes.post('/', jsonParser, SearchController.findRecommendation)
routes.get('/icon/:id', SearchController.findIcon)
routes.get('/providers', SearchController.findProviders)
routes.get('/providers/:id', SearchController.findProviderById)


module.exports = routes;
