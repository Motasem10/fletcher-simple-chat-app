import { LOADING, FAILD, GET_ERRORS, SET_CURRENT_USER } from "./ActionType";
//import rnFirebase from "react-native-firebase";
import firebase from "../firebase";
import { AsyncStorage } from "react-native";

 const loginUser = userData => dispatch => {
  dispatch({ type: GET_ERRORS, payload: {} });//remove error from login
  const { email, password } = userData;
  dispatch({
    type: LOADING  //spinner start 
  });
  console.log('firebase eweb ',{userData})
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(token => {
      console.log({token})
      //save in local storge
      const data = {email, uid: token.user.uid };
      AsyncStorage.setItem("USER", JSON.stringify(data))
        .then(() => {
          setCurrentUser({name, email, uid:data.uid});
        })
        .catch(err => {
          console.log('error from authAction.js ',err);      
          despatchErr(err,dispatch);
        });
    })
    .catch(err => {
      console.log("from login action ", err);
      despatchErr(err,dispatch);
    });
};

 const registerUser = userData => dispatch => {
  const { name, email, image, password } = userData;
  return new Promise((resolve, reject) => {
    dispatch({ type: LOADING });
    dispatch({ type: GET_ERRORS }); //remove errors from reducers
   
    //create user
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {

        //save image in storge 
        firebase
          .storage()
          .ref("/image/profileimage")
          .child(user.user.uid)
          .putFile(image)
          .then(image => {
            //pudh data in DB
   
            firebase
              .database()
              .ref(`users/`)
              .child(user.user.uid)
              .set({ name, email, image: image.downloadURL })
              .then(() => {
                //sign in method
                resolve({ email, password });
              });
          }).catch(err=>{
            dispatch({ type: FAILD });
            let errorMsg = firebaseErrorCode(err);
            reject(errorMsg);
            dispatch({
              type: GET_ERRORS,
              payload: errorMsg
            });
            
          });
      })
      .catch(err => {
        dispatch({ type: FAILD });
        let errorMsg = firebaseErrorCode(err);
        reject(errorMsg);
        dispatch({
          type: GET_ERRORS,
          payload: errorMsg
        });
      });
  });
};

 const setCurrentUser = data => dispatch => {
  console.log('hellow from set current user')
  return dispatch({
    type: SET_CURRENT_USER,
    payload: data
  });
};
const firebaseErrorCode = err => {
  let errorMsg = {};
console.log({err:err.code});
  switch (err.code) {
    case "auth/network-request-failed":
      errorMsg.connection =
        "plaeas check your internet connection and try again";
      alert(errorMsg.connection);
      break;
    case "auth/invalid-email":
      errorMsg.email = "invalid mail";
      break;
    case "auth/email-already-in-use":
      errorMsg.email = err.message;
      break;
    case "auth/weak-password":
      errorMsg.password = err.message;
      break;
      case "auth/user-not-found":
       err.email="no user has this mail" 
    default:'auth/wrong-password'
      errorMsg.password='wrong password'
      errorMsg.err = "unknown error";
  }

  return errorMsg;
};

const despatchErr=(err,dispatch)=>{
   dispatch({ type: FAILD });//stop spinner 
  let errorMsg = firebaseErrorCode(err);//get error msg 
  dispatch({       
    type: GET_ERRORS,
    payload: errorMsg
  });

}


module.exports.setCurrentUser=setCurrentUser;
module.exports.loginUser=loginUser;
module.exports.registerUser=registerUser;
//module.exports.setCurrentUser=setCurrentUser;