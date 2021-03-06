import React from 'react'
import {
    View,
    Header,
    Body,
    Title,
    Left,
    Right,
 
  } from "native-base";
  import locale from '../../locale';
  import {createStackNavigator,
    createMaterialTopTabNavigator,createAppContainer} from 'react-navigation';
  import Icon from "react-native-vector-icons/MaterialIcons";
  import Chats from './tabNavigator/chats';
  
  import Chat from './tabNavigator/chat';
  import Status from "./tabNavigator/status";
  import Calls from "./tabNavigator/calls";
import ChatHeader from './tabNavigator/chatHeader';
import Model from './tabNavigator/model';
import Users from './tabNavigator/users';
import UsersHeader from './tabNavigator/UsersHeader';

const TabNav = createMaterialTopTabNavigator(
  {
    [locale['profile']['chats']]: {
      screen: Chats,
      navigationOptions: {},
    },
    [locale['profile']['status']]: {
      screen: Status,
      navigationOptions: {
        headerLeft: null
      }
    }, [locale['profile']['calls']]: {
      screen: Calls,
      navigationOptions: {
        headerLeft: null
      }
    },

  
  },
  
  {
    tabBarOptions: {
      activeTintColor: "white",
      style: {
        backgroundColor: "#075e54"
      },
      indicatorStyle: {
        backgroundColor: "white"
      }
    }
  }
);
const RootNavigator = createStackNavigator({
  Model:{
    screen:Model,
    
 navigationOptions:{
      header:null,
      initialRouteName:'Model'
    } } ,

HomeApp: {
    screen: TabNav,
    navigationOptions: {   
      header: (
        <Header hasTabs style={{ backgroundColor: "#075e54" }}>
          <Left>
            <Title>{locale.auth.appName}</Title>
          </Left>
          <Right style={{ position: "absolute", right: 20 }}>
            <Icon style={{ color: "white", marginLeft: 10 }} size={20} name="search" />
            <Icon name="more-vert" size={20} style={{ color: "white", marginLeft: 20,marginRight:0 }} />
          </Right>

          <Body />
        </Header>
      )
    }
  },

  Chat: {
    screen: Chat,
    navigationOptions:({navigation})=>( {
      header: (
          <ChatHeader navigation={navigation}/>
    )
    })
  },
  Users:{
    screen:Users,
    navigationOptions:({navigation})=>( {
      header: (
          <UsersHeader navigation={navigation}/>
    )
    })
  

  }


},{initialRouteName:'HomeApp'});


export default  AppContainer= createAppContainer(RootNavigator);