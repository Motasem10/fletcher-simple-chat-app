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
import locale from '../../../locale';
import isRtl from '../../../isRTL';

const Status=()=> {


  renderStatus = (source, header, text) => {
    return (
      <View
        style={{ alignSelf: "flex-start", padding: 5, flexDirection: "row" }}
      >
        <Thumbnail
          style={{ borderWidth: 2, borderColor: "#817b7b" }}
          source={source}
        />
        <View style={{ flexDirection: "column",alignItems:'flex-start',marginLeft:10}}>
          <Text style={{ fontWeight: "bold",}}>{header}</Text>
          <Text style={{ }}>{text}</Text>
        </View>
      </View>
    );
  };

    return (
      <Container>
        
          <View style={{flexDirection:'column',position:'absolute',right:5,bottom:0}}>
            <View 
            style={{ 
           
              backgroundColor: "#efecec",
              
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
          {this.renderStatus(myStatus, locale.status.myStatus,locale.status.now)}
          <View
            style={{
              height: 30,
              backgroundColor: "rgb(247, 247, 247)",
              justifyContent: "center",
             
            }}
          >
            <Text style={{ color: "#817b7b" }}>{locale.status.recent}</Text>
          </View>

          {this.renderStatus(myStatus, "Kariem",isRtl?'قبل 10 دقيقة': "from 10 minuts")}
          {this.renderStatus(myStatus, "Ahmed",isRtl?"منذ ساعة": "from 1 Hour")}
          {this.renderStatus(myStatus, "khaled", isRtl?"اليوم 10:20 ":"Today 2:15pn")}

          <View
            style={{

              height: 30,
              backgroundColor: "rgb(247, 247, 247)",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#817b7b",marginLeft:10}}>{locale.status.viewed}</Text>
          </View>
          {this.renderStatus(myStatus, "khaled", isRtl?"الامس 2:15":"Yesterday, 2:15pm")}
        </Content>
      </Container>
    );
  
}

export default Status;
