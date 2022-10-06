getMovies('movie').then(res => {
  createBanner(res[0].results[ID])
  res.map((movies, id) => {
    swiperInit(id)
    const movieRow = document.querySelector(`#row${id}`)
    movies.results.map(movie => {
      createMovie(movie, movieRow)
    })
  })
})
