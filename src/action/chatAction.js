import firebase from "../firebase";
import { AsyncStorage } from "react-native";
import { SET_FRIENDS, SET_OLD_CHAT_FOR_USER, UPDATE_CHAT } from "./ActionType";
import store from "../store";
//import firebase from "react-native-firebase";
//___________________________________________________

{
  /* 
get friends from localstorge and update it from firebase
*/
}



const getFriends = () => dispatch => {
  return new Promise((resolve, reject) => {
    //   get friends from local storge
    AsyncStorage.getItem("Friends").then(friendsJson => {
      //set new friends in store
      const friends = JSON.parse(friendsJson);
      friends && dispatch({ type: SET_FRIENDS, payload: friends });
      //get friends from databse

     firebase.database().ref('friends').child(store.getState().auth.user.uid)
        .on("value", snapShot => {
          //if there are friends in local storge
          if (friends) {
            editUpdatedFriendsList(snapShot.val(), friends).then(
              newFriendList => {
                AsyncStorage.setItem("Friends", JSON.stringify(newFriendList));
                dispatch({ type: SET_FRIENDS, payload: newFriendList });
                //resolve it to listentNewMasseage
                resolve(newFriendList);
              }
            );
          } else {
            AsyncStorage.setItem("Friends", JSON.stringify(snapShot.val()));
            dispatch({ type: SET_FRIENDS, payload: snapShot.val() });
            resolve(snapShot.val());
          }
        });
    });
  });
};
//=================================================================
/*_________________________________________________
set last msg and  & order users with llast Msg 
*/
//=================================================
const editUpdatedFriendsList = (newFriendList, oldFriendList) => {
  return new Promise(resolve => {
    const friendArray = Object.keys(newFriendList);
    friendArray.forEach(uid => {
      //if it is not  a new friend
      if (oldFriendList[uid]) {
        oldFriendList[uid].lastMsg && //add last Msg to old friend in updated list
          (newFriendList[uid].lastMsg = oldFriendList[uid].lastMsg);
      }
    });

    resolve({ ...oldFriendList, ...newFriendList });
  });
};

//=====================================================
{
  /*1-set last msg 
    2-save it in local storge 
    3-update store
 */
}
const setLastMsg = (uid, msg) => dispatch => {
  try {
    AsyncStorage.getItem("Friends").then(friendsJson => {
      const fr = JSON.parse(friendsJson);
      if (fr != undefined) {
        //if friend state (in store) is not empty
        //add this friend to top of list

        let friendList = addToHeadOfObject(fr, uid);

        friendList[uid].lastMsg = msg; //set msg as last msg
        AsyncStorage.setItem("Friends", JSON.stringify(friendList));
        dispatch({
          type: SET_FRIENDS,
          payload: friendList
        });
        return friendList;
      }
    });
    //else =>thats means it is first comming msg //
  } catch (err) {
    console.err("err in last msg chataction.js");
  }
};
//=====================================================

// it's used to add the last friend connected(send or recived)  to ahead of list
const addToHeadOfObject = (obj, key) => {
  if (!obj[key]) return "error in key";
  let newObj = {};
  const element = obj[key];
  newObj[key] = element;
  delete obj[key];
  return Object.assign(newObj, obj);
};
//================================================================
const saveMsgInLocalStore = (uid, allMsg) => {
  AsyncStorage.setItem(uid, JSON.stringify(allMsg));
};
//=================================================================
//get time ex=> 13:05
const getTime = () => {
  const date = new Date();
  let hours = date.getHours();
  let min = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();

  return hours + ":" + min;
};
//=================================================================

const uploadImg = msg => {
  const { reciverUid, senderUid } = store.getState().chat;
  firebase
    .storage()
    .ref("image/msg")
    .child(reciverUid)
    .putFile(msg.uri)
    .then(image => {
      msg.url = image.downloadURL;
      //     this.setState({ url: image.downloadURL });
      firebase.database()
        .ref(`msg/${reciverUid}`)
        .child(senderUid)
        .push(msg)
        .then(saved => {});
    })
    .catch(err => console.log("err", err));
};
//==================================================================
const sendMsg = msg => dispatch => {
  return new Promise(resolve => {
    /*component doesnt reload when i  change store(redux)
    (temporarily) i will use promise to change state in component to update it  
    */
    //get current  conversition data
    const { reciverUid, senderUid, oldMsg } = store.getState().chat;
    if (msg.msg.length < 1 && msg.msg.uri < 1) return; //if empty msg
    const time = getTime();
    //addtime and   mine=true  means i send it
    let newMsg = { ...msg, time, mine: true };
    let old_Msg = oldMsg;
    //add new msg to state (oldMsg array )

    (old_Msg && old_Msg.unshift(newMsg)) || (old_Msg = [newMsg]);

  dispatch({ type: UPDATE_CHAT, payload: old_Msg });

    saveMsgInLocalStore(reciverUid, old_Msg);
    //resolve it in chat.js to  add it as alast Msg
    resolve(newMsg);

    //if it was image pass it to upload image
    newMsg = { ...newMsg, mine: false }; //set mine to false =>to send it
    if (msg.uri) return uploadImg(newMsg); //upload image  get url of image in  firebase storge
    //if it was text-msg(not img )

  firebase.database()
      .ref(`msg/${reciverUid}`)
      .child(senderUid)
      .push(newMsg)
      .catch(err => console.error(err));
  });
  
};

// const updateFriends=(data)=>{
// //friends=>id=>{lastMsg,time,name,image}
// if(data.lastMsg) 


// }

//==================================================================

//==================================================================
const prepareSenderReciverChat = reciverUid => dispatch => {
  const senderUid = store.getState().auth.user.uid;
  console.log({auth:store.getState()})
  //get old mag
  AsyncStorage.getItem(reciverUid).then(user => {
    console.log("prepareSenderReciverChat", { senderUid });
    dispatch({
      type: SET_OLD_CHAT_FOR_USER,
      payload: { senderUid, reciverUid, oldMsg: user ? JSON.parse(user) : null }
    });
  });
};
//==================================================================
const choosePhoto = (photo, msg) => {
  return new Promise(resolve => {
    msg = { msg };
    msg.uri = photo;
    resolve(msg);
  });
};
//==================================================================

//==================================================================

// i have problem in connect betwen store and  chat.j
// i write this method to fix it =>just set state to update cmponent
const updateChat = (chat, uid) => dispatch => {
  if (store.getState().chat.reciverUid === uid) {
    dispatch({
      type: UPDATE_CHAT,
      payload: chat
    });
  }
};
//===================================================================
module.exports.getFriends = getFriends;
module.exports.setLastMsg = setLastMsg;
module.exports.sendMsg = sendMsg;
module.exports.prepareSenderReciverChat = prepareSenderReciverChat;
module.exports.choosePhoto = choosePhoto;
module.exports.updateChat = updateChat;
