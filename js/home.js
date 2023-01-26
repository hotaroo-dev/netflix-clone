import { getTrending, getMovies, getUpcoming } from './modules/utils.js'
import createBanner from './modules/banner.js'
import { pushMovie } from './modules/swiper.js'

const titles = {
  0: 'Top Rated Movies',
  1: 'Popular Movies',
  2: 'Top Rated Tv Shows',
  3: 'Popular Tv Shows',
  4: 'Upcoming',
  5: 'Trending Now'
}

getTrending('all').then(({ results }) => pushMovie(results, 5, null, titles[5]))

getMovies().then(res => {
  const movies = res[0]
  const tv = res[1]
  const all = [...movies, ...tv]

  createBanner({ ...movies[0].results[8], type: 'movie' })

  all.forEach(({ results }, i) => {
    const type = i < 2 ? types[0] : types[1]
    pushMovie(results, i, type, titles[i])
  })
})

getUpcoming().then(({ results }) => pushMovie(results, 4, 'movie', titles[4]))
