window.onload = () => {

  document.getElementById('search-form').reset();
}

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

  getTweets(startDateValue, endDateValue);
});


// GET Tweet Request
function getTweets(startDate, endDate) {
  axios
    .get('http://localhost:3000/api/tweets', {
      params: {
        startDate,
        endDate
      }
    })
    .then(res => {
      createTable(res, startDate, endDate);
    })
    .catch(err => {
      console.log('err: ' + err);
    });
}

// Modify API date parameters to reduce data results to less than 100
async function reduceCallback(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffDays = parseInt((end - start) / (1000 * 60 * 60 * 24));
  const midpointDays = Math.floor(diffDays / 2);

  // UTC Javascript Date & Time Zone Issues may generate overlap
  // Duplication accounted for in results validation

  await start.setUTCDate(start.getUTCDate() + midpointDays);
  await end.setUTCDate(end.getUTCDate() - midpointDays);

  await getTweets(startDate, start.toUTCString());
  await getTweets(end.toUTCString(), endDate);
}


function createTable(response, startDate, endDate) {
  const data = response.data;
  if (data.length === 100) {
    reduceCallback(startDate, endDate);
  } else if (data.length > 1) {
    for (let item of data) {
      let index = result.findIndex(tweet => tweet.id === item.id);
      if (index === -1) {
        result.push(item);
      }
    }
    let html = 'Total tweets: ' + result.length;

    document.getElementById('tweet-total').innerHTML = html;
  } else {
    document.getElementById('tweet-total').innerHTML = 'No data found';
  }
}



// Table Creation
// request.addEventListener('readystatechange', e => {
//   console.log(e);
//   if (e.target.readyState === 4 && e.target.status === 200) {
//     const data = JSON.parse(e.target.responseText);
//     console.log(data);
//     if (data.length > 1) {
//       let html = '<p>Total tweets: ' + data.length;
//       html += '<table>';
//       html += '<tr>';
//       html += '<th align="left">ID</th>';
//       html += '<th align="left">Date</th>';
//       html += '<th align="left">Tweet</th>';
//       html += '</tr>';

//       for (let item of data) {
//         html += '<tr>';
//         html += '<td>' + item.name + '</td>';
//         html += '<td>' + item.capital + '</td>';
//         html += '<td>' + item.region + '</td>';
//         html += '</tr>';
//       }
//       html += '</table></p>';
//       document.getElementById('tweet-table').innerHTML = html;
//     }
//   } else if (e.target.readyState === 4) {
//     console.log('API data failure has occurred');
//   }
// });