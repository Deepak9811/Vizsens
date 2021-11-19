import React, {Component} from 'react';

import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Appbar, Button, Card, TextInput} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IconAntDesign from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

console.disableYellowBox = true;

class StaffOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slipID: '',
      showDetails: false,
      visibleImage1New: false,
      loader: true,
      image1: require('./image/camera.png'),
    };
  }

  async onSuccess(e) {
    const scanID = e.data;

    if (scanID != '') {
      this.setState({
        slipID: scanID,
        showDetails: true,
      });

      const asy = await AsyncStorage.getItem('scanid');

      console.warn('Qr Scanner', asy);

      console.log('slip id => ', this.state.slipID);
      this.getDataBySlipId();
    } else {
      console.log('scan');
    }
  }

  async getDataBySlipId() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    console.log('this.state.slipId=>>>>>', this.state.slipID);
    fetch(
      `https://ashoka.vizsense.in/api/sslog?id=${this.state.slipID}&mode=2`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: tokenn,
          uid: terminal,
        },
      },
    )
      .then(result => {
        result.json().then(resp => {
          console.log(resp);
          if (resp.response === 'success') {
             
              this.props.navigation.navigate("Home")
              alert(resp.message)
            
            // ToastAndroid.showWithGravity(
            //     resp.message,
            //     ToastAndroid.SHORT,
            //     ToastAndroid.TOP,
            //   );

            console.log(resp);
          } else {
            Alert.alert('', 'Something wents wrong.', [{text: 'Okay'}]);
            this.setState({
              loader: false,
            });
          }
        });
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });
  }

  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <QRCodeScanner
          showMarker
          // reactivate={true}

          onRead={e => this.onSuccess(e)}
          cameraStyle={{height: SCREEN_HEIGHT}}
          customMarker={
            <View style={styles.rectangleContainer}>
              <View style={styles.topOverlay}>
                <Text style={{fontSize: 30, color: 'white'}}></Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={styles.leftAndRightOverlay} />

                <View style={styles.rectangle}>
                  <Icon size={SCREEN_WIDTH * 0.73} color={iconScanColor} />
                  <Animatable.View
                    style={styles.scanBar}
                    direction="alternate-reverse"
                    iterationCount="infinite"
                    duration={1700}
                    easing="linear"
                    animation={this.makeSlideOutTranslation(
                      'translateY',
                      SCREEN_WIDTH * -0.54,
                    )}
                  />
                </View>

                <View style={styles.leftAndRightOverlay} />
              </View>

              <View style={styles.bottomOverlay} />
            </View>
          }
        />
      </View>
    );
  }
}

const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = '#fff';

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = '#22ff00';

const iconScanColor = 'blue';

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // borderRadius:10
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25,
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },

  cardShadow: {
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  ttl: {
    backgroundColor: '#ffffff',
  },
  carCa: {
    width: '85%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '5%',
  },
  pkr: {
    flex: 1,
    width: '100%',
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    borderColor: 'black',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#f3f3f3',
  },
  fnts: {
    fontSize: 18,
    color: '#212529',
  },
  cl: {
    color: '#6f6f6f',
  },
  wd: {
    width: '33%',
  },
  cr: {
    margin: '5%',
    marginTop: '5%',
  },
  cdm: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '5%',
  },
  mgaw: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  mgt: {
    marginTop: '5%',
  },
  inp: {
    marginBottom: '5%',
  },
  mText: {
    backgroundColor: '#fff',
    padding: 5,
    height: 40,
    width: 300,
    borderColor: '#333',
    borderStyle: 'solid',
    borderWidth: 1,
  },

  textFocus: {
    backgroundColor: '#eee',
    borderColor: '#5d05d5',
  },
  centCam: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centCamInfo: {
    fontSize: 16,
    marginTop: '5%',
    marginBottom: '5%',
    textAlign: 'center',
    width: '100%',
  },
};

export default StaffOut;
