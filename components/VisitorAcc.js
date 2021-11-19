import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {Appbar, Button, Card, TextInput} from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

export class VisitorAcc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: '',
      fname: '',
      lname: '',
      image_type: 'Visitor',
      govt_it: 'govt_id',
      accessories: 'accessories',
      vehicle: 'vehicle',
      visibleImage2: false,
      visibleImage3: false,
      visibleImage4: false,
      image1: '',
      mime: '',
      mime2: '',
      mime3: '',
      mime4: '',
      visibleImage1New: false,
      image2: '',
      image3: '',
      image4: '',
      loader: false,
      imageLoader: false,
      imageLoader2: false,
      imageLoader3: false,
      imageLoader4: false,
    };
  }

  cameraCapture() {
    this.setState({
      imageLoader: true,
    });

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.18,
      size: 25,
    })
      .then(image => {
        console.warn(image);
        this.setState({
          image1: image.data,
          mime: image.mime,
          visibleImage1New: true,
          imageLoader: false,
        });

        // this.onChangeImage(image)
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          imageLoader: false,
        });
      });
  }

  cameraCapture2 = () => {
    this.setState({
      imageLoader2: true,
    });

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.18,
      size: 25,
    })
      .then(image => {
        console.warn(image.size);
        this.setState({
          image2: image.data,
          mime2: image.mime,
          visibleImage2: true,
          imageLoader2: false,
        });
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          imageLoader2: false,
        });
      });
  };

  cameraCapture3 = () => {
    this.setState({
      imageLoader3: true,
    });

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.18,
      size: 25,
    })
      .then(image => {
        console.warn(image.size);
        this.setState({
          image3: image.data,
          mime3: image.mime,
          visibleImage3: true,
          imageLoader3: false,
        });
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          imageLoader3: false,
        });
      });
  };

  cameraCapture4 = () => {
    this.setState({
      imageLoader4: true,
    });

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.18,
      size: 25,
    })
      .then(image => {
        console.warn(image.size);
        this.setState({
          image4: image.data,
          mime4: image.mime,
          visibleImage4: true,
          imageLoader4: false,
        });
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
          imageLoader4: false,
        });
      });
  };

  async componentDidMount() {
    try {
      const localVisitorId = JSON.parse(
        await AsyncStorage.getItem('visitorId'),
      );

      const localMobile = JSON.parse(
        await AsyncStorage.getItem('visitorMobile'),
      );

      const localFirstName = JSON.parse(
        await AsyncStorage.getItem('visitorFirstName'),
      );

      const localLastName = JSON.parse(
        await AsyncStorage.getItem('visitorLastName'),
      );

      const meetingName = JSON.parse(await AsyncStorage.getItem('meetingName'));

      const purpose = JSON.parse(await AsyncStorage.getItem('purposeValue'));

      console.warn(
        'visitorId :',
        localVisitorId,
        ', visitorMobile : ',
        localMobile,
        ', visito Firstname : ',
        localFirstName,
        ', visitorLastName : ',
        localLastName,
        ',meeting : ',
        meetingName,
        ', purposeValue : ',
        purpose,
      );

      this.setState({
        vistorId: localVisitorId,
        mobile: localMobile,
        fname: localFirstName,
        lname: localLastName,
        meetingName: meetingName,
        purpose: purpose,
      });
    } catch (error) {
      console.warn('error in local data :', error);
    }
  }

  async saveVisitorData() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    if (this.state.image1.length !== 0) {
      console.log(this.state.image1);

      this.setState({
        loader: true,
      });

      fetch(`https://ashoka.vizsense.in/api/visit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: tokenn,
          uid: terminal,
        },
        body: JSON.stringify({
          visitorId: this.state.vistorId,
          mobile: this.state.mobile,
          fName: this.state.fname,
          lName: this.state.lname,
          purposeId: this.state.purpose,
          empId: this.state.meetingName,
          terminalId: 2,

          visitorPhoto: this.state.image1,
          idPhoto: this.state.image2,
          vehiclePhoto: this.state.image3,
          exPhoto: this.state.image4,
          // image_type: this.state.image_type,
        }),
      })
        .then(result => {
          result.json().then(async resp => {
            console.warn('saveVisitorData :', resp);
            if (resp.response === 'success') {
              await AsyncStorage.setItem(
                'slipID',
                JSON.stringify(resp.data.slipNo),
              );
              await AsyncStorage.setItem(
                'visitTime',
                JSON.stringify(resp.data.visitTime),
              );
              console.warn('resp.data.slipNo', resp.data.slipNo);

              this.setState({
                loader: false,
              });
              this.props.navigation.navigate('PrintVisitor');
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
            error,
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
          console.log(
            'There has been a problem with your fetch operation: ' +
              error.message,
          );
          this.setState({
            loader: false,
          });
        });
    } else {
      alert("Please click visitor's photo.")
    }
  }

  async clearLoackData() {
    alert('clear');
    // try {
    //   await AsyncStorage.clear();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  render() {
    return (
      <View
        animation="fadeInRight"
        // duration="1000"
        style={{flex: 1, backgroundColor: 'Animatable'}}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="Visitor Entry - Ashoka University, Sonipat" />
        </Appbar.Header>

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

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cr}>
            <View style={styles.cardShadow}>
              <View style={styles.mgt}>
                <View style={styles.cdm}>
                  <View style={{marginBottom: '5%'}}>
                    <Text style={{color: '#959595'}}>
                      Please take the photo of the visitor & other things
                    </Text>
                  </View>

                  <Text style={styles.fnts}>
                    Name : {this.state.fname + ' ' + this.state.lname}
                  </Text>
                  <Text style={styles.fnts}>Mobile : {this.state.mobile}</Text>
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

                          <TouchableOpacity
                            onPress={() => this.cameraCapture()}>
                            {/* <FontAwesomeIcon
                              icon={faCamera}
                              style={{color: '#0d6efd', marginBottom: '5%'}}
                              size={80}
                            /> */}

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

                            {!this.state.visibleImage1New ? (
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
                            ) : (
                              <Image
                                style={{
                                  height: 100,
                                  width: 100,
                                  marginBottom: '5%',
                                  borderRadius: 5,
                                }}
                                source={{
                                  uri: `data:${this.state.mime};base64,${this.state.image1}`,
                                }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </Card>
                    </View>

                    <View style={{width: '43%'}}>
                      <Card>
                        <View style={styles.centCam}>
                          <Text style={styles.centCamInfo}>ID Proof</Text>
                          <TouchableOpacity
                            onPress={() => this.cameraCapture2()}>
                            {!this.state.visibleImage2 ? (
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
                            ) : (
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
                              />
                            )}
                          </TouchableOpacity>
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
                          <Text style={styles.centCamInfo}>Accessories</Text>
                          <TouchableOpacity
                            onPress={() => this.cameraCapture3()}>
                            {!this.state.visibleImage3 ? (
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
                            ) : (
                              <Image
                                style={{
                                  height: 100,
                                  width: 100,
                                  marginBottom: '5%',
                                  borderRadius: 5,
                                }}
                                source={{
                                  uri: `data:${this.state.mime3};base64,${this.state.image3}`,
                                }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </Card>
                    </View>

                    <View style={{width: '43%'}}>
                      <Card>
                        <View style={styles.centCam}>
                          <Text style={styles.centCamInfo}>Vehicle</Text>

                          <TouchableOpacity
                            onPress={() => this.cameraCapture4()}>
                            {!this.state.visibleImage4 ? (
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
                            ) : (
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
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </Card>
                    </View>
                  </View>
                </View>

                {/* ------------------------------------------------------------------------- */}
              </View>

              <View style={{marginTop: '8%', marginBottom: '10%'}}>
                <View style={styles.cdm}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.wd}>
                      <LinearGradient
                        colors={['#fe8c00', '#fe8c00']}
                        style={{borderRadius: 5}}>
                        <TouchableOpacity
                          onPress={() => this.props.navigation.goBack()}
                          // onPress={() => {
                          //   this.props.navigation.navigate('Visitor');

                          //   this.clearLoackData();
                          // }}
                          style={{
                            flexDirection: 'row',
                            padding: '5%',
                            borderRadius: 5,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              padding: '5%',
                              // marginLeft: '5%',
                              marginTop: '2%',
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
                          onPress={() => this.saveVisitorData()}
                          style={{
                            flexDirection: 'row',
                            padding: '5%',
                            borderRadius: 5,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontWeight: 'bold',
                              // marginTop: '5%',
                              marginLeft: '10%',
                              fontSize: 16,
                            }}>
                            Next
                          </Text>
                          <Text style={{padding: '5%', marginTop: '2%'}}>
                            <AntDesign
                              name="arrowright"
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

          <View
            style={{
              marginTop: '5%',
              marginBottom: '3%',
              marginLeft: '5%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.link}>
              <Image
                source={require('./image/partner.png')}
                style={{width: 200, height: 35}}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardShadow: {
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
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
    width: '80%',
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
});

export default VisitorAcc;
