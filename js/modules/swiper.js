import { createMovie } from './utils.js'

function swiperInit(index) {
  const swiper = document.createElement('div')
  const swiperWrapper = document.createElement('div')
  swiper.appendChild(swiperWrapper)

  const row = document.createElement('div')
  row.setAttribute('id', `row${index}`)
  row.append(swiper)
  document.querySelector('main > div').appendChild(row)

  swiper.classList.add(`swiper`)
  swiperWrapper.setAttribute('id', `swiper${index}`)
  swiperWrapper.classList.add('swiper-wrapper', 'movies')

  new Swiper(`.swiper`, {
    direction: 'horizontal',
    grabCursor: true,
    speed: 250,
    spaceBetween: 10,
    breakpoints: {
      220: {
        slidesPerView: 2.5
      },
      365: {
        slidesPerView: 3.5
      },
      480: {
        slidesPerView: 4.5
      },
      640: {
        slidesPerView: 5.5
      },
      812: {
        slidesPerView: 6.5
      },
      1024: {
        slidesPerView: 7.5
      },
      1100: {
        slidesPerView: 8.5
      },
      1250: {
        slidesPerView: 9.5
      },
      1500: {
        slidesPerView: 10.5
      }
    }
  })
  return row
}

function createRow(index, title) {
  const row = swiperInit(index)

  const titleEl = document.createElement('h1')
  titleEl.textContent = `${title}`
  row.prepend(titleEl)

  return row.querySelector(`#swiper${index}`)
}

export const pushMovie = (movies, rNum, type, title) => {
  const row = createRow(rNum, title)
  movies.forEach(movie =>
    createMovie(type ? { ...movie, type } : movie, row, 'w300')
  )
}
