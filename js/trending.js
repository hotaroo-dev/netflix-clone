getTrending(types[0]).then(({ results }) => {
  const banner = results[id]
  const row = createRow(0, `${text}`)

  createBanner(banner)
  results.forEach(movie => createMovie(movie, row, 'w300'))
})

getMovieWithGenres(types[0], id)
