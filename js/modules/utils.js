const API_KEY = '86783762237ff3e97be67f3473685c59'
const BASE_PATH = 'https://api.themoviedb.org/3'

/* utils function */
export const getMovies = () =>
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

export const getTrending = async type =>
  await (
    await fetch(`${BASE_PATH}/trending/${type}/day?api_key=${API_KEY}`)
  ).json()

export const getUpcoming = async () =>
  await (
    await fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&with_genres=16`)
  ).json()

export const getTrailerVideo = async (type, id) =>
  await (
    await fetch(`${BASE_PATH}/${type}/${id}/videos?api_key=${API_KEY}`)
  ).json()

export const getMovieImage = (path, format) =>
  `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`

export const getGenres = async type =>
  await (
    await fetch(`${BASE_PATH}/genre/${type}/list?api_key=${API_KEY}`)
  ).json()

export const searchAPI = (type, title) =>
  `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${title}`

export const posterAPI = (type, id) =>
  `${BASE_PATH}/discover/${type}?api_key=${API_KEY}&with_genres=${id}`

const getDetail = async (type, id) =>
  await (await fetch(`${BASE_PATH}/${type}/${id}?api_key=${API_KEY}`)).json()
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

export const paintGenres = data => {
  let ul = document.createElement('ul')
  getDetail(data.media_type || data.type, data.id).then(({ genres }) => {
    const releaseYear = document.createElement('li')
    releaseYear.innerText = `${
      data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0]
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
  card.innerHTML = `<img src="${
    data.poster_path && getMovieImage(data.poster_path, 'w342')
  }">`
  card.innerHTML += `<div><h3>${data.title || data.name}</h3><p>${
    data.overview
  }</p></div>`
  card.append(ringRating(vote))

  let detail = card.querySelector('div')
  detail.append(paintGenres(data), starRating(vote))
}

const noBgImage = 'linear-gradient(#181818 100%, #000a)'

export const createCard = data => {
  const card = document.createElement('div')
  const bg = data.backdrop_path
    ? `linear-gradient(to right, #191919 50%,  #0002),
    url(${getMovieImage(data.backdrop_path, 'w1280')})`
    : noBgImage
  card.style.backgroundImage = bg
  card.classList.add('card')
  paintCard(data, card)

  const deleteBtn = document.createElement('button')
  deleteBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'
  deleteBtn.addEventListener('click', e => deleteMovie(e, data))

  card.append(deleteBtn)
  document.querySelector('.movie-list .wrapper').appendChild(card)
}

export const modal = document.querySelector('.modal')
modal.addEventListener('click', e => {
  if (e.target !== e.currentTarget) return
  modal.classList.remove('modal-active')
})

export const createModal = data => {
  const card = document.querySelector('.modal .modal-card')
  card.style.backgroundImage = data.backdrop_path
    ? `linear-gradient(to right, #191919 50%, #0002), url(${getMovieImage(
        data.backdrop_path,
        'w1280'
      )})`
    : noBgImage

  paintCard(data, card)

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
  modal.classList.add('modal-active')
}

export const createMovie = (data, el, format) => {
  if (!data.poster_path) return

  const movie = document.createElement('div')
  el.appendChild(movie)
  movie.classList.add('movie', 'swiper-slide')
  movie.innerHTML = `<img src="${
    data.poster_path && getMovieImage(data.poster_path, format)
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
export function checkLocalMovies() {
  if (localStorage.getItem('movie-list') === null) return []
  return JSON.parse(localStorage.getItem('movie-list'))
}

export function saveLocalMovies(movie) {
  const movieList = checkLocalMovies()

  // check if movie is in movieList
  if (movieList.some(m => m.id === movie.id)) return

  movieList.push(movie)
  localStorage.setItem('movie-list', JSON.stringify(movieList))
}

function removeLocalMovie(movie) {
  const movieList = checkLocalMovies()

  // get index of movie to remove using splice function
  const index = movieList.findIndex(m => m.id === movie.id)
  movieList.splice(index, 1)
  localStorage.setItem('movie-list', JSON.stringify(movieList))
}
/* end local storage */
