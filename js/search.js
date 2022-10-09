const search = document.querySelector('form.search')
const searchBtn = search.querySelector('svg')
const input = document.querySelector('input[name="title"]')

searchBtn.addEventListener('click', () => search.classList.toggle('active'))

const searchMovies = async title =>
  await (
    await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${title}`)
  ).json()

search.addEventListener('submit', e => {
  e.preventDefault()
  const movies = document.querySelector('.search-movies .wrapper')
  movies.innerHTML = ''
  searchMovies(input.value).then(({ results }) => {
    results.splice(0, 5).map(movie => {
      createSearchMovie(movie, movies)
    })
  })

  movies.style.opacity = 1
  input.value = ''
})

function createSearchMovie(data, el) {
  const movie = createMovie(data, el)
  const release = data.release_date.split('-')[0]
  movie.innerHTML += `<div><h3>${data.title}</h3><p>${release}</p></div>`
}
