import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const BACKEND_SVC = process.env.BACKEND_SVC || 'http://localhost:3333';

  var [whishList, setList] = useState([])
  var [recommended, setRecommendation] = useState({})
  var [movies, setMovies] = useState([])

  function handleInclusion() {
    const title = document.getElementById("search_field").value
    console.log(title)

    if (title) {
      setList([...whishList, title])
      document.getElementById("search_field").value = ''
    }
    console.log(whishList)

  }

  function handleExclusion(index) {
    let elIndex = index;
    console.log(elIndex);

    if (elIndex !== null) {
      const newList = whishList.filter((v, i) => i !== elIndex)

      setList(newList)
    }
  }

  async function getTitles (title) {
    const { data } = await axios.get(`${BACKEND_SVC}/?title=${title}`);

    console.log(`request result = ${JSON.stringify(data)}`);
    if (data) {
      const items = data['items']
      console.log(items)
      for (var index in items) {
        console.log(items[index])
      }
    }
    return data;
  }

  async function getRecommendation() {
    setRecommendation({})
    console.info(`Total of elements in whislist = ${whishList.length}`)
    if (whishList.length === 0) {
      alert('Favor, adicionar titulo de filmes ou series favoritas');
      return;
    }
    console.info(whishList);
    alert('Recomendacao');
    
    try{
      const response = await axios.post(BACKEND_SVC, {
        type: "",//TODO: monitization type includes: flatrate, ... if empty, all types will be considered!
        data: whishList,
      });//TODO: Not following RESTful pattern. This should be replaced to get method with query-params
      if(response.status != 200){
        alert(providerInfo.body);
        return;
      }
      const { provider } = response.data;
      const providerInfo = await axios.get(`${BACKEND_SVC}/providers/${provider}`);
      if(providerInfo.status != 200){
        alert(providerInfo.body);
        return;
      }
      console.log(`Recommended Provider=${providerInfo}`);
      if(providerInfo.data){
        const { icon_url } = providerInfo.data;
        const id = icon_url.split('/')[2]
        setRecommendation({name: providerInfo.data['clear_name'], image_url: `https://images.justwatch.com/icon/${id}/s100`});
      }

    }catch(error){
      alert(error);
    }   
  }

  async function handleRecommendedTitles(){
    const response = await axios.get(`${BACKEND_SVC}/recommendation/movie/?title=${whishList[0]}`);
    console.log(`Recommendations: ${response.data}`);
    if(response.status == 200){
      const { data } = response;
      setMovies(data);
    }else{
      setMovies({});
    }
  }

  function renderRecommendation() {
    if (recommended) {
      return (
        <div>
          <div>
            <h5>Plataforma recomendada</h5>
            <h6>{recommended.name}</h6>
            <img src={recommended.image_url} alt="" />
          </div>
          <div>
            <h2>Filmes e series que você pode gostar:</h2>
            <div className="list-item">
              <ul>
                  {movies.map((data, index) => {
                  return (
                    <li className="list_item" key={index}>                     
                      <div>
                        <img className="recommended_img" src={`https://image.tmdb.org/t/p/original${data['poster_path']}`} title={data['title']} alt="" />
                        <a>{data['title']}</a>
                      </div>
                     
                    </li>
                  )
                })}
              </ul>
        </div>
          </div>
        </div>
      );
    } else {
      return <div></div>
    }
  }

  return (
    <>
      <div className="App-header">
        <img src="/images/what2watch_logo_white.png"></img>
      </div>
      <div className="App" id="App_Title">
        <h1 className="app_title">Sistema de Recomendação</h1>
        <span className="description">Netflix, Amazon Prime, Disney Plus, etc... Não sabe qual assinar? Deixa com a gente, digite os
          filmes e séries que você gosta e vamos te dizer qual a melhor plataforma pra você assinar ;)</span>
      </div>
      <div className="App" id="search_section">
        <input type="text" id="search_field" className="search_input" placeholder="Digite o nome do filmes, series, etc..." />
        <button id="search_btn" onClick={handleInclusion}>Incluir</button>
      </div>
      <div className="App" id="my_movies_section">
        <ul className="list_of_my_movies">
          {whishList.map((name, index) => {
            return <li className="list_item" key={index}>{name} <button className="btn_remove" onClick={() => handleExclusion(index)}>X</button></li>;
          })}
        </ul>
      </div>
      <div className="App">
        <button id="recommendation_btn" onClick={() => {getRecommendation(); handleRecommendedTitles();}}>Obter recomendação</button>
      </div>
      <div className="App">
        {renderRecommendation()}
      </div>
      <div className="App-footer">
        <span>Todos direitos reservados - <a href="#">Grupo 7</a> - INF-332</span>
      </div>
    </>
  );
}

export default App;
