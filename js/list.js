import { checkLocalMovies, createCard } from './modules/utils.js'

const movieList = checkLocalMovies()
movieList.map(movie => createCard(movie))
