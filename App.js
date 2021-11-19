import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home';
import Visitor from './components/Visitor';
import VisitorReason from './components/VisitorReason';
import VisitorAcc from './components/VisitorAcc';
import Login from './components/Login';
import Bluetooth from './components/Bluetooth';
import PrintVisitor from './components/PrintVisitor';
import ReadQr from './components/ReadQr';
import SplashScreen from 'react-native-splash-screen';
import PopUp from './components/PopUp';
import Nav from './components/Nav';
import VisitorWithoutMobile from './components/VisitorWithoutMobile';
import Staff from './components/Staff';
import StaffIN from './components/StaffIn';
import StaffOut from './components/StaffOut';
import Courier from './components/Courier';
import ListInside from './components/ListInside';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    };
  }

  async componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Bluetooth" component={Bluetooth} />
            <Stack.Screen name="Home" component={Home} />

            <Stack.Screen name="Courier" component={Courier} />

            <Stack.Screen name="Visitor" component={Visitor} />
            <Stack.Screen
              name="VisitorWithoutMobile"
              component={VisitorWithoutMobile}
            />
            <Stack.Screen name="VisitorReason" component={VisitorReason} />
            <Stack.Screen name="VisitorAcc" component={VisitorAcc} />

            <Stack.Screen name="Staff" component={Staff} />
            <Stack.Screen name="StaffIN" component={StaffIN} />
            <Stack.Screen name="StaffOUT" component={StaffOut} />

            <Stack.Screen name="PrintVisitor" component={PrintVisitor} />
            <Stack.Screen name="ReadQr" component={ReadQr} />

            <Stack.Screen name="ListInside" component={ListInside} />
          </>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});
