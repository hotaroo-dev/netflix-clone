const homePath = document.querySelector('#home a.active')
const moviePath = document.querySelector('#movies a.active')
const tvPath = document.querySelector('#series a.active')

const banner = document.querySelector('.banner')
const title = banner.querySelector('.title')
const overview = banner.querySelector('.overview')

const playBtn = document.querySelectorAll('#playBtn')
const infoBtn = document.querySelectorAll('#infoBtn')
const addBtn = document.querySelectorAll('#addBtn')

const createBanner = data => {
  dynamicBgImage(data.poster_path, data.backdrop_path)

  banner.style.backgroundImage = bgImage
  title.textContent = `${data.title || data.name}`
  overview.textContent = `${data.overview}`

  document.querySelector('.banner-genres').append(paintGenres(data))

  infoBtn.forEach(info =>
    info.addEventListener('click', e => {
      e.preventDefault()
      createModal(data)
    })
  )

  playBtn.forEach(play =>
    play.addEventListener('click', e => {
      e.preventDefault()
      createVideo(types[0], data.id, videoId)
    })
  )

  addBtn.forEach(add =>
    add.addEventListener('click', () => saveLocalMovies(data))
  )

  const mediaQuery = window.matchMedia('(min-width: 714px)')
  mediaQuery.addEventListener('change', () => {
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
    window.innerWidth < 714
      ? `linear-gradient(to top, #100f0f 10%, rgba(0, 0, 0, 0) 50%), url(${getMovieImage(
          poster_path
        )})`
      : `linear-gradient(to right, #100f0f 5%, rgba(0, 0, 0, 0) 90%), 
    url(${getMovieImage(backdrop_path)})`)
}

const video = document.querySelector('iframe')
const createVideo = (type, id, videoId) => {
  getVideo(type, id).then(({ results }) => {
    console.log(results)
    body.classList.add('video-active')
    video.src = `https://youtube.com/embed/${results[videoId].key}?autoplay=1&mute=1`
  })
}

const iframeWrapper = document.querySelector('.iframe-wrapper')
iframeWrapper.addEventListener('click', () => {
  body.classList.remove('video-active')
  video.src = ''
})
