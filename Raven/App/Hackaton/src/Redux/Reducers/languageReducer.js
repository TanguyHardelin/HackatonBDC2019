
const InitialState = {
    language:"en"
}

function changeLanguage(state = InitialState, action){
    switch(action.type){
        case 'CHANGE_LANGUAGE':
            let nextState = {
                ...state,
                language: action.value
            }
            return nextState;
        default:
            return state;
    }
}

export default changeLanguage;