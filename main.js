'use strict'

const movieSearchUrl = "https://api.themoviedb.org/3/search/multi?"
const imageSearchUrl = "http://image.tmdb.org/t/p/"
const youTubeInfoSearchUrl = "https://www.googleapis.com/youtube/v3/search?"
const youTubeEmbedUrl = "https://www.youtube.com/embed/"
const apiKey = "3324330d7274c224e88ee5dbc2a0b10b"
const apiKeyGoogle = "AIzaSyCQd6wTexIF0NbJw4PDsfTdJCnBFNa6E-w"
let i = 0
let titlesToSearch = []
let browseArrayItems = []
let browseArrayNotDisplayed = store.media.slice()
let imageUrlSuffix = ''


const queryParams = {
    tmdb:{
        api_key: apiKey,
        //language: 'en-US',
        query: ''},
    youTube:{
        key: apiKeyGoogle,
        part: "snippet",
        maxResults: 10,
        q: ''
    }
}

const otherVars = {
    loadIndvPage: false,
    youTubeID: ''
}

//----------HTML Template Functions----------//


//ToDO:
//Add YouTube API for trailers
//make it possible to search using the advanced search parameters
//make sure suggestion box works

//add in other info on search page

//add function to handle not-found items on the list
//add footer with TMDB logo
//When the original title is in a different language, maybe search and display the english one or both?

//----------Render Functions----------//

function renderResults(responseJson){
    console.log("renderResults run 4.1")
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
    console.log("renderIndvPage run 4.2")
    imageUrlSuffix = responseJson.results[0].backdrop_path
    if (imageUrlSuffix === null){
        imageUrlSuffix = responseJson.results[0].poster_path
    }
    if (responseJson.results[0].media_type == 'movie'){
        $('ul.results-list').replaceWith(`
        <div>
            <h2>${responseJson.results[0].original_title}</h2>
            <iframe width="560" height="315" src="${youTubeEmbedUrl}${otherVars.youTubeID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <br>
            <p>${responseJson.results[0].overview}</p>
        </div>`)
    }
    else{
        $('ul.results-list').replaceWith(`
        <div>
            <h2>${responseJson.results[0].original_name}</h2>
            <iframe width="560" height="315" src="${youTubeEmbedUrl}${otherVars.youTubeID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <br>
            <p>${responseJson.results[0].overview}</p>
        </div>`)
    }
}

function whichPageToRender(responseJson){
    console.log("whichPageToRender run 3")
    if (otherVars.loadIndvPage){
        renderIndvPage(responseJson)
        console.log(otherVars.youTubeID)
    }
    else{
        renderResults(responseJson) 
    }
}


//----------Search Functions----------//

//---TMBD-----//

function formatQueryParams(queryArray){
    const queryItems = Object.keys(queryArray)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryArray[key])}`)
  return queryItems.join('&');
}


function fetchInfoTMBD(items,searchUrl) {
    console.log('fetchInfotmdb run2');
    console.log(items)
    for (i=0; i < items.length; i++){
        queryParams.tmdb.query = items[i].title
        var queryString = formatQueryParams(queryParams.tmdb)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            whichPageToRender(responseJson))
        .catch(error => console.log("Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
    }
}
 
//---YouTube-----//
function saveYouTubeId(responseJson){
    console.log('saveYouTubeId run 7')
    console.log(responseJson)
    otherVars.youTubeID = responseJson.items[0].id.videoId
}


function fetchInfoYouTube(title,searchUrl) {
    console.log('fetchInfoYouTube run 6');
    console.log(title)
    queryParams.youTube.q = title + " official trailer"
    var queryString = formatQueryParams(queryParams.youTube)
    var url = searchUrl + queryString
    fetch(url)
    .then(resp => resp.json())
    .then(respJson => 
        saveYouTubeId(respJson))
    .catch(error => console.log("Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
}

 //---LG store-----//

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
    console.log("loadBrowse run 1")
    $('ul.results-list').empty()
    $('.results').removeClass('hidden')
    for (i=0; i < 10; i++){
        browseArrayItems.push(browseArrayNotDisplayed.splice(Math.random()*(browseArrayNotDisplayed.length-1),1).pop())
    }
    console.log(browseArrayItems)
    console.log(browseArrayNotDisplayed.length)
    fetchInfoTMBD(browseArrayItems,movieSearchUrl)
}


//----------Handle Clicks Functions----------//

function handleSearchClick(){
    console.log("handleSearchClick run 5")
    $('#search-form').submit(event => {
        event.preventDefault()
        otherVars.loadIndvPage = false
        $('ul.results-list').empty()
        $('.results').removeClass('hidden')
        queryParams.tmdb.query = $(event.currentTarget).find('#search-bar').val()
        titlesToSearch = findTitleInStore(queryParams.tmdb.query)
        console.log(titlesToSearch)
        fetchInfoTMBD(titlesToSearch, movieSearchUrl)
    });
}

function handleAdvSearchClick(){
    console.log("handleAdvSearchClick run")
    $('main').on('click', '.js-advSearch', event =>{
        $('#advSearchForm').toggleClass('hidden')
    });
}

function handleTitleClick(title){
    console.log('handleTitleClick run 5')
    console.log(title)
    $('ul.results-list').empty()
    titlesToSearch = findTitleInStore(title)
    console.log(titlesToSearch)
    fetchInfoYouTube(titlesToSearch[0].title, youTubeInfoSearchUrl)
    console.log(otherVars.youTubeID)
    otherVars.loadIndvPage = true
    fetchInfoTMBD(titlesToSearch, movieSearchUrl)
}


function callbackFun(){
    console.log('App loaded')
    loadBrowse()
    handleAdvSearchClick()
    handleSearchClick()
}
  
$(callbackFun);