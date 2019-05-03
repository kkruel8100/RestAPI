# RestAPI

## Step 1: clone repo from GitHub
## Step 2: terminal: \RestAPI> npm install or yarn install
## Step 3: terminal: \RestAPI> node server.js
## Step 3: firefox: http://localhost:3000/
## Step 4: firefox: click "Search" button  
*   Default dates: Start date = 01/01/2016 and End date = 12/31/2016
*   Dates may be overwritten with dates between and including the default dates. Form validation will verify input.

## Objective:

1.  Using Javascript, create a GET request to a poorly designed 3rd party API.  
* Known issues: No more than 100 results are returned at one time and no indication of total results available.  
2.  Get the total number of tweets between 01/01/2016-12/31/2017 with no duplication and output in a manner that can be validated.
3.  Complete the request and response within a reasonable time period.
4.  Submit app via GitHub in a public repo.
5.  Ability of 3rd party to run the app.
6.  Bonus: UI to display results.
7.  Additional features.

## Additional Features:

1.  Browser had CORS restrictions that prevented 3rd API requests.  It was necessary to create a server side app with Express and Axios to handle server side GET requests to prevent CORS restrictions.
2.  Ability to search with custom user input for date parameters between 01/01/2016-12/31/2017.
3.  Disable search button when date parameters outside of range.
4.  Coding other than UI interface is NOT date specific and can be used for any date range that the API supports.

