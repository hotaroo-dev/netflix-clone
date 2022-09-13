window.addEventListener('scroll', () => {
  const header = document.querySelector('.header')
  const scrollY = window.scrollY
  if (scrollY > 60) {
    header.style.backgroundColor = '#000'
  } else {
    header.style.backgroundColor = 'rgba(0, 0, 0, 0)'
  }
})

const API_KEY = '86783762237ff3e97be67f3473685c59'
const BASE_PATH = 'https://api.themoviedb.org/3'


const getMovies = async () => {
  const response = await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`)
  const { results } = await response.json()
  return results
}

const getMovieImage = (path, format) => {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${path}`
}

const createBanner = (data) => {
  const banner = document.querySelector('.banner')
  const title = banner.querySelector('.title')
  const overview = banner.querySelector('.overview')

  banner.style.backgroundImage = `linear-gradient(to right, #000, #0002), 
    url(${getMovieImage(data[6].backdrop_path)})`
  title.innerHTML = `<h2>${data[6].title}</h2>`
  overview.innerHTML = `<p>${data[6].overview}</p>`
}

const createMovie = (data) => {
  const movie = document.createElement('div')

  movies.appendChild(movie)
  movie.classList.add('movie')
  movie.innerHTML = `<img src="${getMovieImage(data.poster_path)}">`
  movie.innerHTML += `<h3>${data.title}</h3>`
  movie.addEventListener('click', () => console.log(data))
}

getMovies()
  .then(results => {
    createBanner(results)
    results.map(movie => createMovie(movie))
  })

home.addEventListener('click', () => {
  movies.innerHTML = ''
  getMovies()
    .then(results => {
      results.map(movie => createMovie(movie))
    })
})

/* search */
const search = document.querySelector('form.search')
const searchBtn = search.querySelector('svg')
const input = document.querySelector('input[name="title"]')

let clicked = false
searchBtn.addEventListener('click', () => {
  clicked = !clicked
  if (clicked) {
    input.style.transform = 'scaleX(1)'
    searchBtn.style.transform = 'translateX(-190px)'
  } else {
    input.style.transform = 'scaleX(0)'
    searchBtn.style.transform = 'translateX(0)'
  }
})

search.addEventListener('submit', (e) => {
  e.preventDefault()
  movies.innerHTML = ''

  const checkTitle = input.value.toLowerCase()
  if (checkTitle === '') return

  getMovies().then(results => {
    results.map(movie => {
      const title = movie.title.toLowerCase()
      if (title.includes(checkTitle)) {
        createMovie(movie)
      }
    })
  })
  inputTitle.value = ''
})



