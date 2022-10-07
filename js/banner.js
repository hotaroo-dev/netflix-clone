const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')

window.addEventListener('resize', () => {
  homePath.classList.contains('active') && dynamicBanner('movie')
  tvPath.classList.contains('active') && dynamicBanner('tv')
})

function dynamicBanner(id) {
  getMovies(id).then(res => {
    const banner = res[1].results[ID]
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
