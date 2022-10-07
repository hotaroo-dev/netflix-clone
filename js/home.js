getMovies('movie').then(res => {
  createBanner(res[1].results[ID])
  res.map((movies, index) => {
    swiperInit(index)
    const movieRow = document.querySelector(`#row${index}`)
    movies.results.map(movie => {
      createMovie(movie, movieRow)
    })
  })
})
