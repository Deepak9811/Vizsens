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
import {Appbar, RadioButton} from 'react-native-paper';
import {Picker as SelectPicker} from '@react-native-picker/picker';

// import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export class Courier extends Component {
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
      checked: '',
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
              ToastAndroid.showWithGravity(
                'Number not found',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
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
      <View
        animation="fadeInRight"
        // duration="1000"
        style={{flex: 1, backgroundColor: '#ececec'}}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="Courier - Ashoka University, Sonipat" />
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
                      Please enter the relevant details in the form and click on
                      'Save button' at the bottom.
                    </Text>
                  </View>

                  <Text style={[styles.text_footer]}>Destination Type</Text>
                  <View style={styles.action}>
                    {/* <MaterialIcons name="format-list-numbered" color="#05375a" size={20} /> */}

                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value="first"
                        status={
                          this.state.checked === 'first'
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => this.setState({checked: 'first'})}
                        // style={styles.textInput}
                        //   value={this.state.ConsignmentNo}
                        //   onChangeText={ConsignmentNo =>
                        //     this.setState({ConsignmentNo: ConsignmentNo})
                        //   }
                      />
                      <View style={{marginLeft: '5%'}}>
                        <Text style={{marginTop: '50%'}}>IN</Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value="first"
                        status={
                          this.state.checked === 'first'
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => this.setState({checked: 'first'})}
                        // style={styles.textInput}
                        //   value={this.state.ConsignmentNo}
                        //   onChangeText={ConsignmentNo =>
                        //     this.setState({ConsignmentNo: ConsignmentNo})
                        //   }
                      />
                      <View style={{marginLeft: '5%'}}>
                        <Text style={{marginTop: '25%'}}>OUT</Text>
                      </View>
                    </View>
                  </View>

                  {/* <Text style={[styles.text_footer]}>Mobile Number</Text>
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
                  </View> */}
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Packaging Type</Text>
                  <View style={styles.action}>
                    {/* <MaterialIcons name="format-list-numbered" color="#05375a" size={20} /> */}

                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value="first"
                        status={
                          this.state.checked === 'first'
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => this.setState({checked: 'first'})}
                        // style={styles.textInput}
                        //   value={this.state.ConsignmentNo}
                        //   onChangeText={ConsignmentNo =>
                        //     this.setState({ConsignmentNo: ConsignmentNo})
                        //   }
                      />
                      <View style={{marginLeft: '5%'}}>
                        <Text style={{marginTop: '35%'}}>Box</Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value="first"
                        status={
                          this.state.checked === 'first'
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => this.setState({checked: 'first'})}
                        // style={styles.textInput}
                        //   value={this.state.ConsignmentNo}
                        //   onChangeText={ConsignmentNo =>
                        //     this.setState({ConsignmentNo: ConsignmentNo})
                        //   }
                      />
                      <View style={{marginLeft: '5%'}}>
                        <Text style={{marginTop: '20%'}}>Packet</Text>
                      </View>
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value="first"
                        status={
                          this.state.checked === 'first'
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => this.setState({checked: 'first'})}
                        // style={styles.textInput}
                        //   value={this.state.ConsignmentNo}
                        //   onChangeText={ConsignmentNo =>
                        //     this.setState({ConsignmentNo: ConsignmentNo})
                        //   }
                      />
                      <View style={{marginLeft: '5%'}}>
                        <Text style={{marginTop: '15%'}}>Envelope</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Courier Agency</Text>
                  <View style={[styles.action, {marginTop: 0}]}>
                    <Ionicons
                      name="business-outline"
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

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Consignment Number</Text>
                  <View style={styles.action}>
                    <MaterialIcons
                      name="format-list-numbered"
                      color="#05375a"
                      size={20}
                    />

                    <TextInput
                      label="Consignment Number"
                      mode="outlined"
                      keyboardType="default"
                      returnKeyType="next"
                      placeholder="Tacking Number"
                      style={styles.textInput}
                      value={this.state.ConsignmentNo}
                      onChangeText={ConsignmentNo =>
                        this.setState({ConsignmentNo: ConsignmentNo})
                      }
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Quantity</Text>
                  <View style={styles.action}>
                    <Entypo name="add-to-list" color="#05375a" size={20} />

                    <TextInput
                      label="Quantity"
                      mode="outlined"
                      keyboardType="default"
                      returnKeyType="next"
                      placeholder="0"
                      style={styles.textInput}
                      value={this.state.Quantity}
                      onChangeText={Quantity =>
                        this.setState({Quantity: Quantity})
                      }
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Employee</Text>
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color="#05375a" size={20} />

                    <TextInput
                      label="Employee"
                      mode="outlined"
                      keyboardType="default"
                      placeholder="Select Employee"
                      style={styles.textInput}
                      value={this.state.lname}
                      returnKeyType="next"
                      onChangeText={text => this.setState({lname: text})}
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Delivery Boy</Text>
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color="#05375a" size={20} />

                    <TextInput
                      label="Delivery Boy"
                      mode="outlined"
                      keyboardType="default"
                      placeholder="Name/Mobile of the delivery boy"
                      style={styles.textInput}
                      value={this.state.lname}
                      returnKeyType="next"
                      onChangeText={text => this.setState({lname: text})}
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Second Party</Text>
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color="#05375a" size={20} />

                    <TextInput
                      label="Second Party"
                      mode="outlined"
                      keyboardType="default"
                      placeholder="From/To Details of the consignment"
                      style={styles.textInput}
                      value={this.state.lname}
                      returnKeyType="next"
                      onChangeText={text => this.setState({lname: text})}
                    />
                  </View>
                </View>

                <View style={styles.cdm}>
                  <Text style={[styles.text_footer]}>Remarks</Text>
                  <View style={[styles.action, styles.remarkStyle]}>
                    <EvilIcons
                      name="pencil"
                      color="#05375a"
                      size={30}
                      style={{marginTop: '7%', marginLeft: '2%'}}
                    />

                    <TextInput
                      label="Remarks"
                      mode="outlined"
                      multiline={true}
                      numberOfLines={4}
                      keyboardType="default"
                      placeholder="Type Remarks here"
                      style={[styles.textInput, {paddingLeft: 5}]}
                      value={this.state.remarks}
                      onChangeText={text => this.setState({remarks: text})}
                    />
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
                style={[
                  styles.cdm,
                  {
                    marginTop: '10%',
                    marginBottom: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <View style={styles.wd}>
                  <LinearGradient
                    colors={['#fe8c00', '#fe8c00']}
                    style={{
                      borderRadius: 5,
                    }}>
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
                          //   marginLeft: '5%',
                          fontSize: 16,
                        }}>
                        SUBMIT
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

            <View
              style={{
                // position: 'relative',
                // bottom: 0,
                marginTop: '10%',
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
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  ttl: {
    backgroundColor: '#ffffff',
  },
  remarkStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#05375a',
    borderBottomColor: '#05375a',
  },
  cl: {
    color: '#6f6f6f',
  },
  wd: {
    width: '80%',
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
  touchBack: {
    flexDirection: 'row',
    // backgroundColor: '#0d6efd',
    // padding: '5%',
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

export default Courier;
