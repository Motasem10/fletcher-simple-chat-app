/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View,AsyncStorage} from 'react-native';
import UnAuthComponent from './src/component/unAuthComponent/scrollView';
import { Provider } from "react-redux";
import store from "./src/store";
import { Root } from "native-base";
 import firebase from './src/firebase';
 import SpinnerScreen from './src/component/spinner'
 import {setCurrentUser} from './src/action/authAction'
//console.log({setCurrentUser:setCurrentUser('hi')})
import RootNavigator from './src/component/authComponent/navbar';

//test component 


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isAuth: null
    };
  }
  async componentDidMount(){
console.log('componentDidMount',this.state.isAuth)
 
  console.log(1);
        AsyncStorage.getItem('USER').then(user=>{
        if(!user) {
        
          this.setState({isAuth:false})
          console.log(2,this.state.isAuth.isAuth);
          firebase.auth().signOut();

        }
      // this.setState({isAuth:true})
      if(user) {this.setState({isAuth:true});
      console.log(3);
      store.dispatch( setCurrentUser(JSON.parse(user)));
console.log('usssser',{user:JSON.parse(user)})
     
      console.log('cccc',store.getState())
      }
    })
        
      firebase.auth().onAuthStateChanged(user => {
        if (user) { 
          console.log(4)
             console.log(user);
                 this.setState({ isAuth: true });
                   // store.dispatch( setCurrentUser('WDWQPD'))
          } else {
            console.log(5)
            this.setState({ isAuth: false });
         AsyncStorage.removeItem('Friends');
         AsyncStorage.removeItem('USER');     
            setCurrentUser({});
          }
        });
      }

      renderNavigator() {
      //  return(<SpinnerScreen/>);
        //loading
        if (this.state.isAuth === null) {
          return <SpinnerScreen />
        } else {
          return this.state.isAuth ?
          //home & chat & calls
          (
            <RootNavigator />
          ) ://login & signup
           (
            <UnAuthComponent reload={this.reload} />
          );
        }
      }

  render() {
    console.log({store:store.getState()})
    return (
      <Provider store={store}>
    <Root>{this.renderNavigator()}</Root></Provider>
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
