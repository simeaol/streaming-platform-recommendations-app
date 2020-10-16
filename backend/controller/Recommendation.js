const { default: Axios } = require('axios');
const MovieDB = require('node-themoviedb');
const axios = require('axios');
const { response } = require('express');

const API_KEY = process.env.MOVIEDB_API_KEY || '21e7b53666358e22b451c25088e9cc2f'
const BASE_PATH = 'https://api.themoviedb.org/3'
const mdb = new MovieDB(API_KEY, {});

module.exports = {
    movieRecommendation: async (req, res) => {
        const { title } = req.query;
        console.info(`About findind movied. Title=${title}`);

        const queryString = title.replace(" ", "+");

        const url = `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${queryString}`;
        console.log(`URL : ${url}`);
        axios.get(url).then(result => {
            const { data } = result;
            console.log(JSON.stringify(data));
            const { results } = data;

            const movie = results[0];
            if (movie) {
                //get recommendation
                console.info(`Getting recommendation for title: ${movie['title']}`);
                const { id } = movie;
                axios.get(`${BASE_PATH}/movie/${id}}/recommendations?api_key=${API_KEY}&language=pt-Br`)
                    .then(result => {
                        const { data: { results } } = result;
                        console.log(`recommendation: ${JSON.stringify(results)}`);
                        return res.json(results);
                    }).catch(error => {
                        console.error(error);
                        return res.status(404).end(`Cannot found recommendataion.`);
                    });

            } else {
                return res.status(404).end('Recommnedtaion not found.');
            }
        }).catch(error => {
            console.error(error);
            return res.status(404).end(`${title} NOT FOUND!`);
        });


    },
    //https://image.tmdb.org/t/p/original/b34jPzmB0wZy7EjUZoleXOl2RRI.jpg
    tvRecommendation: async (req, res) => {
        const { title } = req.query;
        console.info(`About finding show. Title=${title}`);

        const queryString = title.replace(" ", "+");

        const url = `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${queryString}`;
        console.log(`URL : ${url}`);
        axios.get(url).then(result => {
            const { data } = result;
            console.log(JSON.stringify(data));
            const { results } = data;

            const show = results[0];
            if (show) {
                //get recommendation
                console.info(`Getting recommendation for title: ${show['name']}`);
                const { id } = show;
                axios.get(`${BASE_PATH}/tv/${id}}/recommendations?api_key=${API_KEY}&language=pt-BR`)
                    .then(result => {
                        const { data: { results } } = result;
                        console.log(`recommendation: ${JSON.stringify(results)}`);
                        return res.json(results);
                    }).catch(error => {
                        console.error(error);
                        return res.status(404).end(`Cannot found recommendation for this shos.`);
                    });

            } else {
                return res.status(404).end('Recommendat ion not found.');
            }
        }).catch(error => {
            console.error(error);
            return res.status(404).end(`${title} NOT FOUND!`);
        });
    },
};