
import React, { Component } from 'react'
import {Image,View} from 'react-native'
import Logo from '../img/logo.jpg';
import {Spinner,Container,Content} from 'native-base'
 class SpinnerScreen extends Component {
  render() {
    return (
      <Container>
     <Content contentContainerStyle={{justifyContent:'center',flex:1 ,alignItems:'center',transform:[{scale:0.5}]}}>
  <Image source={Logo} style={{flex:1}}  />
  <View style={{alignItems:'center',justifyContent:'center',flex:2}}>
      <Spinner size={90} ></Spinner>
  </View>

         
    </Content>
 
      </Container>

    )
  }
}
export default SpinnerScreen;