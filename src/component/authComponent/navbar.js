import React, { Component } from "react";
import {
  Container,

} from "native-base";
import AppContainer from './rootNavigator'


export default class navbar extends Component {

    render() {
    return (
      <Container>
      <AppContainer></AppContainer>
      </Container>
    );
  }
}








