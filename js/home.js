const titles = {
  0: 'Top rated Movies',
  1: 'Popular Movies',
  2: 'Top rated Tv Shows',
  3: 'Popular Tv Show'
}

let homeId = 1
getMovies().then(res => {
  const movies = res[0]
  const tv = res[1]

  createBanner(movies[1].results[homeId])

  movies.map(({ results }, index) => {
    const row = createRow(index, titles[index])
    results.map(movie => createMovie(movie, row))
  })

  tv.map(({ results }, index) => {
    index += 2
    const row = createRow(index, titles[index])
    results.map(tv => createMovie(tv, row))
  })
})
