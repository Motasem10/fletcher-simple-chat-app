import {LOADING,FAILD,SET_CURRENT_USER} from '../action/ActionType'
const initialState={
    isAuth:false,
    isLoading:false,
    user:'NO USER',

}


export default function(state=initialState,action){
switch(action.type){
    case SET_CURRENT_USER:  
    return{
        ...state ,
        user:action.payload,
        isLoading:false,
        isAuth:Object.keys(action.payload).length==0 ||action.payload===undefined?false:true
    };
    case LOADING:
    return{
        ...state ,isLoading:true
    }
    case FAILD:
    return{
        ...state ,isLoading:false
    }

    default:
    return state;
}
}

