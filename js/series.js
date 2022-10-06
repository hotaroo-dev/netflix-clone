getMovies().then(res => {
  const tv = res[1]
  createBanner(tv.results[id])
  tv.results.map(movie => createMovie(movie))

  getGenres('tv').then(({ genres }) => {
    const ul = document.querySelector('ul.genres')
    genres.splice(1, 8).map(genre => {
      const li = document.createElement('li')
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

        ul.appendChild(li)
      })
    })
  })
})

document
  .querySelector('ul.genres')
  .addEventListener('click', () =>
    document.querySelector('.swiper').swiper.slideTo(0)
  )
