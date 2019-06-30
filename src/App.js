import React, { Component } from "react";
import UnAuthComponent from "./component/unAuthComponent/scrollView";
import { AsyncStorage,Text } from "react-native";
import AuthComponent from "./component/authComponent/navbar";
import { Provider } from "react-redux";
import store from "./store";
import firebase from "firebase";
import SpinnerScreen from "./component/spinner";
import { setCurrentUser } from "./action/authAction";
import { Root } from "native-base";
//import firebase from "react-native-firebase";
//import console = require("console");
//set current user data
AsyncStorage.getItem('USER').then(user=>{
    //user
    if(!user)return store.dispatch(setCurrentUser({}))
    store.dispatch(setCurrentUser(JSON.parse(user))); 
if(!user)return store.dispatch(setCurrentUser({}))
       
   }) 
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuth: null
    };
  }

  
// getToken=async()=>{
// let fcmTo=await firebase.messaging().getToken();
// if(fcmTo){

// }
// }
// check(){
// const e= firebase.messaging().hasPermission();
// if(e){
//   firebase.messaging().requestPermission()
//   this.getToken();
// console.log('nooooooooooooti ',e);
// }else{
//   this.requestPermission();
// console.log('nooooooooooooo ontof')
// }
// }

//   componentWillMount() {

//     if(!firebase.apps.length){
//     var config = {
//       apiKey: "AIzaSyAE4zm_Ra_6gajcMZ9Kl6T-GaZDlT2ZwGo",
//       authDomain: "control-717c0.firebaseapp.com",
//       databaseURL: "https://control-717c0.firebaseio.com",
//       projectId: "control-717c0",
//       storageBucket: "",
//       messagingSenderId: "335441848101"
//     };
  
//     firebase.initializeApp(config);
//     //firebase.auth().signOut();
//   }
//   AsyncStorage.getItem('USER').then(user=>{
//   if(!user) {
//     this.setState({isAuth:false})
//     firebase.auth().signOut();
//   }
//  // this.setState({isAuth:true})
// if(user) this.setState({isAuth:true});})
//     firebase.auth().onAuthStateChanged(user => {
//     if (user) { 
//           //  console.log(user);
//              this.setState({ isAuth: true });
                
//       } else {
//         this.setState({ isAuth: false });
//      AsyncStorage.removeItem('Friends');
//      AsyncStorage.removeItem('USER');     
//         setCurrentUser({});
//       }
//     });
//   }

async componentDidMount(){


if(!firebase.apps.length){
      var config = {
        apiKey: "AIzaSyAE4zm_Ra_6gajcMZ9Kl6T-GaZDlT2ZwGo",
        authDomain: "control-717c0.firebaseapp.com",
        databaseURL: "https://control-717c0.firebaseio.com",
        projectId: "control-717c0",
        storageBucket: "",
        messagingSenderId: "335441848101"
      };
    
     firebase.initializeApp(config);
    // firebase.auth().signOut();
    }
    AsyncStorage.getItem('USER').then(user=>{
    if(!user) {
      this.setState({isAuth:false})
      firebase.auth().signOut();
    }
  // this.setState({isAuth:true})
  if(user) this.setState({isAuth:true});})
    
  firebase.auth().onAuthStateChanged(user => {
    if (user) { 
         console.log(user);
             this.setState({ isAuth: true });
                  
      } else {
        this.setState({ isAuth: false });
     AsyncStorage.removeItem('Friends');
     AsyncStorage.removeItem('USER');     
        setCurrentUser({});
      }
    });
  }









  renderNavigator() {
    //loading
    if (this.state.isAuth === null) {
      return <SpinnerScreen />;
    } else {
      return this.state.isAuth ?
      //home & chat & calls
      (
        <AuthComponent />
      ) ://login & signup
       (
        <UnAuthComponent reload={this.reload} />
      );
    }
  }

  render() {
    return <Provider store={store}>
    <Root>
 {this.renderNavigator()}
    </Root>
    </Provider>;
  }
}
