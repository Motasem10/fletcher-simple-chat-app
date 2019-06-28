import {
  SET_FRIENDS,
  SET_LAST_MSG,
  UPDATE_CHAT,
  SET_OLD_CHAT_FOR_USER,
  SET_URI
} from "../action/ActionType";

const initialState = {
  friends: null,
  oldMsg: null,
  senderUid: null,
  reciverUid: null
};

export default function(state = initialState, action) {
  console.log("chat reducer", { initialState, action });
  switch (action.type) {
    case SET_FRIENDS: //set lest of friends to render it in home page
      return { ...state, friends: action.payload };
    case SET_LAST_MSG: //set last msg to render it in home page
      return { ...state, friends: action.payload };
    case SET_OLD_CHAT_FOR_USER: 
      const { senderUid, reciverUid, oldMsg } = action.payload;
      return { ...state, senderUid, reciverUid, oldMsg };
    case UPDATE_CHAT:
      return { ...state, oldMsg: action.payload };
    default:
      return state;
  }
}
