import {
  SET_FRIENDS,
  SET_LAST_MSG,
  UPDATE_CHAT,
  SET_OLD_CHAT_FOR_USER,
  SET_URI,
  INCREMENT_DOC
} from "../action/ActionType";

const initialState = {
  friends: null,
  lastChat: null,
  senderUid: null,
  reciverUid: null,
  numberOfDoc:0, // every doc has some msg 
  numberOfLoodingDoc:1,
};

export default function(state = initialState, action) {
  console.log("chat reducer", { initialState, action });
  switch (action.type) {
    case SET_FRIENDS: //set lest of friends to render it in home page
      return { ...state, friends: action.payload };
    case SET_LAST_MSG: //set last msg to render it in home page
      return { ...state, friends: action.payload };
    case SET_OLD_CHAT_FOR_USER: 
      const { senderUid, reciverUid, lastChat,numberOfLoodingDoc } = action.payload;
      return { ...state, senderUid, reciverUid, lastChat,numberOfLoodingDoc };
      case UPDATE_CHAT:
      return { ...state, lastChat: action.payload };

      case INCREMENT_DOC:
        return { ...state, ...action.payload };
    default:
      return state;
  }
}
