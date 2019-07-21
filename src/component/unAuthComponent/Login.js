import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity,Text } from "react-native";
import logo from "../../img/logo.jpg";
import { loginUser } from "../../action/authAction";
import {
  Button,
  Spinner,
  Input,
  Icon,
  Label,
  Form,
  Item,
  Container,
  Content
} from "native-base";
import isRtl from '../../isRTL'
import locale from '../../locale'
import validation from "../../validation/loginValidation";
import { connect } from "react-redux";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      isloading: false,
      isRTL:isRtl
    };
  }


  componentWillReceiveProps = (props) => {

    if (props.errors) {

      this.setState({ errors: props.errors });
    }
  }
  onsubmit = () => {
    const { errors, isvalid } = validation(this.state);
    if (!isvalid) return this.setState({ errors });

    const { email, password } = this.state;
    this.props.loginUser({ email, password });
  };
  renderButton = () => {
    const button = this.props.auth.isLoading ?
      (
        <Spinner />
      ) : (
        <Button style={styles.button} onPress={this.onsubmit} full success>
          <Icon
            name="md-log-in"
            style={{ color: "white", margin: 0, padding: 0 }}
          />
          <Text style={{ color: "white", margin: 0, padding: 0,fontWeight:'bold' }}>{locale.auth.loginButton}</Text>
        </Button>
      );
    return button;
  };
  render() {
    const { errors ,isRTL} = this.state;
    return (
      <Container>
        <Content>
          <View style={styles.view}>
            <Image style={styles.image} source={logo} />
            <Form style={styles.form}>
             <Item stackedLabel >
                <Label  style={styles.Rtl}>
              <Icon name="mail" style={{ fontSize: 18,...styles.ltrIcon }} />
                 {locale.auth.email} { '  '}
                 <Icon name="mail" style={{ fontSize: 18, ...styles.rtlIcon}} />  
              </Label>
                <Input
               style={styles.textInput}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email, errors: {} })}
                />
              </Item>
              {errors.email && (
                <Text style={{ color: "#f99898",...styles.Rtl }}> {errors.email} </Text>
              )}
             <Item success stackedLabel last  >
                <Label style={styles.Rtl}>
                 <Icon name="md-key" style={{ fontSize: 18,...styles.ltrIcon }} />
                 <Text style={styles.Rtl}>{locale.auth.password}{ '  '}</Text>
                 <Icon name="md-key" style={{ fontSize: 18, ...styles.rtlIcon }} />
              </Label>
                <Input
               style={styles.textInput}
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={password =>
                    this.setState({ password, errors: {} })
                  }
                />
              </Item>
              {errors.password && (
                <Text style={{ color: "#f99898",...styles.Rtl }}>{errors.password}</Text>
              )}

              {this.renderButton()}
              {//this.props.auth.isLoading
                false ||
                <TouchableOpacity
                  onPress={() => {
                    console.log("hi");
                    this.props.goToRegisterPage();
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.text}>{locale.auth.createAccount}</Text>
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
    //width:'90%',
    alignItems: "center",
   // transform:[{scaleX:isRtl?-1:1}]
  },
  image: {
 //  transform:[{scaleX:isRtl?-1:1}],
    height: 100,
    width: 200,
    marginTop: "20%",
    marginBottom: "10%",
    flex: 15
  },

  text: {
  //  transform:[{scaleX:isRtl?-1:1}],
    fontWeight: "bold",
    color: "green",
    marginTop: 10,

    // flex:1,
    fontSize: 16
  },
  form: {
    flex: 80,
    flexDirection: "column",
 //   transform:[{scaleX:isRtl?-1:1}],
    width: "95%",

    //  marginTop: 40
  },
  Rtl:{
   // transform:[{scaleX:isRtl?-1:1}]
  },
  button: {
    marginTop: 30,
    alignSelf:'center',
    width:'80%',
  //  transform:[{scaleX:isRtl?-1:1}],
    flexDirection: "row",
    borderRadius: 20

  },
  textInput:{
    textAlign:isRtl?'right':'left',
    transform: [{ scaleX: isRtl ? -1 : 1 }]
      },
      rtlIcon: {
        color: isRtl ? 'green' : 'white'
      },
      ltrIcon: {
        color: !isRtl ? 'green' : 'white'
      }
});
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);

//export default Login