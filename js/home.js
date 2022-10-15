const titles = {
  0: 'Top Rated Movies',
  1: 'Popular Movies',
  2: 'Top Rated Tv Shows',
  3: 'Popular Tv Shows',
  4: 'Trending Now'
}

let id = 1
const types = ['movie', 'tv']

getTrending('all').then(({ results }) => {
  const row = createRow(4, titles[4])
  results.map(movie => createMovie(movie, row))
})

getMovies().then(res => {
  const movies = res[0]
  const tv = res[1]
  const all = [...movies, ...tv]

  createBanner(movies[1].results[id])

  all.map(({ results }, index) => {
    const type = index < 2 ? types[0] : types[1]
    const row = createRow(index, titles[index])
    results.map(movie => {
      movie = { ...movie, type }
      createMovie(movie, row)
    })
  })
})
