const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')
const movieId = 1
const tvId = 5

window.addEventListener('resize', () => {
  window.innerWidth > 800
    ? search.classList.add('active')
    : search.classList.remove('active')

  homePath.classList.contains('active') && dynamicBanner('movie', movieId)
  tvPath.classList.contains('active') && dynamicBanner('tv', tvId)
})

function dynamicBanner(type, id) {
  getMovies(type).then(res => {
    const banner = res[1]?.results[id]
    const { bgImage, pos, brightness } = dynamicBgImage(
      banner.poster_path,
      banner.backdrop_path
    )
    document.querySelector(
      '.banner'
    ).style.backgroundImage = `linear-gradient(${pos}, #100f0f, ${brightness}), 
      url(${getMovieImage(bgImage)})`
  })
}

function dynamicBgImage(poster_path, backdrop_path) {
  let bgImage
  let pos
  let brightness
  if (innerWidth < 667) {
    bgImage = poster_path
    pos = 'to top'
    brightness = 'rgba(0, 0, 0, 0)'
  } else {
    bgImage = backdrop_path
    pos = 'to right'
    brightness = '#0002'
  }
  return { bgImage, pos, brightness }
}
