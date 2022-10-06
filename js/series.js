getMovies('tv').then(res => {
  const tv = [...res[0].results, ...res[1].results]
  createBanner(tv[ID])

  swiperInit(0)
  const movieRow = document.querySelector('#row0')
  tv.map(movie => createMovie(movie, movieRow))

  getGenres('tv').then(({ genres }) => {
    const ul = document.querySelector('ul.genres')
    genres.splice(1, 8).map(genre => {
      const li = document.createElement('li')
      ul.appendChild(li)
      li.innerHTML = `<a href="#">${genre.name}</a>`
      li.addEventListener('click', e => {
        e.preventDefault()
        const activeEl = ul.querySelector('li.active')
        activeEl && activeEl.classList.remove('active')
        li.classList.add('active')

        getMoviesWithGenre('tv', genre.id).then(data => {
          movies.innerHTML = ''
          data.results.map(poster => createMovie(poster))
        })
      })
    })
  })
})

document
  .querySelector('ul.genres')
  .addEventListener('click', () =>
    document.querySelector('.swiper').swiper.slideTo(0)
  )
