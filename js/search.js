const search = document.querySelector('form.search')
const searchBtn = search.querySelector('svg')
const input = document.querySelector('input[name="title"]')

window.innerWidth > 800
  ? search.classList.add('active')
  : search.classList.remove('active')

searchBtn.addEventListener('click', () => search.classList.toggle('active'))

const searchMovies = async title =>
  await (
    await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${title}`)
  ).json()

input.addEventListener('keyup', e => {
  if (!e.target.value) return

  const movies = document.querySelector('.search-movies .wrapper')
  movies.innerHTML = ''
  searchMovies(input.value).then(({ results }) => {
    if (!results) return
    results.map(movie => {
      createSearchMovie(movie, movies)
    })
  })

  const searchWrapper = movies.parentElement
  searchWrapper.classList.add('active')
  searchWrapper.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
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
