getTrending(types[0]).then(({ results }) => {
  const banner = results[id]
  const row = createRow(0, `${text}`)
  results.map(movie => createMovie(movie, row))
  createBanner(banner)

  const watchBtn = document.querySelector('.btn-wrapper .watch')
  watchBtn.addEventListener('click', () =>
    createVideo(types[0], banner.id, videoId)
  )
})

getMovieWithGenres(types[0], id)
