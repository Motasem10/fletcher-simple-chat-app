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
import Icon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity, ScrollView, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import firebase from "../../../firebase";

import { getFriends, setLastMsg, updateChat,saveMsgInLocalStore } from "../../../action/chatAction";

class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: null
    };
  }
notificationHandel =(name,msg,image)=>{

    const notification = new firebase.notifications.Notification()
    .setTitle('FLETCHERS')
    .setBody('new masseage ').setData({largeIcon:'logo'})
    .setNotificationId('notification-action')
    .setSound('default')
    .android.setChannelId('notification-action')
    .android.setPriority(firebase.notifications.Android.Priority.Max);

     image && notification.android.setBigPicture(image)
    // Build an action
    const action = new firebase.notifications.Android.Action('snooze', 'logo', `${name}: ${msg}`);
    // This is the important line
    action.setShowUserInterface(false);
    // Add the action to the notification
    notification.android.addAction(action);
    
    // Display the notification
    firebase.notifications().displayNotification(notification);
  }
  listenToNewMsg =async friends => {
    console.log('listenToNewMsg',friends);
    if (!friends) return;
      const reciverUid = this.props.uid;
      const friendsUid = Object.keys(this.props.friends); // get array of friends  uid
      //listen to all friends

      friendsUid.forEach(uid => {
        console.log({uid,reciverUid})
        const ref = firebase.database().ref(`msg/${reciverUid}/${uid}`);
        ref.on("value", snapShot => {
          if (snapShot.val()) {
            console.log({friends,s:snapShot.ref})
            const msges = Object.values(snapShot.val());
            const uid = snapShot.ref.path.split('/')[2];
            const  name =friends[uid].name;
            const image =friends[uid].image
           ref.remove();
           console.log({msges})
            this.recivedMsgHandel(msges,uid).then(data=>{
              console.log('ooo',{data})
        //    this.notificationHandel(name,data.msg.msg,image);
            this.props.setLastMsg(data.uid, data.msg);

            });
            
                 
         
          }
        
      });
    });
  };
  recivedMsgHandel = (msgArr, uid) => {
    return new Promise(resolve => {
      console.log({msgArr})

      AsyncStorage.getItem(uid).then(old => {
        const OldChat = JSON.parse(old);
        console.log('chats.js',{OldChat})
        //if it is the first chat
        if (!OldChat.lastChat) {
          AsyncStorage.setItem(uid, JSON.stringify(msgArr)); //if it is the first msg from new friend
        } else {
          const concatedChat = msgArr.concat(OldChat.lastChat);
          this.props.updateChat(concatedChat, uid);
AsyncStorage.getItem(uid).then(id=>{
  
       saveMsgInLocalStore(uid,concatedChat,concatedChat[0],JSON.parse(id).numberOfDoc ,1) 
})     
        }

        return resolve({ msg: msgArr[0], uid });
      });
    });
  };
goToUSersList=()=>{
  console.log('=++++++++++++++++++======')
  this.props.navigation.navigate("Users");

}
  componentWillReceiveProps = props => {};

  componentDidMount = async () => {
    try {
//AsyncStorage.removeItem("m0gvBr8dchaxwOmlNB1fM6rMREJ3")
console.log('before getFriends')      
const friends = await this.props.getFriends();
console.log('after getFriends')
      
    await this.listenToNewMsg(friends);
    } catch (err) {
      console.log("error home.js CDM", err);
    }
  };



  renderFriends = () => {
    let index = -1; //index for uid
    const { friends } = this.props;
    if (friends) {
      //if there are friends in state
      const uidArray = Object.keys(friends);
      return Object.values(friends).map(friend => {
        index++;
        const uid = uidArray[index];
        const { name, email, image } = friend;

        return (
          <ListItem key={uid}
          
         
          >
            <TouchableOpacity

onPress={() =>{
//  this.notificationHandel('sss','sssss',"https://firebasestorage.googleapis.com/v0/b/control-717c0.appspot.com/o/image%2Fprofileimage%2FVoSIqSulG1cXUl3HdZNbURxCipo1?alt=media&token=5b8f4009-d457-4ac4-8b91-41ce8317a7fe") 
  this.props.navigation.navigate("Chat", {
    data: { uid, name, email, image },
    lastMsg: this.props.setLastMsg
  })}}

              style={{ flexDirection: "row" }}
            >
              <Thumbnail source={{ uri: image }} circular />
              <View style={{ flexDirection: "column" }}>
                <View>
                  <Text style={{ fontWeight: "bold", marginLeft: 2 }}>
                    {name}
                  </Text>
                </View>

                <Text
                  lineBreakMode={true}
                  maxLength={10}
                  numberOfLines={1}
                  style={{
                    padding: 10,
                    maxWidth: "100%",
                    flex: 1,
                    marginLeft: 8,
                    color: "#868686",
                    flexGrow: 1
                  }}
                >
                  {friend.lastMsg
                    ? friend.lastMsg.msg && friend.lastMsg.msg.length > 15
                      ? friend.lastMsg.msg.slice(0, 15)
                      : friend.lastMsg.msg
                    : ""}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-end"
                }}
              >
                <Text>{friend.lastMsg ? friend.lastMsg.time : ""}</Text>
              </View>
            </TouchableOpacity>
          </ListItem>
        );
      });
    }
  };

  render() {
    return (
      <Container>
      
          <View style={{flex:10}}>
          <ScrollView >
         {this.renderFriends()}
          </ScrollView>
          </View>
          <View style={{
    flex:2 ,  backgroundColor: "#20c659",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    margin: 10,
    position:'absolute',
  //  zIndex:1,
    bottom:10,
    right:3,
    width: 50,
    height: 50,
    borderRadius: 50}}>
      <TouchableOpacity 
          onPress={()=>this.goToUSersList()}>
            <Icon name="person-add" color="white" size={30} />
         </TouchableOpacity>
         </View>
      </Container>
    );
  }
}
mapStateToProps = state => {
  return {
    friends: state.chat.friends,
    uid: state.auth.user.uid
  };
};
export default connect(
  mapStateToProps,
  { getFriends ,setLastMsg, updateChat }
)(Chats);



