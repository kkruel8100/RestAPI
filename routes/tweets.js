const axios = require('axios');

module.exports = app => {

    app.get('/api/tweets', (req, res) => {
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        axios
            .get(
                `https://badapi.iqvia.io/api/v1/tweets?startDate=${startDate}&endDate=${endDate}`
            )
            .then(response => {
                res.send(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    });
}
