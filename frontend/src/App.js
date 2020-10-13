import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>INF-332 - Bemvindo ao sistema de recomendação</h1>
      <input type="text" id="search_field" width="50%" placeholder="Procure pelo filmes, series e ..." />
      <button type="submit" id="search_btn">Buscar</button>
    </div>
  );
}

export default App;
