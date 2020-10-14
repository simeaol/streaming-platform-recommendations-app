const JustWatch = require("justwatch-api");
const bodyParser = require("body-parser");

module.exports = {
    /**Find all title with the similarity */
    findTitle: async (req, resp) => {
        console.log('About searching movie...');
        var justwatch = new JustWatch({locale:'pt_BR'});
        var query_name = req.params[0];
        
        console.log(`query-params = ${JSON.stringify(req.query)}`);
        var title = req.query['title']; //or const {title} = req.query
    
        console.log(`Title = ${title}`);
    
        var searchResult = await justwatch.search({query: title});
        console.log("search", searchResult);
        
        return resp.json(searchResult);
    
    },
    
    /**Redirect to properly provide icon */
    findIcon: async (req, resp) => {
        console.log(`About getting icon id = ${req.params}`);
        const id = req.params.id;
        resp.redirect(`https://images.justwatch.com/icon/${id}/s100`);
    },
    
    /**Return all providers available in the service */
    findProviders: async (req, resp) => {
        console.log('About searching providers...');
        var justwatch = new JustWatch({locale:'pt_BR'});
    
        var searchResult = await justwatch.getProviders();
        console.log("search", searchResult);
        
        return resp.json(searchResult);
    },

    /**Find provider by ID */
    findProviderById: async (req, resp) => {
        const { id } = req.params;
        console.log(`About finding provider ID=${id}`);
        var justwatch = new JustWatch({locale:'pt_BR'});
        const providers = await justwatch.getProviders();
        for(p of providers){
            if(p['id'] == id){
                return resp.json(p)
            }
            console.log(JSON.stringify(p))
        }
        return resp.status(404).send(`Provider ID=${id} not found`);

    },

    /**Return provider which contains most element provided by the user */
    findRecommendation: async (req, resp) => {
        const { type, data } = req.body;
        console.log(type)
        if(data){
            var providers = new Map();
            var justwatch = new JustWatch({locale:'pt_BR'});
            for(title of data){
                var result = await justwatch.search({query: title});
                for(item of result['items']){
                    if(item['title'].toLowerCase() == title.toLowerCase()){ //Given title equals to requested

                        if(type){
                            item['offers'].reduce((filtered, offer) => {
                                if(offer['monetization_type'] == type){
                                    const { provider_id } = offer;
                                    const element = providers.get(provider_id);
                                    if(element){
                                        providers.set(offer['provider_id'], element+1);
                                    }else{
                                        providers.set(offer['provider_id'], 1);
                                    }                                    
                                }
                            });                          
                            
                        }else{
                            item['offers'].reduce((filtered, offer) => {
                                const { provider_id } = offer;
                                const element = providers.get(provider_id);
                                if(element){
                                    providers.set(offer['provider_id'], element+1);
                                }else{
                                    providers.set(offer['provider_id'], 1);
                                }
                            });                               
                        }                        
                    }
                }           

            }    
            const [provider_id, total] = [...providers.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
            return resp.json({"provider":provider_id, "total" :total});     
        }
   
        return resp.status(400).send(`Bad request!`);
    }
};