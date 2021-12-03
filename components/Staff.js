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
import { Appbar, Card } from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import { Picker as SelectPicker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';



export default class Staff extends Component {
  constructor(props) {
    super(props);
    this.myText = React.createRef();
    this.state = {
      searchMeeting: '',
      purposeData: [],
      staffData: [],

      purposeValue: '',
      purposeIndexValue: '',
      vendorName: '',
      meetingId: '',
      loader: true,
      hideFetch: false,
      employId: '',
      staffId: '0',
      showList: false,
      disabled: true,
      hideFirstPicker:true
    };
  }

  async componentDidMount() {


    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));


    fetch(`https://ashoka.vizsense.in/api/vendors`, {
      method: 'GET',
      headers: {
        token: tokenn,
        uid: terminal,
      },
    })
      .then(data => {
        data.json().then(async resp => {
          console.log('reasone =>', resp.data[0]);
          if (resp.response === 'success') {
            this.setState({
              purposeData: resp.data,
              loader: false,

            });
            // console.log('puo :--------------------------', this.state.staffData);
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
    if(value > 0){
      console.log("value greater",value)
      this.setState(
        {
          purposeValue: value,
          vendorName: this.state.purposeData[index - 1].vendroName,
        },
        () => {
          console.log("this.state.purposeData[index].vendroName ", value, index, label, this.state.purposeData[index - 1].vendroName)
          this.getVendorID();
          this.setState({
            // hideFirstPicker:false,
            loader: true,
            disabled: false
          })
        },
      );

    }else{
      console.log("value less "+value)
    }



   

  };






  async getVendorID() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
    // this.setState({
    //   staffId: "0",
    //   loaderList: true,

    // })
    try {
      await AsyncStorage.setItem('vendorName', (this.state.vendorName));
      await AsyncStorage.setItem('vendorID', JSON.stringify(this.state.purposeValue));
      const purp = (await AsyncStorage.getItem('vendorName'))

      console.log(purp)
    } catch (error) {
      console.log(error)
    }
    console.log("purposeValue 1:---------", this.state.purposeValue, this.state.staffId, this.state.vendorName, tokenn)




    fetch(
      `https://ashoka.vizsense.in/api/supportstaff?vendorId=${this.state.purposeValue}&prefix=${this.state.searchMeeting}&staffId=${this.state.staffId}`,
      {
        method: 'GET',
        headers: {
          token: tokenn,
          uid: terminal,
        },
      },
    ).then(result => {
      result.json().then(resp => {
        console.log('employeeId : ', resp);
        if (resp.response === 'success') {
          this.setState({
            staffData: resp.data,
            loader: false,
            showList: true,
            loaderList: false,
          })

        } else {
          console.log('error');
        }
      });
    }).catch(error => {
      console.log(
        'There has been a problem with your fetch operation: ' +
        error.message,
      );
    });
  }


  async getTextValue(item) {
    // const meting = item.name;

    this.state.staffId = item.staffId;

    try {
      if (!this.state.staffId !== '' && !this.state.purposeValue !== '') {
        console.log("purposeValue 1:-", this.state.purposeValue)
        await AsyncStorage.setItem('staffId', JSON.stringify(this.state.staffId));
        await AsyncStorage.setItem('purposeValue', JSON.stringify(this.state.purposeValue));
        const loc = JSON.stringify(await AsyncStorage.getItem('staffId'))
        const purp = JSON.stringify(await AsyncStorage.getItem('purposeValue'))
        this.props.navigation.push('StaffDetails')

        console.log(loc, purp)
      } else {
        console.log("Something Wents Wrong")
      }

    } catch (error) {
      console.log(error)
    }

    console.log(
      'name => ', item.staffId,
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
                backgroundColor: 'rgba(0,0,0,0.15)',
              }}></View>
            <View
              style={styles.lod}>
              <ActivityIndicator size="large" color="#009BFF" />
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
                <TouchableOpacity onPress={() => this.props.navigation.push("AddStaff")} disabled={this.state.disabled}>
                  <Text><Feather name="user-plus" size={25} /></Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cl}>Vendor</Text>

              <View style={styles.pkr}>
                <SelectPicker
               
                  style={{ width: '100%' }}
                  // mode="dropdown"
                  // dropdownIconColor={'red'}
                  selectedValue={this.state.purposeValue}
                  onValueChange={(value, index, label) => {
                    this.onPickerValueChange(value, index, label),
                      this.setState({
                        purposeIndexValue: value,
                      });
                  }}>
                  
                  {/* {this.state.hideFirstPicker ?( */}
                  <SelectPicker.item
                    label="Select Vendor"
                    color="#aaa"
                    value="0"
                    // enabled={false}
                    
                  />
                  {/* ):null} */}

                  {this.state.purposeData.map((item, i) => (
                    <SelectPicker.item
                      label={item.vendroName}
                      color="#000407"
                      value={item.vendorId}
                    />
                  ))}
                </SelectPicker>
              </View>
            </View>

            <View style={styles.cdm}>

              {this.state.showList ? (

                <View style={{
                  marginTop: '3%',
                }}>
                  <Text style={[styles.cl,{marginBottom:"3%"}]}>Staff Name</Text>
                  <View style={styles.flatstyles}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                      <View style={{ marginTop: '1%', marginBottom: '1%', }}>
                        {this.state.staffData.map((item, i) => {
                          return (
                            <React.Fragment key={i}>
                              <View style={{ elevation: 1 }}>
                                <TouchableOpacity
                                  style={styles.searchTextSyle}
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
    maxHeight: 270,
    width: '100%',
    // position: 'absolute',
    // elevation: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    borderWidth: 1,
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
    backgroundColor: '#f2f2f2',
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
  lod: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    elevation: 3,
    top: '50%',
    justifyContent: 'center',
  }
});
