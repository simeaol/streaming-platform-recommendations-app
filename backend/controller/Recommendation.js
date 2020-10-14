const { default: Axios } = require('axios');
const MovieDB = require('node-themoviedb');
const axios = require('axios');
const { response } = require('express');

const API_KEY = process.env.MOVIEDB_API_KEY || '21e7b53666358e22b451c25088e9cc2f'
const mdb = new MovieDB(API_KEY, {});
module.exports = {
    movieRecommendation: async(req, res) => {
        const { title } = req.query;
        console.info(`About findind movied. Title=${title}`);

        const queryString = title.replace(" ", "+");

        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${queryString}`;
        console.log(`URL : ${url}`);
        axios.get(url).then(result => {
            const { data } = result;
            console.log(JSON.stringify(data));
            const { results } = data;

            const movie = results[0];
            if(movie){
                //get recommendation
                console.info(`Getting recommendation for title: ${movie['title']}`);
                const { id } = movie;
                axios.get(`https://api.themoviedb.org/3/movie/${id}}/recommendations?api_key=${API_KEY}&language=pt-Br`)
                .then(result => {
                    const { data: { results } } = result;
                    console.log(`recommendation: ${JSON.stringify(results)}`);
                    return res.json(results);
                }).catch(error => {
                    console.error(error);  
                    return res.status(404).end(`Cannot found recommendataion.`);                 
                });
                
            }else{
                return res.status(404).end('Recommnedtaion not found.');
            }
        }).catch(error => {
            console.error(error);
            return res.status(404).end(`${title} NOT FOUND!`);
        });


    },
    tvRecommendation: async(req, res) => {
        const { title } = req.params;

        //await mdb.tv.
    },
    //https://image.tmdb.org/t/p/original/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg

}