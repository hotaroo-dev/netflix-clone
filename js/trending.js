getTrending(types[0]).then(({ results }) => {
  const row = createRow(0, `${text}`)
  results.map(movie => createMovie(movie, row))
  createBanner(results[id])

  const watchBtn = document.querySelector('.btn-wrapper .watch')
  watchBtn.addEventListener('click', () => {
    getVideo(types[0], results[id].id).then(({ results }) => {
      const video = document.querySelector('iframe#trailer')
      video.parentElement.classList.add('video-active')
      video.src = `https://youtube.com/embed/${results[videoId].key}`
    })
  })
})

getMovieWithGenres(types[0], id)

const iframeWrapper = document.querySelector('.iframe-wrapper')
iframeWrapper.addEventListener('click', e => {
  iframeWrapper.classList.remove('video-active')
  const video = iframeWrapper.children[0]
  video.setAttribute('src', '')
})
