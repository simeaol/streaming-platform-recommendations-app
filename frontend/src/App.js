import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const BACKEND_SVC = process.env.REACT_APP_BACKEND_SVC || 'http://localhost:3333';

  var [whishList, setList] = useState([])
  var [recommended, setRecommendation] = useState({})
  const [possibleTitles, setPossibleTitles] = useState([]);
  var [movies, setMovies] = useState([])
  var [shows, setShows] = useState([])

  async function handleChange(e) {
    if (e.target.value.length >= 3) {
      let movie = e.target.value;

      const response = await getTitles(movie);
      let itemTitles = response['items'];
      setPossibleTitles(itemTitles);
      let titles = itemTitles.map((i) => i.title);

      console.log(`Possible item: ${titles}`);
    }
  }

  async function handleSearchBlur() {
    setPossibleTitles([]);
  }

  function handleInclusion(itemTitle, itemType = 'movie') {
    let title = document.getElementById("search_field").value;
    let type = itemType;
    if (itemTitle !== null) {
      title = itemTitle;
    }
    console.log(`${title} - ${type}`)

    if (title) {
      let newList = whishList.concat([{ t: title, ty: type }]);
      setList(newList)
      document.getElementById("search_field").value = ''
      setPossibleTitles([]);
    }
    console.log(whishList)

    setVisible("recommendation_btn")
  }

  function handleExclusion(index) {
    let elIndex = index;
    console.log(elIndex);

    if (elIndex !== null) {
      const newList = whishList.filter((v, i) => i !== elIndex)

      setList(newList)
    }
  }

  async function getTitles(title) {
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
    setVisible("platform");
    setVisible("recommended");

    try {
      const response = await axios.post(BACKEND_SVC, {
        type: "",//TODO: monitization type includes: flatrate, ... if empty, all types will be considered!
        data: whishList,
      });//TODO: Not following RESTful pattern. This should be replaced to get method with query-params
      if (response.status != 200) {
        alert(providerInfo.body);
        return;
      }
      const { provider } = response.data;
      const providerInfo = await axios.get(`${BACKEND_SVC}/providers/${provider}`);
      if (providerInfo.status != 200) {
        alert(providerInfo.body);
        return;
      }
      console.log(`Recommended Provider=${providerInfo}`);
      if (providerInfo.data) {
        const { icon_url } = providerInfo.data;
        const id = icon_url.split('/')[2]
        setRecommendation({ name: providerInfo.data['clear_name'], image_url: `https://images.justwatch.com/icon/${id}/s100` });
      }

    } catch (error) {
      alert(error);
    }
  }

  async function handleRecommendedTitles() {
    let firstMovie = whishList.find((i) => i.ty === 'movie');
    let firstShow = whishList.find((i) => i.ty === 'show');

    if (firstMovie) {
      console.log(firstMovie)
      const responseMovie = await axios.get(`${BACKEND_SVC}/recommendation/movie/?title=${firstMovie['t']}`);
      console.log(`Movie Recommendations: ${responseMovie.data}`);
      if (responseMovie.status === 200) {
        const { data } = responseMovie;
        setMovies(data);
      } else {
        setMovies({});
      }
    }

    if (firstShow) {
      console.log(firstShow)
      const responseShow = await axios.get(`${BACKEND_SVC}/recommendation/serie/?title=${firstShow['t']}`);
      console.log(`Shows Recommendations: ${responseShow.data}`);
      if (responseShow.status === 200) {
        const { data } = responseShow;
        setShows(data);
      } else {
        setShows({});
      }
    }
  }

  async function setVisible(id) {
    document.getElementById(id).style.visibility = "visible";
  }

  var renderSearchPreview = possibleTitles.map(({ title, original_release_year, object_type }, index) => {
    return (
      <SearchPreview
        key={index}
        handleInclusion={handleInclusion}
        index={index}
        title={title}
        year={original_release_year}
        type={object_type}
      />
    );
  });

  return (
    <>
      <div className="App-header">
        <img src="/images/what2watch_logo_white.png"></img>
      </div>
      <div className="App" id="App_Title">
        <h1 className="app_title">Sistema de Recomendação</h1>
        <span className="description">
          Netflix, Amazon Prime, Disney Plus, etc... Não sabe qual assinar?
          <br></br>
          Deixa com a gente, digite os filmes e séries que você gosta e vamos te dizer qual a melhor plataforma pra você assinar.
          <br></br>
          Ahh, e ainda recomendados uns filminhos 😉
        </span>
      </div>
      <div className="App" id="search_section">
        <div className="search-form">
          <input type="text" id="search_field" className="search_input" placeholder="Digite o nome do filmes, series, etc..." onChange={handleChange} />
          <button id="search_btn" onClick={() => handleInclusion(null)}><img src="/images/add_white_18dp.png"></img></button>
        </div>
        <div className="search-results-p">
          {possibleTitles.length > 0 ? (
            <div className="search-results">{renderSearchPreview}</div>
          ) : null}
          <div></div>
        </div>
      </div>
      <div className="App" id="my_movies_section">
        <ul className="list_of_my_movies">
          {whishList.map((value, index) => {
            return <li className="list_item" key={index}>{value['t']} <button className="btn_remove" onClick={() => handleExclusion(index)}>X</button></li>;
          })}
        </ul>
      </div>
      <div className="App">
        <button id="recommendation_btn" onClick={() => { getRecommendation(); handleRecommendedTitles(); }}>Obter recomendação</button>
      </div>
      <RecommendationResult recommended={recommended} movies={movies} shows={shows} />
      <div className="App-footer">
        <span>Todos direitos reservados - <a href="#">Grupo 7</a> - INF-332</span>
      </div>
    </>
  );
}


export default App;

const SearchPreview = ({ title, index, handleInclusion, year, type }) => {
  function getType(type) {
    return (type === 'movie') ? 'Filme' : 'Série';
  }

  return (
    <div
      onClick={() => handleInclusion(title, type)}
      className={`search-preview ${index == 0 ? "start" : ""}`}
    >
      <div className="first">
        <p className="title">{title} ({year}) - {getType(type)}</p>
      </div>
    </div>
  );
};

function RecommendationResult({ recommended, movies, shows }) {
  return (
    <div className="App">
      <div id="platform">
        <p className="section_title">Baseado no seu gosto, essa é sua plataforma ideal:</p>
        <h6>{recommended.name}</h6>
        <img src={recommended.image_url} alt="" />
      </div>
      <div id="recommended">
        {movies.length > 0 ? <Recommendations type={'Filmes'} list={movies} /> : null }
        {shows.length > 0 ? <Recommendations type={'Séries'} list={shows} /> : null}
      </div>
    </div>
  );
}

function Recommendations({ type, list }) {
  return (
    <div>
      <h3 className="section_title">{type} que você pode gostar:  </h3>
      <ul className="list_of_recommendeds">
        {list.map((data, index) => {
          return (
            <li className="recommended_item" key={index}>
              <div className="recommended_title">
                <img className="recommended_img" src={`https://image.tmdb.org/t/p/original${data['poster_path']}`} title={data['title']} alt="" />
                <br></br>
                <span className="recommended_name">{data['title']}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  );
}