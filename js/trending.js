const infoBtn = document.querySelector('.btn-wrapper .info')

getTrending(types[0]).then(({ results }) => {
  const banner = results[id]
  const row = createRow(0, `${text}`)

  createBanner(banner)
  results.forEach(movie => createMovie(movie, row, 'w300'))

  infoBtn.addEventListener('click', () => createModal(banner))
})

getMovieWithGenres(types[0], id)
