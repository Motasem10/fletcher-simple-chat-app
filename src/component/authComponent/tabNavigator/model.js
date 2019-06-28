import React, { Component } from 'react'
import {Content,Container,Footer,Textarea,Badge } from 'native-base'
import {ImageBackground,View,TouchableWithoutFeedback,StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
export default class Model extends Component {
    constructor(props){
        super(props);
        this.state={
            msg:'',
            source:''
        }
    }
  render() {
      console.log('this.props..source',this.props.navigation.getParam('data'));
    return (
        
            <View style={{backgroundColor:'black',flexDirection:'column',flex:1}}>
          <ImageBackground style={{flex:8,width:'100%',height:'100%'}} source={{uri:this.props.navigation.getParam('data').source}}>
    
    </ImageBackground>
                <View style={{flex:2 ,backgroundColor:'black'}}>


                <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
              <View style={{ flex: 15 }}>
                <TouchableWithoutFeedback onPress={ ()=>{
                    this.props.navigation.goBack()
                    this.props.navigation.getParam('data').choosePhoto(this.props.navigation.getParam('data').source)}}>
                  <Badge style={styles.senIconView}>
                    <Icon
                      size={30}
                      name="send"
                      color="white"
                      style={ styles.sendIcon}
                    />
                  </Badge>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.textAreaView}>
             
                <Textarea
                placeholder='type text ... '
                  multiline={true}
                  maxLength={100}
               onChangeText={(msg)=>{this.props.navigation.getParam('data').onChangeText(msg)
               this.setState({msg});  
              }}
                  style={styles.textArea}
                  value={this.state.msg}
                />
              </View>
            </View>
         
         

                </View>
                <View style={{flex:1}}></View>
       </View>
    )
  }
}
const styles = StyleSheet.create({

    sendIcon: {
      // color: "white",
      transform: [{ rotate: "180deg" }]
    },
    senIconView: {
      width:50,
      height:50,
      backgroundColor: "#00897b",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center"
    },
  
    textAreaView: {
      flexDirection: "row",
      borderRadius: 30,
      backgroundColor: "white",

   alignItems:'flex-end'
    },
    textArea: {  width:"70%", height: "100%",color:'white',backgroundColor:'black' }
  });
