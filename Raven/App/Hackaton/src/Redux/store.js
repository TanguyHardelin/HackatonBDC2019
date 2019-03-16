// Store/configureStore.js

import { createStore, combineReducers } from 'redux';
import languageReducer from './Reducers/languageReducer'
import pageReducer from './Reducers/pageReducer'

let mainReducer = combineReducers({language:languageReducer,page:pageReducer})

export default createStore(mainReducer)