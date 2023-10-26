//Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});


function likedMoviesList(){
    const item = JSON.parse(localStorage.getItem ('liked_movies'));
    let movies;

    //Devolvemos a local storage lo que estaba en liked_movies
    if(item) {
        movies = item;
    } else {
        movies = {};
    }
    
    
    return movies;
}


//Creamos la función de dar megusta 
function likeMovie(movie){
    //     if( ) {
    const likedMovies = likedMoviesList();
    //Para poder ver el id de cada pelicula que le das me gusta 
    //en la consola de nuestro navegador
    console.log(likedMovies);

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
        // console.log('la pelicula ya esta en LS, deberiamos eliminarla');
    } else{
        likedMovies[movie.id] = movie;
        // console.log('la pelicula no estaba en LS, deberiamos agragarla');
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
}    

//Utils

//Creamos el código con "Intersenction observer" para que cargen solo las imagenes
//vistas en pantalla

const lazyloader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            const url = entry.target.getAttribute('data-img')
            // console.log(entry.target)
            entry.target.setAttribute('src', url);    
        }        
    });
});


function createMovies( 
    movies,
    container, 
    {
        lazyload = false,
        clean = true,
    }={},
)   {
    if (clean){
            container.innerHTML = '';//Nos sirve  para limpiar el contenedor cada ves que se recarga
    }

    movies.forEach(movie => {        
        const movieContainer = document.createElement('div');//Creamos un elemento div
        movieContainer.classList.add('movie-container');//Añadimos la lista de movie-container
        //Agregamos el evento para la selección de peliculas 
        

        const movieImg = document.createElement('img');//Creamos un elemento IMG
        movieImg.classList.add('movie-img');        
        movieImg.setAttribute('alt', movie.title);//Agragamos el atributo alt
        movieImg.setAttribute(
            lazyload ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
        );
        movieImg.addEventListener('click', () =>{
            location.hash = "#movie=" + movie.id;
        });
        //Creamos una evento para generar una imagene que no tiene  
        //una imagen por defecto
        movieImg.addEventListener('error', () =>{
            movieImg.setAttribute(
                'src',
                'https://static.platzi.com/static/images/error/img404.png',
            );
        })

        //Creamos el boton de like 
        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        //Condicional para que nuestrras peliculas en favoritos tengan 
        //marcado el like en la zona de favoritos 
        likedMoviesList()[movie.id]&& movieBtn.classList.add 
        ('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            //Oocion de dar like o quitar el like
            likeMovie(movie);

        });


        //Llamamos a lazyloader o intersection observer
        if (lazyload){
            lazyloader.observe(movieImg);
        }
        

        movieContainer.appendChild(movieImg);
        //Agregamos el boton de like
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });//Hacemos un forEach para recibir una pelicula 
}

function createCategories(categories, container) {
    container.innerHTML = "";

    categories.forEach(category=> {
        const categoryContainer = document.createElement('div');//Creamos un elemento div
        categoryContainer.classList.add('category-container');//Añadimos la lista de movie-container
        
        const categoryTitle = document.createElement('h3');//Creamos un elemento IMG
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+ category.id);//Agragamos el atributo alt
        categoryTitle.addEventListener('click', () =>{//Se coloca para dar click en las opciones de categoria
            location.hash = `#category=${category.id}-${category.name}`;//Se coorigen los errores de concatenación
        });
        const categoryTitleText = document.createTextNode(category.name);//Creamos una constante const
        
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);//Se cambia a container

        
    });//Hacemos un forEach para recibir una pelicula   
}

//Llamdos a la API

//Creamos una funcion asincrona para las tendencias
async function getTrendingMoviesPreview(){
    const {data}  = await api('trending/movie/day');
    const movies = data.results;
    console.log(movies)

    createMovies(movies, trendingMoviesPreviewList, true);//Se reduce el código que sigue, 
    //colocando este codigo en la funcion vreateMovies

    // trendingMoviesPreviewList.innerHTML = "";
    // movies.forEach(movie => {        
    //     const movieContainer = document.createElement('div');//Creamos un elemento div
    //     movieContainer.classList.add('movie-container');//Añadimos la lista de movie-container
        
    //     const movieImg = document.createElement('img');//Creamos un elemento IMG
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);//Agragamos el atributo alt
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path,);

    //     movieContainer.appendChild(movieImg);
    //     trendingMoviesPreviewList.appendChild(movieContainer);
    // });//Hacemos un forEach para recibir una pelicula 
}

