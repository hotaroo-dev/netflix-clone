import {
  getTrending,
  getGenres,
  posterAPI,
  createMovie
} from './modules/utils.js'
import createBanner from './modules/banner.js'
import createRow from './modules/swiper.js'

getTrending(types[0]).then(({ results }) => {
  const banner = results[id]
  const row = createRow(0, `${text}`)

  createBanner(banner)
  results.forEach(movie => createMovie(movie, row, 'w300'))
})

const getPosterWithGenres = type => {
  getGenres(type).then(({ genres }) =>
    Promise.all(
      genres.slice(0, 6).map(genre => {
        fetch(posterAPI(type, genre.id))
          .then(response => response.ok && response.json())
          .then(({ results }) => {
            if (!results) return
            const row = createRow(genre.id, genre.name)
            results.forEach(movie => {
              movie = { ...movie, type }
              createMovie(movie, row, 'w300')
            })
          })
      })
    )
  )
}

getPosterWithGenres(types[0], id)
