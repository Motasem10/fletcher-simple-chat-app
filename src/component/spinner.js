
import React, { Component } from 'react'
import {Image,View} from 'react-native'
import Logo from '../img/logo.jpg';
import {Spinner,Container,Content} from 'native-base'
 class SpinnerScreen extends Component {
  render() {
    return (
      <Container>
     <Content contentContainerStyle={{justifyContent:'center',flex:1 ,alignItems:'center',}}>
       <View style={{flex: 1,
    //width:'90%',
    alignItems: "center",}}>
  <Image source={Logo} style={{flex:1,transform:[{scale:0.5}]}}  />
  <View style={{alignItems:'center',justifyContent:'center',flex:2}}>
      <Spinner size={90} ></Spinner>
  </View>

         </View>
    </Content>
 
      </Container>

    )
  }
}
export default SpinnerScreen;