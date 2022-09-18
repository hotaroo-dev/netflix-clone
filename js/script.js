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
      fetch(`${BASE_PATH}/${id}/popular?api_key=${API_KEY}`).then(response =>
        response.json()
      )
    )
  )
}

const getMovieImage = (path, format) => {
  return `https://image.tmdb.org/t/p/${format ? format : 'original'}${path}`
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

const createCard = data => {
  const card = document.createElement('div')
  movies.appendChild(card)
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
    console.log(data)
    data.genres.map((genre, i, arr) => {
      let li = document.createElement('li')
      li.innerText = arr.length - 1 === i ? `${genre.name}` : `${genre.name},`
      ul.appendChild(li)
    })
  })
  detail.appendChild(ul)

  series.querySelector('span').addEventListener('click', () => {
    modal.classList.remove('active')
    series.style.opacity = 0
  })
}

const modal = document.querySelector('.modal')
const createMovie = data => {
  const movie = document.createElement('div')
  movies.appendChild(movie)
  movie.classList.add('movie')
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

  homePath.classList.contains('active') && createBanner(movie.results[10])
  if (tvPath.classList.contains('active')) {
    createBanner(tv.results[9])
    createCard(tv.results[9])
    tv.results.splice(0, 5).map(movie => createMovie(movie))
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
