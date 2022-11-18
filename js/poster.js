import { getTrending, getGenres, posterAPI } from './modules/utils.js'
import createBanner from './modules/banner.js'
import { pushMovie } from './modules/swiper.js'

getTrending(types[0]).then(({ results }) => {
  createBanner(results[id])
  pushMovie(results, 0, null, title)
})

const getPosterWithGenres = type => {
  getGenres(type).then(({ genres }) =>
    Promise.all(
      genres.slice(0, 6).map(genre => {
        fetch(posterAPI(type, genre.id))
          .then(response => response.ok && response.json())
          .then(({ results }) => {
            if (!results) return

            pushMovie(results, genre.id, type, genre.name)
          })
      })
    )
  )
}

getPosterWithGenres(types[0], id)
