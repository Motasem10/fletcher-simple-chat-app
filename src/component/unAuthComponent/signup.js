import React, { Component } from "react";
import validation from "../../validation/signupValidation";
import { connect } from "react-redux";
import { registerUser, loginUser } from "../../action/authAction";
import { StyleSheet, Image, View, TouchableOpacity } from "react-native";
import logo from "../../img/logo.jpg";
import {
  Button,
  Input,
  Root,
  Label,
  Content,
  Text,
  Icon,
  ActionSheet,
  Form,
  Item,
  Container,
  Spinner
} from "native-base";

import imagePicker from "react-native-image-picker";
class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      password: "",
      password2: "",

      errors: {},
      image: ""
    };
  }

  componentWillReceiveProps(props) {
    if (props.errors) {
      this.setState({ errors: props.errors });
    }
  }

  handelChoosePhoto = () => {
    ActionSheet.show(
      {
        options: [
          { text: "camira", icon: "camera", iconColor: "green" },
          { text: "Galary", icon: "image", iconColor: "green" },
          { text: "cancl", icon: "exit", iconColor: "green" }
        ],
        cancelButtonIndex: 2
      },
      ButtonIndex => {
        if (ButtonIndex == 0) {
          imagePicker.launchCamera({}, res => {
            this.setState({ image: res.uri });
          });
        } else if (ButtonIndex == 1) {
          imagePicker.launchImageLibrary({}, res => {
            if (res.fileSize > 1024 * 1024) {
              return alert("the maxmum sizee of image is 1MB");
            }
            this.setState({ image: res.uri });
          });
        }
      }
    );
  };
  handelSubmit = () => {
        // console.log('from handel submit ',this.state)
        const { errors, isvalid } = validation(this.state);
       if (!isvalid) return this.setState({ errors, errors });
        this.props
            .registerUser(this.state)
            .then(data => {
              this.props.loginUser(data);
            })
          .catch(err => {
            console.log(err);
          });
  };

  render() {
    const { errors } = this.state;
    return (
      <Container>
        <Content>
          <Root>
            <View style={styles.view}>
              <Image style={styles.image} source={logo} />
              <Form style={styles.form}>
                <Item stackedLabel>
                  <Label>
                    <Icon
                      name="md-person"
                      style={{ fontSize: 18, color: "green" }}
                    />
                    Name
                  </Label>
                  <Input
                    onChangeText={name => {
                      this.setState({ name, errors: {} });
                    }}
                  />
                </Item>
                {errors.name && (
                  <Text style={{ color: "#f99898" }}>{errors.name}</Text>
                )}
                <Item stackedLabel>
                  <Label>
                    <Icon
                      name="mail"
                      style={{ fontSize: 18, color: "green" }}
                    />{" "}
                    E-mail
                  </Label>
                  <Input
                    onChangeText={email => this.setState({ email, errors: {} })}
                  />
                </Item>
                {errors.email && (
                  <Text style={{ color: "#f99898" }}> {errors.email} </Text>
                )}
                <Item stackedLabel>
                  <Label>
                    <Icon
                      name="md-lock"
                      style={{ fontSize: 18, color: "green" }}
                    />{" "}
                    Password
                  </Label>
                  <Input
                    secureTextEntry={true}
                    onChangeText={password =>
                      this.setState({ password, errors: {} })
                    }
                  />
                </Item>
                {errors.password && (
                  <Text style={{ color: "#f99898" }}> {errors.password} </Text>
                )}
                <Item stackedLabel>
                  <Label>
                    <Icon
                      name="md-lock"
                      style={{ fontSize: 18, color: "green" }}
                    />{" "}
                    Confirm Password
                  </Label>
                  <Input
                    secureTextEntry={true}
                    onChangeText={password2 => this.setState({ password2 })}
                  />
                </Item>
                {errors.password2 && (
                  <Text style={{ color: "#f99898" }}> {errors.password2} </Text>
                )}
                <Item
                  style={{ borderBottomWidth: 0 }}
                  inlineLabel={true}
                  bordered="true"
                  // fixedLabel={true}
                  underline={false}
                >
                  <Text>
                    <Icon
                      name="md-images"
                      style={{ fontSize: 18, color: "green" }}
                    />{" "}
                    Image{" "}
                  </Text>
                  <TouchableOpacity onPress={() => this.handelChoosePhoto()}>
                    <Icon
                      style={{ marginLeft: 50, fontSize: 50 }}
                      name="md-cloud-upload"
                    />
                  </TouchableOpacity>
                  <Text>{this.state.image ? "uploaded sucsessfully" : ""}</Text>
                  {errors.password2 && (
                  <Text style={{ color: "#f99898" }}> {errors.password2} </Text>
                )}
                </Item>
                {this.props.auth.isLoading ? (
                  <Spinner />
                ) : (
                  <Button
                    onPress={this.handelSubmit}
                    style={styles.button}
                    full
                    success
                  >
                    <Text>SignUp</Text>
                  </Button>
                )}
              </Form>
            </View>
          </Root>
        </Content>
      </Container>
    );
  }
}
const mapStateToProps = state => {
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
    marginTop: "10%",
    flex: 15
  },

  text: {
    fontWeight: "bold",
    color: "green",
    marginTop: 10,

    fontSize: 16
  },
  form: {
    flex: 80,
    flexDirection: "column",
    width: "80%",
    marginTop: 40
  },
  button: {
    marginTop: 30,
    borderRadius: 20,
    alignItems: "center"
  }
});
export default connect(
  mapStateToProps,
  { registerUser, loginUser }
)(SignUp);
