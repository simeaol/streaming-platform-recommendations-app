import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  var [whishList, setList] = useState([])

  function handleInclusion(){
    const title = document.getElementById("search_field").value        
    console.log(title)

    if(title){
      setList([...whishList, title])
      document.getElementById("search_field").value=''
    }
    console.log(whishList)

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

  function getRecommendation(){
    if(whishList.values.length == 0){
      alert('Favor, adicionar titulo de filmes ou series favoritas')
    }
    alert('Recomendacao')
  }

  return (
    <>
      <div className="App">
        <h1>INF-332 - Bemvindo ao sistema de recomendação</h1>
        <input type="text" id="search_field" width="50%" placeholder="Digite o nome do filmes, series e ..." />
        <button id="search_btn" onClick={handleInclusion}>Incluir</button>
      </div>
      <div className="App">
        <ul>
          {whishList}
        </ul>
      </div>
      <div className="App">
        <button id="recommendation_btn" onClick={getRecommendation}>Obter recomendação</button>
      </div>
    </>
  );
}

export default App;
