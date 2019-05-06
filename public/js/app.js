window.onload = () => {
  document.getElementById('search-form').reset();
};

const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const searchButton = document.getElementById('search-button');
let result = [];

// Form Validation - Disable Search Button
document.addEventListener('click', e => {
  if (
    new Date(startDate.value) < new Date(startDate.min) ||
    new Date(startDate.value) > new Date(startDate.max) ||
    new Date(endDate.value) > new Date(endDate.max) ||
    new Date(endDate.value) < new Date(endDate.min) ||
    new Date(endDate.value) < new Date(startDate.value)
  ) {
    searchButton.setAttribute('disabled', 'disabled');
  } else {
    searchButton.removeAttribute('disabled');
  }
});

// Search
document.querySelector('#search-button').addEventListener('click', e => {
  const startDateValue = document.getElementById('start-date').value;
  const endDateValue = document.getElementById('end-date').value;

  searchButton.remove();
  document.getElementById('tweet-total').innerHTML = 'Searching ...';

  getTweets(startDateValue, endDateValue).then(data =>
    setTimeout(() => {
      createTable(data);
    }, 10000)
  );
});

// // GET Tweet Request
async function getTweets(startDate, endDate) {
  return await axios
    .get('http://localhost:3000/api/tweets', {
      params: {
        startDate,
        endDate
      }
    })
    .then(res => {
      if (res.data.length === 100) {
        reduceResult(startDate, endDate).then(newDates => {
          // Date[0] = new endDate
          // Date[1] = new startDate
          getTweets(startDate, newDates[0]);
          getTweets(newDates[1], endDate);
        });
      } else {
        result = getResults(res);
        let html = 'Total tweets: ' + result.length;
        document.getElementById('tweet-total').innerHTML = html;
        console.log(result);
      }
      return result;
    })
    .catch(err => {
      console.log('err: ' + err);
    });
}

// Modify API date parameters to reduce data results to less than 100
async function reduceResult(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffDays = parseInt((end - start) / (1000 * 60 * 60 * 24));
  const midpointDays = Math.floor(diffDays / 2);

  // UTC Javascript Date & Time Zone Issues may generate overlap
  // Duplication accounted for in results validation

  await start.setUTCDate(start.getUTCDate() + midpointDays);
  await end.setUTCDate(end.getUTCDate() - midpointDays);

  return [start.toUTCString(), end.toUTCString()];
}

function getResults(response) {
  const data = response.data;
  if (data.length > 0) {
    for (let item of data) {
      let index = result.findIndex(tweet => tweet.id === item.id);
      if (index === -1) {
        result.push(item);
      }
    }
  }

  return result;
}

function createTable(response) {
  if (response.length > 0) {
    let html = '<table>';
    html += '<tr>';
    html += '<th align="left">ID</th>';
    html += '<th align="left">Date</th>';
    html += '<th align="left">Tweet</th>';
    html += '</tr>';

    for (let item of response) {
      html += '<tr>';
      html += '<td>' + item.id + '</td>';
      html += '<td>' + item.stamp + '</td>';
      html += '<td>' + item.text.substring(0, 100) + '</td>';
      html += '</tr>';
    }
    html += '</table></p';
    document.getElementById('tweet-table').innerHTML = html;
  }
}
