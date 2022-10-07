const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')
const movieId = 1
const tvId = 14

window.addEventListener('resize', () => {
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
    ).style.backgroundImage = `linear-gradient(${pos}, #100f0f 5%, ${brightness}), 
      url(${getMovieImage(bgImage)})`
  })
}