//Creamos una función asyncrona para las categorias 
async function getCategoriesPreview(){
    const {data}= await api('genre/movie/list');
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);
    //Creamos una const para llamar los atributos del index
    // const categoriesPreviewList = document.querySelector
    // ('#categoriesPreview .categoriesPreview-list')
    
    //Llamamos una nueva variable para corregir el error de duplicado de datos 
    //Y se borra la constante indentada anteriror


    //categoriesPreviewList.innerHTML = "";


    // categories.forEach(category=> {
    //     const categoryContainer = document.createElement('div');//Creamos un elemento div
    //     categoryContainer.classList.add('category-container');//Añadimos la lista de movie-container
        
    //     const categoryTitle = document.createElement('h3');//Creamos un elemento IMG
    //     categoryTitle.classList.add('category-title');
    //     categoryTitle.setAttribute('id', 'id'+ category.id);//Agragamos el atributo alt
    //     categoryTitle.addEventListener('click', () =>{//Se coloca para dar click en las opciones de categoria
    //         location.hash = `#category=${category.id}-${category.name}`;//Se coorigen los errores de concatenación
    //     });
    //     const categoryTitleText = document.createTextNode(category.name);//Creamos una constante const
        
    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);
    //     categoriesPreviewList.appendChild(categoryContainer);

        
    // });//Hacemos un forEach para recibir una pelicula 
}
//Creamos una función asyncrona para para llamar a las peliculas de las API de diferentes categorias 
async function getMoviesByCategory(id){//No olvidar que llamamos a los id
    const {data}  = await api('discover/movie',{//Aca creamos la constante para llamar a las peliculas de las diferentes categorias
        params: {
            with_genres: id,
        },
    });
    const movies = data.results;
    //Agragamos la opción de pagina maxima
    maxPage = data.total_pages;

    createMovies(movies, genericSection, {lazyload: true});
}


