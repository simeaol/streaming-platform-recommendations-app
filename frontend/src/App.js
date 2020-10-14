import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  var [whishList, setList] = useState([])
  var [recommended, setRecommendation] = useState({})

  function handleInclusion(){
    const title = document.getElementById("search_field").value        
    console.log(title)

    if(title){
      setList([...whishList, title])
      document.getElementById("search_field").value=''
    }
    console.log(whishList)

  }

  function handleExclusion(index){
    let elIndex = index;
    console.log(elIndex);

    if (elIndex !== null) {
      const newList = whishList.filter((v, i) => i !== elIndex)

      setList(newList)
    }
  }

  async function getTitles (title) {
    const { data } = await axios.get(`http://localhost:3333/?title=${title}`);
   

    console.log(`request result = ${ JSON.stringify(data)}`);
    if(data){
      const items = data['items']
      console.log(items)
      for(var index in items){
        console.log(items[index])
      }
    }
    return data;
  }

  async function getRecommendation(){
    console.info(`Total of elements in whislist = ${whishList.length}`)
    if(whishList.length === 0){      
      alert('Favor, adicionar titulo de filmes ou series favoritas');
      return;
    }
    console.info(whishList);
    alert('Recomendacao');
    console.log(whishList)   
    
    const response = await axios.post('http://localhost:3333/', {
      type: "",//TODO: monitization type includes: flatrate, ... if empty, all types will be considered!
      data: whishList,
    });//TODO: Not following RESTful pattern. This should be replaced to get method with query-params
    const { provider } = response.data;
    const providerInfo = await axios.get(`http://localhost:3333/providers/${provider}`);
    console.log(`Recommended Provider=${providerInfo}`);
    if(providerInfo.data){
      const { icon_url } = providerInfo.data;
      const id = icon_url.split('/')[2]
      setRecommendation({name: providerInfo.data['clear_name'], image_url: `https://images.justwatch.com/icon/${id}/s100`});
    }
    
  }

  function renderRecommendation(){
    if(recommended){
      return(
      <div>
        <h5>Plataforma recomendado</h5>
        <h6>{recommended.name}</h6>
        <img src={recommended.image_url} alt=""/>
      </div>
      )
    }else{
      return <div></div>
    }
  }

  return (
    <>
      <div className="App">
        <h1>INF-332 - Bem Vindo ao Sistema de Recomendação</h1>
        <input type="text" id="search_field" width="50%" placeholder="Digite o nome do filmes, series e ..." />
        <button id="search_btn" onClick={handleInclusion}>Incluir</button>
      </div>
      <div className="App">
        <ul class="list_of_my_movies">
          {whishList.map((name, index) => {
            return <li key={ index }>{name} <button class="btn-delete" onClick={() => handleExclusion(index)}>X</button></li>;
          })}
        </ul>
      </div>
      <div className="App">
        <button id="recommendation_btn" onClick={getRecommendation}>Obter recomendação</button>
      </div>
      <div className="App">    
        {renderRecommendation()}
      </div>
    </>
  );
}

export default App;
