getTrending(types[0]).then(({ results }) => {
  const row = createRow(0, `${text}`)
  results.map(movie => createMovie(movie, row))
  createBanner(results[id])
})

getMovieWithGenres(types[0], id)
