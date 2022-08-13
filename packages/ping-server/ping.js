var axios = require("axios");

function ping(url) {
  return axios.get(url).then(
    (res) => res.status >= 200 && res.status <= 300,
    () => false
  );
}

module.exports = ping;
