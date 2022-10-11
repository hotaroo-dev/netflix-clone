const homePath = document.querySelector('#home a.active')
const moviePath = document.querySelector('#movies a.active')
const tvPath = document.querySelector('#series a.active')

const createBanner = data => {
  const banner = document.querySelector('.banner')
  const title = banner.querySelector('.title')
  const overview = banner.querySelector('.overview')
  let { bgImage, pos } = dynamicBgImage(data.poster_path, data.backdrop_path)

  banner.style.backgroundImage = `linear-gradient(${pos}, #100f0f, rgba(0, 0, 0, 0.0)), 
    url(${getMovieImage(bgImage)})`
  title.innerHTML = `<h2>${data.title || data.name}</h2>`
  overview.innerHTML = `<p>${data.overview}</p>`

  window.addEventListener('resize', () => {
    window.innerWidth > 860
      ? search.classList.add('active')
      : search.classList.remove('active')

    homePath && dynamicBanner(data)
    moviePath && dynamicBanner(data)
    tvPath && dynamicBanner(data)
  })
}

function dynamicBanner(data) {
  const { bgImage, pos } = dynamicBgImage(data.poster_path, data.backdrop_path)
  document.querySelector(
    '.banner'
  ).style.backgroundImage = `linear-gradient(${pos}, #100f0f, rgba(0, 0, 0, 0)), 
    url(${getMovieImage(bgImage)})`
}

function dynamicBgImage(poster_path, backdrop_path) {
  let bgImage
  let pos
  if (innerWidth < 713) {
    bgImage = poster_path
    pos = 'to top'
  } else {
    bgImage = backdrop_path
    pos = 'to right'
  }
  return { bgImage, pos }
}
