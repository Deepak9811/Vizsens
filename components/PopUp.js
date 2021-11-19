import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';

import {Appbar, Modal} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default class PopUp extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <>
          <View style={styles.popBackground}></View>
          <View style={styles.successMa}>
            <Animatable.View
              animation={this.showPopUp ? 'fadeInUpBig' : 'fadeInUpBig'}>
              <View style={styles.popup}>
                <TouchableOpacity
                  style={styles.crossIcon}
                  onPress={() =>
                    this.setState({
                      showPopUp: false,
                    })
                  }>
                  <AntDesign name="close" size={25} />
                </TouchableOpacity>

                <View style={{paddingHorizontal: 20}}>
                  <View style={styles.successIcon}>
                    <Feather name="check-circle" color="green" size={40} />
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '5%',
                    }}>
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: '600',
                      }}>
                      Payment Successful
                    </Text>
                  </View>

                  <View>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.push('Home')}
                      style={[
                        styles.button,
                        {
                          marginTop: '10%',
                        },
                      ]}>
                      <LinearGradient
                        colors={['#f68823', '#b03024']}
                        style={styles.signIn}>
                        <Text
                          style={[
                            styles.textSign,
                            {
                              color: '#fff',
                            },
                          ]}>
                          Continue
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animatable.View>
          </View>
        </>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  popBackground: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    elevation: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  successMa: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    // bottom: 0,
    margin: '5%',
    // backgroundColor: '#fff',
    elevation: 5,
  },
  popup: {
    width: '100%',
    // zIndex: 1 ,
    // position:"relative",
    paddingBottom: '10%',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    // flex:1
  },

  crossIcon: {
    marginBottom: '5%',
    paddingLeft: 5,
    paddingTop: 5,
  },
  successIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
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
    textTransform: 'uppercase',
  },
});
