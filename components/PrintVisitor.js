import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Image,
  TextInput,Alert
} from 'react-native';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';

import RNQRGenerator from 'rn-qr-generator';
import LinearGradient from 'react-native-linear-gradient';
import {Appbar, Card} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class PrintVisitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: null,
      pairedDs: [],
      foundDs: [],
      bleOpend: false,
      loading: false,
      boundAddress: '',
      debugMsg: '',
      visitTime: '',
    };
  }

  async componentDidMount() {
    try {
      const blueName = JSON.parse(await AsyncStorage.getItem('blueName'));
      const blueAddress = JSON.parse(await AsyncStorage.getItem('blueAddress'));
      console.warn('blue Name =>', blueName, ', blueAddress : ' + blueAddress);

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

      const meetingName = JSON.stringify(
        await AsyncStorage.getItem('meetingName'),
      );

      const purpose = JSON.parse(await AsyncStorage.getItem('purposeValue'));

      const visitTime = JSON.parse(await AsyncStorage.getItem('visitTime'));

      const slipID = JSON.parse(await AsyncStorage.getItem('slipID'));

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
        ', slipID :',
        slipID,
        ', visitTime : ',
        visitTime,
      );

      console.log('visitTime', visitTime.slice(0, 11));

      this.setState({
        visitTime: visitTime.slice(0, 11),
        fname: localFirstName,
        lname: localLastName,
        text_input: slipID,
        fname: localFirstName,
        lname: localLastName,
        boundAddress: blueAddress,
        name: blueName,
      });

      console.log(
        'blue => ',
        this.state.name,
        ' address',
        this.state.boundAddress,
      );
    } catch (error) {
      console.log('errro :' + error);
    }

    RNQRGenerator.generate({
      value: this.state.text_input,
      height: 200,
      width: 200,
      base64: true,
    })
      .then(response => {
        const {uri, width, height, base64} = response;
        this.setState({
          base64Image: base64,
        });
        console.warn(this.state.text_input);
      })
      .catch(error => console.log('Cannot create QR code', error));

    // try {

    //   this.setState({
    //     vistorId: localVisitorId,
    //     mobile: localMobile,
    //     fname: localFirstName,
    //     lname: localLastName,
    //     meetingName: meetingName,
    //     purpose: purpose,
    //   });
    // } catch (error) {
    //   console.warn('error in local data :', error);
    // }
  }

  getTextInputValue() {
    RNQRGenerator.generate({
      value: this.state.text_input,
      height: 200,
      width: 200,
      base64: true,
    })
      .then(response => {
        const {uri, width, height, base64} = response;
        this.setState({
          base64Image: base64,
        });
        console.warn(this.state.text_input);
      })
      .catch(error => console.log('Cannot create QR code', error));
  }

  render() {
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
          <Appbar.Content title="Visitor Entry - Ashoka University, Sonipat" />
        </Appbar.Header>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cr}>
            <View style={styles.cardShadow}>
              <View
                style={{
                  marginLeft: '5%',
                  marginBottom: '10%',
                  marginTop: '5%',
                }}>
                <Text style={{fontSize: 18, color: '#05375a'}}>
                  Name : {this.state.fname + ' ' + this.state.lname}
                </Text>
                <Text style={{fontSize: 18, color: '#05375a'}}>
                  Slip : {this.state.text_input}
                </Text>
              </View>

              <Image
                source={{
                  uri: 'data:image/png;base64,' + this.state.base64Image,
                }}
                style={styles.image}
              />

              <View style={{padding: 10, marginBottom: '5%', marginTop: '10%'}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    try {
                      await BluetoothEscposPrinter.printerInit();
                      await BluetoothEscposPrinter.printerLeftSpace(0);

                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.CENTER,
                      );
                      await BluetoothEscposPrinter.setBlob(0);
                      await BluetoothEscposPrinter.printText(
                        'Ashoka University - Day Visitor\r\n',
                        {
                          encoding: 'GBK',
                          codepage: 0,
                          widthtimes: 3,
                          heigthtimes: 3,
                          fonttype: 1,
                        },
                      );
                      await BluetoothEscposPrinter.printText('\r\n', {});
                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.LEFT,
                      );

                      let columnWidths = [8, 30];

                      await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.LEFT,
                        ],
                        ['Name :', this.state.fname + ' ' + this.state.lname],
                        {},
                      );

                      await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.LEFT,
                        ],
                        ['Date :', this.state.visitTime],
                        {},
                      );
                      await BluetoothEscposPrinter.printText(
                        '-------------------------------------------\r\n',
                        {},
                      );

                      await BluetoothEscposPrinter.printText(
                        this.state.text_input,
                        {},
                      );
                      await BluetoothEscposPrinter.printPic(
                        this.state.base64Image,
                        {
                          width: 100,
                          left: 100,
                        },
                      );

                      this.props.navigation.navigate('Home');

                      ToastAndroid.show(
                        'Take Slip from Printer',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                      );
                    } catch (e) {
                      Alert.alert("Error","Bluetooth Not Found" || 'ERROR');
                      ToastAndroid.show(
                        'Entry success',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                      );
                      this.props.navigation.navigate('Home');
                    }
                  }}
                  activeOpacity={0.7}>
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
                        Print
                      </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

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
              style={{width: 200, height: 35}}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  title: {
    // width: width,
    backgroundColor: '#eee',
    color: '#232323',
    paddingLeft: 8,
    paddingVertical: 10,
    textAlign: 'left',
    fontSize: 16,
  },
  wtf: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
    color: '#05375a',
  },
  address: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
  },
  text: {
    color: '#fff',
    fontSize: 20,
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
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    margin: 5,
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
    marginTop: '10%',
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
