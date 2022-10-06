window.addEventListener('scroll', () => {
  const header = document.querySelector('.header')
  const scrollY = window.scrollY
  if (scrollY > 60) {
    header.classList.add('blur')
  } else {
    header.classList.remove('blur')
  }
})

const toggleMenu = () => {
  const nav = document.querySelector('nav.mobile')
  nav.classList.contains('open')
    ? nav.classList.remove('open')
    : nav.classList.add('open')
}

/* utils function */
const API_KEY = '86783762237ff3e97be67f3473685c59'
const BASE_PATH = 'https://api.themoviedb.org/3'
const id = 7

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

const getMoviesWithGenre = async (id, genreId) =>
  await (
    await fetch(
      `${BASE_PATH}/${id}/popular?api_key=${API_KEY}&with_genres=${genreId}`
    )
  ).json()

const getMovieImage = (path, format) =>
  `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`

const getDetail = async data =>
  await (await fetch(`${BASE_PATH}/tv/${data.id}?api_key=${API_KEY}`)).json()
/* end utils function */

const dynamicBgImage = (poster_path, backdrop_path) => {
  let bgImage
  let pos
  if (innerWidth < 667) {
    bgImage = poster_path
    pos = 'to top'
  } else {
    bgImage = backdrop_path
    pos = 'to right'
  }
  return { bgImage, pos }
}

const createBanner = data => {
  const banner = document.querySelector('.banner')
  const title = banner.querySelector('.title')
  const overview = banner.querySelector('.overview')
  let { bgImage, pos } = dynamicBgImage(data.poster_path, data.backdrop_path)

  banner.style.backgroundImage = `linear-gradient(${pos}, #100f0f,  #0002), 
    url(${getMovieImage(bgImage)})`
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
  detail.classList.add('no-mobile')

  const totalRating = 10
  let starPercentage = (data.vote_average / totalRating) * 100
  starPercentage = Math.round(starPercentage / 10) * 10
  starsInner.style.width = `${starPercentage}%`
}

const createCard = data => {
  const card = document.createElement('div')
  card.classList.add('card', 'modal-card', 'active')
  paintCard(card, data)

  const deleteBtn = document.createElement('i')
  deleteBtn.classList.add('fas', 'fa-trash')
  deleteBtn.addEventListener('click', e => deleteMovie(e, data))

  card.appendChild(deleteBtn)
  document.querySelector('main .wrapper').appendChild(card)
}

const modal = document.querySelector('.modal')
modal.addEventListener('click', e => {
  if (e.target !== e.currentTarget) return
  modal.classList.remove('modal-active')
})

const createModal = data => {
  const card = document.querySelector('.modal-card')
  paintCard(card, data)

  const addBtn = document.createElement('i')
  addBtn.classList.add('fas', 'fa-plus')
  addBtn.addEventListener('click', () => {
    saveLocalMovies(data)
    modal.classList.remove('modal-active')
  })

  card.appendChild(addBtn)
}

const createMovie = data => {
  const movie = document.createElement('div')
  movies.appendChild(movie)
  movie.classList.add('movie', 'swiper-slide')
  movie.innerHTML = `<img src="${getMovieImage(data.poster_path)}">`

  movie.addEventListener('click', () => {
    modal.classList.add('modal-active')
    createModal(data)
  })
}

const deleteMovie = (e, data) => {
  const card = e.target.parentElement
  card.classList.add('fall')
  card.addEventListener('transitionend', () => card.remove())
  removeLocalMovie(data)
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
/* end search */

/* local storage */
const checkMovie = (movieList, data) =>
  movieList.some(movie => movie.id === data.id)

const getIndex = (movieList, data) => {
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
/* end local storage */
