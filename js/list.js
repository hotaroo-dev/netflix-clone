import { checkLocalMovies, createCard } from './components/utils.js'

const movieList = checkLocalMovies()
movieList.map(movie => createCard(movie))
