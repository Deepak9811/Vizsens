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
  Alert,ActivityIndicator
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Picker as SelectPicker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';



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



const Stack = createNativeStackNavigator();

export default class Apps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
    
    };
  }

  async componentDidMount() {
    // await AsyncStorage.clear();
    SplashScreen.hide()
  
      const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
      const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
  
      this.setState({
        token: tokenn,
        terminalId: terminal,
      });
  
      console.log('App token 😃 ', tokenn,terminal);
  
      // if(tokenn !== null){
      //   console.log("token")
        this.props.navigation.navigate("Blue")
  
      // }else{console.log('else')}
    
    }




  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {/* {this.state.token !== null ? ( */}
            <>
            <Stack.Screen name="Nav" component={Nav}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Bluetooth" component={Bluetooth} />
              <Stack.Screen name="Home" component={Home} />

              <Stack.Screen name="Visitor" component={Visitor} />

              <Stack.Screen name="VisitorReason" component={VisitorReason} />

              <Stack.Screen name="VisitorAcc" component={VisitorAcc} />
              <Stack.Screen name="PrintVisitor" component={PrintVisitor} />
              <Stack.Screen name="ReadQr" component={ReadQr} />

              
           
            </>
          {/* ) : (
            <>
            
            <Stack.Screen name="Login" component={Login}/>
            </>
          )} */}

          {/* <Stack.Screen name="popup" component={PopUp} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


 class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      purposeValue: '',
      purposeIndexValue: '',
      terminalData: [],
      check_textInputChange: false,
      secureTextEntry: true,
      loader:false
    };
  }

  textInputchange(val) {
    if (val.length !== 0) {
      this.setState({
        email: val,
        check_textInputChange: true,
      });
    } else {
      this.setState({
        email: val,
        check_textInputChange: false,
      });
    }
  }

  handlePasswordChange(val) {
    this.setState({
      password: val,
    });
  }

  updateSecureTextEntry() {
    this.setState({
      secureTextEntry: false,
    });
  }

 

 async componentDidMount() {

  SplashScreen.hide()

    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    this.setState({
      token: tokenn,
      terminalId: terminal,
    });

    console.log('App token 😃 ', tokenn,terminal);

    // if(tokenn !== null){
    //   console.log("token")
      this.props.navigation.navigate("Blue")

    // }else{console.log('else')}



    fetch(`https://ashoka.vizsense.in/api/terminal/0`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(data => {
        data.json().then(async resp => {
          if (resp.response === 'success') {
            this.setState({
              terminalData: resp.data,
            });
          }
        });
      })
      .catch(error => {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });
  }

  onPickerValueChange = (value, index, label) => {
    this.setState(
      {
        purposeValue: value,
        // purposeName: this.state.terminalData[index].p_name,
      },
      // () => {
      //   console.log(this.state.terminalData[index].p_name);
      // },
    );
  };

  check() {
    if (
      this.state.email === '' ||
      this.state.pass === '' ||
      this.state.purposeValue === ''
    ) {
     Alert.alert('', 'Please enter your account details to login.', );
      
    } else if (
      this.state.email !== '' &&
      this.state.pass !== '' &&
      this.state.purposeValue !== ''
    ) {
      this.signIn();
    }
  }

  signIn() {
    this.setState({loader:true})
    console.log(this.state.email, this.state.pass, this.state.purposeValue);

    fetch(
      `https://ashoka.vizsense.in/api/login?loginId=${this.state.email}&password=${this.state.pass}&terminalid=${this.state.purposeValue}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
            'content-type': 'application/json',
        },
   
      },
    ).then(result => {
      result.json().then(async resp => {
        console.log(resp);
        if (resp.response === 'success') {
          console.log(resp.data.terminalid);
          try {
            // await AsyncStorage.setItem('visitorId',JSON.stringify(resp.data.visitorId));

            await AsyncStorage.setItem("token",JSON.stringify(resp.data.token))
            await AsyncStorage.setItem("terminalid",JSON.stringify(resp.data.terminalid))
            const tokenn = await AsyncStorage.getItem("token")

            this.setState({
              loader: false,
            });

            // this.props.navigation.navigate("Blue")
          this.props.navigation.navigate('Blue');
            

            console.log(tokenn)
            
          } catch (error) {
            console.log("local login : ",error)
            this.setState({
              loader: false,
            });
          }
        } else {
          this.setState({
            loader: false,
          });
          ToastAndroid.showWithGravity(
            resp.message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      });
    });
  }
  render() {
    return (
      <>
      <SafeAreaProvider style={styles.container}>
        <StatusBar backgroundColor="#fff9" barStyle="dark-content" />

        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
            marginTop: '10%',
          }}>
          <Image source={require('./components/image/partner.png')} />
        </View>

        {/* <View style={styles.header}>
          <Text style={[styles.text_header, {color: '#05375a'}]}>
            {' '}
            Welcome!{' '}
          </Text>
        </View> */}


        {this.state.loader ? (
          <>
            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                elevation: 3,
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}></View>
            <View
              style={{
                flex: 1,
                width: '100%',
                position: 'absolute',
                elevation: 3,
                top: '50%',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color="#0d6efd" />
            </View>
          </>
        ) : null}

        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* --------TERMINAL----------- */}
            <View>
              <Text style={styles.text_footer}> Termname </Text>
              <View style={styles.action}>
                <MaterialCommunityIcons name="door" color="#05375a" size={25} />

                <SelectPicker
                  style={styles.textInput}
                  // mode="dropdown"
                  selectedValue={this.state.purposeValue}
                  onValueChange={(value, index, label) => {
                    this.onPickerValueChange(value, index, label),
                      this.setState({
                        purposeIndexValue: value,
                      });
                  }}>
                  {this.state.terminalData.map((item, i) => (
                    <SelectPicker.item
                      label={item.termname}
                      color="#6f6f6f"
                      value={item.termid}
                    />
                  ))}
                </SelectPicker>
              </View>
            </View>

            {/* --------Email-------------------- */}

            <View>
              <Text style={[styles.text_footer, {marginTop: 20}]}> Email </Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color="#05375a" size={20} />

                <TextInput
                  returnKeyType="next"
                  placeholder="Your Email"
                  style={styles.textInput}
                  value={this.state.email}
                  onChangeText={val => {
                    this.textInputchange(val);
                    this.setState({
                      email: val,
                    });
                  }}
                />
                {this.state.check_textInputChange ? (
                  <Animatable.View animation="bounceIn">
                    <Feather name="check-circle" color="green" size={20} />
                  </Animatable.View>
                ) : null}
              </View>
            </View>

            {/* ------------Password------------- */}
            <Text style={[styles.text_footer, {marginTop: 20}]}>
              {' '}
              Password{' '}
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color="#05375a" size={20} />

              <TextInput
                secureTextEntry={this.state.secureTextEntry ? true : false}
                returnKeyType="next"
                placeholder="Your Password"
                style={styles.textInput}
                value={this.state.pass}
                onChangeText={val => {
                  this.handlePasswordChange(val);
                  this.setState({
                    pass: val,
                  });
                }}
              />
              <TouchableOpacity onPress={() => this.updateSecureTextEntry()}>
                {this.state.secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        secureTextEntry: true,
                      })
                    }>
                    <Feather name="eye" color="green" size={20} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.check()}>
              <LinearGradient
                colors={['#fe8c00', '#fe8c00']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </Animatable.View>
      </SafeAreaProvider>
    </>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
