const homePath = document.querySelector('#home a')
const tvPath = document.querySelector('#series a')

const createBanner = data => {
  const banner = document.querySelector('.banner')
  const title = banner.querySelector('.title')
  const overview = banner.querySelector('.overview')
  let { bgImage, pos, brightness } = dynamicBgImage(
    data.poster_path,
    data.backdrop_path
  )

  banner.style.backgroundImage = `linear-gradient(${pos}, #100f0f,  ${brightness}), 
    url(${getMovieImage(bgImage)})`
  title.innerHTML = `<h2>${data.title || data.name}</h2>`
  overview.innerHTML = `<p>${data.overview}</p>`

  window.addEventListener('resize', () => {
    window.innerWidth > 800
      ? search.classList.add('active')
      : search.classList.remove('active')

    homePath.classList.contains('active') && dynamicBanner(data)
  })
}

function dynamicBanner(data) {
  const { bgImage, pos, brightness } = dynamicBgImage(
    data.poster_path,
    data.backdrop_path
  )
  document.querySelector(
    '.banner'
  ).style.backgroundImage = `linear-gradient(${pos}, #100f0f, ${brightness}), 
    url(${getMovieImage(bgImage)})`
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
