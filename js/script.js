window.addEventListener('scroll', () => {
  const header = document.querySelector('.header')
  const scrollY = window.scrollY
  if (scrollY > 60) {
    header.classList.add('blur')
  } else {
    header.classList.remove('blur')
  }
})

const body = document.querySelector('body')
const theme = localStorage.getItem('theme')
theme && body.classList.add(theme)

const toggleMode = () => {
  body.classList.toggle('light')
  localStorage.setItem('theme', body.classList.value)
}

const toggleMenu = () =>
  document.querySelector('nav.mobile').classList.toggle('open')

/* utils function */
const API_KEY = '86783762237ff3e97be67f3473685c59'
const BASE_PATH = 'https://api.themoviedb.org/3'

const getMovies = async () =>
  await Promise.all(
    ['movie', 'tv'].map(type =>
      Promise.all(
        ['popular', 'top_rated'].map(id =>
          fetch(
            `${BASE_PATH}/${type}/${id}?api_key=${API_KEY}&with_genres=16`
          ).then(response => response.json())
        )
      )
    )
  )

const getGenres = async type => {
  return await (
    await fetch(`${BASE_PATH}/genre/${type}/list?api_key=${API_KEY}`)
  ).json()
}

const getMoviesWithGenre = async (type, genreId) =>
  await (
    await fetch(
      `${BASE_PATH}/${type}/popular?api_key=${API_KEY}&with_genres=${genreId}`
    )
  ).json()

const getMovieImage = (path, format) =>
  `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`

const getDetail = async (type, id) =>
  await (await fetch(`${BASE_PATH}/${type}/${id}?api_key=${API_KEY}`)).json()
/* end utils function */

const paintCard = (data, card, type) => {
  const bg = data.backdrop_path
    ? `linear-gradient(to right, #191919 50%,  #0002),
    url(${getMovieImage(data.backdrop_path)})`
    : '#191919'
  card.style.backgroundImage = bg
  card.innerHTML = `<img src="${getMovieImage(data.poster_path) || './images/no-icon.png'
    }">`
  card.innerHTML += `<div><h3>${data.title || data.name}</h3><p>${data.overview
    }</p></div>`

  let detail = card.querySelector('div')

  let ul = document.createElement('ul')
  getDetail(type, data.id).then(data => {
    const releaseYear = document.createElement('li')
    releaseYear.innerText = `${data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0]
      }`
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
  detail.classList.add('no-mobile')

  const totalRating = 10
  let starPercentage = (data.vote_average / totalRating) * 100
  starPercentage = Math.round(starPercentage / 10) * 10
  starsInner.style.width = `${starPercentage}%`
}

const createCard = data => {
  const card = document.createElement('div')
  card.classList.add('card', 'modal-card', 'active')
  paintCard(data, card, data.type || 'movie')

  const deleteBtn = document.createElement('i')
  deleteBtn.classList.add('fas', 'fa-trash')
  deleteBtn.addEventListener('click', e => deleteMovie(e, data))

  card.appendChild(deleteBtn)
  document.querySelector('.movie-list .wrapper').appendChild(card)
}

const modal = document.querySelector('.modal')
modal &&
  modal.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
    modal.classList.remove('modal-active')
  })

const createModal = data => {
  const card = document.querySelector('.modal .modal-card')
  const type = document.querySelector('main').id || 'movie'
  paintCard(data, card, type)

  const addBtn = document.createElement('i')
  addBtn.classList.add('fas', 'fa-plus')
  addBtn.addEventListener('click', () => {
    saveLocalMovies(data, type)
    modal.classList.remove('modal-active')

    document.querySelector('main').classList.contains('movie-list') &&
      createCard(data)
  })

  card.appendChild(addBtn)
}

const createMovie = (data, el) => {
  const movie = document.createElement('div')
  el.appendChild(movie)
  movie.classList.add('movie', 'swiper-slide')
<<<<<<< HEAD
  movie.innerHTML = `<img src="${(data.poster_path && getMovieImage(data.poster_path)) ||
    './images/no-icon.png'
    }">`
=======
  movie.innerHTML = `<img src="${
    (data.poster_path && getMovieImage(data.poster_path)) || './images/no-icon.png'
  }">`
>>>>>>> 9fcb218179c5e83501b21e56d84010ea04c40fe0

  movie.addEventListener('click', () => {
    modal.classList.add('modal-active')
    createModal(data)
  })

  return movie
}

function deleteMovie(e, data) {
  const card = e.target.parentElement
  card.classList.add('fall')
  card.addEventListener('transitionend', () => card.remove())
  removeLocalMovie(data)
}

/* local storage */
const checkMovie = (movieList, data) =>
  movieList.some(movie => movie.id === data.id)

function getIndex(movieList, data) {
  let index
  movieList.forEach((movie, i) => {
    if (movie.id === data.id) index = i
  })
  return index
}

function checkLocalMovies() {
  if (localStorage.getItem('movie-list') === null) return (movieList = [])
  return (movieList = JSON.parse(localStorage.getItem('movie-list')))
}

function saveLocalMovies(movie, type) {
  checkLocalMovies()

  if (checkMovie(movieList, movie)) return
  movieList.push({ ...movie, type })
  localStorage.setItem('movie-list', JSON.stringify(movieList))
}

function removeLocalMovie(movie) {
  checkLocalMovies()

  const index = getIndex(movieList, movie)
  movieList.splice(index, 1)
  localStorage.setItem('movie-list', JSON.stringify(movieList))
}
/* end local storage */
