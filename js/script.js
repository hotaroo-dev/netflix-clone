window.addEventListener('scroll', () => {
  const header = document.querySelector('.header')
  const scrollY = window.scrollY
  if (scrollY > 60) {
    header.style.backgroundColor = '#100f0f'
  } else {
    header.style.backgroundColor = 'rgba(0, 0, 0, 0)'
  }
})

const API_KEY = '86783762237ff3e97be67f3473685c59'
const BASE_PATH = 'https://api.themoviedb.org/3'

const getMovies = async () => {
  return await Promise.all(
    ['movie', 'tv'].map(id =>
      fetch(`${BASE_PATH}/${id}/top_rated?api_key=${API_KEY}`).then(response =>
        response.json()
      )
    )
  )
}

const getGenres = async id => {
  return await (
    await fetch(`${BASE_PATH}/genre/${id}/list?api_key=${API_KEY}`)
  ).json()
}

const getMoviesWithGenre = async (id, genreId) => {
  return await (
    await fetch(
      `${BASE_PATH}/${id}/top_rated?api_key=${API_KEY}&with_genres=${genreId}`
    )
  ).json()
}

const getMovieImage = (path, format) => {
  return `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`
}

const getDetail = async data => {
  return await (
    await fetch(`${BASE_PATH}/tv/${data.id}?api_key=${API_KEY}`)
  ).json()
}

const createBanner = data => {
  const banner = document.querySelector('.banner')
  const title = banner.querySelector('.title')
  const overview = banner.querySelector('.overview')

  banner.style.backgroundImage = `linear-gradient(to right, #100f0f 10%,  #0002), 
    url(${getMovieImage(data.backdrop_path)})`
  title.innerHTML = `<h2>${data.title || data.name}</h2>`
  overview.innerHTML = `<p>${data.overview}</p>`
}

const paintCard = (card, data) => {
  card.style.backgroundImage = `linear-gradient(to right, #191919 50%,  #0002),
    url(${getMovieImage(data.backdrop_path)})`
  card.innerHTML = `<img src="${getMovieImage(data.poster_path)}">`
  card.innerHTML += `<div><h3>${data.name}</h3><p>${data.overview}</p></div>`

  let detail = card.querySelector('div')

  let ul = document.createElement('ul')
  getDetail(data).then(data => {
    const releaseYear = document.createElement('li')
    releaseYear.innerText = `${data.first_air_date.split('-')[0]}`
    ul.appendChild(releaseYear)

    data.genres.map((genre, i, arr) => {
      let li = document.createElement('li')
      li.innerText = arr.length - 1 === i ? `${genre.name}` : `${genre.name},`
      ul.appendChild(li)
    })
  })

  /* rating */
  let rating = document.createElement('div')
  rating.innerHTML += `<span>${data.vote_average}/10</span>`

  let starsOuter = document.createElement('div')
  let starsInner = document.createElement('div')
  starsOuter.classList.add('stars-outer')
  starsInner.classList.add('stars-inner')
  starsOuter.appendChild(starsInner)
  rating.appendChild(starsOuter)

  detail.append(ul, rating)

  const totalRating = 10
  let starPercentage = (data.vote_average / totalRating) * 100
  starPercentage = Math.round(starPercentage / 10) * 10
  starsInner.style.width = `${starPercentage}%`
}

const deleteMovie = (e, data) => {
  const card = e.target.parentElement.parentElement
  card.classList.add('fall')
  card.addEventListener('transitionend', () => card.remove())
  removeLocalMovie(data)
}

const createCard = data => {
  const card = document.createElement('div')
  card.classList.add('card', 'modal-card', 'active')
  paintCard(card, data)

  const deleteBtn = document.createElement('i')
  deleteBtn.classList.add('fas', 'fa-trash')
  deleteBtn.addEventListener('click', e => deleteMovie(e, data))

  card.querySelector('div').appendChild(deleteBtn)
  document.querySelector('main .wrapper').appendChild(card)
}

const createModal = data => {
  const card = document.querySelector('.modal-card')
  paintCard(card, data)

  card
    .querySelector('img')
    .addEventListener('click', () => saveLocalMovies(data))
}

const modal = document.querySelector('.modal')

const createMovie = data => {
  const movie = document.createElement('div')
  movies.appendChild(movie)
  movie.classList.add('movie', 'swiper-slide')
  movie.innerHTML = `<img src="${getMovieImage(data.poster_path)}">`

  movie.addEventListener('click', e => {
    modal.classList.add('modal-active')
    createModal(data)
  })
}

const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')

getMovies().then(response => {
  const movie = response[0]
  const tv = response[1]

  homePath.classList.contains('active') && createBanner(movie.results[9])
  if (tvPath.classList.contains('active')) {
    createBanner(tv.results[19])
    tv.results.map(movie => createMovie(movie))

    getGenres('tv').then(({ genres }) => {
      const ul = document.querySelector('ul.genres')
      genres.splice(1, 8).map(genre => {
        const li = document.createElement('li')
        ul.appendChild(li)
        li.innerHTML = `<a href="#">${genre.name}</a>`
        li.addEventListener('click', e => {
          e.preventDefault()
          const activeEl = ul.querySelector('li.active')
          activeEl && activeEl.classList.remove('active')
          li.classList.add('active')
          getMoviesWithGenre('tv', genre.id).then(data => {
            movies.innerHTML = ''
            data.results.map(poster => createMovie(poster))
          })
        })
      })

      modal.addEventListener('click', e => {
        if (e.target !== e.currentTarget) return
        modal.classList.remove('modal-active')
      })
    })
  }
})

/* Movie list */
const favPath = document.querySelector('#fav a')
if (favPath.classList.contains('active')) {
  checkLocalMovies()

  movieList.map(movie => createCard(movie))
}

/* search */
const search = document.querySelector('form.search')
const searchBtn = search.querySelector('svg')
const input = document.querySelector('input[name="title"]')

searchBtn.addEventListener('click', () => {
  if (search.classList.contains('active')) {
    search.classList.remove('active')
  } else {
    search.classList.add('active')
  }
})

search.addEventListener('submit', e => {
  e.preventDefault()
  input.value = ''
})

/* local storage */
function checkLocalMovies() {
  if (localStorage.getItem('movie-list') === null) return (movieList = [])
  return (movieList = JSON.parse(localStorage.getItem('movie-list')))
}

const checkMovie = (movieList, data) =>
  movieList.some(movie => movie.id === data.id)

const getIndex = (movieList, data) => {
  let index
  movieList.forEach((movie, i) => {
    if (movie.id === data.id) index = i
  })
  return index
}

function saveLocalMovies(movie) {
  checkLocalMovies()

  if (checkMovie(movieList, movie)) return
  movieList.push(movie)
  localStorage.setItem('movie-list', JSON.stringify(movieList))
}

function removeLocalMovie(movie) {
  checkLocalMovies()

  const index = getIndex(movieList, movie)
  movieList.splice(index, 1)
  localStorage.setItem('movie-list', JSON.stringify(movieList))
}
