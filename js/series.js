const tvId = 1

getTrending('tv').then(({ results }) => {
  const row = createRow(0, 'Trending Series')
  results.map(movie => createMovie(movie, row))
  createBanner(results[tvId])
})

getMovieWithGenres('tv', tvId)
