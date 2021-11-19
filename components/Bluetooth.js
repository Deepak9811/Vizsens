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
  TextInput,
  BackHandler,
  Alert,
} from 'react-native';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';

import RNQRGenerator from 'rn-qr-generator';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Appbar} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';

var {height, width} = Dimensions.get('window');
export default class Bluetooth extends Component {
  _listeners = [];
  constructor(props) {
    super(props);
    this.state = {
      devices: null,
      pairedDs: [],
      foundDs: [],
      bleOpend: false,
      loading: true,
      boundAddress: '',
      _listeners: [],
      dk: 'dk',
    };
  }

  // componentDidMount() {
  //   this.logOut()
  // }

  backButton() {
    BackHandler.addEventListener(
      'hardwareBackPress',

      this.disableBackButton(),
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',

      this.disableBackButton(),
    );
  }

  disableBackButton() {
    BackHandler.exitApp();

    return true;
  }

  async componentDidMount() {
    //alert(BluetoothManager)
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        this.setState({
          bleOpend: Boolean(enabled),
          loading: false,
        });
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );

      console.log('listener', this._listeners);
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }
  }

  _deviceAlreadPaired(rsp) {
    var ds = null;
    if (rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {
        console.log(e);
      }
    }
    if (ds && ds.length) {
      let pared = this.state.pairedDs;
      pared = pared.concat(ds || []);
      this.setState({
        pairedDs: pared,
      });
    }
  }

  _deviceFoundEvent(rsp) {
    // alert(JSON.stringify(rsp));
    var r = null;
    console.log('r ===>', r);
    try {
      if (typeof rsp.device == 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      console.log('_deviceFoundEvent', e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = this.state.foundDs || [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          this.setState({
            foundDs: found,
          });
        }
      }
    }
  }

  _renderRow(rows) {
    console.log('rows', rows.address);
    let items = [];
    console.log('items', items);
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <View style={{paddingLeft: 15, paddingRight: 15}}>
            <TouchableOpacity
              key={new Date().getTime() + i}
              style={[
                styles.wtf,
                {
                  marginBottom: 5,
                  borderBottomColor: '#e1e1e1',
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                },
              ]}
              onPress={() => {
                this.setState({
                  loading: true,
                });
                BluetoothManager.connect(row.address).then(
                  s => {
                    console.log('blue =>', row, 'sssssss : ', s);
                    this.addBlueLocal(row);
                    this.setState({
                      loading: false,
                      boundAddress: row.address,
                      name: row.name || 'UNKNOWN',
                    });
                    console.log('this.stae.', this.saet);
                  },
                  e => {
                    console.log('e =>', e);
                    this.setState({
                      loading: false,
                    });
                    alert(e);
                  },
                );
              }}>
              <Text style={[styles.name]}>{row.name || 'UNKNOWN'}</Text>
              <Text style={styles.address}>{row.address}</Text>
            </TouchableOpacity>
          </View>,
        );
      }
    }
    return items;
  }

  async addBlueLocal(row) {
    if (row) {
      try {
        await AsyncStorage.setItem('blueName', JSON.stringify(row.name));
        await AsyncStorage.setItem('blueAddress', JSON.stringify(row.address));
        // await AsyncStorage.setItem('blueAddress', JSON.stringify(row.address));
        console.log('row : ' + row.name, ', address : ' + row.address);
        this.props.navigation.navigate('Home');
      } catch (error) {
        console.log('errro' + error);
      }
    } else {
      alert('Try again.');
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header style={styles.ttl}>
          <Appbar.Content title="Bluetooth" />
        </Appbar.Header>

        <View style={{backgroundColor: '#f3f3f3', flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginLeft: '5%',
                marginRight: '5%',
                marginBottom: '20%',
                marginTop: '5%',
              }}>
              {/* <Text>{JSON.stringify(this.state, null, 3)}</Text> */}

              <View
                style={{
                  backgroundColor: '#ffffff',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#05375a',
                        marginRight: '20%',
                      }}>
                      Bluetooth
                      {/* {this.state.bleOpend ? 'true' : 'false'}{' '} */}
                    </Text>
                  </View>

                  <View style={{textAlign: 'right', width: '50%'}}>
                    <Switch
                      value={this.state.bleOpend}
                      trackColor={{true: '#6dd5ed', false: '#6dd5ed'}}
                      thumbColor={'#2193b0'}
                      onValueChange={v => {
                        this.setState({
                          loading: true,
                        });
                        if (!v) {
                          BluetoothManager.disableBluetooth().then(
                            () => {
                              this.setState({
                                bleOpend: false,
                                loading: false,
                                foundDs: [],
                                pairedDs: [],
                              });
                            },
                            err => {
                              console.log(err);
                            },
                          );
                        } else {
                          BluetoothManager.enableBluetooth().then(
                            r => {
                              var paired = [];
                              if (r && r.length > 0) {
                                for (var i = 0; i < r.length; i++) {
                                  try {
                                    paired.push(JSON.parse(r[i]));
                                  } catch (e) {
                                    //ignore
                                  }
                                }
                              }
                              this.setState({
                                bleOpend: true,
                                loading: false,
                                pairedDs: paired,
                              });
                            },
                            err => {
                              this.setState({
                                loading: false,
                              });
                              alert(err);
                            },
                          );
                        }
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={{marginBottom: '5%'}}>
                <TouchableOpacity
                  style={styles.button}
                  disabled={this.state.loading || !this.state.bleOpend}
                  onPress={() => {
                    this._scan();
                  }}>
                  <LinearGradient
                    colors={['#fe8c00', '#fe8c00']}
                    style={styles.signIn}>
                    <View>
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: '#fff',
                            fontSize: 18,
                          },
                        ]}>
                        Scan Bluetooth
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={{marginBottom:"5%"}}
                onPress={() => this.props.navigation.push('Home')}>
                <LinearGradient
                  colors={['#fe8c00', '#fe8c00']}
                  style={styles.signIn}>
                  <View>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#fff',
                          fontSize: 18,
                        },
                      ]}>
                      Continue Without Bluetooth
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <View style={{marginBottom: '2%'}}>
                <Text style={{}}>
                  Connected :
                  <Text style={{color: 'blue'}}>
                    {!this.state.name ? ' No Devices' : this.state.name}
                  </Text>
                </Text>

                <Text style={{}}>Paired Devices :</Text>
              </View>

              {this._renderRow(this.state.pairedDs) ? (
                <View
                  style={{
                    marginBottom: '5%',
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                  }}>
                  <TouchableOpacity style={{justifyContent: 'space-between'}}>
                    {this._renderRow(this.state.pairedDs)}
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={{flexDirection: 'row'}}>
                <Text>new : </Text>
                {this.state.loading ? (
                  <ActivityIndicator animating={true} />
                ) : null}
              </View>

              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 10,
                }}>
                {this._renderRow(this.state.foundDs)}
              </View>

              {/* <View style={{marginBottom: '5%', marginTop: '5%'}}>
                <TouchableOpacity
                  style={styles.button}
                  disabled={
                    this.state.loading || this.state.boundAddress.length <= 0
                  }
                  onPress={async () => {
                    try {
                      await BluetoothEscposPrinter.printerInit();
                      await BluetoothEscposPrinter.printerLeftSpace(0);

                      await BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.CENTER,
                      );
                      await BluetoothEscposPrinter.setBlob(0);
                      await BluetoothEscposPrinter.printText(
                        'Ashoka University - Day Visitor',
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

                      let columnWidths = [8, 20];

                      await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.LEFT,
                        ],
                        ['Name :', 'Vijender Pandita'],
                        {},
                      );

                      await BluetoothEscposPrinter.printColumn(
                        columnWidths,
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.LEFT,
                        ],
                        ['Date :', '10-Oct-2021'],
                        {},
                      );
                      await BluetoothEscposPrinter.printText(
                        '-------------------------------------------\r\n',
                        {},
                      );
                      let columnWidth = [8];
                      await BluetoothEscposPrinter.printColumn(
                        columnWidth,
                        [BluetoothEscposPrinter.ALIGN.CENTER],
                        ['V210726345'],
                        {},
                      );
                      await BluetoothEscposPrinter.printPic(
                        this.state.base64Image,
                        {width: 100, left: 220},
                      );
                    } catch (e) {
                      alert(e.message || 'ERROR');
                    }
                  }}>
                  <LinearGradient
                    colors={['#fe8c00', '#fe8c00']}
                    style={styles.signIn}>
                    <TouchableOpacity>
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: '#fff',
                            fontSize: 18,
                          },
                        ]}>
                        Print Receipt
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              </View> */}

              {/* <View style={styles.btn}>
                <View>
                  <Image
                    style={{width: 60, height: 60}}
                    source={{
                      uri: 'data:image/png;base64,' + this.state.base64Image,
                    }}
                  />
                </View> */}

              {/* ==========QR CODE============= */}

              {/* <View style={{padding: 10}}>
                  <Text style={[styles.text_footer, {marginTop: 20}]}>
                    Enter Text
                  </Text>
                  <View style={styles.action}>
                    <TextInput
                      returnKeyType="next"
                      placeholder="Your Email"
                      style={styles.textInput}
                      value={this.state.text_input}
                      onChangeText={text =>
                        this.setState({
                          text_input: text,
                        })
                      }
                    />
                  </View>
                </View> */}

              {/* <View style={{padding: 10}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.getTextInputValue()}
                    activeOpacity={0.7}>
                    <LinearGradient
                      colors={['#fe8c00', '#fe8c00']}
                      style={styles.signIn}>
                      <TouchableOpacity>
                        <Text
                          style={[
                            styles.textSign,
                            {
                              color: '#fff',
                            },
                          ]}>
                          Generate
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <Image
                  source={{
                    uri: 'data:image/png;base64,' + this.state.base64Image,
                  }}
                  style={styles.image}
                /> */}

              {/* <View style={{marginBottom: '5%'}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.props.navigation.push('PrintVisitor')}>
                  <LinearGradient
                    colors={['#fe8c00', '#fe8c00']}
                    style={styles.signIn}>
                    <View>
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: '#fff',
                            fontSize: 18,
                          },
                        ]}>
                        Print
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View> */}

              {/* -------------------------------------------------------------------------------- */}
            </View>
            {/* </View> */}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  _scan() {
    this.setState({
      loading: true,
    });
    BluetoothManager.scanDevices().then(
      s => {
        var ss = s;
        var found = ss.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = this.state.foundDs;
        if (found && found.length) {
          fds = found;
        }
        this.setState({
          foundDs: fds,
          loading: false,
        });
      },
      er => {
        this.setState({
          loading: false,
        });
        console.log('error' + JSON.stringify(er));
      },
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

  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  ttl: {
    backgroundColor: '#fff',
  },
});
