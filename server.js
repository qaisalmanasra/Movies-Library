'use strict'
const url = "postgres://qaismaher:0000@localhost:5432/movie"
const port = 3000;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg');
//const client = new Client(url);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const dataForMovies = require('./data.json');
const axios = require('axios').default;
const apiKey = process.env.APIKEY;
const app = express();
app.use(cors());

app.get('/', dataHandeler);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/trending', hundleTrending);
app.get('/search', hundleSearch);
app.get('/top_rated', hundleTopRated);
app.get('/upcoming', hundleUpComing);
app.post("/addMovie",handleAdd);
app.get("/getMovies",handleGet);
app.put("/UPDATE/:titleName", handleUpdate);
app.delete("/DELETE", handleDelete);
app.get("/getMoviesById", handleGetById);



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

function handleAdd(req , res){
  const { title, release_date, overview, personal_comment } = req.body;

  let sql = 'INSERT INTO movies(title, release_date, overview, personal_comment) VALUES($1, $2, $3, $4) RETURNING *;' // sql query
  let values = [title, release_date, overview, personal_comment];
  client.query(sql, values).then((result) => {
      console.log(result.rows);
      return res.status(201).json(result.rows[0]);
  }).catch()
};

function handleGet(req , res){
  let sql = 'SELECT * from movies;'
  client.query(sql).then((result) => {
      console.log(result);
      res.json(result.rows);
  }).catch((err) => {
      handleError(err, req, res);
  });
};
function handleUpdate(req, res) {
  const { title, release_date, overview, personal_comment } = req.body;
  const { titleName } = req.params;
  let sql = `UPDATE movies SET title=$1, release_date=$2, overview=$3, personal_comment=$4 WHERE id = $5 RETURNING *;`  // sql query
  let values = [title, release_date, overview, personal_comment, titleName];
  client.query(sql, values).then((result) => {
  return res.status(200).json(result.rows);
  }).catch()
}
function handleDelete(req, res) {
  const  movieId  = req.query.id
  let sql = 'DELETE FROM movies WHERE id=$1;'
  let value = [movieId];
  client.query(sql, value).then(result => {
  console.log(result);
  res.send("deleted successfully");
  }
  ).catch()
}
function handleGetById(req, res) {

  const { id } = req.query;
  let sql = 'SELECT * from movies WHERE id=$1;'
  let value = [id];
  client.query(sql, value).then((result) => {
    res.json(result.rows);
  }).catch();
}
client.connect().then(() => {

  app.listen(port, () => {
      console.log(`test ${port}`);
  });
})