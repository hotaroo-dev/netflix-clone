const search = document.querySelector('form.search')
const searchBtn = search.querySelector('form svg')
const input = document.querySelector('input[name="title"]')

searchBtn.addEventListener('click', () => search.classList.toggle('active'))

const searchUtils = (types, title) =>
  Promise.all(
    types.map(type =>
      fetch(
        `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${title}`
      ).then(res => res.json())
    )
  )

const movies = document.querySelector('.search-movies .wrapper')
const searchWrapper = movies.parentElement

input.addEventListener('focus', () => {
  movies.firstChild && searchWrapper.classList.add('active')
})

input.addEventListener('input', e => {
  const closeBtn = document.querySelector('svg.close-btn')

  movies.textContent = ''
  searchWrapper.classList.add('active')

  if (!e.target.value) {
    searchWrapper.classList.remove('active')
    closeBtn.classList.remove('active')
    return
  }

  closeBtn.classList.add('active')
  closeBtn.addEventListener('click', () => {
    e.target.value = ''
    movies.textContent = ''
    searchWrapper.classList.remove('active')
    closeBtn.classList.remove('active')
  })

  searchUtils(types, input.value).then(res => {
    movies.textContent = ''
    res.forEach(({ results }, index) => {
      if (results.length === 0) return

      results = results.slice(0, 18) || results
      results.forEach(movie => {
        movie = { ...movie, type: types[index] }
        createSearchMovie(movie, movies)
      })
    })
  })

  searchWrapper.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
    searchWrapper.classList.remove('active')
  })
})

search.addEventListener('submit', e => {
  e.preventDefault()
})

function createSearchMovie(data, el) {
  const movie = createMovie(data, el, 'w154')
  if (!movie) return

  const release =
    data.release_date?.split('-')[0] ||
    data.first_air_date?.split('-')[0] ||
    'unknown year'
  movie.classList.remove('swiper-slide')
  movie.innerHTML += `<div><h3>${
    data.title || data.name
  }</h3><p>${release}</p></div>`
}
