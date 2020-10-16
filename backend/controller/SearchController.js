const JustWatch = require("justwatch-api");
const bodyParser = require("body-parser");
const ProviderIds = require('../utils/platformids_utils');

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
        console.info(`About finding recommendation. Details=${JSON.stringify(req.body)}`);
        const { type, data } = req.body;
        console.info(`filter type = ${type}`);
        if(data){
            var providers = new Map();
            var justwatch = new JustWatch({locale:'pt_BR'});
            for(item of data){
                let title = item;
                console.info(`Title item = ${title}`);
                var result = await justwatch.search({query: title});
                for(item of result['items']){                                       
                    if(item['title'].toLowerCase().trim() == title.toLowerCase().trim()){ //Given title equals to requested
                        console.info(`${item['title'].toLowerCase()} == ${title.toLowerCase()}`);
                        console.log(`Offers  for ${title}. \n ${JSON.stringify(item['offers'])}`);
                        if(type){
                            for(offer of item['offers']){
                                console.info(`Checkiing monitization type for ${JSON.stringify(offer)}`);
                                if(offer['monetization_type'] == type){
                                    const { provider_id } = offer;
                                    const element = providers.get(provider_id);
                                    if(element){
                                        providers.set(offer['provider_id'], element+1);
                                    }else{
                                        providers.set(offer['provider_id'], 1);
                                    }                                    
                                }
                            }                      
                            
                        }else{                            
                            for(offer of item['offers']){
                                console.info(`${offer}`)
                                const { provider_id } = offer;
                                const element = providers.get(provider_id);
                                if(element){
                                    providers.set(offer['provider_id'], element+1);
                                }else{
                                    providers.set(offer['provider_id'], 1);
                                }
                            }                             
                        }                        
                    }
                }           

            }  
            console.log(providers);
            if(providers.size == 0){
                return resp.status(404).end('Recommendation NOT FOUND');
            }  
            console.log(providers);
            const [provider_id, total] = [...providers.entries()].reduce((a, e) => e[1] > a[1] ? e : a);
            const found = ProviderIds.BR_PROVIDERS.find(i => i == provider_id);
            if(!found){
                for(p of providers.keys()){
                    if(ProviderIds.BR_PROVIDERS.find(i => i == p)){
                        return resp.json({"provider":p, "total" :0}); 
                    }
                }
            }
            return resp.json({"provider":provider_id, "total" :total});     
        }
   
        return resp.status(400).send(`Bad request!`);
    }
};