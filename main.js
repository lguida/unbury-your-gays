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
    titlesToSearch: []
}

//----------HTML Template Functions----------//


//ToDO:
//make it possible to search using the advanced search parameters
    //language
//make sure suggestion box works

//fix bug where it won't look for things with special characters
//make it possible to search again after loading the individual page

//add function to handle not-found items on the list
//add footer with TMDB logo




//----------Render Functions----------//

function makeGenreList(responseJson){
    var genresToList = []
    for (i=0; i < responseJson.results[0].genre_ids.length; i++){
        for (j=0; j < genres.ids.length; j++){
            if (genres.ids[j].id == responseJson.results[0].genre_ids[i]){
                genresToList.push(' ' + genres.ids[j].name)
            }
        }
    }
    return genresToList
}

function renderResults(responseJson){
    console.log("renderResults run 4.1")
    console.log(responseJson)
    console.log(otherVars.imageUrlSuffix)
    console.log(otherVars.imageCount)
    $('ul.results-list').append(`
        <li class="result-entry group">
            <div class="item">
                <a href='javascript:handleTitleClick("${responseJson.Title}")' class='js-indv-link'>${responseJson.Title}</a>
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
                <img src="${imageSearchUrl + 'w780' + otherVars.imageUrlSuffix[String(responseJson.Title)]}" alt="placeholder">
            </div>
        </li>`)
    otherVars.imageCount += 1
}

function renderIndvPage(responseJson){
    console.log("renderIndvPage run 4.2")
        $('ul.results-list').replaceWith(`
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

function renderGenreSearchResults(responseJson){
    for (i=0; i < responseJson.results[0].genre_ids.length; i++){
        if (responseJson.results[0].genre_ids[i] == otherVars.genreCode){
            renderResults(responseJson)
        }
        else{
            console.log(responseJson.results[0].genre_ids[i], otherVars.genreCode)
        }
    }
}

function whichPageToRender(responseJson){
    console.log("whichPageToRender run 3")
    if (otherVars.loadIndvPage){
        renderIndvPage(responseJson)
        console.log(otherVars.youTubeID)
        console.log(responseJson)
    }
    else{
        renderResults(responseJson) 
    }
}


//----------Search Functions----------//

//-----OMBD-----//

function fetchInfoOmbd(title,searchUrl){   
    console.log(title)
    queryParams.omdb.t = title
    var queryString = formatQueryParams(queryParams.omdb)
    console.log(queryString)
    var url = searchUrl + queryString
    fetch(url)
    .then(response => response.json())
    .then(responseJson => 
        whichPageToRender(responseJson))
    //.catch(error => console.log("Couldn't find ")
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
    console.log('fetching in tmdb',items)
    for (i=0; i < items.length; i++){
        if (items[i].title === undefined){
            queryParams.tmdb.query = items[i]
        }
        else{
            queryParams.tmdb.query = items[i].title
        }
        var queryString = formatQueryParams(queryParams.tmdb)
        //console.log(queryString)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            saveImagePath(responseJson))
        //.catch(error => console.log("Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
    }
}

function fetchGenreResults(searchUrl){
    for (i=0; i < store.media.length; i++){
        queryParams.tmdb.query = store.media[i].title
        var queryString = formatQueryParams(queryParams.tmdb)
        console.log(queryString)
        var url = searchUrl + queryString
        fetch(url)
        .then(response => response.json())
        .then(responseJson => 
            renderGenreSearchResults(responseJson))
        .catch(error => console.log("Couldn't find "+ store.media[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
    }
}
 
//-----YouTube-----//
function saveYouTubeId(responseJson){
    console.log('saveYouTubeId run 7')
    otherVars.youTubeID = responseJson.items[0].id.videoId
    var title = [queryParams.youTube.q.replace(" official trailer", '')]
    console.log (title)
    fetchInfoTMBD(title, movieSearchUrl)
}


function fetchInfoYouTube(title,searchUrl) {
    console.log('fetchInfoYouTube run 6');
    queryParams.youTube.q = title + " official trailer"
    var queryString = formatQueryParams(queryParams.youTube)
    var url = searchUrl + queryString
    fetch(url)
    .then(response => response.json())
    .then(responseJson => 
        saveYouTubeId(responseJson))
    //.catch(error => console.log("something went wrong"))//"Couldn't find "+ items[i] + " in database")); //here lets eventually make it call a function that searches in an alternate database (one that I'll make probably) to see if that works before writing to the console that it can't find it.
}

 //-----LG store-----//

function findTitleInStore(title){
    otherVars.titlesToSearch = [] 
    console.log(title,": in find titlein store")
    for (i=0; i < store.media.length; i++){
        if (store.media[i].title.toLowerCase().includes(title.toLowerCase())){
            otherVars.titlesToSearch.push(store.media[i])
        }
    }
    console.log(otherVars.titlesToSearch,": in find titlein store")
    //return otherVars.titlesToSearch
}

function findGenreCode(genre){
    var genreCode = ''
    for (i=0; i < genres.ids.length; i++){
        if (genres.ids[i].name.toLowerCase().includes(genre.toLowerCase())){
            genreCode = genres.ids[i].id
        }
    }
    return genreCode
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
        findTitleInStore(queryParams.tmdb.query)
        console.log(otherVars.titlesToSearch)
        fetchInfoTMBD(otherVars.titlesToSearch, movieSearchUrl)
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
    findTitleInStore(title)
    console.log(otherVars.titlesToSearch)
    fetchInfoYouTube(otherVars.titlesToSearch[0].title, youTubeInfoSearchUrl)
    console.log(otherVars.youTubeID)
    otherVars.loadIndvPage = true
}

function handleSearchGenreClick(){
    console.log('handleSearchGenreClick run')
    $('main').on('click', '#genre-button', event =>{
        event.preventDefault()
        otherVars.loadIndvPage = false
        $('ul.results-list').empty()
        $('.results').removeClass('hidden')
        otherVars.genre = $('#genre').val()
        otherVars.genreCode = findGenreCode(otherVars.genre)
        console.log(queryParams.tmdb.query)
        fetchGenreResults(movieSearchUrl)
    })
}


function callbackFun(){
    console.log('App loaded')
    loadBrowse()
    handleAdvSearchClick()
    handleSearchClick()
    handleSearchGenreClick()
}
  
$(callbackFun);