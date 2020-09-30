'use strict'

const movieSearchUrl = "https://api.themoviedb.org/3/search/multi?"
const imageSearchUrl = "http://image.tmdb.org/t/p/"
const apiKey = "3324330d7274c224e88ee5dbc2a0b10b"
let i = 0
let titlesToSearch = []


const queryParams = {
    api_key: apiKey,
    //language: 'en-US',
    query: ''
}

//----------HTML Template Functions----------//




//----------Render Functions----------//

function renderResults(responseJson){
    console.log("renderResult run")
    if (responseJson.results[0].media_type == 'movie'){
        $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item">
                <a href="">${responseJson.results[0].original_title}</a>
                <br>
                <p>${responseJson.results[0].overview}</p>
            </div>
            <div class="item">
                <img src="${imageSearchUrl + 'w780' + responseJson.results[0].backdrop_path}" alt="Placeholder Image">
            </div>
        </li>`)
    }
    else {
        $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item">
                <a href="">${responseJson.results[0].original_name}</a>
                <br>
                <p>${responseJson.results[0].overview}</p>
            </div>
            <div class="item">
                <img src="${imageSearchUrl + 'w780' + responseJson.results[0].backdrop_path}" alt="Placeholder Image">
            </div>
        </li>`)
    }

}

//----------Search Functions----------//

function formatQueryParams(){
    const queryItems = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
  return queryItems.join('&');
}


function fetchInfo(items,searchUrl) {
    console.log('fetchInfo run');
    for (i=0; i < items.length; i++){
        queryParams.query = items[i].title
        var queryString = formatQueryParams()
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            renderResults(responseJson))
        .catch(error => alert('Something went wrong. Try again later.')); 
    }
}

function findTitleInStore(title){
    titlesToSearch = []
    for (i=0; i < store.media.length; i++){
        if (store.media[i].title.toLowerCase().includes(title.toLowerCase())){
            titlesToSearch.push(store.media[i])
        }
    }
    return titlesToSearch
}




//----------Handle Clicks Functions----------//

function handleSearchClick(){
    console.log("handleSearchClick run")
    $('#search-form').submit(event => {
        event.preventDefault()
        $('ul.results-list').empty()
        $('.results').removeClass('hidden')
        queryParams.query = $(event.currentTarget).find('#search-bar').val()
        titlesToSearch = findTitleInStore(queryParams.query)
        console.log(titlesToSearch)
        fetchInfo(titlesToSearch, movieSearchUrl)
    });
}

function handleAdvSearchClick(){
    console.log("handleAdvSearchClick run")
    $('main').on('click', '.js-advSearch', event =>{
        $('#advSearchForm').toggleClass('hidden')
    });
}


function callbackFun(){
    console.log('App loaded')
    handleAdvSearchClick()
    handleSearchClick()
}
  
$(callbackFun);