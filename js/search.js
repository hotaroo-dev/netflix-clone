const search = document.querySelector('form.search')
const searchBtn = search.querySelector('svg')
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

input.addEventListener('keyup', e => {
  const movies = document.querySelector('.search-movies .wrapper')
  const searchWrapper = movies.parentElement
  searchWrapper.classList.add('active')

  movies.textContent = ''

  if (!e.target.value) {
    searchWrapper.classList.remove('active')
    return
  }

  searchUtils(types, input.value).then(res => {
    if (!res) return
    res.map(({ results }, index) => {
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
  input.value = ''
})

function createSearchMovie(data, el) {
  const movie = createMovie(data, el)
  const release =
    data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0]
  movie.classList.remove('swiper-slide')
  movie.innerHTML += `<div><h3>${data.title || data.name
    }</h3><p>${release}</p></div>`
}
