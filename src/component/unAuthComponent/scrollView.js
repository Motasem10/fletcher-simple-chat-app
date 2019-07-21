import Login from "./Login";
import SignUp from "./signup";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import React, { Component } from "react";
const deviceWidth = Dimensions.get("window").width;
import isRtl from '../../isRTL';

 class rootStackNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTo: { x: 0, y: 0, animated: true },
      width:Dimensions.get("window").width
    };
  }
  goToRegisterPage = () => {
    //console.log({this:this});
    this.scroller.scrollTo({ x: isRtl?-deviceWidth:deviceWidth, y: 0 });
  };

onLayout=()=>{
 this.setState({width:Dimensions.get("window").width})
}
firstOnlayoutCalled=false;
  render() {
      return (
      <ScrollView
      onLayout={()=>{
        if(this.firstOnlayoutCalled){
          this.onLayout();}
      else{
        this.firstOnlayoutCalled=true;
      }
      }}
      contentContainerStyle={{flexGrow:1,justifyContent:'center',}}
        ref={scroll => (this.scroller = scroll)}
        scrollTo={this.state.scrollTo}
        horizontal={true}
        pagingEnabled={true}
        showHorizontalScrollIndecator={true}
      >
        <View style={{...styles.view ,width:this.state.width}}>
          <Login goToRegisterPage={this.goToRegisterPage.bind(this)} />
        </View>
        <View style={{...styles.view ,width:this.state.width}}>
          <SignUp />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: "white",
  //  flex: 1,
   width: Dimensions.get("window").width,
  //  justifyContent: "center",
   // alignItems: "center"
  }
});

export default rootStackNavigator;