import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
  Image,
  ToastAndroid,BackHandler
} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Card } from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import { Picker as SelectPicker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

import LinearGradient from 'react-native-linear-gradient';

export default class EmployeeIn extends Component {
  constructor(props) {
    super(props);
    this.myText = React.createRef();
    this.state = {
      searchMeeting: '',
      listArray: [],
      purposeData: [],
      showSearchContent: false,

      loader: false,
      employId: '',
      searchLoader: false,
    };
  }

  

  async searchVisitor(value) {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    if (!value) {
      this.setState({ listArray: [], showSearchContent: false });
    }

    this.setState({
      searchLoader: true,
    });

    if (this.state.searchMeeting.length === 0) {
      ToastAndroid.show(
        "Enter Employee's name",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      this.setState({
        searchLoader: false,
      });
    } else {
      let sParameter = this.state.searchMeeting;
      sParameter = encodeURIComponent(sParameter.trim());

      fetch(`https://ashoka.vizsense.in/api/searchEmp?prefix=` + sParameter, {
        method: 'GET',
        headers: {
          token: tokenn,
          uid: terminal,
        },
      })
        .then(data => {
          data.json().then(resp => {
            // console.log('searcher =>', resp);
            if (resp.response == 'success') {
              this.setState({
                listArray: resp.data,
                showSearchContent: true,
                searchLoader: false,
              });
            } else {
              this.setState({
                searchLoader: false,
              });
              ToastAndroid.show(
                resp.message,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
            }
          });
        })
        .catch(error => {
          this.setState({
            searchLoader: false,
          });
          ToastAndroid.show(
            error.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          console.log(
            'There has been a problem with your fetch operation: ' +
            error.message,
          );
        });
    }
  }

  async checkReason() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
    if (this.state.employId !== '' && this.state.mName !== '') {
      console.log('this.state.mobile :-', this.state.mName);
      this.setState({
        loader: true,
      });

      fetch(`https://ashoka.vizsense.in/api/empstatus?empid=${this.state.employId}&type=IN`, {
        method: "POST",
        headers: {
          token: tokenn,
          uid: terminal,
        },

      }).then((result) => {
        result.json().then(resp => {
          console.log("employee In : ", resp)
          if (resp.response === 'success') {
            this.props.navigation.push('Home')
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
            this.setState({
              searchMeeting: '',
              loader: false,
            });
          }
        })
      }).catch(error => {
        this.setState({
          loader: false,
        });
        ToastAndroid.show(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        console.log(
          'There has been a problem with your fetch operation: ' +
          error.message,
        );
      });
    } else {
      Alert.alert('', 'Please fill the fields.', [
        { text: 'Okay' },
      ],{cancelable:true});
    }
  }


  async EmpyOUt() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
    if (this.state.employId !== '' && this.state.mName !== '') {
      console.log('this.state.mobile :-', this.state.mName);
      this.setState({
        loader: true,
      });

      fetch(`https://ashoka.vizsense.in/api/empstatus?empid=${this.state.employId}&type=OUT`, {
        method: "POST",
        headers: {
          token: tokenn,
          uid: terminal,
        },

      }).then((result) => {
        result.json().then(resp => {
          console.log("employee out : ", resp.message)
          if (resp.response === 'success') {
            this.props.navigation.push('Home')
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
            );
            this.setState({
              searchMeeting: '',
              loader: false,
            });
          } else {
            // if (resp.message === "set status failed") {
              this.setState({
                loader: false,
              })
              ToastAndroid.show(
                resp.message,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
              );

            // }
          }
        })
      }).catch(error => {
        this.setState({
          loader: false,
        });
        ToastAndroid.show(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        console.log(
          'There has been a problem with your fetch operation: ' +
          error.message,
        );
      });
    } else {
      Alert.alert('', 'Please fill the fields.', [
        { text: 'Okay' },
      ],{cancelable:true});
    }
  }

  getTextValue(item) {
    const meting = item.name;

    this.state.mName = meting;
    this.state.employId = item.empid;
    this.state.searchMeeting = meting;
    this.setState({
      showSearchContent: false,
    });
    console.log(
      'name => ',
      this.state.mName,
      this.state.employId,
      this.state.searchMeeting,
    );
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

          <Appbar.Content title="Employee Entry - Ashoka University, Sonipat" />
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
              <Text style={{ color: '#959595' }}>
                Please select employee's name :
              </Text>
            </View>

            <View style={styles.cdm}>
              <Text style={styles.cl}>Employee</Text>
              <View style={styles.searchSt}>
                <TextInput
                  placeholder="search"
                  placeholderTextColor="#696969"
                  style={styles.searchInputStyle}
                  value={this.state.searchMeeting}
                  onChangeText={value => {
                    this.setState({ searchMeeting: value });
                  }}
                />
                <TouchableOpacity
                  onPress={value => this.searchVisitor(value)}
                  style={{ borderLeftWidth: 1 }}>
                  <IconAntDesign
                    style={styles.iconStyle}
                    name="search"
                    size={25}
                    color="#696969"
                  />
                </TouchableOpacity>
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
                              return (
                                <React.Fragment key={i}>
                                  <View style={{ elevation: 1 }}>
                                    <TouchableOpacity
                                      style={styles.searchTextSyle}
                                      value={this.state.mName}
                                      onPress={() => this.getTextValue(item)}>
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

          <View style={{ marginTop: '5%', marginBottom: '15%' }}>
            <View style={styles.cdm}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.wd}>
                  <LinearGradient
                    colors={['#fe8c00', '#fe8c00']}
                    style={{ borderRadius: 5 }}>
                    <TouchableOpacity
                      onPress={() => this.EmpyOUt()}
                      style={styles.btnTouch}>
                      <Text
                        style={{
                          padding: '5%',
                          // marginLeft: '7%',
                          marginTop: '1%',
                        }}>
                        <AntDesign
                          name="arrowleft"
                          size={20}
                          style={{ color: 'white' }}
                        />
                      </Text>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          marginRight: '10%',
                          fontSize: 16,
                        }}>
                        OUT
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

                <View style={styles.wd}></View>

                <View style={styles.wd}>
                  <LinearGradient
                    colors={['#fe8c00', '#fe8c00']}
                    style={{ borderRadius: 5 }}>
                    <TouchableOpacity
                      onPress={() => this.checkReason()}
                      style={styles.btnTouch}>
                      <Text
                        style={styles.empIN}>
                        IN
                      </Text>
                      <Text style={{ padding: '5%', marginLeft: "5%" }}>
                        <AntDesign
                          name="arrowright"
                          size={20}
                          style={{ color: 'white' }}
                        />
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* </ScrollView> */}

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            marginBottom: '3%',
            marginLeft: '5%',
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <View style={styles.link}>
            <Image
              source={require('./image/partner.png')}
              style={{ width: 200, height: 35 }}
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
  empIN: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: '10%',
    fontSize: 16,
  },
  btnTouch: {
    flexDirection: 'row',
    padding: '5%',
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatstyles: {
    maxHeight: 450,
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
});
