import React, { Component } from "react";
import {
  View,
  Text,
  Thumbnail,
  Container,
  Content
} from "native-base";
import { StyleSheet } from "react-native";

import Image1 from '../../../img/image1.jpg';
import Image2 from '../../../img/image2.jpg';
import Image3 from '../../../img/image3.jpg';
import Image4 from '../../../img/image4.jpg';
import Icon from "react-native-vector-icons/MaterialIcons";
import isRtl from '../../../isRTL'
export default class Calls extends Component {
state={ 
    //Image, "aly", "january 10, 4:22AM", "recived")
    calls:[{
        type:'recived',
        image:Image1,
        name:'kariem',
        time:"january 10, 1:22AM"

    },
    {
        type:'',
        image:Image2,
        name:'mahmoud ahmed',
        time:"january 0, 4:22AM"

    },
    {
        type:'recived',
        image:Image3,
        name:'moatasem ',
        time:"january 10, 3:22PM"

    }
    ,{
        type:'',
        image:Image4,
        name:'amar',
        time:"january 10, 12:22PM"

    }

]
}
        

  renderCalls = (Image, title, text, callType) => {
    let handelCalltypeIcon;
    if (callType === "recived") {
      handelCalltypeIcon = {
        color: "red",
        name: "call-received"
      };
    } else {
      handelCalltypeIcon = {
        color: "#0b7f50",
        name: "call-made"
      };
    }

    return (
      <View style={styles.view} key={Math.random()}>
        <Thumbnail source={Image} />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.title}>{title}</Text>
          <View style={{ flexDirection: "row", }}>
            <Icon
              name={handelCalltypeIcon.name}
              size={20}
              color={handelCalltypeIcon.color}
            />
            <Text
              style={styles.text}
            >
              {text}
            </Text>
          </View>
        </View>
        <View style={styles.firstCallIcon}>
          <Icon name="call" color="#0b7f50" size={30} />
        </View>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Content style={{ flex: 1 }}>
      {this.state.calls.map(i=>this.renderCalls(i.image,i.name,i.time,i.type))}
        </Content>
        <View style={styles.secondCallIcon}>
          <Icon name="phone-in-talk" color="white" size={24} />
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignSelf: "flex-start",
    padding: 10,
    flexDirection: "row"
  },
  title: { fontWeight: "bold", marginLeft: 2,
  alignSelf:'flex-start',

  
},

  firstCallIcon: {
    flex: 8,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  secondCallIcon: {
    backgroundColor: "#20c659",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    margin: 10,
    width: 50,
    height: 50,
    borderRadius: 50
  },
  text:{
    //transform:[{scaleX:isRtl?-1:1}],
      marginLeft: 5,
      justifyContent: "center",
      alignItems: "center"
    
  },
  Rtl:{
    transform:[{scaleX:isRtl?-1:1}],
  }
});
