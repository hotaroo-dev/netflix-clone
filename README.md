<p align="center">
  <img width="180px" src="images/logo.png"/>
</p>
<h2 align="center">Netflix Clone</h2>

<p align="center"><b>Ingredients</b></p>
<p align="center">
  <img width="20px" src="images/markdown/html.svg"/>
  <img width="20px" src="images/markdown/css.svg"/>
  <img width="22px" src="images/markdown/javascript.svg"/>
</p>
<p align="center">
  <img width="22px" src="images/markdown/swiper.svg"/>
</p>

<br />

## 🕸️ Projects!

<p align="center">
  <img width="600px" src="images/markdown/preview.gif"/>
</p>

<p align="center">
  <a href="https://hotaroo-dev.github.io/netflix-clone/">🖥️ Live Demo</a>
</p>

<br/>

## 🪶 Features

- [x] Advanced Search **_Movie_, _TV_** and **_All_** in Homepage / My List 🎬
- [x] Watch Trailer Banner whenever you click on _play / watch btn_ 🍿
- [x] Touch slider for movies img 👈🏼👉🏼
- [x] Modal pop-up `Movie Detail` after clickling movie img 🃏
- [x] Dark mode 🌙 & Light mode 🌞
- [x] Add movie to list 📃 _(localStorage)_ ➕
- [x] Delete movie from My List 💥

<br/>

## 🔎 Search Method

`SearchUtils` fetch movies with title as a query

```js
const searchUtils = (types, title) =>
  Promise.all(
    types.map(type =>
      fetch(
        `${BASE_PATH}/search/${type}?api_key=${API_KEY}&query=${title}`
      ).then(res => res.json())
    )
  )
```

`Search` search on input changes

```js
const movies = document.querySelector('.search-movies .wrapper')
const searchWrapper = movies.parentElement

input.addEventListener('focus', () => {
  movies.firstChild && searchWrapper.classList.add('active')
})

input.addEventListener('input', e => {
  const closeBtn = document.querySelector('svg.close-btn')

  movies.textContent = ''
  searchWrapper.classList.add('active')

  if (!e.target.value) {
    searchWrapper.classList.remove('active')
    closeBtn.classList.remove('active')
    return
  }

  closeBtn.classList.add('active')
  closeBtn.addEventListener('click', () => {
    e.target.value = ''
    movies.textContent = ''
    searchWrapper.classList.remove('active')
    closeBtn.classList.remove('active')
  })

  searchUtils(types, input.value).then(res => {
    movies.textContent = ''
    res.forEach(({ results }, i) => {
      if (results.length === 0) return

      results.slice(0, 20).forEach(movie => {
        createSearchMovie({ ...movie, type: types[i] }, movies)
      })
    })
  })

  searchWrapper.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return
    searchWrapper.classList.remove('active')
  })
})
```

<br/>

## ⚙️ Before Started

#### <img alt="Tip" src="https://img.shields.io/static/v1.svg?label=&message=Tip&style=flat&color=b2f5ea"> By starting the server locally, you can easily change and check code

You can test Html, CSS, JS. in real time by starting a web server locally. To do this, you need to install `node.js` and `npm`. After that, you can install the live server by using the command below.

```
npm install -g live-server
```

start the server by running the command below.

```
live-server .
```

<br/>

## 👏🏼 Contributing

Can't spell thank you without `YOU`.
