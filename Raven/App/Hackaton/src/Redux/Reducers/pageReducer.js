
const InitialState = {
    page : "Home"
}

function pageReducer(state = InitialState, action){
    switch(action.type){
        case 'CHANGE_PAGE':
            let nextState = {
                ...state,
                page: action.value
            }
            return nextState;
        default:
            return state;
    }
}

export default pageReducer;