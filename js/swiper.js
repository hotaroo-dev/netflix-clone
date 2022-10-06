const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  speed: 350,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
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
