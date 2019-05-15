import { createStore, combineReducers } from 'redux';
// import placeReducer from './reducers/placeReducer';

const initialState = {
  placeName: '',
  places: []
};

function placeReducer(state = initialState, action) {
  switch(action.type) {
    case 'ADD_PLACE':
      return {
        ...state,
        places: state.places.concat({
          key: Math.random(),
          value: action.payload
        })
      };
    default:
      return state;
  }
}


const rootReducer = combineReducers({
  places: placeReducer
});

const configureStore = () => {
  return createStore(rootReducer);
}

export default configureStore;