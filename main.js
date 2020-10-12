'use strict'

const queryParams = {
    tmdb:{
        api_key: "3324330d7274c224e88ee5dbc2a0b10b",
        query: ''},
    youTube:{
        key: "AIzaSyCQd6wTexIF0NbJw4PDsfTdJCnBFNa6E-w",
        part: "snippet",
        maxResults: 10,
        q: ''
    },
    omdb:{
        apikey: "8ef190b6",
        t: '',
        plot: 'full'
    }
}

const otherVars = {
    loadIndvPage: false,
    youTubeID: '',
    imageUrlSuffix: [],
    searchCategory: '',
    searchQuery: '',
    browseArrayNotDisplayed: store.media.slice(),
    browseArrayItems: []
}

//----------HTML Template functions ----------//

function createSearchResultHTML(responseJson){
    var correction = checkForCorrections(responseJson.Title,"image")
    if (correction === undefined){
        var imageUrlToPrint = store.constants.imageSearchUrl + 'w780' + otherVars.imageUrlSuffix[String(responseJson.Title)]
    }   
    else{
        var imageUrlToPrint = correction
    }
    let titleToSend = String(responseJson.Title)
    titleToSend = titleToSend.replace(/'/g, "*")
    let stringToRender = `
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
            <img src="${imageUrlToPrint}" alt="${responseJson.Title} poster">
        </div> 
        <hr>
    </li>`
    return stringToRender
}

function createIndvPageHTML(responseJson){
    let youTubeEmbedString = ''
    let htmlToReturn = ''
    if (otherVars.youTubeID === ''){
         youTubeEmbedString = `<p class="youtube-error" >Oops! Sorry, we can't display the YouTube trailer right now</p>`
    }
    else {
         youTubeEmbedString = `<iframe  class="item youtube-embed"  src="${store.constants.youTubeEmbedUrl}${otherVars.youTubeID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    }
    htmlToReturn =`
        <div>
            <h2 class="css-page-title">${responseJson.Title}</h2>
            <div class="group">
                ${youTubeEmbedString}
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
        </div>
    `
    return htmlToReturn
}

//----------Render Functions----------//

function renderResults(stringToRender, whereToAdd){
    $(whereToAdd).append(stringToRender)
}


function whichPageToRender(responseJson){
    if (otherVars.loadIndvPage){
        var stringToRender = createIndvPageHTML(responseJson)
        renderResults(stringToRender, 'div.js-indv-page')
    }
    else{
        var stringToRender = createSearchResultHTML(responseJson)
        renderResults(stringToRender, 'ul.results-list') 
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
    var correction = checkForCorrections(title,"name")
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
    .catch(error => alert("Sorry! Couldn't find ",title))
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
                fetchInfoOmbd(responseJson.results[0].original_title, store.constants.omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].title)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].title, store.constants.omdbSearchUrl)
            }
        }
        else{
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_name)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].original_name, store.constants.omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].name)] = responseJson.results[0].poster_path
                fetchInfoOmbd(responseJson.results[0].name, store.constants.omdbSearchUrl)
            }
        }
    }
    else{
        if (responseJson.results[0].media_type == 'movie'){
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_title)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].original_title, store.constants.omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].title)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].title, store.constants.omdbSearchUrl)
            }
        }
        else{
            if (responseJson.results[0].original_language === "en"){
                otherVars.imageUrlSuffix[String(responseJson.results[0].original_name)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].original_name, store.constants.omdbSearchUrl)
            }
            else{
                otherVars.imageUrlSuffix[String(responseJson.results[0].name)] = responseJson.results[0].backdrop_path
                fetchInfoOmbd(responseJson.results[0].name, store.constants.omdbSearchUrl)
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
        .catch(error => alert("Sorry! Couldn't find "+ items[i] + " in database"))
    }
}

function testIfMatching(responseJson){
    if (responseJson[String(otherVars.searchCategory)].toLowerCase().includes(otherVars.searchQuery.toLowerCase())){
        var items = [responseJson.Title]
        fetchInfoTMBD(items, store.constants.movieSearchUrl)
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
        .catch(error => alert("Sorry! Couldn't find something in database"))
    }
}
 
//-----YouTube-----//
function saveYouTubeId(responseJson){
    otherVars.youTubeID = responseJson.items[0].id.videoId
    var title = [queryParams.youTube.q.replace(" official trailer", '')]
    if (queryParams.youTube.q === "Gypsy Netflix official trailer"){
        title = [queryParams.youTube.q.replace(" Netflix official trailer", '')]
    }
    fetchInfoOmbd(title, store.constants.omdbSearchUrl)
}


function fetchInfoYouTube(title,searchUrl) {
    var correction = checkForCorrections(title,"youTube")
    var backupTitle = [title]
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
    .catch(error => fetchInfoOmbd(backupTitle, store.constants.omdbSearchUrl)) 
}


 //-----LG store-----//

function findTitleInStore(title){
    let titlesToSearch = [] 
    for (var i=0; i < store.media.length; i++){
        if (store.media[i].title.toLowerCase().includes(title.toLowerCase())){
           titlesToSearch.push(store.media[i])
        }
    }
    return titlesToSearch
}

//----------Loading Browse Window Functions----------//

function loadBrowse(){
    otherVars.browseArrayItems = []
    $('ul.results-list').empty()
    $('.results').removeClass('hidden')
    for (var i = 0; i < 10; i++){
        otherVars.browseArrayItems.push(otherVars.browseArrayNotDisplayed.splice(Math.random()*(otherVars.browseArrayNotDisplayed.length-1),1).pop())
    }
    fetchInfoTMBD(otherVars.browseArrayItems,store.constants.movieSearchUrl)
}


//----------Handle Clicks Functions----------//

function handleSearchClick(){
    $('#search-form').submit(event => {
        event.preventDefault()
        otherVars.loadIndvPage = false
        $(".js-back-search").addClass("hidden")
        $('ul.results-list').empty()
        $('div.js-indv-page').empty()
        $(".landing").addClass("hidden")
        $('.results').removeClass('hidden')
        otherVars.searchQuery = $(event.currentTarget).find('#search-bar').val()
        otherVars.searchCategory = $(event.currentTarget).find('#search-category').val()
        fetchSearchResults(store.constants.omdbSearchUrl)
    })
}

function handleTitleClick(title){
    $('ul.results-list').empty()
    title = title.replace("*", "\'")
    otherVars.loadIndvPage = true
    $(".landing").addClass("hidden")
    $(".js-back-search").removeClass("hidden")
    let titleInfo = findTitleInStore(title)
    otherVars.youTubeID = ''
    if (titleInfo[0].youTubeID === undefined){
        fetchInfoYouTube(titleInfo[0].title, store.constants.youTubeInfoSearchUrl)
    }
    else{
        otherVars.youTubeID = titleInfo[0].youTubeID
        fetchInfoOmbd(title, store.constants.omdbSearchUrl)
    }
}

function handleBackToSearchClick(){
    $('main').on('click','.js-back-search', event=> {
        $('div.js-indv-page').empty()
        otherVars.loadIndvPage = false
        $(".js-back-search").addClass("hidden")
        $('.results').removeClass('hidden')
        if (otherVars.searchCategory === ''){
            fetchInfoTMBD(otherVars.browseArrayItems,store.constants.movieSearchUrl)
        }
        else{
            fetchSearchResults(store.constants.omdbSearchUrl)
        }
    })
}




function callbackFun(){
    loadBrowse()
    handleSearchClick()
    handleBackToSearchClick()
}
  
$(callbackFun)