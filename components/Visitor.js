import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  // Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ToastAndroid,
  Image,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Picker as SelectPicker} from '@react-native-picker/picker';

import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import IconAntDesign from 'react-native-vector-icons/MaterialIcons';

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: '',
      fname: '',
      lname: '',
      loader: false,
      token: '',
      purposeData: [],
      purposeValue: '',
    };
  }

  async componentDidMount() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    // alert('clear');
    try {
      // await AsyncStorage.clear();
      await AsyncStorage.multiRemove([
        'visitorId',
        'visitorMobile',
        'visitorFirstName',
        'visitorLastName',
        'meetingName',
        'purposeValue',
        'visitTime',
        'slipID',
        'visitorData',
      ]);
      let localData = JSON.parse(await AsyncStorage.getItem('visitorData'));
      console.warn('local Data :', localData);
    } catch (error) {
      console.log(error);
    }

    const localMobile = JSON.parse(await AsyncStorage.getItem('visitorMobile'));
    console.log('local data', localMobile);

    fetch(`https://ashoka.vizsense.in/api/purpose`, {
      method: 'GET',
      headers: {
        token: tokenn,
        uid: terminal,
      },
    })
      .then(data => {
        data.json().then(async resp => {
          console.log('purpose =>', resp);
          if (resp.response === 'success') {
            this.setState({
              purposeData: resp.data,
            });
            // console.log('puo :', this.state.purposeData);
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
        purposeName: this.state.purposeData[index].purpose,
      },
      // () => {
      //   console.log(this.state.purposeData[index].p_name);
      // },
    );
  };

  async getVisitorData(s) {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    let phoneNumberLength = this.state.mobile.length;
    if (phoneNumberLength === 10) {
      this.setState({
        loader: true,
      });

      fetch(
        `https://ashoka.vizsense.in/api/searchVisitor?mobile=${this.state.mobile}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            token: tokenn,
            uid: terminal,
          },
        },
      )
        .then(result => {
          result.json().then(async resp => {
            console.log('mobile search : ', resp);
            if (resp.response === 'success') {
              console.warn('response => ', resp);

              await AsyncStorage.setItem(
                'visitorId',
                JSON.stringify(resp.data.visitorId),
              );

              await AsyncStorage.setItem(
                'visitorMobile',
                JSON.stringify(resp.data.mobile),
              );

              await AsyncStorage.setItem(
                'visitorFirstName',
                JSON.stringify(resp.data.fName),
              );

              await AsyncStorage.setItem(
                'visitorLastName',
                JSON.stringify(resp.data.lName),
              );

              this.setState({
                mobile: resp.data.mobile,
                fname: resp.data.fName,
                lname: resp.data.lName,
                loader: false,
              });

              console.warn(
                'mobile',
                this.state.mobile,
                'fname =>',
                this.state.fname,
                'lname =>',
                this.state.lname,
              );

              if (
                this.state.mobile !== '' &&
                this.state.fname !== '' &&
                this.state.lname !== ''
              ) {
                // this.props.navigation.navigate('VisitorReason');
              } else {
                alert('Something wents wrong.');
              }
            } else {
              this.setState({
                loader: false,
              });
              ToastAndroid.show(
                'Number not found',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
            }
          });
        })
        .catch(error => {
          console.log(
            'There has been a problem with your fetch operation: ' +
              error.message,
          );
          this.setState({
            loader: false,
          });
        });
    } else if (phoneNumberLength === 0) {
      alert('Please enter mobile number. ');
      this.setState({
        loader: false,
      });
    } else if (phoneNumberLength < 10) {
      alert('Please check mobile number. ');
      this.setState({
        loader: false,
      });
    } else {
      alert('Please insert mobile number. ');
      this.setState({
        loader: false,
      });
    }
  }

  check() {
    if (
      this.state.mobile !== '' &&
      this.state.fname !== '' &&
      this.state.lname !== '' &&
      this.state.purposeValue !== ''
    ) {


      console.log('purposeValue', this.state.purposeValue);
      this.addVisitorData();
    } else {
      Alert.alert('Wrong Input', 'Please fill all the fields.', [
        {text: 'Okay'},
      ]);
      this.setState({
        loader: false,
      });
    }
  }

  async addVisitorData() {
    this.setState({
      loader: true,
    });

    const lengthMobile = this.state.mobile.length;

    if (lengthMobile < 10) {
      alert('Please check mobile number. ');
      this.setState({
        loader: false,
      });
    } else {
      try {
        await AsyncStorage.setItem(
          'visitorMobile',
          JSON.stringify(this.state.mobile),
        );

        await AsyncStorage.setItem(
          'visitorFirstName',
          JSON.stringify(this.state.fname),
        );

        await AsyncStorage.setItem(
          'visitorLastName',
          JSON.stringify(this.state.lname),
        );

        await AsyncStorage.setItem(
          'purposeValue',
          JSON.stringify(this.state.purposeValue),
        );

        this.props.navigation.navigate('VisitorReason');
        this.setState({
          loader: false,
        });
      } catch (error) {
        console.log('local storage post error :' + error);
        this.setState({
          loader: false,
        });
      }

      console.warn(
        'local',
        await AsyncStorage.getItem('visitorMobile'),
        await AsyncStorage.getItem('visitorFirstName'),
        await AsyncStorage.getItem('visitorLastName'),
        await AsyncStorage.getItem('purposeValue'),
      );
    }
  }

  render() {
    // console.log('render file Deepak');
    return (
      <Animatable.View
      animation="fadeInRight"
      duration={400}
        style={{flex: 1, backgroundColor: '#ececec'}}>
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
                      Please enter mobile number first
                    </Text>
                  </View>

                  <Text style={[styles.text_footer]}>Mobile Number</Text>
                  <View
                    style={[
                      styles.action,
                      {borderWidth: 1, borderColor: '#f2f2f2', borderRadius: 5},
                    ]}>
                    <Entypo
                      name="mobile"
                      color="#05375a"
                      size={20}
                      style={{paddingTop: 10}}
                    />

                    <TextInput
                      label="Number"
                      maxLength={10}
                      keyboardType="numeric"
                      returnKeyType="next"
                      placeholder="Mobile Number"
                      style={[styles.textInput, {paddingTop: 15}]}
                      value={this.state.mobile}
                      onChangeText={text => this.setState({mobile: text})}
                      // onBlur={e => this.getVisitorData(e)}
                    />
                    <TouchableOpacity
                      onPress={value => this.getVisitorData(value)}
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                      }}>
                      <IconAntDesign
                        name="search"
                        size={25}
                        color="#696969"
                        style={{marginLeft: '5%'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>First Name</Text>
                  <View style={styles.action}>
                    <Feather name="user" color="#05375a" size={20} />

                    <TextInput
                      label="First Name"
                      mode="outlined"
                      keyboardType="default"
                      returnKeyType="next"
                      placeholder="First Name"
                      style={styles.textInput}
                      value={this.state.fname}
                      onChangeText={fname => this.setState({fname: fname})}
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Last Name</Text>
                  <View style={styles.action}>
                    <Feather name="user" color="#05375a" size={20} />

                    <TextInput
                      label="Last Name"
                      mode="outlined"
                      keyboardType="default"
                      placeholder="Last Name"
                      style={styles.textInput}
                      value={this.state.lname}
                      returnKeyType="next"
                      onChangeText={text => this.setState({lname: text})}
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Purpose of meeting</Text>
                  <View style={[styles.action, {marginTop: 0}]}>
                    <Feather name="user"
                      color="#05375a"
                      size={20}
                      style={{marginTop: 15}}
                    />

                    <SelectPicker
                      style={{width: '100%', marginTop: 0, padding: 0}}
                      // mode="dropdown"
                      selectedValue={this.state.purposeValue}
                      onValueChange={(value, index, label) => {
                        this.onPickerValueChange(value, index, label),
                          this.setState({
                            purposeIndexValue: value,
                          });
                      }}>
                      {this.state.purposeData.map((item, i) => (
                        <SelectPicker.item
                          label={item.purpose}
                          color="#6f6f6f"
                          value={item.purposeId}
                        />
                      ))}
                    </SelectPicker>
                  </View>
                </View>

                {/* <View style={styles.cdm}>
                  <Text style={styles.cl}>Purpose of meeting</Text>

                  <View style={styles.pkr}>
                    <SelectPicker
                      style={{width: '100%'}}
                      // mode="dropdown"
                      selectedValue={this.state.purposeValue}
                      onValueChange={(value, index, label) => {
                        this.onPickerValueChange(value, index, label),
                          this.setState({
                            purposeIndexValue: value,
                          });
                      }}>
                      {this.state.purposeData.map((item, i) => (
                        <SelectPicker.item
                          label={item.purpose}
                          color="#6f6f6f"
                          value={item.purposeId}
                        />
                      ))}
                    </SelectPicker>
                  </View>
                </View> */}
              </View>

              <View
                style={styles.inp}
                style={{marginTop: '10%', marginBottom: '5%'}}>
                <View style={styles.cdm}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.wd}>
                      <LinearGradient
                        colors={['#fe8c00', '#fe8c00']}
                        style={{borderRadius: 5}}>
                        <TouchableOpacity
                          onPress={() => this.props.navigation.goBack()}
                          style={[
                            styles.touchBack,
                            {justifyContent: 'center', alignItems: 'center'},
                          ]}>
                          <Text
                            style={{
                              padding: '5%',
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
                          onPress={() => {
                            this.check();
                          }}
                          style={[
                            styles.touchBack,
                            {justifyContent: 'center', alignItems: 'center'},
                          ]}>
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
        </ScrollView>

        <View
          style={{
            // position: 'relative',
            // bottom: 0,
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
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
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
  cl: {
    color: '#6f6f6f',
  },
  wd: {
    width: '33%',
  },
  cr: {
    height: '100%',
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
  touchBack: {
    flexDirection: 'row',
    // backgroundColor: '#0d6efd',
    padding: '5%',
    borderRadius: 5,
    width: '100%',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: '#f2f2f2',
    // paddingBottom: 5,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 12,
    color: '#05375a',
  },
});

export default Profile;
