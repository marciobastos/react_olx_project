const initialState = {
    email: ''
};

export default (state = initialState, action) => {

    if(action.type === 'set_email') {
        return {...state, email:action.payload.email };
    }
    return state;
}