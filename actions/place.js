
import { ADD_PLACE } from './types';

export const addPlace = location => {
  return {
    type: ADD_PLACE,
    payload: location
  }
}