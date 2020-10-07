'use strict'

const movieSearchUrl = "https://api.themoviedb.org/3/search/multi?"
const imageSearchUrl = "https://image.tmdb.org/t/p/"
const youTubeInfoSearchUrl = "https://www.googleapis.com/youtube/v3/search?"
const youTubeEmbedUrl = "https://www.youtube.com/embed/"
const omdbSearchUrl = "https://www.omdbapi.com/?"
const apiKey = "3324330d7274c224e88ee5dbc2a0b10b"
const apiKeyGoogle = "AIzaSyCQd6wTexIF0NbJw4PDsfTdJCnBFNa6E-w"
const apiKeyOmdb = "8ef190b6"
let i = 0
let j = 0
let browseArrayItems = []
let browseArrayNotDisplayed = store.media.slice()
let imageUrlToPrint = ''
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
    searchQuery: ''
}

//----------HTML Template Functions----------//


//ToDO:
//make sure suggestion box works
    //add a message saying the message has been sent

//add footer with TMDB logo




//----------Render Functions----------//

function renderResults(responseJson){
    correction = checkForCorrections(responseJson.Title,"image")
    if (correction === undefined){
        imageUrlToPrint = imageSearchUrl + 'w780' + otherVars.imageUrlSuffix[String(responseJson.Title)]
    }   
    else{
        imageUrlToPrint = correction
    }
    let titleToSend = String(responseJson.Title)
    titleToSend = titleToSend.replace(/'/g, "*")
    $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item">
                <a href='javascript:handleTitleClick("${titleToSend}")' class='js-indv-link'>${responseJson.Title}</a>
                <br>
                <p>${responseJson.Plot}</p>
                <p>Genres: ${responseJson.Genre} </p>
                <p>Release Year: ${responseJson.Year}</p>
                <p>Director: ${responseJson.Director}</p>
                <p>Writer: ${responseJson.Writer}</p>
                <p>Cast: ${responseJson.Actors}</p>
                <p>Original Language: ${responseJson.Language} </p>
                <p>Country: ${responseJson.Country}</p>
            </div>
            <div class="item">
                <img src="${imageUrlToPrint}" alt="placeholder">
            </div>
        </li>`)
}

function renderIndvPage(responseJson){
    console.log("renderIndvPage run 4.2")
        $('div.js-indv-page').append(`
        <div>
            <h2>${responseJson.Title}</h2>
            <iframe width="560" height="315" src="${youTubeEmbedUrl}${otherVars.youTubeID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <br>
            <p>${responseJson.Plot}</p>
            <p>Genres: ${responseJson.Genre} </p>
            <p>Release Year: ${responseJson.Year}</p>
            <p>Director: ${responseJson.Director}</p>
            <p>Writer: ${responseJson.Writer}</p>
            <p>Cast: ${responseJson.Actors}</p>
            <p>Original Language: ${responseJson.Language} </p>
            <p>Country: ${responseJson.Country}</p>
        </div>`)
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
        for (i=0; i < corrections.name.length; i++){
            if (corrections.name[i].tmdbTitle === title){
                return corrections.name[i].omdbTitle
            }
        }
    }
    else if (type === "image"){
        for (i=0; i < corrections.image.length; i++){
            if (corrections.image[i].omdbTitle === title){
                return corrections.image[i].imageUrl
            }
        }
    }
    else if (type === "nameReverse"){
        for (i=0; i < corrections.name.length; i++){
            if (corrections.name[i].omdbTitle === title){
                return corrections.name[i].tmdbTitle
            }
        }
    }
    else if (type === "youTube"){
        for (i=0; i < corrections.youTube.length; i++){
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
  return queryItems.join('&');
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
    console.log('fetchInfotmdb run2');
    console.log(items)
    for (i=0; i < items.length; i++){
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
        console.log(queryString)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            saveImagePath(responseJson))
        //.catch(error => console.log("Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
    }
}

function testIfMatching(responseJson){
    if (responseJson[String(otherVars.searchCategory)].toLowerCase().includes(otherVars.searchQuery.toLowerCase())){
        var items = [responseJson.Title]
        fetchInfoTMBD(items, movieSearchUrl)
    }
}


function fetchSearchResults(searchUrl){
    for (i=0; i < store.media.length; i++){
        queryParams.omdb.t = store.media[i].title
        var queryString = formatQueryParams(queryParams.omdb)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            testIfMatching(responseJson))
        .catch(error => console.log("Couldn't find something in database"))//+ store.media[i].title + " in database"));
    }
}
 
//-----YouTube-----//
function saveYouTubeId(responseJson){
    otherVars.youTubeID = responseJson.items[0].id.videoId
    var title = [queryParams.youTube.q.replace(" official trailer", '')]
    fetchInfoTMBD(title, movieSearchUrl)
}


function fetchInfoYouTube(title,searchUrl) {
    console.log('fetchInfoYouTube run 6');
    correction = checkForCorrections(title,"youTube")
    if (correction === undefined){
        queryParams.youTube.q = title + " official trailer"
    }   
    else{
        queryParams.youTube.q = correction + " official trailer"
    }
    console.log(queryParams.youTube.q)
    var queryString = formatQueryParams(queryParams.youTube)
    var url = searchUrl + queryString
    fetch(url)
    .then(response => response.json())
    .then(responseJson => 
        saveYouTubeId(responseJson))
    .catch(error => console.log("couldn't find", title))//"Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
}

 //-----LG store-----//

function findTitleInStore(title){
    otherVars.titlesToSearch = [] 
    for (i=0; i < store.media.length; i++){
        if (store.media[i].title.toLowerCase().includes(title.toLowerCase())){
            otherVars.titlesToSearch.push(store.media[i])
        }
    }
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
    fetchInfoTMBD(browseArrayItems,movieSearchUrl)
}


//----------Handle Clicks Functions----------//

function handleSearchClick(){
    console.log("handleSearchClick run 5")
    $('#search-form').submit(event => {
        event.preventDefault()
        otherVars.loadIndvPage = false
        $('ul.results-list').empty()
        $('div.js-indv-page').empty()
        $('.results').removeClass('hidden')
        otherVars.searchQuery = $(event.currentTarget).find('#search-bar').val()
        otherVars.searchCategory = $(event.currentTarget).find('#search-category').val()
        console.log(otherVars.searchQuery)
        fetchSearchResults(omdbSearchUrl)
    });
}

function handleTitleClick(title){
    console.log('handleTitleClick run 5')
    $('ul.results-list').empty()
    title = title.replace("*", "\'")
    findTitleInStore(title)
    fetchInfoYouTube(otherVars.titlesToSearch[0].title, youTubeInfoSearchUrl)
    otherVars.loadIndvPage = true
}


function callbackFun(){
    console.log('App loaded')
    loadBrowse()
    handleSearchClick()
}
  
$(callbackFun);