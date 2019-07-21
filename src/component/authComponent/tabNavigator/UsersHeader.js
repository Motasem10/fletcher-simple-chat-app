import React, { Component } from "react";

import { View, Header, Title, Thumbnail,Text } from "native-base";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

class UsersHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Header style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableWithoutFeedback
            onPress={() => {
           
              this.props.navigation.navigate("HomeApp");
            }}
          >
            <Icon size={24} color="white" name="arrow-back" />
          </TouchableWithoutFeedback>

          <View style={{flexDirection:'column' ,marginLeft:10}}>
          <Title >Select contact</Title>
            <Text style={{fontSize:15,color:'white'}} >{this.props.navigation.getParam('Users') ?this.props.navigation.getParam('Users')+' contacts':''  } </Text>
     </View>
          
        </View>
        <View style={styles.headerRight}>
    
          <Icon
            size={24}
            style={{ marginRight: 5 }}
            color="white"
            name="search"
          />
          <Icon
            size={24}
            style={{ marginRight: 5 }}
            color="white"
            name="more-vert"
          />
        </View>
  
      </Header>
    );
  }
}
const styles = StyleSheet.create({
  header: { backgroundColor: "#075e54", flexDirection: "row" },
  headerLeft: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  thumbnail: { padding: 10, transform: [{ scale: 0.6 }] },
  headerRight: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row"
  },
  

});

export default UsersHeader;
