'use strict'

const movieSearchUrl = "https://api.themoviedb.org/3/search/multi?"
const imageSearchUrl = "https://image.tmdb.org/t/p/"
const youTubeInfoSearchUrl = "https://www.googleapis.com/youtube/v3/search?"
const youTubeEmbedUrl = "https://www.youtube.com/embed/"
const omdbSearchUrl = "https://www.omdbapi.com/?"
const apiKey = "3324330d7274c224e88ee5dbc2a0b10b"
const apiKeyGoogle = "AIzaSyCQd6wTexIF0NbJw4PDsfTdJCnBFNa6E-w"
const apiKeyOmdb = "8ef190b6"
let browseArrayItems = []
let browseArrayNotDisplayed = store.media.slice()
let correction = ''


const queryParams = {
    tmdb:{
        api_key: apiKey,
        query: ''},
    youTube:{
        key: apiKeyGoogle,
        part: "snippet",
        maxResults: 10,
        q: ''
    },
    omdb:{
        apikey: apiKeyOmdb,
        t: '',
        plot: 'full'
    }
}

const otherVars = {
    loadIndvPage: false,
    youTubeID: '',
    genre: '',
    genreCode: '',
    imageUrlSuffix: [],
    titlesToSearch: [],
    searchCategory: '',
    searchQuery: '',
    saveTitle:''
}

//----------Render Functions----------//

function renderResults(responseJson){
    correction = checkForCorrections(responseJson.Title,"image")
    if (correction === undefined){
        var imageUrlToPrint = imageSearchUrl + 'w780' + otherVars.imageUrlSuffix[String(responseJson.Title)]
    }   
    else{
        var imageUrlToPrint = correction
    }
    let titleToSend = String(responseJson.Title)
    titleToSend = titleToSend.replace(/'/g, "*")
    $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item resultText">
                <a href='javascript:handleTitleClick("${titleToSend}")' class='js-indv-link indvLink'>${responseJson.Title}</a>
                <p>${responseJson.Plot}</p>
                <br>
                <div class="small-text group">
                    <div class="item">
                        <p><b>Director:</b> ${responseJson.Director}</p>
                        <p><b>Writer:</b> ${responseJson.Writer}</p>
                        <p><b>Cast:</b> ${responseJson.Actors}</p>  
                    </div>
                    <div class="item right-item">
                        <p><b>Genres:</b> ${responseJson.Genre} </p>
                        <p><b>Release Year:</b> ${responseJson.Year}</p>
                        <p><b>Original Language:</b> ${responseJson.Language} </p>
                        <p><b>Country:</b> ${responseJson.Country}</p>
                    </div>
                </div>
            </div>
            <div class="item">
                <img src="${imageUrlToPrint}" alt="placeholder">
            </div>  
        </li><hr>`
    )
}

function renderIndvPage(responseJson){
    $('div.js-indv-page').append(`
        <div>
            <h2 class="css-page-title">${responseJson.Title}</h2>
            <div class="group">
                <iframe  class="item youtube-embed"  src="${youTubeEmbedUrl}${otherVars.youTubeID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <br>
                <p class="item">${responseJson.Plot}</p>
            </div>
            <div class="group indv-page-box">
                <div class="item">
                    <p>Genres: ${responseJson.Genre} </p>
                    <p>Release Year: ${responseJson.Year}</p>
                    <p>Director: ${responseJson.Director}</p>
                </div>
                <div class="item">
                    <p>Writer: ${responseJson.Writer}</p>
                    <p>Cast: ${responseJson.Actors}</p>
                </div>
                <div class="item">
                    <p>Original Language: ${responseJson.Language} </p>
                    <p>Country: ${responseJson.Country}</p>
                </div>
            </div>
        </div>`
    )
}

function whichPageToRender(responseJson){
    if (otherVars.loadIndvPage){
        renderIndvPage(responseJson)
    }
    else{
        renderResults(responseJson) 
    }
}


//----------Search Functions----------//

function checkForCorrections(title, type){
    if (type === "name") {
        for (var i=0; i < corrections.name.length; i++){
            if (corrections.name[i].tmdbTitle === title){
                return corrections.name[i].omdbTitle
            }
        }
    }
    else if (type === "image"){
        for (var i=0; i < corrections.image.length; i++){
            if (corrections.image[i].omdbTitle === title){
                return corrections.image[i].imageUrl
            }
        }
    }
    else if (type === "nameReverse"){
        for (var i=0; i < corrections.name.length; i++){
            if (corrections.name[i].omdbTitle === title){
                return corrections.name[i].tmdbTitle
            }
        }
    }
    else if (type === "youTube"){
        for (var i=0; i < corrections.youTube.length; i++){
            if (corrections.youTube[i].title === title){
                return corrections.youTube[i].search
            }
        }
    }
    
}

//-----OMBD-----//

function fetchInfoOmbd(title,searchUrl){
    correction = checkForCorrections(title,"name")
    if (correction === undefined){
        queryParams.omdb.t = title
    }   
    else{
        queryParams.omdb.t = correction
    }
    var queryString = formatQueryParams(queryParams.omdb)
    var url = searchUrl + queryString
    fetch(url)
    .then(response => response.json())
    .then(responseJson => 
        whichPageToRender(responseJson))
    .catch(error => console.log("Couldn't find ",title))
}


//-----TMBD-----//

function formatQueryParams(queryArray){
    const queryItems = Object.keys(queryArray)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryArray[key])}`)
  return queryItems.join('&')
}

