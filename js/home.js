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
  results.forEach(movie => createMovie(movie, row, 'w300'))
})

const playBtn = document.querySelector('.btn-wrapper .play')
const addBtn = document.querySelector('.btn-wrapper .list')

getMovies().then(res => {
  const movies = res[0]
  const tv = res[1]
  const all = [...movies, ...tv]
  const banner = movies[1].results[id]
  createBanner(banner)

  playBtn.addEventListener('click', () => createVideo('movie', banner.id, 2))
  addBtn.addEventListener('click', () =>
    saveLocalMovies({ ...banner, type: 'movie' })
  )

  all.forEach(({ results }, index) => {
    const type = index < 2 ? types[0] : types[1]
    const row = createRow(index, titles[index])
    results.forEach(movie => {
      movie = { ...movie, type }
      createMovie(movie, row, 'w300')
    })
  })
})
