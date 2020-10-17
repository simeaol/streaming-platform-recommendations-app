const express = require("express");
const cors = require('cors');
const routes = require('./routes');
const mqService = require('./mq/mqservices');

var app = express();
const expressSwagger = require('express-swagger-generator')(app);
app.use(cors())
app.use(express.json());


//middlware for root path
app.get('/', (req, res, next) => {
    console.info(`middleware from get / processing request...`);
    let  title  = req.query;
    try{
        if(title){
            console.info(`Sending data to queue "movies."`);
            mqService.publishToQueue("titles", title);
        }
    }catch(error){
        console.error(`Something bad occured while executing middlware /. error: ${error}`);
    }
    next();
});

app.post('/', (req, res, next) => {
    console.info(`middleware from post / processing request...`);
    let { type, data }  = req.body;
    try{
        if(data){
            console.info(`Sending data to queue "movies."`);
            mqService.publishToQueue("titles", {type, data});            
        }
    }catch(error){
        console.error(`Something bad occured while executing middlware /. error: ${error}`);
    }
    next();
});

//recommendation
app.get('/recommendation/*', (req, res, next) => {
    console.info(`middleware from get /recommendation processing request...`);
    let  title  = req.query;
    try{
        if(title){
            console.info(`Sending data to queue "movies."`);
            mqService.publishToQueue("recommendation", title);
        }
    }catch(error){
        console.error(`Something bad occured while executing middlware /. error: ${error}`);
    }
    next();
});

//After middlware, otherwise, middleware will be ignored.
app.use(routes);

const PORT = process.env.PORT || 3333;




let options = {
    swaggerDefinition: {
        info: {
            description: 'This is the what2watch documentation API',
            title: 'What2Watch API',
            version: '1.0.0',
        },
        host: 'localhost:3333',
        basePath: '/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http'],
    },
    basedir: __dirname,
    files: ['./routes.js'] 
};
expressSwagger(options)

app.listen(PORT, (req, resp) => {
    console.log(`server started at ${PORT}`);
})