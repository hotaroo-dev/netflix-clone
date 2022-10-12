const movieId = 16

getTrending('movie').then(({ results }) => {
  const row = createRow(0, 'Trending Movies')
  results.map(movie => createMovie(movie, row))
  createBanner(results[movieId])
})

getMovieWithGenres('movie', movieId)
