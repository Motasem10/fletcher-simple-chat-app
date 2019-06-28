import React, { Component } from "react";
import { Button } from "native-base";
import {
  View,
  Image,
  StyleSheet,
  Text,
  AsyncStorage
} from "react-native";
//import Button from '../common/button'
import logo from "../../img/logo.jpg";


class Header extends Component {
  componentWillMount() {
    AsyncStorage.getItem("token")
      .then(token => {
        if (token) this.props.navigation.navigate("TabNav");
      })
      .catch(err => console.log("err in componentwillmount ", err));
  }
  render() {
    return (
      <View style={styles.view}>
        <Image style={styles.image} source={logo} />
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Login")}
            full
            success
          >
            <Text style={styles.text}>Login</Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => this.props.navigation.navigate("SignUp")}
          
          >
            <Text style={styles.text}>SignUp</Text>
          </Button>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  view: {
    flex: 1,

    alignItems: "center"
  },
  image: {
    height: 100,
    width: 200,
    marginTop: "40%",
    flex: 15
  },
  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16
  },
  buttons: {
    flex: 80 ,
    flexDirection: "column",
    width: "80%",
    marginTop:30
  },
  button: {
    marginTop: 10,
    borderRadius:20,
    alignItems: "center"
  }
});
export default Header;
