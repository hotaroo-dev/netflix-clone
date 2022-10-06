getMovies().then(res => {
  const movies = res[0]
  createBanner(movies.results[id])
  movies.results.map(movie => createMovie(movie))
})
