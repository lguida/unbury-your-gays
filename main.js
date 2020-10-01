'use strict'

const movieSearchUrl = "https://api.themoviedb.org/3/search/multi?"
const imageSearchUrl = "http://image.tmdb.org/t/p/"
const apiKey = "3324330d7274c224e88ee5dbc2a0b10b"
let i = 0
let titlesToSearch = []
let browseArrayItems = []
let browseArrayNotDisplayed = store.media
let imageUrlSuffix = ''


const queryParams = {
    api_key: apiKey,
    //language: 'en-US',
    query: ''
}

const otherVars = {
    loadIndvPage: false,
}

//----------HTML Template Functions----------//


//ToDO:
//Display individual movie pages
//Add YouTube API for trailers
//make sure suggestion box works

//add in other info on search page

//add function to handle not-found items on the list
//add footer with TMDB logo
//When the original title is in a different language, maybe search and display the english one or both?

//----------Render Functions----------//

function renderResults(responseJson){
    console.log("renderResult run")
    imageUrlSuffix = responseJson.results[0].backdrop_path
    if (imageUrlSuffix === null){
        imageUrlSuffix = responseJson.results[0].poster_path
    }
    if (responseJson.results[0].media_type == 'movie'){
        $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item">
                <a href='javascript:handleTitleClick("${responseJson.results[0].original_title}")' class='js-indv-link'>${responseJson.results[0].original_title}</a>
                <br>
                <p>${responseJson.results[0].overview}</p>
            </div>
            <div class="item">
                <img src="${imageSearchUrl + 'w780' + imageUrlSuffix}" alt="placeholder">
            </div>
        </li>`)
    }
    else {
        $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item">
                <a href='javascript:handleTitleClick("${responseJson.results[0].original_name}")' class="js-indv-link">${responseJson.results[0].original_name}</a>
                <br>
                <p>${responseJson.results[0].overview}</p>
            </div>
            <div class="item">
                <img src="${imageSearchUrl + 'w780' + imageUrlSuffix}" alt="placeholder">
            </div>
        </li>`)
    }

}

function renderIndvPage(responseJson){
    console.log("renderIndvPage run")
    imageUrlSuffix = responseJson.results[0].backdrop_path
    if (imageUrlSuffix === null){
        imageUrlSuffix = responseJson.results[0].poster_path
    }
    if (responseJson.results[0].media_type == 'movie'){
        $('ul.results-list').replaceWith(`
        <div>
            <h2>${responseJson.results[0].original_title}</h2>
            <img src="${imageSearchUrl + 'w780' + imageUrlSuffix}" alt="Placeholder Image">
            <br>
            <p>${responseJson.results[0].overview}</p>
        </div>`)
    }
    else{
        $('ul.results-list').replaceWith(`
        <div>
            <h2>${responseJson.results[0].original_name}</h2>
            <img src="${imageSearchUrl + 'w780' + imageUrlSuffix}" alt="Placeholder Image">
            <br>
            <p>${responseJson.results[0].overview}</p>
        </div>`)
    }
}

function whichPageToRender(responseJson){
    if (otherVars.loadIndvPage){
        renderIndvPage(responseJson)
        console.log(responseJson)
        console.log(otherVars.loadIndvPage)
    }
    else{
        renderResults(responseJson) 
        console.log(responseJson)
        console.log(otherVars.loadIndvPage)
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
    console.log(items)
    for (i=0; i < items.length; i++){
        queryParams.query = items[i].title
        var queryString = formatQueryParams()
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            whichPageToRender(responseJson))
        .catch(error => console.log("Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
    }
}

function findTitleInStore(title){
    titlesToSearch = [] 
    console.log(title,": in find titlein store")
    for (i=0; i < store.media.length; i++){
        if (store.media[i].title.toLowerCase().includes(title.toLowerCase())){
            titlesToSearch.push(store.media[i])
        }
    }
    console.log(titlesToSearch,": in find titlein store")
    return titlesToSearch
}

//----------Loading Browse Window Functions----------//

function loadBrowse(){
    $('ul.results-list').empty()
    $('.results').removeClass('hidden')
    for (i=0; i < 10; i++){
        browseArrayItems.push(browseArrayNotDisplayed.splice(Math.random()*(browseArrayNotDisplayed.length-1),1).pop())
    }
    console.log(browseArrayItems)
    console.log(browseArrayNotDisplayed.length)
    fetchInfo(browseArrayItems,movieSearchUrl)
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

function handleTitleClick(title){
    console.log('handleTitleClick run')
    console.log(title)
    $('ul.results-list').empty()
    titlesToSearch = findTitleInStore(title)
    console.log(titlesToSearch)
    otherVars.loadIndvPage = true
    fetchInfo(titlesToSearch, movieSearchUrl)
}


function callbackFun(){
    console.log('App loaded')
    loadBrowse()
    handleAdvSearchClick()
    handleSearchClick()
}
  
$(callbackFun);