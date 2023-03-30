
// Importa a biblioteca Spotify Web API JS
import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';

//var app = express();

// Cria uma instância da biblioteca Spotify Web API JS com as credenciais de acesso
const spotifyApi = new SpotifyWebApi({
  clientId: 'c08c5dc95de34343ad80f1195b8b6668',
  clientSecret: 'a47c6ad503e24e0ab99c2d8a06b5ecd2',
});

var token = 'BQBDPGNw__VT-CAZbcpvINAS16hQfZDhlTUGqErxvaK8fDx6oQptlkFCiKBn8htdLsOomC0ybVw9Vmqg1w0i2AqRJQSXS63TyjNi6ai88frUHapnZcl8';
spotifyApi.setAccessToken(token);

// Importar o módulo Axios para realizar requisições HTTP
import axios from 'axios';

// Criando a array "artistas" com os nomes e id's dos artistas a serem analisados
const artistas = [
  { nome: 'Ed Sheeran', id: '6eUKZXaKkcviH0Ku9w2n3V' },
  { nome: 'Queen', id: '1dfeR4HaWDbWqFHLkxsg1d' },
  { nome: 'Ariana Grande', id: '66CXWjxzNUsdJxJ2JdwvnR' },
  { nome: "Maroon 5", id: "04gDigrS5kc9YWfZHwBETP" },
  { nome: "Imagine Dragons", id: "53XhwfbYqKCa1cC15pYq2q"},
  { nome: "Eminem", id: "7dGJo4pcD2V6oG8kP0tJRR"},
  { nome: "Lady Gaga", id: "1HY2Jd0NmPuamShAr6KMms"},
  { nome: "Cold Play", id: "4gzpq5DPGxSnKTe4SA8HAU"},
  { nome: "Beyonce", id: "6vWDO969PvNqNYHIOW5v0m"},
  { nome: "Bruno Mars", id: "0du5cEVh5yTK9QJze8zA0C"},
  { nome: "Rihanna", id: "5pKCCKE2ajJHZ9KAiaK11H"},
  { nome: "Shakira", id: "0EmeFodog0BfCgMzAIvKQp"},
  { nome: "Justin Bieber", id: "1uNFoZAHBGtllmzznpCI3s"},
  { nome: "Demi Lovato", id: "6S2OmqARrzebs0tKUEyXyp"},
  { nome: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02"}
];

// URL da API do Spotify
const baseURL = 'https://api.spotify.com/v1';

// Criando o objeto "auth" para acessar a API do Spotify
const auth = {
  headers: {
    Authorization: 'Bearer ' + 'BQBDPGNw__VT-CAZbcpvINAS16hQfZDhlTUGqErxvaK8fDx6oQptlkFCiKBn8htdLsOomC0ybVw9Vmqg1w0i2AqRJQSXS63TyjNi6ai88frUHapnZcl8'
  }
};

// Criando função para obter os dados dos artista
async function informacoesArtista(id) {
  const url = `${baseURL}/artists/${id}`;
  const response = await axios.get(url, auth);
  return response.data;
}

// Criando array para armazenar as informações dos artistas
const artistasInfo = [];

// Obtém as informações dos artistas e armazena no array artistasInfo
for (let i = 0; i < artistas.length; i++) {
  const info = await informacoesArtista(artistas[i].id);
  artistasInfo.push(info);
}

// Ordena os artistas por número de seguidores e popularidade
const artistasPorSeguidores = artistasInfo.sort((a, b) => b.followers.total - a.followers.total);
const artistasPorPopularidade = artistasInfo.sort((a, b) => b.popularity - a.popularity);

// Obtém as informações dos artistas com mais seguidores e maior popularidade
const maisSeguidores = artistasPorSeguidores.slice(0, 7);
const maisPopulares = artistasPorPopularidade.slice(0, 5);

// Cria um objeto com as informações dos rankings
const rankings = {
  maisSeguidores: maisSeguidores.map(a => ({ nome: a.name, seguidores: a.followers.total, popularidade: a.popularity })),
  maisPopulares: maisPopulares.map(a => ({ nome: a.name, seguidores: a.followers.total, popularidade: a.popularity }))
};

// Envia os rankings para o endpoint desejado como uma requisição POST
axios.post('https://psel-solution-automation-cf-ubqz773kaq-uc.a.run.app?access_token=UcAxu7xAh02D', rankings)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });

//app.listen(8888)