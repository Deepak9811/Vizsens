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

class ReaderQr extends Component {
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


    console.log("this.state.slipId=>>>>>",this.state.slipID)
    fetch(
      `https://ashoka.vizsense.in/api/getvisit?slipNo=${this.state.slipID}`,
      {
        method: 'GET',
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
          console.log(resp.data);
          if (resp.response === 'success') {
            this.setState({
              // visibleImage1New: true,
              // visibleImage2New: true,
              mobile: resp.data.mobile,
              fname: resp.data.fName,
              lname: resp.data.lName,
              // image1: resp.data.visitorPhoto,
              // image2: resp.data.idPhoto,
              // image3: resp.data.vehiclePhoto,
              // image4: resp.data.exPhoto,

              loader: false,
             
            });

            if (
              resp.data.visitorPhoto ||
              resp.data.idPhoto ||
              resp.data.vehiclePhoto ||
              resp.data.exPhoto
            ) {
              if (resp.data.visitorPhoto) {
                if (resp.data.visitorPhoto !== 'null') {
                  this.setState({
                    visibleImage1New: true,
                    image1: resp.data.visitorPhoto,
                  });
                }
              }if(resp.data.idPhoto){
                if (resp.data.idPhoto === 'null') {
                  this.setState({
                    visibleImage2New: false,
                   
                  });
                }else{
                  this.setState({
                    visibleImage2New: true,
                    image2: resp.data.idPhoto,
                  });
                }
              }if(resp.data.vehiclePhoto){
                if (resp.data.vehiclePhoto === 'null') {
                  this.setState({
                    visibleImage3New: false,
                  
                  });
                }else{
                  this.setState({
                    visibleImage3New: true,
                    image3: resp.data.vehiclePhoto,
                  });
                }
              }if(resp.data.exPhoto){
                if (resp.data.exPhoto === 'null') {
                  this.setState({
                    visibleImage4New: false,
                 
                  });
                }else{
                  this.setState({
                    visibleImage4New: true,
                    image4: resp.data.exPhoto,
                  });
                }
              }
              
              
              
            }

            console.log(this.state.mobile);
          }else{
            this.props.navigation.navigate('Home');
            Alert.alert('', resp.message, [{text: 'Okay'}]);
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
          ToastAndroid.BOTTOM,
        );
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });
  }

 async exitVisitor() {
    console.log('hello exit');

    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
  const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));


    fetch(`https://ashoka.vizsense.in/api/exit?slipNo=${this.state.slipID}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: tokenn,
        uid: terminal,
      },
    })
      .then(result => {
        result.json().then(resp => {
          console.log(resp);
          this.props.navigation.navigate('Home');
          ToastAndroid.showWithGravity(
            'Visitor Exit Success',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          // if (resp.response === 'success') {
          //   console.log(resp)
          //   this.props.navigation.navigate("Home")
          // }else{
          //   console.log("error in deleting")
          // }
        });
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
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
        {this.state.showDetails ? (
          <View
            animation="fadeInRight"
            // duration="1000"
            style={{flex: 1, backgroundColor: 'Animatable'}}>
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

            <Appbar.Header style={styles.ttl}>
              <TouchableOpacity
                style={{paddingLeft: '2%'}}
                onPress={() => this.props.navigation.goBack()}>
                <AntDesign name="arrowleft" color="#05375a" size={25} />
              </TouchableOpacity>

              <Appbar.Content title="Visitor Entry - Ashoka University, Sonipat" />
            </Appbar.Header>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.cr}>
                <View style={styles.cardShadow}>
                  <View style={styles.mgt}>
                    <View style={styles.cdm}>
                      {/* <View style={{marginBottom: '3%'}}>
                    <Text style={{color: '#959595'}}>
                      Please take print
                    </Text>
                  </View> */}

                      <Text style={styles.fnts}>
                        Name : {this.state.fname + ' ' + this.state.lname}
                      </Text>
                      <Text style={styles.fnts}>
                        Mobile : {this.state.mobile}
                      </Text>

                      <Text style={styles.fnts}>
                        Slip id : {this.state.slipID}
                      </Text>
                    </View>

                    {/* -------------CAMERA-ICON---------------------------- */}

                    <View style={styles.carCa}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          marginBottom: '5%',
                        }}>
                        <View style={{width: '43%'}}>
                          <Card>
                            <View style={styles.centCam}>
                              <Text style={styles.centCamInfo}>Visitor</Text>

                              {/* <Image
                                style={{
                                  height: 100,
                                  width: 100,
                                  marginBottom: '5%',
                                  borderRadius: 5,
                                }}
                                source={
                                  this.state.visibleImage1New
                                    ? {
                                        uri: `data:${this.state.mime};base64,${this.state.image1}`,
                                      }
                                    : this.state.image1
                                }
                              /> */}

                              <View>
                                {this.state.visibleImage1New ? (

                                  <Image
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginBottom: '5%',
                                      borderRadius: 5,
                                    }}
                                    // source={
                                    //   this.state.visibleImage1New
                                    //     ? {
                                    //         uri: `data:${this.state.mime};base64,${this.state.image1}`,
                                    //       }
                                    //     : this.state.image1
                                    // }

                                    source={{
                                      uri: `data:${this.state.mime};base64,${this.state.image1}`,
                                    }}
                                  />




                                  
                                ) : (
                                  <Text
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginTop: '8%',
                                      borderRadius: 5,
                                    }}>
                                    <FontAwesome
                                      name="user-o"
                                      size={90}
                                      color="#fe8c00"
                                    />
                                  </Text>
                                )}
                              </View>
                            </View>
                          </Card>
                        </View>

                        <View style={{width: '43%'}}>
                          <Card>
                            <View style={styles.centCam}>
                              <Text style={styles.centCamInfo}>ID Proof</Text>
                              <View
                                >
                                {this.state.visibleImage2New ? (
                                  <Image
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginBottom: '5%',
                                      borderRadius: 5,
                                    }}
                                    source={{
                                      uri: `data:${this.state.mime2};base64,${this.state.image2}`,
                                    }}

                                    // source={
                                    //   this.state.visibleImage2New
                                    //     ? {
                                    //         uri: `data:${this.state.mime};base64,${this.state.image2}`,
                                    //       }
                                    //     : this.state.image1
                                    // }
                                  />
                                ) : (
                                  



<Text
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginTop: '8%',
                                      borderRadius: 5,
                                    }}>
                                    <FontAwesome
                                      name="vcard-o"
                                      size={90}
                                      color="#fe8c00"
                                    />
                                  </Text>


                                  
                                )}
                              </View>
                            </View>
                          </Card>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <View style={{width: '43%'}}>
                          <Card>
                            <View style={styles.centCam}>
                              <Text style={styles.centCamInfo}>
                                Accessories
                              </Text>
                              <View
                                >
                                {this.state.visibleImage3New ? (
                                  <Image
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginBottom: '5%',
                                      borderRadius: 5,
                                    }}
                                    // source={
                                    //   this.state.visibleImage4New
                                    //     ? {
                                    //         uri: `data:${this.state.mime};base64,${this.state.image4}`,
                                    //       }
                                    //     : this.state.image1
                                    // }

                                    source={{
                                      uri: `data:${this.state.mime3};base64,${this.state.image3}`,
                                    }}
                                  />
                                ) : (

                                  <Text
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginTop: '8%',
                                      borderRadius: 5,
                                    }}>
                                    <FontAwesome5
                                      name="toolbox"
                                      size={90}
                                      color="#fe8c00"
                                    />
                                  </Text>


                                  
                                )}
                              </View>
                            </View>
                          </Card>
                        </View>

                        <View style={{width: '43%'}}>
                          <Card>
                            <View style={styles.centCam}>
                              <Text style={styles.centCamInfo}>Vehicle</Text>

                              <View>
                                {this.state.visibleImage4New ? (
                                  <Image
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginBottom: '5%',
                                      borderRadius: 5,
                                    }}
                                    source={{
                                      uri: `data:${this.state.mime4};base64,${this.state.image4}`,
                                    }}

                                    // source={
                                    //   this.state.visibleImage3New
                                    //     ? {
                                    //         uri: `data:${this.state.mime};base64,${this.state.image3}`,
                                    //       }
                                    //     : this.state.image1
                                    // }
                                  />
                                ) : (

                                  <Text
                                    style={{
                                      height: 100,
                                      width: 100,
                                      marginTop: '8%',
                                      borderRadius: 5,
                                    }}>
                                    <FontAwesome
                                      name="car"
                                      size={90}
                                      color="#fe8c00"
                                    />
                                  </Text>




                                  
                                )}
                              </View>
                            </View>
                          </Card>
                        </View>
                      </View>
                    </View>

                    {/* ------------------------------------------------------------------------- */}
                  </View>

                  <View style={{marginTop: '8%', marginBottom: '5%'}}>
                    <View style={styles.cdm}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={styles.wd}>
                          <LinearGradient
                            colors={['#fe8c00', '#fe8c00']}
                            style={{borderRadius: 5}}>
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.goBack();
                              }}
                              style={{
                                flexDirection: 'row',
                                padding: '5%',
                                borderRadius: 5,
                                width: '100%',justifyContent:"center",alignItems:"center"
                              }}>
                              <Text
                                style={{
                                  padding: '5%',
                                  // marginLeft: '7%',
                                  marginTop: '1%',
                                }}>
                                <AntDesign
                                  name="arrowleft"
                                  size={20}
                                  style={{color: 'white'}}
                                />
                              </Text>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  marginRight: '5%',
                                  fontSize: 16,
                                }}>
                                Back
                              </Text>
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>

                        <View style={styles.wd}></View>

                        <View style={styles.wd}>
                          <LinearGradient
                            colors={['#fe8c00', '#fe8c00']}
                            style={{borderRadius: 5}}>
                            <TouchableOpacity
                              onPress={() => this.exitVisitor()}
                              style={{
                                flexDirection: 'row',
                                padding: '5%',
                                borderRadius: 5,
                                width: '100%',justifyContent:"center",alignItems:"center"
                              }}>
                              <Text
                                style={{
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  // marginTop: '5%',
                                  marginLeft: '10%',
                                  fontSize: 16,
                                }}>
                                Exit
                              </Text>
                              <Text style={{padding: '5%'}}>
                                <IconAntDesign
                                  name={'exit-to-app'}
                                  size={20}
                                  style={{color: 'white'}}
                                />
                              </Text>
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                position: 'absolute',
                bottom: 0,
                marginLeft: '5%',
                alignItems: 'center',
                left: 0,
                right: 0,
              }}>
              <View style={styles.link}>
                <Image
                  source={require('./image/partner.png')}
                  style={{width: 200, height: 35}}
                />
              </View>
            </View>
          </View>
        ) : (
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
        )}
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

export default ReaderQr;
