import firebase from "../firebase";
import { AsyncStorage } from "react-native";
import { SET_FRIENDS, SET_OLD_CHAT_FOR_USER, UPDATE_CHAT,INCREMENT_DOC } from "./ActionType";
import store from "../store";
const  MSG_LIMIT =20;


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

      firebase.database().ref('users')
        .on("value", snapShot => {
          //if there are friends in local storge
          if (friends) {
         //   editUpdatedFriendsList(snapShot.val(), friends).then(
              newFriendList={...snapShot.val(),...friends} 
              //=> {
                AsyncStorage.setItem("Friends", JSON.stringify(newFriendList));
                dispatch({ type: SET_FRIENDS, payload: newFriendList });
                //resolve it to listentNewMasseage
                resolve(newFriendList);
         //     }
        //    );
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
        ///console.log({friendList});

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
   // let newObj = {};
  
  return {[key]:obj[key],...obj};
  };
//================================================================
const saveMsgInLocalStore = (uid, allMsg, msg, numberOfDoc,numberOfLoodingDoc) => {
  if (allMsg.length > MSG_LIMIT &&  (allMsg.length/ numberOfLoodingDoc)>MSG_LIMIT   ) {
  //  console.log('saveMsgInLocalStore', { uid, allMsg, msg, numberOfDoc,uidNum: allMsg.slice(1,MSG_LIMIT+1)})
//console.log(`create new Doc`)
    AsyncStorage.multiSet([
      [uid + (Number(numberOfDoc)+1),  JSON.stringify(allMsg.slice(1,MSG_LIMIT+1) ) ],
      [uid, JSON.stringify({ lastChat: [msg], numberOfDoc:Number(numberOfDoc)+1 })]
   ])
    .catch(err => {
      console.error({ err })
     
    })
    let payload={
      numberOfDoc:Number(numberOfDoc)+1,
      numberOfLoodingDoc:numberOfLoodingDoc+1,
    }
  //  console.log({payload});
    //dispatch aldMsg
   store.dispatch({
      type:INCREMENT_DOC,
      payload,
    })

  } else {
  //  console.warn('else remove it =======>>>======>>>',{ lastChat: allMsg.slice(0,(allMsg.length- (numberOfLoodingDoc-1)*MSG_LIMIT) ), numberOfDoc,allMsg });
  AsyncStorage.setItem(uid, JSON.stringify({ lastChat:allMsg.slice(0,(allMsg.length- (numberOfLoodingDoc-1)*MSG_LIMIT) ), numberOfDoc }));
  }



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
        .then(saved => { });
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
  //  console.log({sendMsg:store.getState()});
    const { reciverUid, lastChat, numberOfDoc,numberOfLoodingDoc } = store.getState().chat;
    const {senderUid}=store.getState().chat;
    if (msg.msg.length < 1 && msg.msg.uri < 1) return; //if empty msg

    const time = new Date().getTime();
    //addtime and   mine=true  means i send it
    let newMsg = { ...msg, time, mine: true };
    let old_Msg = lastChat;
    //add new msg to state (lastChat array )

    (old_Msg && old_Msg.unshift(newMsg)) || (old_Msg = [newMsg]);

    dispatch({ type: UPDATE_CHAT, payload: old_Msg });

    saveMsgInLocalStore(reciverUid, old_Msg, newMsg, numberOfDoc,numberOfLoodingDoc);
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
//==================================================================

//==================================================================
const prepareSenderReciverChat = reciverUid => dispatch => {
  const senderUid = store.getState().auth.user.uid;
 
  const {numberOfLoodingDoc}=store.getState().chat;
  //get old msg       
  AsyncStorage.getItem(reciverUid).then(user => {
    user = JSON.parse(user);
    if (!user) {
    
      let newUser = { numberOfDoc: 0, lastChat: [] }
      AsyncStorage.setItem(reciverUid, JSON.stringify(newUser));
      return dispatch({
        type: SET_OLD_CHAT_FOR_USER,
        payload: { senderUid, reciverUid, ...newUser }
      });
    }

    if (false && user.lastChat.length <=3 && user.numberOfDoc > 0 && numberOfLoodingDoc==1) {// becouse chat will be very short add  new doc
    
      AsyncStorage.getItem(reciverUid+user.numberOfDoc).then(extraMsg => {
      //  console.log('not seeeeeeeeeeeeeeeeeeeeeeeeeeen',{lastChat:user.lastChat,extraMsg:JSON.parse(extraMsg)})
        lastChat=[ ...user.lastChat,...JSON.parse(extraMsg),] ;
      //  console.log('user.lastChat',{lastChat} )

         dispatch({
        type: SET_OLD_CHAT_FOR_USER,
        payload: { senderUid, reciverUid, lastChat, numberOfDoc: user.numberOfDoc,numberOfLoodingDoc:2 }
      });

      })
    } else {

      dispatch({
        type: SET_OLD_CHAT_FOR_USER,
        payload: { senderUid, reciverUid, lastChat: user.lastChat, numberOfDoc: user.numberOfDoc,numberOfLoodingDoc:1 }
      });
    }
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

const loadMore=(payload)=>dispatch=>{
  dispatch({type:'INCREMENT_DOC',payload});
}
function getDate(timeMs) {
  const date = new Date(Number(timeMs) || new Date());
  let dd = date.getUTCDate() + "";
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear() + "";
  let hour = date.getHours() + "";
  let min = date.getMinutes();
  min = min < 10 ? "0" + min : min;
  mm = mm < 10 ? "0" + mm : mm + "";
  dd = dd < 10 ? "0" + dd : dd + "";
 
  // let time = hour+'' + min<10?min+'':min+'0'
  return {
    date: yyyy + "-" + mm + "-" + dd,
    time: hour + ":" + min
  };
}

//===================================================================
module.exports.getFriends = getFriends;
module.exports.setLastMsg = setLastMsg;
module.exports.sendMsg = sendMsg;
module.exports.prepareSenderReciverChat = prepareSenderReciverChat;
module.exports.choosePhoto = choosePhoto;
module.exports.updateChat = updateChat;
module.exports.saveMsgInLocalStore=saveMsgInLocalStore;
module.exports.loadMore=loadMore;
module.exports.getDate=getDate;