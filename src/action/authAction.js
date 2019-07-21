import { LOADING, FAILD, GET_ERRORS, SET_CURRENT_USER } from "./ActionType";
import firebase from "../firebase";
import { AsyncStorage } from "react-native";


 const loginUser = userData => dispatch => {
  dispatch({ type: GET_ERRORS, payload: {} });//remove error from login
  const { email, password } = userData;
  dispatch({
    type: LOADING  //spinner start 
  });

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(token => {
      //save in local storge
      const data = {email, uid: token.user.uid };
      AsyncStorage.setItem("USER", JSON.stringify(data))
        .then(() =>setCurrentUser({name, email, uid:data.uid}))
        .catch(err =despatchErr(err,dispatch));
         })
        .catch(err => despatchErr(err,dispatch));
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
              .ref(`users`)
              .child(user.user.uid)
              .set({ name, email ,image: image.downloadURL })
              .then(() => {
                //sign in method
                resolve({ email, password });
              })
       })
     .catch(err=>{
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
       locale.connection;
      alert(errorMsg.connection);
      break;
      case "auth/unknown" :
        errorMsg.connection =
         locale.connection;
        alert(errorMsg.connection);
        break;
    case "auth/invalid-email":
      errorMsg.email = locale.error.invalid-email
      break;
    case "auth/email-already-in-use":
      errorMsg.email = locale.error["email-already-in-use"];
      break;
    case "auth/weak-password":
      errorMsg.password = locale.error.weak-password;
      break;
      case "auth/user-not-found":
       err.email=locale.error.user-not-found; 
    case 'auth/wrong-password':
      errorMsg.password=locale.error.wrong-password;
      default:
      errorMsg.err = locale.error.unknown;
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