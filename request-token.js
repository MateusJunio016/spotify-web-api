//Obs: A maior parte deste código foi retirado exclusivamente da documentação oficial da API do Spotify
//Acesse em: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/access-token-using-client-credentials.js

import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: 'c08c5dc95de34343ad80f1195b8b6668',
  clientSecret: 'a47c6ad503e24e0ab99c2d8a06b5ecd2'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  }
);