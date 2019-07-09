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
import { TouchableOpacity, ScrollView, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import firebase from "../../../firebase";

import { getFriends, setLastMsg, updateChat } from "../../../action/chatAction";

class Home extends Component {
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
    if (!friends) return;
      const reciverUid = this.props.uid;
      const friendsUid = Object.keys(this.props.friends); // get array of friends  uid
      //listen to all friends

      friendsUid.forEach(uid => {
        const ref = firebase.database().ref(`msg/${reciverUid}/${uid}`);
        ref.on("value", snapShot => {
          if (snapShot.val()) {
            const msges = Object.values(snapShot.val());
            const uid = snapShot.ref.path.pieces_[2];
            const  name =friends[uid].name;
            const image =friends[uid].image
            ref.remove();
            this.recivedMsgHandel(msges,uid).then(data=>{
              console.log('ooo',{data})
            this.notificationHandel(name,data.msg.msg,image);
            this.props.setLastMsg(data.uid, data.msg);

            });
            
                 
         
          }
        
      });
    });
  };
  recivedMsgHandel = (msg, uid) => {
    return new Promise(resolve => {
      const keys = Object.keys(msg);
      keys.reverse();
      let msgArr = [];
      keys.forEach(key => {
        msgArr.push(msg[key]);
      });

      AsyncStorage.getItem(uid).then(old => {
        const OldChat = JSON.parse(old);

        //if it is the first chat
        if (!OldChat) {
          AsyncStorage.setItem(uid, JSON.stringify(msgArr)); //if it is the first msg from new friend
        } else {
          const concatedChat = OldChat.concat(msgArr);
          this.props.updateChat(concatedChat, uid);
          AsyncStorage.setItem(uid, JSON.stringify(concatedChat));
        }

        return resolve({ msg: msgArr[msgArr.length - 1], uid });
      });
    });
  };

  componentWillReceiveProps = props => {};

  componentDidMount = async () => {
    try {
//AsyncStorage.removeItem("m0gvBr8dchaxwOmlNB1fM6rMREJ3")
      const friends = await this.props.getFriends();
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
        <Content>
          <List>{this.renderFriends()}</List>
        </Content>
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
)(Home);
