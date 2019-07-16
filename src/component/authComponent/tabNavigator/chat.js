import React, { Component } from "react";
import bg from "../../../img/bg.png";

import {
  View,
  Text,
  Container,
  Badge,
  Card,
  CardItem,
  Textarea,
  ActionSheet,
} from "native-base";
//import firebase from '../../../firebase'
import imagePicker from "react-native-image-picker";

import Icon from "react-native-vector-icons/MaterialIcons";
import {
  ImageBackground,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import { connect } from "react-redux";
import {
  sendMsg,
  prepareSenderReciverChat,
  choosePhoto
} from "../../../action/chatAction";


class Chat extends Component {
  constructor(props) {

    super(props);
    this.state = {
      msg: "",
      lastChat: "",
      start:0,
      end:0

    };
  }
  componentWillUnmount() {


  }
  handelChoosePhoto = () => {

    ActionSheet.show(
      {
        options: [
          { text: "camira", icon: "camera", iconColor: "green" },
          { text: "Galary", icon: "image", iconColor: "green" },
          { text: "cancl", icon: "exit", iconColor: "green" }
        ],
        cancelButtonIndex: 2
      },
      ButtonIndex => {
        if (ButtonIndex == 0) {
          imagePicker.launchCamera({}, res => {
            this.setState({ image: res.uri });
          });
        } else if (ButtonIndex == 1) {
          imagePicker.launchImageLibrary({}, res => {
            if (res.fileSize > 1024 * 1024) {
              return alert("the maxmum size of image is 1MB");
            }

            res.uri && this.props.navigation.navigate("Model", {
              data: {
                choosePhoto: this.choosePhoto.bind(this),
                source: res.uri,
                onChangeText: msg => this.setState({ msg })
              }
            })
          });
        }
      }
    );
  };

  choosePhoto = uri => {
    choosePhoto(uri, this.state.msg).then(msg => {
      //SEND MSG TAKE Object
      this.props.sendMsg(msg).then(msg => {

        //set last msg t uunderstandt it look at home.js 
        this.props.navigation.getParam('lastMsg')(this.props.reciverUid, msg)
        this.setState({ msg: '' })

      });

    });
    this.setState({ msg: "" });
  };






  componentDidMount = async () => {

    //get uid from home.js 
    const reciverUid = this.props.navigation.getParam("data").uid;
    //get old MSg 
    await this.props.prepareSenderReciverChat(reciverUid);


  };

  handelSendMsg = () => {
    const msg = this.state.msg;
    if (msg.length < 1) return
    this.setState({ msg: '' })
    const reciverUid = this.props.navigation.getParam("data").uid;
    const senderUid = this.props.senderUid;
    console.log({ senderUid, reciverUid, p: this.props })
    this.props.sendMsg({ msg }).then(msg => {
      this.props.navigation.getParam('lastMsg')(this.props.reciverUid, msg)
    });
    console.log({ senderUid, reciverUid })
    // firebase.database()
    //.ref(`msg/${reciverUid}`)
    //.child(senderUid)
    // .push(msg)
    //.catch(err => console.error(err));


  };

  RendrChat = (item) => {
    if (item.mine) {
      return (
        <View key={Math.random()} style={item.uri ? styles.Image : styles.sendMsg} >
          {item.uri && (
            <Card >
              <CardItem cardBody >


                <Image
                  style={{ height: 200, width: null, flex: 1, resizeMode: 'cover' }}
                  resizeMode={'cover'}
                  source={{
                    uri: item.uri
                  }}
                />

              </CardItem>
            </Card>
          )}
          {item.msg ? (
            <Text style={{ alignSelf: "flex-start" }}>{item.msg}</Text>
          ) : null}
          <Text style={{ fontSize: 10, alignSelf: "flex-end" }}>
            {item.time}
          </Text>
        </View>
      );
    } else {
      return (
        <View key={Math.random()} style={item.uri ? styles.Imagerecived : styles.resevedMsg} >
          {item.url && (//if msg content image 
            <Card >
              <CardItem cardBody >
                <Image
                  style={{ height: 200, width: null, flex: 1, resizeMode: 'cover' }}
                  resizeMode={'cover'}
                  source={{
                    uri: item.url
                  }}
                />

              </CardItem>
            </Card>
          )}
          {item.msg ? (
            <Text style={{ alignSelf: "flex-start" }}>{item.msg}</Text>
          ) : null}
          <Text style={{ fontSize: 10, alignSelf: "flex-end" }}>
            {item.time}
          </Text>
        </View>
      );

    }
  }

  render() {

let data=this.props.lastChat?this.props.lastChat:[];
console.log({lastChat:this.props.lastChat,data});
    return (
      <Container>
        <ImageBackground source={bg} style={{ flex: 1, width: "100%", height: "100%" }}>
          {/* <ScrollView
            ref={ref => (this.scrollView = ref)}
            onContentSizeChange={() => {
             
             this.scrollView.scrollToEnd({ animated: true });
            }}
          > */}
          <FlatList data={data}

            initialNumToRender={3}
            ref={ref => this.ScrollView = ref}
            inverted={false}
            style={{ transform: [{ scaleY: -1 }] }}
            renderItem={({ item, index }) => (
              <View style={{ transform: [{ scaleY: -1 }] }}>
                {this.RendrChat(item)}
              </View>
            )}
            ListHeaderComponent={() =>
              (<View on style={{ marginBottom: 70 }}></View>)
            }
            //    onLayout={
            //()=>this.ScrollView.scrollToEnd({animated:false})
            //  }
            extraData={(item, index) => console.log({ item, index })}

          >

          </FlatList>
          <View style={{ flex: 10 }}>




          </View>



          <View style={{ flexDirection: "row", marginBottom: 10, zIndex: 0, position: 'absolute', bottom: 0 }}>


            <View style={styles.textAreaView}>

              <Textarea
                multiline={true}
                maxLength={100}
                onChangeText={msg => this.setState({ msg })}
                style={styles.textArea}
                value={this.state.msg}
              />
              <TouchableWithoutFeedback onPress={this.handelChoosePhoto} style={{ position: 'absolute', right: 0 }}>
                <Badge style={styles.cameraIcon}>
                  <Icon size={30} name="camera-alt" color="black" />
                </Badge>
              </TouchableWithoutFeedback>
            </View>

            <View style={{ flex: 15 }}>
              <TouchableWithoutFeedback onPress={(e) => this.handelSendMsg(e)}>
                <Badge style={styles.senIconView}>
                  <Icon
                    size={30}
                    name={this.state.msg ? "send" : "mic"}
                    color="white"
                    style={this.state.msg ? styles.sendIcon : {}}
                  />
                </Badge>
              </TouchableWithoutFeedback>
            </View>
          </View>

        </ImageBackground>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  sendMsg: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "rgb(226, 255, 201);",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 15,
    minWidth: "40%"
  },
  resevedMsg: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 15,
    minWidth: "40%"
  },

  sendIcon: {
    // color: "white",
    // transform: [{ rotate: "180deg" }]
  },
  Image: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "rgb(226, 255, 201);",
    borderRadius: 10,
    padding: 3,
    width: "60%"
  },
  Imagerecived: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 3,
    width: "60%"
  },
  senIconView: {
    width: 50,
    height: 50,
    backgroundColor: "#00897b",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },

  cameraIcon: {
    flex: 1,
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  textAreaView: {
    flex: 90,
    flexDirection: "row",
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: "white",

    minHeight: 40
  },
  textArea: { flex: 9, width: "95%", height: "100%" }
});

mapStateToProps = state => {
  console.log({ state })
  return {
    auth: state.auth,
    msg: "",
    lastChat: state.chat.lastChat ,//&& state.chat.lastChat.reverse(),
    url: state.chat.url,
    uri: state.chat.uri,
    path: state.chat.path,
    senderUid: state.chat.senderUid,
    reciverUid: state.chat.reciverUid,
    friends: state.chat.friends,
  };
};
export default connect(
  mapStateToProps,
  { prepareSenderReciverChat, sendMsg }
)(Chat);

//export default Chat;