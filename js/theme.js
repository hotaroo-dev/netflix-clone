const body = document.body
const theme = localStorage.getItem('theme')
theme && body.classList.add(theme)
