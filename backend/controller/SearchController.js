const JustWatch = require("justwatch-api");
const https = require('https');

module.exports = {
    findTitle: async (req, resp) => {
        console.log('About searching movie...')
        var justwatch = new JustWatch({locale:'pt_BR'});
        var query_name = req.params[0]
        
        console.log(`query-params = ${JSON.stringify(req.query)}`)
        var title = req.query['title'] //or const {title} = req.query
    
        console.log(`Title = ${title}`);
    
        var searchResult = await justwatch.search({query: title});
        console.log("search", searchResult);
        
        return resp.json(searchResult)
    
    },
    
    findIcon: async (req, resp) => {
        console.log(`About getting icon id = ${req.params}`)
        const id = req.params.id
        resp.redirect(`https://images.justwatch.com/icon/${id}/s100`);
    },
    
    findProviders: async (req, resp) => {
        console.log('About searching providers...')
        var justwatch = new JustWatch({locale:'pt_BR'});
    
        var searchResult = await justwatch.getProviders();
        console.log("search", searchResult);
        
        return resp.json(searchResult)
    },
};