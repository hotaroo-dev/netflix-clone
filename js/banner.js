const homePath = document.querySelector('#home a.active')
const moviePath = document.querySelector('#movies a.active')
const tvPath = document.querySelector('#series a.active')

const banner = document.querySelector('.banner')
const title = banner.querySelector('.title')
const overview = banner.querySelector('.overview')

const createBanner = data => {
  dynamicBgImage(data.poster_path, data.backdrop_path)

  banner.style.backgroundImage = bgImage
  title.textContent = `${data.title || data.name}`
  overview.textContent = `${data.overview}`

  !homePath && document.querySelector('.banner-genres').append(paintGenres(data))

  window.addEventListener('resize', () => {
    console.log('resize')
    homePath && dynamicBanner(data)
    moviePath && dynamicBanner(data)
    tvPath && dynamicBanner(data)
  })
}

function dynamicBanner(data) {
  dynamicBgImage(data.poster_path, data.backdrop_path)
  document.querySelector('.banner').style.backgroundImage = bgImage
}

function dynamicBgImage(poster_path, backdrop_path) {
  return (bgImage =
    window.innerWidth < 713
      ? `linear-gradient(to top, #100f0f 8%, rgba(0, 0, 0, 0) 50%), url(${getMovieImage(poster_path)})`
      : `linear-gradient(to right, #100f0f 5%, rgba(0, 0, 0, 0) 90%), 
    url(${getMovieImage(backdrop_path)})`)
}
