import Login from "./Login";
import SignUp from "./signup";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import React, { Component } from "react";

//import console = require("console");
const deviceWidth = Dimensions.get("window").width;
 class rootStackNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTo: { x: 0, y: 0, animated: true }
    };
  }
  goToRegisterPage = () => {
    //console.log({this:this});
    this.scroller.scrollTo({ x: deviceWidth, y: 0 });
  };



  render() {
      return (
      <ScrollView
      contentContainerStyle={{flexGrow:1,justifyContent:'center'}}
        ref={scroll => (this.scroller = scroll)}
        scrollTo={this.state.scrollTo}
        horizontal={true}
        pagingEnabled={true}
        showHorizontalScrollIndecator={true}
      >
        <View style={styles.view}>
          <Login goToRegisterPage={this.goToRegisterPage.bind(this)} />
        </View>

        <View style={styles.view}>
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