let scrolled = false
const header = document.querySelector('.header')

window.addEventListener('scroll', () => (scrolled = true))

setInterval(() => {
  if (!scrolled) return

  scrolled = false
  window.scrollY > 60
    ? header.classList.add('blur')
    : header.classList.remove('blur')
}, 250)

const toggleMode = () => {
  body.classList.toggle('light')
  localStorage.setItem('theme', body.classList.value)
}

const toggleMenu = () =>
  document.querySelector('nav#dropdown').classList.toggle('open')

/* utils function */
const API_KEY = '86783762237ff3e97be67f3473685c59'
const BASE_PATH = 'https://api.themoviedb.org/3'

const getMovies = () =>
  Promise.all(
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

const getTrending = async type =>
  await (
    await fetch(`${BASE_PATH}/trending/${type}/day?api_key=${API_KEY}`)
  ).json()

const getMovieImage = (path, format) =>
  `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`

const getDetail = async (type, id) =>
  await (await fetch(`${BASE_PATH}/${type}/${id}?api_key=${API_KEY}`)).json()

const getVideo = async (type, id) =>
  await (
    await fetch(`${BASE_PATH}/${type}/${id}/videos?api_key=${API_KEY}`)
  ).json()

const getGenres = async type =>
  await (
    await fetch(`${BASE_PATH}/genre/${type}/list?api_key=${API_KEY}`)
  ).json()

const getMovieWithGenres = type => {
  getGenres(type).then(({ genres }) =>
    Promise.all(
      genres.slice(0, 8).map(genre => {
        fetch(
          `${BASE_PATH}/discover/${type}?api_key=${API_KEY}&with_genres=${genre.id}`
        )
          .then(response => response.ok && response.json())
          .then(({ results }) => {
            if (!results) return
            const row = createRow(genre.id, genre.name)
            results.forEach(movie => {
              movie = { ...movie, type }
              createMovie(movie, row, 'w300')
            })
          })
      })
    )
  )
}
/* end utils function */

const totalRating = 10

const starRating = vote => {
  const starPercentage = (vote / totalRating) * 100
  const starPercentageRounded = Math.round(starPercentage / 10) * 10

  let rating = document.createElement('div')
  rating.innerHTML += `<span>${vote}/10</span>`
  rating.classList.add('no-mobile')

  let starsOuter = document.createElement('div')
  let starsInner = document.createElement('div')
  starsOuter.classList.add('stars-outer')
  starsInner.classList.add('stars-inner')
  starsOuter.appendChild(starsInner)
  starsInner.style.width = `${starPercentageRounded}%`
  rating.appendChild(starsOuter)

  return rating
}

const ringRating = vote => {
  const ringPercentage = Math.round((vote / totalRating) * 100)

  let rating = document.createElement('div')
  const circle = '<circle cx="15" cy="15" r="15"></circle>'

  rating.innerHTML = `<svg>${circle}${circle}</svg>`
  rating.innerHTML += `<span>${ringPercentage}</span>`
  rating.classList.add('percent', 'mobile')

  const strokeOffset = 93 - (93 * ringPercentage) / 100
  rating
    .querySelector('svg circle:last-child')
    .style.setProperty('--percent', strokeOffset)

  return rating
}

const paintGenres = data => {
  let ul = document.createElement('ul')
  getDetail(data.media_type || data.type, data.id).then(({ genres }) => {
    const releaseYear = document.createElement('li')
    releaseYear.innerText = `${data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0]
      }`
    ul.appendChild(releaseYear)

    genres.forEach(genre => {
      let li = document.createElement('li')
      const name = genre.name.split(' & ')[0]
      li.innerText = `${name}`
      ul.appendChild(li)
    })
  })

  return ul
}

const paintCard = (data, card) => {
  const vote = data.vote_average
  card.innerHTML = `<img src="${data.poster_path && getMovieImage(data.poster_path, 'w500')
    }">`
  card.innerHTML += `<div><h3>${data.title || data.name}</h3><p>${data.overview
    }</p></div>`
  card.append(ringRating(vote))

  let detail = card.querySelector('div')
  detail.append(paintGenres(data), starRating(vote))
}

const noBgImage = 'linear-gradient(#181818 100%, #000a)'

const createCard = data => {
  const card = document.createElement('div')
  const bg = data.backdrop_path
    ? `linear-gradient(to right, #191919 50%,  #0002),
    url(${getMovieImage(data.backdrop_path, 'w1280')})`
    : noBgImage
  card.style.backgroundImage = bg
  card.classList.add('card')
  paintCard(data, card, data.type)

  const deleteBtn = document.createElement('button')
  deleteBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'

  card.append(deleteBtn)
  card.lastChild.addEventListener('click', e => deleteMovie(e, data))

  document.querySelector('.movie-list .wrapper').appendChild(card)
}

const modal = document.querySelector('.modal')
modal &&
  modal.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
    const card = modal.children[0]
    card.textContent = ''
    card.style.backgroundImage = 'none'
    modal.classList.remove('modal-active')
  })

const dynamicBg = (card, backdrop) => {
  if (window.innerWidth < 561) {
    card.style.backgroundImage = noBgImage
  } else {
    card.style.backgroundImage = backdrop
      ? `linear-gradient(to right, #191919 50%, #0002), url(${getMovieImage(
        backdrop,
        'w1280'
      )})`
      : noBgImage
  }

  return card
}

const createModal = data => {
  modal.classList.add('modal-active')

  const card = document.querySelector('.modal .modal-card')
  dynamicBg(card, data.backdrop_path)
  paintCard(data, card, data.type)

  const mediaQuery = window.matchMedia('(max-width: 560px)')
  mediaQuery.addEventListener('change', () =>
    dynamicBg(card, data.backdrop_path)
  )

  const addBtn = document.createElement('div')
  addBtn.classList.add('fav')
  addBtn.addEventListener('click', () => {
    addBtn.classList.toggle('animate')
    saveLocalMovies(data)

    const main = document.querySelector('main')
    if (main.classList.contains('movie-list')) {
      let titles = main.querySelectorAll('.card > div > h3')
      let isMovie = false
      titles.forEach(t => {
        const title = data.title || data.name
        if (t.textContent === title) isMovie = true
      })
      !isMovie && createCard(data)
    }
  })

  card.appendChild(addBtn)
}

const createMovie = (data, el, format) => {
  if (!data.poster_path) return

  const movie = document.createElement('div')
  el.appendChild(movie)
  movie.classList.add('movie', 'swiper-slide')
  movie.innerHTML = `<img src="${data.poster_path && getMovieImage(data.poster_path, format)
    }">`

  movie.addEventListener('click', () => createModal(data))

  return movie
}

function deleteMovie(e, data) {
  const card = e.currentTarget.parentElement
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
