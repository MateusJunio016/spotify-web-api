/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

import express from 'express'; // Express web server framework
import request from 'request'; // "Request" library
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';

var client_id = 'c08c5dc95de34343ad80f1195b8b6668'; // Your client id
var client_secret = 'a47c6ad503e24e0ab99c2d8a06b5ecd2'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/BQA8oaPfQKF5uoEXEoTZmORkjiT96dYgF5eILUnHxveO5FDYxvxgpSCqP1-3g_XwLVJF5RYy4owjvptunrR0Z0yBrXkI3z_6b1xoH0L3EuB7QGR9pTfc',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);


// Importa a biblioteca Spotify Web API JS
import SpotifyWebApi from 'spotify-web-api-node';

// Cria uma instância da biblioteca Spotify Web API JS com as credenciais de acesso
const spotifyApi = new SpotifyWebApi({
    clientId: 'c08c5dc95de34343ad80f1195b8b6668',
    clientSecret: 'a47c6ad503e24e0ab99c2d8a06b5ecd2',
});

// Define os IDs dos artistas selecionados
const artistIds = [
    '6eUKZXaKkcviH0Ku9w2n3V', // Ed Sheeran
    '1dfeR4HaWDbWqFHLkxsg1d', // Queen
    '66CXWjxzNUsdJxJ2JdwvnR', // Ariana Grande
    '04gDigrS5kc9YWfZHwBETP', //Maroon 5 
    '53XhwfbYqKCa1cC15pYq2q', //Imagine Dragons
    '7dGJo4pcD2V6oG8kP0tJRR', //Eminem
    '1HY2Jd0NmPuamShAr6KMms', //Lady Gaga
    '4gzpq5DPGxSnKTe4SA8HAU', //Coldplay
    '6vWDO969PvNqNYHIOW5v0m', //Beyonce
    '0du5cEVh5yTK9QJze8zA0C', //Bruno Mars
    '5pKCCKE2ajJHZ9KAiaK11H', //Rihanna
    '0EmeFodog0BfCgMzAIvKQp', //Shakira
    '1uNFoZAHBGtllmzznpCI3s', //Justin Bieber
    '6S2OmqARrzebs0tKUEyXyp', //Demi Lovato
    '06HL4z0CvFAxyc27GXpf02' //Taylor Swift

];

// Define a quantidade de artistas a serem selecionados para cada ranking
const mostFollowers = 7
const topIndice = 5

// Cria arrays vazios para armazenar os dados dos artistas
const artistsData = [];
let topFollowedArtists = [];
let topPopularArtists = [];

// Faz uma requisição para obter as informações dos artistas
spotifyApi.getArtists(artistIds)
    .then((response) => {
        // Extrai os dados de cada artista e armazena no array artistsData
        response.artists.forEach((artist) => {
            artistsData.push({
                name: artist.name,
                followers: artist.followers.total,
                popularity: artist.popularity,
            });
        });

        // Ordena os artistas pelo número de seguidores (em ordem decrescente) e seleciona os topArtistsCount primeiros
        topFollowedArtists = artistsData.sort((a, b) => b.followers - a.followers).slice(0, mostFollowers);

        // Ordena os artistas pela popularidade (em ordem decrescente) e seleciona os topArtistsCount primeiros
        topPopularArtists = artistsData.sort((a, b) => b.popularity - a.popularity).slice(0, topIndice);

        // Envia as listas ordenadas para um endpoint como uma requisição do tipo POST
        fetch('http://localhost:8888/callback', {
            method: 'POST',
            body: JSON.stringify({
                topFollowedArtists,
                topPopularArtists,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Rankings enviados com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao enviar os rankings:', error);
            });
    })
    .catch((error) => {
        console.error('Erro ao obter informações dos artistas:', error);
    });
