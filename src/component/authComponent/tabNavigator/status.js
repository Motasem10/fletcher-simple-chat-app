import React, { Component } from "react";
import {
  Text,
  Container,
  Thumbnail,

  Content,
  View
} from "native-base";
import myStatus from "../../../img/image1.jpg";
import Icon from "react-native-vector-icons/MaterialIcons";
class Status extends Component {
  renderStatus = (source, header, text) => {
    return (
      <View
        style={{ alignSelf: "flex-start", padding: 5, flexDirection: "row" }}
      >
        <Thumbnail
          style={{ borderWidth: 2, borderColor: "#169386" }}
          source={source}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontWeight: "bold", marginLeft: 2 }}>{header}</Text>
          <Text style={{ marginLeft: 8 }}>{text}</Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <Container>
          <View style={{flexDirection:'column',position:'absolute',right:5,bottom:0}}>
            <View 
            style={{    backgroundColor: "#efecec",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",
            margin: 10,
            width: 50,
            height: 50,
            borderRadius: 50}}
            >
<Icon   name='edit' color='#274350' size={25}  />
            </View>
            <View style={{    backgroundColor: "#20c659",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    margin: 10,
    width: 50,
    height: 50,
    borderRadius: 50}} >
<Icon size={30} name='camera-alt' color='white' />
            </View>
          </View>
        <Content>
     
          <View  style={{ color: "black", position: "absolute",right:5,top:20 }}>
          <Icon
            name="more-horiz" size={20}
           color='black'
          />
          </View>
          {this.renderStatus(myStatus, "My status", "just Now")}
          <View
            style={{
              height: 30,
              backgroundColor: "rgb(247, 247, 247)",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#169386" }}>Recent updates</Text>
          </View>
          {this.renderStatus(myStatus, "Kariem", "from 10 minuts")}
          {this.renderStatus(myStatus, "Ahmed", "from 1 Hour")}
          {this.renderStatus(myStatus, "khaled", "Today 2:15pn")}

          <View
            style={{
              height: 30,
              backgroundColor: "rgb(247, 247, 247)",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#169386" }}> Viewed updates</Text>
          </View>
          {this.renderStatus(myStatus, "khaled", "Yesterday, 2:15pm")}
        </Content>
      </Container>
    );
  }
}

export default Status;
