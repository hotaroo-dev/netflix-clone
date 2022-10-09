getMovies('tv').then(res => {
  const tv = [...res[1].results, ...res[0].results]
  createBanner(tv[tvId])

  swiperInit(0)
  const movieRow = document.querySelector('#row0')
  tv.map(movie => createMovie(movie, movieRow))
})

document
  .querySelector('ul.genres')
  .addEventListener('click', () =>
    document.querySelector('.swiper').swiper.slideTo(0)
  )