function saveImagePath(responseJson){
    if (responseJson.results[0].backdrop_path === null){
        if (responseJson.results[0].media_type == 'movie'){
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_title)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].original_title, omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].title)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].title, omdbSearchUrl)
            }
        }
        else{
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_name)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].original_name, omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].name)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].name, omdbSearchUrl)
            }
        }
    }
    else{
        if (responseJson.results[0].media_type == 'movie'){
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_title)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].original_title, omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].title)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].title, omdbSearchUrl)
            }
        }
        else{
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_name)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].original_name, omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].name)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].name, omdbSearchUrl)
            }
        }
    }
}


function fetchInfoTMBD(items,searchUrl) {
    for (var i=0; i < items.length; i++){
        if (items[i].title === undefined){
            queryParams.tmdb.query = items[i]
        }
        else{
            queryParams.tmdb.query = items[i].title
        }
        if (queryParams.tmdb.query === "Kiss Me"){
            queryParams.tmdb.query ="With Every Heartbeat"
        }
        var queryString = formatQueryParams(queryParams.tmdb)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            saveImagePath(responseJson))
        .catch(error => console.log("Couldn't find "+ items[i] + " in database"))
    }
}

function testIfMatching(responseJson){
    if (responseJson[String(otherVars.searchCategory)].toLowerCase().includes(otherVars.searchQuery.toLowerCase())){
        var items = [responseJson.Title]
        fetchInfoTMBD(items, movieSearchUrl)
    }
}


function fetchSearchResults(searchUrl){
    for (var i=0; i < store.media.length; i++){
        queryParams.omdb.t = store.media[i].title
        var queryString = formatQueryParams(queryParams.omdb)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            testIfMatching(responseJson))
        .catch(error => console.log("Couldn't find something in database"))
    }
}
 
//-----YouTube-----//
function saveYouTubeId(responseJson){
    otherVars.youTubeID = responseJson.items[0].id.videoId
    var title = [queryParams.youTube.q.replace(" official trailer", '')]
    if (queryParams.youTube.q === "Gypsy Netflix official trailer"){
        title = [queryParams.youTube.q.replace(" Netflix official trailer", '')]
    }
    fetchInfoTMBD(title, movieSearchUrl)
}


function fetchInfoYouTube(title,searchUrl) {
    correction = checkForCorrections(title,"youTube")
    if (correction === undefined){
        queryParams.youTube.q = title + " official trailer"
    }   
    else{
        queryParams.youTube.q = correction + " official trailer"
    }
    var queryString = formatQueryParams(queryParams.youTube)
    var url = searchUrl + queryString
    fetch(url)
    .then(response => response.json())
    .then(responseJson => 
        saveYouTubeId(responseJson))
    .catch(error => console.log("couldn't find", title))
}

 //-----LG store-----//

function findTitleInStore(title){
    otherVars.titlesToSearch = [] 
    for (var i=0; i < store.media.length; i++){
        if (store.media[i].title.toLowerCase().includes(title.toLowerCase())){
            otherVars.titlesToSearch.push(store.media[i])
        }
    }
}

//----------Loading Browse Window Functions----------//

function loadBrowse(){
    $('ul.results-list').empty()
    $('.results').removeClass('hidden')
    for (var i = 0; i < 10; i++){
        browseArrayItems.push(browseArrayNotDisplayed.splice(Math.random()*(browseArrayNotDisplayed.length-1),1).pop())
    }
    fetchInfoTMBD(browseArrayItems,movieSearchUrl)
}


//----------Handle Clicks Functions----------//

function handleSearchClick(){
    $('#search-form').submit(event => {
        event.preventDefault()
        otherVars.loadIndvPage = false
        $('ul.results-list').empty()
        $('div.js-indv-page').empty()
        $('.results').removeClass('hidden')
        otherVars.searchQuery = $(event.currentTarget).find('#search-bar').val()
        otherVars.searchCategory = $(event.currentTarget).find('#search-category').val()
        fetchSearchResults(omdbSearchUrl)
    })
}

function handleTitleClick(title){
    $('ul.results-list').empty()
    title = title.replace("*", "\'")
    findTitleInStore(title)
    fetchInfoYouTube(otherVars.titlesToSearch[0].title, youTubeInfoSearchUrl)
    otherVars.loadIndvPage = true
}




function callbackFun(){
    loadBrowse()
    handleSearchClick()
}
  
$(callbackFun)