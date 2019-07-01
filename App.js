/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View,AsyncStorage} from 'react-native';
import RootStackNavigator from './src/component/unAuthComponent/scrollView';
import { Provider } from "react-redux";
import store from "./src/store";
import { Root } from "native-base";
 import firebase from 'firebase';
 import {setCurrentUser} from './src/action/authAction'
export default class App extends Component {
   
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

  render() {

    return (
      <Provider store={store}>
    <Root>
      <View style={styles.container}>
 <RootStackNavigator></RootStackNavigator>
      </View>
      </Root>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
