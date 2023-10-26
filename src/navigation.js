//Variable infiniteScroll
let maxPage;
let page = 1;
let infiniteScroll;

//Damos dinamimismo al boton de busqueda para que me lleve a su sección search
searchFormBtn.addEventListener('click', () =>{//Busqueda
    location.hash = '#search='+ searchFormInput.value;
});
//Damos dinamimismo al boton de (Ver mas) para que me lleve a la sección Tendencias
trendingBtn.addEventListener('click', () =>{
    location.hash = '#trends';
});
//Damos dinamismo a la flecha para siempre volver al home  
arrowBtn.addEventListener('click', () =>{
    history.back();//Metodo para que cuando vayamos atras esten los resultados anteriormente vistos 
    //location.hash = '#home';
})


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
//Agregamos el evento de Scroll
window.addEventListener('scroll', infiniteScroll, false);

//Funcion navigator
function navigator(){
    console.log({location});

    //Condicional de infiniteScroll
    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive:false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')){
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
        searchPage();
    } else if (location.hash.startsWith('#movie=')){
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')){
        categoriesPage();
    }else{
        homePage();
    }

    //Solucion para aparecer arriba cada vez que cambiamos de pagina o scroll
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    //Segunda parte de infiniteScroll
    if (infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

function homePage(){
    console.log('Home!!');

    //Definimos las clases 
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    //Section - node.js
    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    //Llamanos las peliculas favoritas
    getLikedMovies();
}

function categoriesPage(){
    console.log('categories!!');

     //Definimos las clases 
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
     //Section - node.js
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove ('inactive');
    movieDetailSection.classList.add('inactive');
    
    const [_, categoryData] = location.hash.split('='); //=> ['']
    const [categoryId, categoryName] = categoryData.split('-');
    
    headerCategoryTitle.innerHTML = categoryName;//se agrega esta linea para que el nombre de cada categoria sea la indicada
    
    getMoviesByCategory(categoryId);
    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}

function movieDetailsPage(){
    console.log('Movie !!');

    //Definimos las clases 
    headerSection.classList.add ('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    //Section - node.js
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    
    //Enviamos el ['#movie', '234567']
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);

    //Cargamos la información de la api de cada pelicula
    //getMovieById(id);
}
//Función creada para encontrar la pelicula que 
//queramos en nuestro buscador
function searchPage(){
    console.log('Search !!');
     //Definimos las clases 
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
      //Section - node.js
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove ('inactive');
    movieDetailSection.classList.add('inactive');

    //Enviamos el query
    const [_, query] = location.hash.split('=');    
    getMoviesBySearch(query);

    //Añadimos InifiniteScroll
    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function trendsPage(){
    console.log('TRENDS!!');
     //Definimos las clases 
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
       //Section - node.js
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove ('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();

    //Agregamos el infiniteScroll
    infiniteScroll= getPaginatedTrendingMovies;
}