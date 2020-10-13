const express = require("express");
const routes = require('./routes');
const cors = require('cors')

var app = express();
app.use(cors())
app.use(routes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, (req, resp) => {
    console.log(`server started at ${PORT}`);
})