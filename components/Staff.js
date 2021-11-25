import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Card } from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import { Picker as SelectPicker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import RNQRGenerator from 'rn-qr-generator';

export default class Staff extends Component {
  constructor(props) {
    super(props);
    this.myText = React.createRef();
    this.state = {
      searchMeeting: '',
      listArray: [],
      purposeData: [],
      showSearchContent: false,
      fname: '',
      lname: '',
      vistorId: '',
      purposeValue: '',
      purposeIndexValue: '',
      purposeName: '',
      meetingId: '',
      loader: false,
      hideFetch: false,
      employId: '',
    };
  }

  async componentDidMount() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
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

      console.log(
        'visitorId :',
        localVisitorId,
        'visitorMobile : ',
        localMobile,
        'visito Firstname : ',
        localFirstName,
        'visitorLastName : ',
        localLastName,
      );

      this.setState({
        vistorId: localVisitorId,
        mobile: localMobile,
        fname: localFirstName,
        lname: localLastName,
      });
    } catch (error) {
      console.log('error in local data :', error);
    }

    fetch(`https://ashoka.vizsense.in/api/vendors`, {
      method: 'GET',
      headers: {
        token: tokenn,
        uid: terminal,
      },
    })
      .then(data => {
        data.json().then(async resp => {
          console.log('reasone =>', resp.data);
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

  async searchVisitor(value) {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
    console.log('hlloe');
    this.setState({
      listArray: [],
    });

    if (!this.state.searchMeeting.length == 0) {
      this.setState({ listArray: [], showSearchContent: true, searchLoader: true, });
      console.log('seachmeeting length :-', this.state.searchMeeting.length)
    } else {
      console.log('seachmeeting =============',)
      this.setState({ listArray: [], showSearchContent: false, searchLoader: false, });
    }



    // let sParameter = value;
    // sParameter = encodeURIComponent(sParameter.trim());

    fetch(
      `https://ashoka.vizsense.in/api/supportstaff?vendorId=${this.state.purposeValue}&prefix=${this.state.searchMeeting}&staffId=0`,
      {
        method: 'GET',
        headers: {
          token: tokenn,
          uid: terminal,
        },
      },
    )
      .then(data => {
        data.json().then(resp => {
          // console.log('searcher =>', resp.data);
          if (resp.response == 'success') {
            // console.log('search =>', resp);
            this.setState({
              listArray: resp.data,
              showSearchContent: true,
              searchLoader: false,
            });
          } else {
            this.setState({
              showSearchContent: false,
              searchLoader: false,
            });
            ToastAndroid.showWithGravity(
              resp.message,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );

          }
        });
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log(
          'There has been a problem with your fetch operation: ' +
          error.message,
        );
        this.setState({
          searchLoader: false,
        });
      });
  }

  checkReason() {
    if (
      this.state.purposeValue !== '' &&
      this.state.mName !== '' &&
      this.state.mobile !== ''
    ) {
      this.addVisitorReason();
    } else {
      Alert.alert('Wrong Input', 'Please fill all the fields.', [
        { text: 'Okay' },
      ]);
    }
  }

  async addVisitorReason() {
    console.log(
      'mobile:',
      this.state.mobile,
      ', meeting:',
      this.state.mName,
      ', purpose value:',
      this.state.purposeValue,
    );

    this.setState({
      loader: true,
    });

    try {
      await AsyncStorage.setItem(
        'meetingName',
        JSON.stringify(this.state.employId),
      );
      await AsyncStorage.setItem(
        'purposeValue',
        JSON.stringify(this.state.purposeValue),
      );
    } catch (error) {
      console.log('error' + error);
    }

    this.getMeetingId();
  }

  async getMeetingId() {
    try {
      const meetingName = JSON.stringify(
        await AsyncStorage.getItem('meetingName'),
      );
      const purpose = JSON.parse(await AsyncStorage.getItem('purposeValue'));
      console.log('meeting =>', meetingName, ', purposeValue =>', purpose);
      // this.props.navigation.navigate('VisitorAcc');
      this.setState({
        loader: false,
      });
    } catch (error) {
      console.log('error' + error);
      this.setState({
        loader: false,
      });
    }
  }

  // addrenderItem(item) {
  //   return (
  //     <TouchableOpacity
  //       style={{elevation: 3, flex: 1}}
  //       onPress={() => alert('clicked')}>
  //       <Text style={styles.flatText} value={this.state.mName}>
  //         {item.m_name}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // }

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

  async getTextValue(item) {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    console.log(item.staffId);
    const meting = item.name;
    const staffId = item.staffId;

    this.state.mName = meting;
    this.state.employId = item.staffId;
    this.state.searchMeeting = meting;
    this.setState({
      showSearchContent: false,
    });
    console.log(
      'name => ',
      this.state.mName,
      ' employId : ',
      this.state.employId,
      ' searchMeeting : ',
      this.state.searchMeeting,
    );

    if (item.employeeId) {
      fetch(
        `https://ashoka.vizsense.in/api/supportstaff?vendorId=${this.state.purposeValue}&prefix=${this.state.searchMeeting}&staffId=${staffId}`,
        {
          method: 'GET',
          headers: {
            token: tokenn,
            uid: terminal,
          },
        },
      ).then(result => {
        result.json().then(resp => {
          console.log('employeeId : ', resp.data[0].employeeId);
          if (resp.response === 'success') {
            this.setState({
              staffName: resp.data[0].name,
              staffEmpoyeeID: resp.data[0].employeeId,
              staffValidTill: resp.data[0].validtill,
              staffMobile: resp.data[0].mobile,
              hideFetch: true,
            });
            this.getTextInputValue();
          } else {
            console.log('error');
          }
        });
      });
    }
  }

  getTextInputValue() {
    RNQRGenerator.generate({
      value: this.state.staffEmpoyeeID,
      height: 200,
      width: 200,
      base64: true,
    })
      .then(response => {
        const { uri, width, height, base64 } = response;
        this.setState({
          base64Image: base64,
        });
        console.warn(this.state.base64Image);
      })
      .catch(error => console.log('Cannot create QR code', error));
  }

  render() {
    return (
      <Animatable.View animation="fadeInRight" style={styles.container} duration={400}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{ paddingLeft: '2%' }}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>

          <Appbar.Content title="Staff Entry - Ashoka University, Sonipat" />
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

        {/* <ScrollView> */}
        <View style={styles.cr}>

          <View style={styles.mgt}>
            <View style={styles.cdm}>
              <View style={{ flexDirection: "row", marginBottom: '3%' }}>
                <View style={{}}>
                  <Text style={{ color: '#959595' }}>
                    Select the option below to proceed further...
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.push("AddStaff")}>
                  <Text><Feather name="user-plus" size={25} /></Text></TouchableOpacity>
              </View>

              <Text style={styles.cl}>Vendor</Text>

              <View style={styles.pkr}>
                <SelectPicker
                  style={{ width: '100%' }}
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
                      label={item.vendroName}
                      color="#6f6f6f"
                      value={item.vendorId}
                    />
                  ))}
                </SelectPicker>
              </View>
            </View>

            <View style={styles.cdm}>
              <Text style={styles.cl}>Staff Name </Text>
              <View style={styles.searchSt}>
                <TextInput
                  placeholder="search"
                  placeholderTextColor="#696969"
                  style={styles.searchInputStyle}
                  value={
                    // this.state.showSearchContent
                    // ?
                    this.state.searchMeeting
                    // :
                    // this.state.mName
                  }
                  onChangeText={value => {
                    this.setState({ searchMeeting: value });
                    this.searchVisitor(value);
                  }}
                // onBlur={e => {
                //   setTimeout(() => {
                //     this.setState({showSearchContent: false});
                //   });
                // }}
                // mode="outlined"
                />
                <IconAntDesign
                  style={styles.iconStyle}
                  name="search"
                  size={25}
                  color="#696969"
                />
              </View>
              {!this.state.searchLoader ? (
                <>
                  {this.state.showSearchContent ? (
                    <View
                      style={{
                        marginTop: '10%',
                        width: '100%',
                      }}>
                      <View style={styles.flatstyles}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View
                            style={{
                              marginTop: '5%',
                              marginBottom: '5%',
                              width: '100%',
                            }}>
                            {this.state.listArray.map((item, i) => {
                              {
                                /* console.log('item =>', item); */
                              }
                              return (
                                <React.Fragment key={i}>
                                  <View style={{ elevation: 1 }}>
                                    <TouchableOpacity
                                      style={styles.searchTextSyle}
                                      value={this.state.mName}
                                      onPress={() =>
                                        this.getTextValue(item)
                                      }>
                                      <Text style={[styles.searchText]}>
                                        {item.name}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </React.Fragment>
                              );
                            })}
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                  ) : null}
                </>
              ) : (
                <>
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
              )}
            </View>
          </View>

        </View>

        {/* </ScrollView> */}

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            marginBottom: '3%',
            marginLeft: '5%',
            alignItems: 'center',
          }}>
          <View style={styles.link}>
            <Image
              source={require('./image/partner.png')}
              style={{ width: 200, height: 30 }}
            />
          </View>
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    width: '100%',
    height: '100%',
  },

  ttl: {
    backgroundColor: '#ffffff',
  },
  flatstyles: {
    maxHeight: 200,
    width: '100%',
    // position: 'absolute',
    // elevation: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    borderWidth: 1,
  },
  flatText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 2,
    color: 'black',
  },
  searchSt: {
    marginTop: 8,
    width: '100%',
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
  },
  iconStyle: {
    paddingTop: 15,
    marginHorizontal: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 22,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  searchTextSyle: {
    width: '100%',
    // flex: 1,
    marginVertical: 2,

    margin: 0,
    backgroundColor: '#fff',
  },
  searchInputStyle: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    margin: 0,
    color: 'black',
  },
  pkr: {
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
    fontSize: 16,
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
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
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
    marginBottom: '5%',
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
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    margin: 5,
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
  button: {
    alignItems: 'center',
    marginTop: 30,
  },
});
