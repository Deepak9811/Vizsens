import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from 'react-native-splash-screen';
import Login from './Login';
import Bluetooth from './Bluetooth';

export default class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };
  }

  async componentDidMount() {
    // await AsyncStorage.clear();

    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    this.setState({
      token: tokenn,
      terminalId: terminal,
    });

    console.log('App token 😃 ', tokenn, terminal);

    // if(tokenn !== null){
    //   console.log("token")
    // this.props.navigation.navigate('Blue');

    // }else{console.log('else')}
  }

  render() {
    return (
      <>

      {/* <Text>hello</Text> */}
      {this.state.token ==null ?(<Login/>):<Bluetooth/>}
        
        
      </>
    );
  }
}

const styles = StyleSheet.create({});
