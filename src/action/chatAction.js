import firebase from "../firebase";
import { AsyncStorage } from "react-native";
import { SET_FRIENDS, SET_OLD_CHAT_FOR_USER, UPDATE_CHAT,INCREMENT_DOC } from "./ActionType";
import store from "../store";
const  MSG_LIMIT =15;

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
const saveMsgInLocalStore = (uid, allMsg, msg, numberOfDoc,numberOfLoodingDoc) => {

  console.log('saveMsgInLocalStore', { uid, allMsg, msg, numberOfDoc,numberOfLoodingDoc })
  console.log(' if(allMsg>=3)', allMsg.length >= MSG_LIMIT &&  (allMsg.length/ numberOfLoodingDoc)>=MSG_LIMIT  );
  console.log('(allMsg.slice(0,MSG_LIMIT))',[allMsg.length, numberOfLoodingDoc
  ]);

  if (allMsg.length >= MSG_LIMIT &&  (allMsg.length/ numberOfLoodingDoc) >=MSG_LIMIT   ) {


    console.log('saveMsgInLocalStore', { uid, allMsg, msg, numberOfDoc })
console.log(`create new Doc`)
    AsyncStorage.multiSet([
      [uid + (Number(numberOfDoc)+1),  JSON.stringify(allMsg.slice(0,MSG_LIMIT) ) ],
      [uid, JSON.stringify({ lastChat: [msg], numberOfDoc:Number(numberOfDoc)+1 })]
   ])
    .catch(err => {
      console.error({ err })
     
    })
    let payload={
      numberOfDoc:Number(numberOfDoc)+1,
      numberOfLoodingDoc:numberOfLoodingDoc+1,
    }
    console.log({payload});
    //dispatch aldMsg
   store.dispatch({
      type:INCREMENT_DOC,
      payload,
    })

  } else {
  AsyncStorage.setItem(uid, JSON.stringify({ lastChat: allMsg, numberOfDoc }));
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
    const { reciverUid, senderUid, lastChat, numberOfDoc,numberOfLoodingDoc } = store.getState().chat;
    if (msg.msg.length < 1 && msg.msg.uri < 1) return; //if empty msg
    const time = getTime();
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
  AsyncStorage.getAllKeys().then(allKey => {
    console.log({ allKey });

    allKey.forEach(k => {
      if (k.length > 13) {
      //AsyncStorage.removeItem(k)
        AsyncStorage.getItem(k)
       .then(e => {
          console.log(`---${k}---`, JSON.parse(e));
        })

      }
    })

  })
  const senderUid = store.getState().auth.user.uid;
 
  
  //get old msg       
  AsyncStorage.getItem(reciverUid).then(user => {
    user = JSON.parse(user);
    console.log({ user })
    if (!user) {
      console.log('not seeeeeeeeeeeeeeeeeeeeeeeeeeen')
      let newUser = { numberOfDoc: 0, lastChat: [] }
      console.log('create new user in  AsyncStorage', { newUser });

      AsyncStorage.setItem(reciverUid, JSON.stringify(newUser));
      return dispatch({
        type: SET_OLD_CHAT_FOR_USER,
        payload: { senderUid, reciverUid, ...newUser }
      });
    }

    console.log({ user });
    console.log('lastChat<10 && numberOfDoc>0', user.lastChat.length < 3 );
    
    if (user.lastChat.length <=MSG_LIMIT && user.numberOfDoc > 0 ) {// becouse chat will be very short add  new doc
      console.log('not seeeeeeeeeeeeeeeeeeeeeeeeeeen')
      AsyncStorage.getItem(reciverUid+user.numberOfDoc).then(extraMsg => {

        lastChat={...JSON.parse(extraMsg), ...user.lastChat} ;
        console.log('user.lastChat',{lastChat} )

         dispatch({
        type: SET_OLD_CHAT_FOR_USER,
        payload: { senderUid, reciverUid, lastChat:Object.values(lastChat), numberOfDoc: user.numberOfDoc,numberOfLoodingDoc:2 }
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
//===================================================================
module.exports.getFriends = getFriends;
module.exports.setLastMsg = setLastMsg;
module.exports.sendMsg = sendMsg;
module.exports.prepareSenderReciverChat = prepareSenderReciverChat;
module.exports.choosePhoto = choosePhoto;
module.exports.updateChat = updateChat;
module.exports.saveMsgInLocalStore=saveMsgInLocalStore;
