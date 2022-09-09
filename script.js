const api_key = '86783762237ff3e97be67f3473685c59'
const getMovies = async () => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}`)  
  const { results }= await response.json()

  const movies = document.getElementById('movies')
  results.map(({ poster_path, title}) => {
    const movie = document.createElement('div')
    movies.appendChild(movie)
    movie.classList.add('movie')
    movie.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${poster_path}">`
    movie.innerHTML += `<h3>${title}</h3>`
  })
}

getMovies()
