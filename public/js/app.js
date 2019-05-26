window.onload = () => {
  document.getElementById('search-form').reset();
};

const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const searchButton = document.getElementById('search-button');

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

  new Promise((resolve, reject) => {
    allTweets(startDateValue, endDateValue, resolve, reject);
  }).then(response => {
    createTable(response.data);
  });
});

// GET Tweet Request
const allTweets = (startDate, endDate, resolve, reject) => {
    axios
      .get('http://localhost:3000/api/tweets', {
        params: {
          startDate,
          endDate
        }
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        return 'Something went wrong. Please refresh and try again.';
      });
};

function createTable(data) {
  let htmlTotal = 'Total tweets: ' + data.length;
  document.getElementById('tweet-total').innerHTML = htmlTotal;
  
  if (data.length > 0) {
    let html = '<table>';
    html += '<tr>';
    html += '<th align="left">ID</th>';
    html += '<th align="left">Date</th>';
    html += '<th align="left">Tweet</th>';
    html += '</tr>';

    for (let item of data) {
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
