'use strict'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dataForMovies = require('./data.json');
const axios = require('axios').default;
const apiKey = process.env.APIKEY;
const app = express();
app.use(cors());
const port = 3000;

app.get('/', dataHandeler);

app.get('/trending', hundleTrending);
app.get('/search', hundleSearch);
app.get('/top_rated', hundleTopRated);
app.get('/upcoming', hundleUpComing);


function dataHandeler(req, res) {
  let result = [];
  let newMovie = new Movie(dataForMovies.title, dataForMovies.poster_path, dataForMovies.overview)
  result.push(newMovie);
  res.json(result);
}

function hundleTrending(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
    axios.get(url)
    .then(result => {
        let trending = result.data.results.map(trendMap => {
        return new Trend(trendMap.id, trendMap.title, trendMap.release_date, trendMap.poster_path, trendMap.overview);
      })
      res.json(trending);
    })
    .catch((error) => {
      console.log(error);
      res.send("Error Finding Trend Movies");
    })
}

function hundleSearch(req, res) {
  let movieTitle = req.query.movieTitle;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}&page=2`;
  axios.get(url)
    .then(result => {
      res.json(result.data.results);
    })
    .catch((error) => {
      console.log(error);
      res.send("can't find matching");
    })
}

function hundleTopRated(req, res) {
  let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
  axios.get(url)
    .then(result => {
      res.json(result.data.results);
    })
    .catch((error) => {
      console.log(error);
      res.send("error, no top rated movies");
    })
}

function hundleUpComing(req, res) {
  let url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
  axios.get(url)
    .then(result => {
      res.json(result.data.results);
    })
    .catch((error) => {
      console.log(error);
      res.send("error, no up coming movies");
    })
}

app.get('/favorite', favHandeler);

function favHandeler(req, res) {
  res.send('Welcome to Favorite Page');
}

app.get('/error', (req, res) => res.send(error()));

app.use(function (err, req, res, text) {
  console.log(err.stack);
  res.type('taxt/plain');
  res.status(500);
  res.send('Something Went Wrong');
})

app.use(function (req, res, text) {
  res.status(404);
  res.type('text/plain');
  res.send('Page Not Found');
});


app.listen(port, handleListen)

function handleListen() {
  console.log(`test ${port}`);
}

function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}
function Trend(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
} 