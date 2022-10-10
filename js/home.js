const titles = {
  0: 'Top rated Movies',
  1: 'Popular Movies',
  2: 'Top rated Tv Shows',
  3: 'Popular Tv Show'
}

getMovies().then(res => {
  const movies = res[0]
  const tv = res[1]
  let homeId = 1

  createBanner(movies[1].results[homeId])

  movies.map(({ results }, index) => {
    const row = createRow(index, titles)
    results.map(movie => createMovie(movie, row))
  })

  tv.map(({ results }, index) => {
    const row = createRow(index + 2, titles)
    results.map(tv => createMovie(tv, row))
  })
})

function createRow(index, titles) {
  swiperInit(index)

  const row = document.querySelector(`#row${index}`)
  const title = document.createElement('h1')
  title.innerHTML = `${titles[index]}`

  row.prepend(title)

  return row.querySelector(`#swiper${index}`)
}
