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

input.addEventListener('input', e => {
  const movies = document.querySelector('.search-movies .wrapper')
  const searchWrapper = movies.parentElement

  movies.textContent = ''
  searchWrapper.classList.add('active')

  if (!e.target.value) {
    searchWrapper.classList.remove('active')
    return
  }

  searchUtils(types, input.value).then(res => {
    if (!res) return
    res.map(({ results }, index) => {
      results = results.slice(0, 20) || results
      results.map(movie => {
        movie = { ...movie, type: types[index] }
        createSearchMovie(movie, movies)
      })
    })
  })

  searchWrapper.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
    movies.textContent = ''
    searchWrapper.classList.remove('active')
  })
})

search.addEventListener('submit', e => {
  e.preventDefault()
})

function createSearchMovie(data, el) {
  const movie = createMovie(data, el)
  if (!movie) return

  const release =
    data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0]
  movie.classList.remove('swiper-slide')
  movie.innerHTML += `<div><h3>${
    data.title || data.name
  }</h3><p>${release}</p></div>`
}
