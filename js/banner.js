const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')

/*
window.addEventListener('resize', () => {
  getMovies().then(response => {
    const movie = response[0]
    const tv = response[1]
    let moiveBanner = homePath.classList.contains('active') && movie.results[id]
    let tvBanner = tvPath.classList.contains('active') && tv.results[id]

    const poster = moiveBanner.poster_path || tvBanner.poster_path
    const backdrop = moiveBanner.backdrop_path || tvBanner.backdrop_path
    const { bgImage, pos, brightness } = dynamicBgImage(poster, backdrop)

    document.querySelector(
      '.banner'
    ).style.backgroundImage = `linear-gradient(${pos}, #100f0f 5%, ${brightness}), 
    url(${getMovieImage(bgImage)})`
  })
})
*/