function getPaginatedMoviesByCategory(id) {
    //Creamos el código para nuestro scroll infinito    
    return async function ()  {
        const   {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        //Constante de maxPage      
        const pageIsNotMax = page < maxPage;
        
        if(scrollIsBottom && pageIsNotMax){    
            page++;//Para que page sume más paginas
            const {data}  = await api('discover/movie',{//Aca creamos la constante para llamar a las peliculas de las diferentes categorias
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;

            createMovies(
                movies, 
                genericSection, 
                {lazyload: true, clean: false},
            );    
        }
    }
}


//Función que creamos para encontrar la peicula dada en nuestro formulario de busqueda
// genericSection.innerHTML = "";//Se hace un genericSection con un innerHTML donde vamos a enviar nuestras peliculas 
    
    // movies.forEach(movie => {
        
    //     const movieContainer = document.createElement('div');//Creamos un elemento div
    //     movieContainer.classList.add('movie-container');//Añadimos la lista de movie-container
        
    //     const movieImg = document.createElement('img');//Creamos un elemento IMG
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);//Agragamos el atributo alt
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path,);

    //     movieContainer.appendChild(movieImg);
    //     genericSection.appendChild(movieContainer);
    // });//Hacemos un forEach para recibir una pelicula 
async function getMoviesBySearch(query){//No olvidar que llamamos a los id
    const {data}  = await api('search/movie',{//Aca creamos la constante para llamar a las peliculas de las diferentes categorias
        params: {
            query,
        },
    });
    const movies = data.results;
    maxPage= data.total_pages;
    console.log(maxPage);
    createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    //Creamos el código para nuestro scroll infinito    
    return async function ()  {
        const   {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        //Constante de maxPage      
        const pageIsNotMax = page < maxPage;
        
        if(scrollIsBottom && pageIsNotMax){    
            page++;//Para que page sume más paginas
            const {data}  = await api('search/movie',{//Aca creamos la constante para llamar a las peliculas de las diferentes categorias
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
            
            createMovies(
                movies, 
                genericSection, 
                {lazyload: true, clean: false},
            );    
        }
    }
}
//Tendencias
async function getTrendingMovies(){
    const {data}  = await api('trending/movie/day');
    const movies = data.results;

    //Establecemos el código para definir el maximo de paginas 
    
    maxPage = data.total_pages;

    createMovies(movies, genericSection, {lazyload: true, clean: true});//Se reduce el código que sigue, 

    //Creamos una boton de cargar mas 
    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar Mas';
    // //Agregamos el click con un evento
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
    //colocando este codigo en la funcion vreateMovies

    // trendingMoviesPreviewList.innerHTML = "";
    // movies.forEach(movie => {        
    //     const movieContainer = document.createElement('div');//Creamos un elemento div
    //     movieContainer.classList.add('movie-container');//Añadimos la lista de movie-container
        
    //     const movieImg = document.createElement('img');//Creamos un elemento IMG
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);//Agragamos el atributo alt
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path,);

    //     movieContainer.appendChild(movieImg);
    //     trendingMoviesPreviewList.appendChild(movieContainer);
    // });//Hacemos un forEach para recibir una pelicula 
}

//Varibale para que nuestra pagina sea dinamica 
//let page = 1;
//E
// window.addEventListener('scroll', getPaginatedTrendingMovies);


//Creamos la funcion para llamar a nuestro boton de cargar mas
async function getPaginatedTrendingMovies(){
    //Creamos el código para nuestro scroll infinito    
    const{
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    //Constante de maxPage      
    const pageIsNotMax = page < maxPage;
    
    if(scrollIsBottom && pageIsNotMax){

        page++;//Para que page sume más paginas
        const {data}  = await api('trending/movie/day', {
            params:{//Se agrega un objeto
                page,
            },
        });
        const movies = data.results;
        


        createMovies(movies, 
            genericSection, 
            {lazyload: true, clean: false},
        );    
    }
    
    // //Para llamar infinitas paginas 
    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar Mas';
    // //Agregamos el click con un evento
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
}

//Función para traer la informacion de cada pelicula de nuestra api
async function getMovieById(id){
    const {data: movie}  = await api('movie/' + id);
    
    //Crear la imagen de la pelicula
    const movieImgUrl ='https://image.tmdb.org/t/p/w500'+ movie.poster_path;
    console.log(movieImgUrl)
    headerSection.style.background = 
    //Esta propiedad anexa un degradado negro en la parte superior de la pantalla para 
    //poder ver la flecha de para atras.
    `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 
    19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})`;
    
    //Detalles de la pelicula 
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    //Función para generar la categoria y calificacion de cada pelicula 
    createCategories(movie.genres, movieDetailCategoriesList);
    //Llamamos a la función de recomendaciones
    getRelatedMoviesId(id);
    

    // trendingMoviesPreviewList.innerHTML = "";
    // movies.forEach(movie => {        
    //     const movieContainer = document.createElement('div');//Creamos un elemento div
    //     movieContainer.classList.add('movie-container');//Añadimos la lista de movie-container
        
    //     const movieImg = document.createElement('img');//Creamos un elemento IMG
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);//Agragamos el atributo alt
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path,);

    //     movieContainer.appendChild(movieImg);
    //     trendingMoviesPreviewList.appendChild(movieContainer);
    // });//Hacemos un forEach para recibir una pelicula 
}

//Funcion para ver las peliculas recomendadas cuando selecciones una pelicula 
async function getRelatedMoviesId(id) {
    const {data} = await api (`movie/${id}/similar`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);
}

//Función para manejar a localStorage
function getLikedMovies(){
    const likedMovies = likedMoviesList();


    //Nos ayuda a combertir los valores de un objeto a una value
    const moviesArray =  Object.values(likedMovies)//Convertimos a un Array
    createMovies(moviesArray, likedMoviesListArticle    , { lazyload:  false, clean: true});
    
    console.log(likedMovies)
}