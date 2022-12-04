//const https = require('https')
const axios = require('axios').default;

// const fetchJoke = ()=>{
//     let url= "https://api.chucknorris.io/jokes/random";
//     let result =  "";
//     const request = https.request(url, (response) => {
//         let data = '';
//         response.on('data', (chunk) => {
//             data = data + chunk.toString();
//         });
        
//         response.on('end', () => {
//             const body = JSON.parse(data);
//             return body;
//         });
//     })

//     request.on('error', (error) => {
//         console.log('An error', error);
//     });
//     request.on("fi")
//     request.end();
// }


async function newjoke() {
    let response= "";
    try {
      response = await axios.get('https://api.chucknorris.io/jokes/random',{
        headers:{
            'Accept-Encoding': 'application/json'
        }
      });
    } catch (error) {
      console.error(error);
    }
    return response.data;
  };



module.exports =newjoke;