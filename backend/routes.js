const Router = require("express").Router
const bodyParser = require('body-parser')
const SearchController = require('./controller/SearchController')
const RecommendationController =require('./controller/Recommendation')

const routes = Router()
const jsonParser = bodyParser.json();

routes.get("/", SearchController.findTitle);
routes.post('/', jsonParser, SearchController.findRecommendation);
routes.get('/icon/:id', SearchController.findIcon);
routes.get('/providers', SearchController.findProviders);
routes.get('/providers/:id', SearchController.findProviderById);

routes.get('/recommendation/movie', jsonParser, RecommendationController.movieRecommendation);
routes.get('/recommendation/serie', jsonParser, RecommendationController.tvRecommendation);


module.exports = routes;
