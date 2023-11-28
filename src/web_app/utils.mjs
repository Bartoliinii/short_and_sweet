// Import axios as an ES module
import axios from 'axios';

const apiUrl = 'http://0.0.0.0:7001/get_reviews/';
const bertUrl = 'http://0.0.0.0:7070/fit-transform/'


const urlPattern = /https:\/\/play.google.com\/store\/apps\/details\?id=([a-zA-Z0-9.]+)&hl=en_.*$/;
function verifyUrl(url) {
  return urlPattern.test(url);
}

const idPattern = /id=([a-zA-Z0-9.]+)&/;
function extractId(url) {
  const match = url.match(idPattern);
  return match ? match[1] : null;
}

async function main() {
  let url = process.argv[2];
  console.log(url);
  let num = process.argv[3];
  let stars = process.argv[4];
  
  if (!verifyUrl(url)) {
    console.log("Invalid URL");
  } else {
    let id = extractId(url);

    let response = await axios.get(apiUrl,{
      params: {
        app_id: id,
        stars: stars,
        count: num
      }})
    console.log('recied response')
    let pred = await axios.post(bertUrl, {
      Reviews: response.data.reviews
    })
    console.log(pred.data)
  }
}

main();
