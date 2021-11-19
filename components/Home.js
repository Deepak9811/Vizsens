import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ToastAndroid,
  BackHandler,
  Alert,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Appbar, Button, Card, Title, Paragraph} from 'react-native-paper';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: '',
      name: '',
      totalVisitor: [],
      todaysVisitor: '',
    };
  }

  toastAndroid() {
    ToastAndroid.showWithGravity(
      'Disable',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  }

  logOut() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.disableBackButton(),
    );
  }

  disableBackButton() {
    Alert.alert('', 'Do you want to log out  from app ?', [
      {text: 'Yes', onPress: () => this.clearToken()},
      {text: 'No', onPress: () => console.warn('No Pressed')},
    ]);
    return true;
  }

  async clearToken() {
    await AsyncStorage.clear();
    BackHandler.exitApp();
  }

  componentDidMount() {
    this.getTotalEntry();
    this.continueCall()
  }

  continueCall(){
    setInterval(() => {
      this.getTotalEntry();
    }, 6000);
  }

  async getTotalEntry() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    this.setState({
      token: tokenn,
      terminalId: terminal,
    });

    console.log('token ', tokenn, terminal);

    fetch(`https://ashoka.vizsense.in/api/tiles`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
        token: tokenn,
        uid: terminal,
      },
    })
      .then(data => {
        data.json().then(async resp => {
          console.log(resp.data[1].name);
          if (resp.response === 'success') {
            this.setState({
              totalVisitor: resp.data,
              todaysVisitor: resp.data[0].name,
              todaysVisitorCount: resp.data[0].count,
              WithinPremisesCount: resp.data[1].count,
              WithinPremises: resp.data[1].name,
            });
            console.log(this.state);
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#ececec'}}>
        <Appbar.Header style={styles.ttl}>
          <Appbar.Content title="VIZSENSE - Ashoka University, Sonipat" />

          <View style={{marginRight: 5}}>
            <Appbar.Content
              title={
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'black',
                  }}>
                  {'  '}
                  {this.state.todaysVisitorCount}
                </Text>
              }
              subtitle={this.state.todaysVisitor}
              color="#959595"
            />
          </View>

          <TouchableOpacity 
          // onPress={()=>this.props.navigation.navigate('ListInside')} 
          >
            <Appbar.Content
              title={
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'black',
                  }}>
                  {'   '}
                  {this.state.WithinPremisesCount}
                </Text>
              }
              subtitle={this.state.WithinPremises}
              color="#959595"
              style={{}}
            />
          </TouchableOpacity>
          <FontAwesome
            name="user-o"
            color="#05375a"
            size={30}
            style={{marginRight: 15, marginLeft: 10}}
          />
        </Appbar.Header>

        <View>
          <View style={styles.cardShadow}>
            <View style={styles.cdm}>
              <View style={{marginBottom: '5%'}}>
                <Text style={{color: '#959595'}}>
                  Select the option below to proceed further...
                </Text>
              </View>

              {/* ----------------VISITOR------------------------------------------ */}

              <View style={styles.cr}>
                <View style={styles.inp}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Visitor')}>
                    <View style={[styles.signIn]}>
                      <View style={{flexDirection: 'row'}}>
                        <Feather
                          name="user"
                          size={25}
                          style={{marginRight: '3%'}}
                        />
                        <Text style={styles.textSign}>Visitor Entry</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.inp}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      this.props.navigation.navigate('VisitorWithoutMobile')
                    }>
                    <View style={[styles.signIn]}>
                      <View style={{flexDirection: 'row'}}>
                        <Feather
                          name="user"
                          size={25}
                          style={{marginRight: '3%'}}
                        />
                        <Text style={styles.textSign}>
                          Visitor Entry - Without Mobile Number
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={[styles.inp, {marginBottom: 0}]}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('ReadQr')}>
                    <View style={[styles.signIn]}>
                      <View style={{flexDirection: 'row'}}>
                        <Feather
                          name="user"
                          size={25}
                          style={{marginRight: '3%'}}
                        />
                        <Text style={styles.textSign}>Visitor Exit</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ---------------STAFF----------------------------------- */}

              <View style={styles.cr}>
                <View style={styles.inp}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Staff')}>
                    <View style={[styles.signIn]}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('./image/staff.png')}
                          style={{marginRight: '3%', width: 30, height: 30}}
                        />
                        <Text style={styles.textSign}>
                          Support Staff - Badge Printing
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', width: '100%'}}>
                  <View style={[styles.inp, {width: '45%', marginBottom: 0}]}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.props.navigation.navigate('StaffIN')}>
                      <View style={[styles.signIn]}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={require('./image/staff.png')}
                            style={{marginRight: '3%', width: 30, height: 30}}
                          />
                          <Text style={styles.textSign}>Support Staff IN </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[
                      styles.inp,
                      {marginLeft: '10%', width: '45%', marginBottom: 0},
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('StaffOUT')
                      }>
                      <View style={[styles.signIn]}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={require('./image/staff.png')}
                            style={{marginRight: '3%', width: 30, height: 30}}
                          />
                          <Text style={styles.textSign}>Support Staff OUT</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* <View style={styles.inp}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.toastAndroid()}>
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
                      APPOINTMENTS
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View> */}

              <View style={[styles.inp, styles.cr]}>
                <TouchableOpacity
                  // onPress={() => this.props.navigation.push('Courier')}
                  >
                  <View style={[styles.signIn]}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={require('./image/shipping.png')}
                        style={{width: 28, height: 23, marginRight: '2%'}}
                      />
                      <Text style={styles.textSign}>Courier</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.inp, styles.cr]}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.logOut()}>
                  <View style={[styles.signIn]}>
                    <View style={{flexDirection: 'row'}}>
                      <Feather
                        name="log-out"
                        size={22}
                        style={{marginRight: '3%',}}
                      />
                      <Text style={styles.textSign}>Log Out</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

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

          {/* <View style={{position: 'absolute', bottom: 0}}>
          <View style={styles.link}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://celect.in/')}
              style={styles.linkS}>
              <Text>Powered by</Text>
              <Text style={{color: '#f68823'}}> CELECT</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        </View>
      </View>
    );
  }
}

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  link: {
    paddingBottom: 10,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  linkS: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ttl: {
    backgroundColor: '#ffffff',
  },
  cr: {
    padding: '5%',
    marginBottom: '5%',
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
  },
  cdm: {
    width: '90%',
    marginTop: '5%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '5%',
  },
  inp: {
    marginBottom: '5%',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
  },
  button: {
    // alignItems: 'center',
    // marginTop: 30,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05375a',
  },
  totalentry: {
    width: '77%',
    flexDirection: 'row',
    // backgroundColor: 'white',
    padding: 5,
  },
  totalText: {
    width: '80%',
    // backgroundColor: 'green',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  totalCount: {
    width: '30%',
    // backgroundColor: 'green',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
