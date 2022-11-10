import {
  getTrending,
  getMovies,
  getUpcoming,
  createMovie
} from './modules/utils.js'
import createBanner from './modules/banner.js'
import createRow from './modules/swiper.js'

const titles = {
  0: 'Top Rated Movies',
  1: 'Popular Movies',
  2: 'Top Rated Tv Shows',
  3: 'Popular Tv Shows',
  4: 'Upcoming',
  5: 'Trending Now'
}

getTrending('all').then(({ results }) => {
  const row = createRow(5, titles[5])
  results.forEach(movie => createMovie(movie, row, 'w300'))
})

getMovies().then(res => {
  const movies = res[0]
  const tv = res[1]
  const all = [...movies, ...tv]
  const banner = { ...movies[0].results[3], type: 'movie' }

  createBanner(banner)

  all.forEach(({ results }, i) => {
    const type = i < 2 ? types[0] : types[1]
    const row = createRow(i, titles[i])
    results.forEach(movie => {
      movie = { ...movie, type }
      createMovie(movie, row, 'w300')
    })
  })
})

getUpcoming().then(({ results }) => {
  const row = createRow(4, titles[4])
  results.forEach(movie => {
    movie = { ...movie, type: types[0] }
    createMovie(movie, row, 'w300')
  })
})
