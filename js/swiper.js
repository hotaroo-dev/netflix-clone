function swiperInit(index) {
  const swiper = document.createElement('div')
  const swiperWrapper = document.createElement('div')
  swiper.appendChild(swiperWrapper)

  const row = document.createElement('div')
  row.setAttribute('id', `row${index}`)
  row.append(swiper)
  document.querySelector('main').appendChild(row)

  swiper.classList.add(`swiper`)
  swiperWrapper.setAttribute('id', `swiper${index}`)
  swiperWrapper.classList.add('swiper-wrapper', 'movies')

  return new Swiper(`.swiper`, {
    direction: 'horizontal',
    speed: 350,
    breakpoints: {
      320: {
        slidesPerView: 3.5,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 4,
        spaceBetween: 14
      },
      560: {
        slidesPerView: 4.5,
        spaceBetween: 14
      },
      812: {
        slidesPerView: 5,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 20
      },
      1100: {
        slidesPerView: 7,
        spaceBetween: 20
      },
      1250: {
        slidesPerView: 8,
        spaceBetween: 25
      }
    }
  })
}
