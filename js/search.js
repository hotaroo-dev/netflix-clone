const search = document.querySelector('form.search')
const searchBtn = search.querySelector('svg')
const input = document.querySelector('input[name="title"]')

window.innerWidth > 860
  ? search.classList.add('active')
  : search.classList.remove('active')

searchBtn.addEventListener('click', () => search.classList.toggle('active'))

const searchMovies = async title =>
  await (
    await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${title}`)
  ).json()

input.addEventListener('keyup', e => {
  const movies = document.querySelector('.search-movies .wrapper')
  const searchWrapper = movies.parentElement
  movies.textContent = ''

  if (!e.target.value) {
    searchWrapper.classList.remove('active')
    return
  }

  searchMovies(input.value).then(({ results }) => {
    if (!results) return
    results.map(movie => {
      createSearchMovie(movie, movies)
    })
  })

  searchWrapper.classList.add('active')
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
  const release = data.release_date?.split('-')[0] || 'unknown year'
  movie.innerHTML += `<div><h3>${data.title}</h3><p>${release}</p></div>`
}
