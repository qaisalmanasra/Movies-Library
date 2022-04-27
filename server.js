'use strict'

const express = require('express');
const dataForMovies = require('./data.json');

const app = express();
const port = 3000;

app.get('/', dataHandeler);

function dataHandeler(req, res) {
  let result = [];
  let newMovie = new Movie(dataForMovies.title, dataForMovies.poster_path, dataForMovies.overview)
  result.push(newMovie);
  res.json(result);
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
  console.log(`test ${port}`)
}

function Movie(title, poster_path, overview) {
  this.title = title
  this.poster_path = poster_path
  this.overview = overview
}