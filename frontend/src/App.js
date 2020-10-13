import React from 'react';
import axios from 'axios';
import './App.css';

function App() {

  function getPlatform(){
    const title = document.getElementById("search_field").value
        
    console.log(title)

    getTitles(title);


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

  return (
    <div className="App">
      <h1>INF-332 - Bemvindo ao sistema de recomendação</h1>
      <input type="text" id="search_field" width="50%" placeholder="Procure pelo filmes, series e ..." />
      <button id="search_btn" onClick={() => getPlatform()}>Buscar</button>
    </div>
  );
}

export default App;
