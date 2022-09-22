window.addEventListener('scroll', () => {
  const header = document.querySelector('.header')
  const scrollY = window.scrollY
  if (scrollY > 60) {
    header.style.backgroundColor = '#100f0f'
  } else {
    header.style.backgroundColor = 'rgba(0, 0, 0, 0)'
  }
})

const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  slidesPerView: 5.05,
  spaceBetween: 25,
  speed: 400,
  loop: true
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

getGenres('tv').then(({ genres }) =>
  genres.splice(1, 8).map(genre => {
    console.log(genre)
    const li = document.createElement('li')
    li.innerHTML = `<a href="#">${genre.name}</a>`
    document.querySelector('ul.genres').appendChild(li)
  })
)

const getMovieImage = (path, format) => {
  return `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`
}

const createBanner = data => {
  const banner = document.querySelector('.banner')
  const title = banner.querySelector('.title')
  const overview = banner.querySelector('.overview')

  banner.style.backgroundImage = `linear-gradient(to right, #100f0f 20%,  #0002), 
    url(${getMovieImage(data.backdrop_path)})`
  title.innerHTML = `<h2>${data.title || data.name}</h2>`
  overview.innerHTML = `<p>${data.overview}</p>`
}

const createCard = data => {
  const card = document.createElement('div')
  document.querySelector('main').appendChild(card)
  card.classList.add('card')
  card.innerHTML = `<img src="${getMovieImage(data.poster_path)}">`
  card.innerHTML += `<p>${data.overview}</p>`
}

const getDetail = async data => {
  return await (
    await fetch(`${BASE_PATH}/tv/${data.id}?api_key=${API_KEY}`)
  ).json()
}

const createModal = (e, data) => {
  const series = document.querySelector('.modal-series')
  series.style.opacity = 1
  series.style.backgroundImage = `linear-gradient(to right, #191919 50%,  #0002),
    url(${getMovieImage(data.backdrop_path, 'w500')})`
  series.innerHTML = `<img src="${e.target.src}">`
  series.innerHTML += '<span>&times;</span>'
  series.innerHTML += `<div><h3>${data.name}</h3><p>${data.overview}</p></div>`

  let detail = series.querySelector('div')

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
  detail.appendChild(ul)

  /* rating */
  let rating = document.createElement('div')
  rating.innerHTML += `<span>${data.vote_average}/10</span>`

  let starsOuter = document.createElement('div')
  let starsInner = document.createElement('div')
  starsOuter.classList.add('stars-outer')
  starsInner.classList.add('stars-inner')
  starsOuter.appendChild(starsInner)
  rating.appendChild(starsOuter)
  detail.appendChild(rating)

  const totalRating = 10
  let starPercentage = (data.vote_average / totalRating) * 100
  starPercentage = Math.round(starPercentage / 10) * 10
  starsInner.style.width = `${starPercentage}%`

  series.querySelector('span').addEventListener('click', () => {
    modal.classList.remove('active')
    series.style.opacity = 0
  })
}

const modal = document.querySelector('.modal')
const createMovie = data => {
  const movie = document.createElement('div')
  movies.appendChild(movie)
  movie.classList.add('movie', 'swiper-slide')
  movie.innerHTML = `<img src="${getMovieImage(data.poster_path)}">`

  movie.addEventListener('click', e => {
    modal.classList.add('active')
    createModal(e, data)
  })
}

const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')

getMovies().then(response => {
  const movie = response[0]
  const tv = response[1]

  homePath.classList.contains('active') && createBanner(movie.results[13])
  if (tvPath.classList.contains('active')) {
    createBanner(tv.results[8])
    createCard(tv.results[8])
    tv.results.map(movie => createMovie(movie))
  }
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

search.addEventListener('submit', e => {
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
  input.value = ''
})
