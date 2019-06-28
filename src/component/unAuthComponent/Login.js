import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import logo from "../../img/logo.jpg";
//import { loginUser } from "../../action/authAction";
import {
  Button,
  Spinner,
  Input,
  Icon,
  Label,
  Text,
  Form,
  Item,
  Container,
  Content
} from "native-base";
//import validation from "../../validation/loginValidation";
//import { connect } from "react-redux";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      isloading: false
    };
  }


  // componentWillReceiveProps=(props)=>{
  
  // if(props.errors){
     
  //    this.setState({errors:props.errors});
  // } 
  // }
  // onsubmit =  () => {
  //   const { errors, isvalid } = validation(this.state);
  //   if (!isvalid)  return this.setState({ errors });
    
  //   const { email, password } = this.state;
  //   this.props.loginUser({ email, password });
  // };
  renderButton = () => {
   // const button = this.props.auth.isLoading  ? 
   const button=false ? (
      <Spinner />
    ) : (
      <Button style={styles.button} onPress={this.onsubmit} full success>
        <Icon
          name="md-log-in"
          style={{ color: "white", margin: 0, padding: 0 }}
        />
        <Text style={{ color: "white", margin: 0, padding: 0 }}>Login!</Text>
      </Button>
    );
    return button;
  };
  render() {
    const { errors } = this.state;
    return (
      <Container>
        <Content>
        <View style={styles.view}>
          <Image style={styles.image} source={logo} />
          <Form style={styles.form}>
            <Item stackedLabel>
              <Label>
                <Icon name="mail" style={{ fontSize: 18, color: "green" }} />{" "}
                E-mail
              </Label>
              <Input
                value={this.state.email}
                onChangeText={email => this.setState({ email, errors: {} })}
              />
            </Item>
            {errors.email && (
              <Text style={{ color: "#f99898" }}> {errors.email} </Text>
            )}
            <Item success stackedLabel last>
              <Label>
                <Icon name="md-key" style={{ fontSize: 18, color: "green" }} />{" "}
                Password
              </Label>
              <Input
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={password =>
                  this.setState({ password, errors: {} })
                }
              />
            </Item>
            {errors.password && (
              <Text style={{ color: "#f99898" }}>{errors.password}</Text>
            )}

            {this.renderButton()}
            {//this.props.auth.isLoading
            false ||
            <TouchableOpacity
              onPress={() => {
                console.log("hi");
            //    this.props.goToRegisterPage();
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={styles.text}>create New Account</Text>
              </View>
            </TouchableOpacity>}
          </Form>
        </View>
        </Content>
      </Container>
    );
  }
}
mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

const styles = StyleSheet.create({
  view: {
    flex: 1,

    alignItems: "center"
  },
  image: {
    height: 100,
    width: 200,
    marginTop: "20%",
    marginBottom: "10%",
    flex: 15
  },

  text: {
    fontWeight: "bold",
    color: "green",
    marginTop: 10,

    // flex:1,
    fontSize: 16
  },
  form: {
    flex: 80,
    flexDirection: "column",
    width: "80%",
  //  marginTop: 40
  },
  button: {
    marginTop: 30,
 
    flexDirection: "row",
    borderRadius: 20

  }
});
// export default connect(
//   mapStateToProps,
//   { loginUser }
// )(Login);

export default Login