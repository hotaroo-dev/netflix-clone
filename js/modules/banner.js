import {
  getMovieImage,
  getTrailerVideo,
  paintGenres,
  createModal,
  saveLocalMovies
} from './utils.js'

const banner = document.querySelector('.banner')
const title = banner.querySelector('.title')
const overview = banner.querySelector('.overview')
const playBtn = document.querySelectorAll('#playBtn')
const infoBtn = document.querySelectorAll('#infoBtn')
const addBtn = document.querySelectorAll('#addBtn')

export default function createBanner(data) {
  banner.style.backgroundImage = dynamicBgImage(
    data.poster_path,
    data.backdrop_path
  )
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
      createVideo(data.id, data.type || data.media_type)
    })
  )

  addBtn.forEach(add =>
    add.addEventListener('click', () => saveLocalMovies(data))
  )

  const mediaQuery = window.matchMedia('(min-width: 714px)')
  mediaQuery.addEventListener(
    'change',
    () =>
      (banner.style.backgroundImage = dynamicBgImage(
        data.poster_path,
        data.backdrop_path
      ))
  )
}

function dynamicBgImage(poster_path, backdrop_path) {
  return window.innerWidth < 714
    ? `linear-gradient(to top, #100f0f 10%, rgba(0, 0, 0, 0) 50%), url(${getMovieImage(
        poster_path
      )})`
    : `linear-gradient(to right, #100f0f 5%, rgba(0, 0, 0, 0) 90%), 
    url(${getMovieImage(backdrop_path)})`
}

const video = document.querySelector('iframe')
const createVideo = (id, type) => {
  getTrailerVideo(type, id).then(({ results }) => {
    const videoId =
      trailer ?? results.findIndex(v => v.name.includes('Trailer'))
    body.classList.add('video-active')
    video.src = `https://youtube.com/embed/${results[videoId].key}?autoplay=1&mute=1`
  })
}

const iframeWrapper = document.querySelector('.iframe-wrapper')
iframeWrapper.addEventListener('click', () => {
  body.classList.remove('video-active')
  video.src = ''
})
