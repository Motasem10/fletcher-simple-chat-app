import React, { Component } from "react";

import {
  View,
  Text,
  List,
  ListItem,
  Container,
  Thumbnail,
  Content
} from "native-base";
import { TouchableOpacity,AsyncStorage,StyleSheet } from "react-native";
import { connect } from "react-redux";

import {  setLastMsg } from "../../../action/chatAction";




class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }
  getUsers=()=>{
    return new Promise((resolve,reject)=>{
//       firebase.database().ref('users').once('value',snapShot=>{
// if(snapShot.val()) return resolve(snapShot.val());

AsyncStorage.getItem("Friends").then(friendsJson => {
  //set new friends in store
  let friends = JSON.parse(friendsJson);
friends={friends,...friends,...friends}
  resolve(friends);

      })

      
    })
  }

  componentDidMount = async () => {
const users = await this.getUsers();
//pass number of users to Users header
//this.props.navigation.navigate('Chat',{Users:Object.keys(users).length});
this.setState({users});

  };



  renderusers = () => {
    let index = -1; //index for uid
 let  users = this.state.users;
    if (users) {
      //if there are users in state
      const uidArray = Object.keys(users);
      return Object.values(users).map(friend => {
        index++;
        const uid = uidArray[index];
        const { name, email, image } = friend;

        return (
          <View key={uid}>
            <TouchableOpacity

onPress={(e) =>{
this.props.navigation.navigate("Chat", {
    data: { uid, name, email, image },
    lastMsg: this.props.setLastMsg
  })
}}
              style={{ flexDirection: "row" }}
            >
              <Thumbnail  source={{ uri: image }}  style={{ transform: [{ scale: 0.7 }]}} circular />
              <View style={style.center}>
                <View  style={{}} >
                  <Text style={{ fontWeight: "bold", marginLeft: 6 }}>
                    {name}
                  </Text>
                </View>

    
              </View>
       
        
                {/* <Text>{friend.lastMsg ? friend.lastMsg.time : ""}</Text> */}
            
            </TouchableOpacity>
          </View>
        );
      });
    }else return(<View><Text style={{textAlign:'center'}}>check you internet connection</Text></View>)
  };

  render() {
    return (
      <Container>
        <Content>
          <List>{this.renderusers()}</List>
        </Content>
      </Container>
    );
  }
}

const style=StyleSheet.create({
  center:{
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center'
  }
})
export default connect(
   mapStateToProps,
   { setLastMsg }
 )(Users);

