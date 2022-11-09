let scrolled = false
const header = document.querySelector('.header')

window.addEventListener('scroll', () => (scrolled = true))

setInterval(() => {
  if (!scrolled) return

  scrolled = false
  window.scrollY > 60
    ? header.classList.add('blur')
    : header.classList.remove('blur')
}, 250)

const logo = document.querySelectorAll('#logo')
logo.forEach(l =>
  l.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  )
)

const toggleMode = () => {
  body.classList.toggle('light')
  localStorage.setItem('theme', body.classList.value)
}

const toggleMenu = () =>
  document.querySelector('nav#dropdown').classList.toggle('open')
