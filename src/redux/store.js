import {createStore} from 'redux'

const initalStore = {
    loading : false,
    user: {}
}

const reducer = (state = initalStore, action) => {
    if(action.type === 'SET_LOADING') {
        return {
            ...state,
            loading: action.value
        }
    }
    if(action.type === 'SET_USER') {
        return {
            ...state,
            user: action.value
        }
    }
    return state;
}
const store = createStore(reducer);
export default store;