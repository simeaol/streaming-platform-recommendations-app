const Router = require("express").Router;
const bodyParser = require('body-parser');
const SearchController = require('./controller/SearchController');
const RecommendationController =require('./controller/Recommendation');

const routes = Router()
const jsonParser = bodyParser.json();

/**
 * Return the movie/serie info based on filter name
 * @route GET /
 * @param {string} title.query.required - title of the catalog
 * @returns {object} 200 - JSON of specific movie/serie
 * @returns {object} 404 - Not Found message
 */
routes.get("/", SearchController.findTitle);

/**
 * Return platform recomendation based on array of titles provided
 * @route POST /
 * @body {object} object.required - title of the catalog
 * @returns {object} 200 - JSON of specific movie/serie
 * @returns {object} 404 - Not Found message
 */
routes.post('/', jsonParser, SearchController.findRecommendation);

/**
 * Return the title icon
 * @route GET /icon/{id}
 * @param {integer} id - id of the catalog/title/provider
 * @returns {object} 200 - Icon of fiven title/movie/serie
 * @returns {object} 404 - Not Found message
 */
routes.get('/icon/:id', SearchController.findIcon);

/**
 * Return all providers available in the area
 * @route GET /providers
 * @returns {object} 200 - JSON of specific provider
 * @returns {object} 404 - Not Found message
 */
routes.get('/providers', SearchController.findProviders);

/**
 * Return info of the provided id
 * @route GET /providers/{id}
 * @param {integer} id.required - id of specific provider
 * @returns {object} 200 - JSON of specific provider
 * @returns {object} 404 - Not Found message
 */
routes.get('/providers/:id', SearchController.findProviderById);

/**
 * Return recommendation for movies
 * @route GET /recommendation/movie
 * @param {string} title.query.required - the movie title
 * @returns {object} 200 - JSON of recommended movies
 * @returns {object} 404 - Not Found message
 */
routes.get('/recommendation/movie', jsonParser, RecommendationController.movieRecommendation);

/**
 * Return recommendation for series
 * @route GET /recommendation/serie
 * @param {string} title.query.required - the serie title
 * @returns {object} 200 - JSON of recommended series
 * @returns {object} 404 - Not Found message
 */
routes.get('/recommendation/serie', jsonParser, RecommendationController.tvRecommendation);

module.exports = routes;
