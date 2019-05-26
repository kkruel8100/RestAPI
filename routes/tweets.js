const axios = require('axios');

module.exports = app => {
  app.get('/api/tweets', (req, res) => {
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    let result = [];
    let counter = 0;
    function getAxios(startDate, endDate) {
      counter++;
      axios
      .get(
        `https://badapi.iqvia.io/api/v1/tweets?startDate=${startDate}&endDate=${endDate}`
      )
      .then(response => {
        counter --;
        if (response.data.length === 100) {
          reduceResult(startDate, endDate).then(newDate => {
            getAxios(startDate, newDate);
            getAxios(newDate, endDate);
          });
        } else {
          const data = response.data;
          if (data.length > 0) {
            for (let item of data) {
              let index = result.findIndex(tweet => tweet.id === item.id);
              if (index === -1) {
                result.push(item);
              }           
            }
          }
          if (counter === 0) {
            res.send(result)
          }}
      })
      .catch(error => {
        console.log(error);
      });
    }
    getAxios(startDate, endDate)
  });
};

async function reduceResult(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffDays = parseInt((end - start) / (1000 * 60 * 60 * 24));
  const midpointDays = Math.floor(diffDays / 2);

  // Adjust - new date
  await start.setUTCDate(start.getUTCDate() + midpointDays);
  const newDate = start.toUTCString();
  return [newDate];
}
