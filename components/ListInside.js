import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity, ActivityIndicator, ToastAndroid,Alert
} from 'react-native';

import { Checkbox, Appbar, TextInput } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ListInside extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideInput: false,
      checked: false,
      checkeds: false,
      showAllDeleteIcon: false,
      purposeIndexValue: '',
      data: [],
      //-------------new checkbox state
      deletionArray: [],
      allSelected: false,
      loader: true,
      vSlipNo: [],
      ErroMessage: false
    };
  }

  

  async componentDidMount() {
    this.getVisitorInside()
  }

  async getVisitorInside() {
    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    fetch(`https://ashoka.vizsense.in/api/exitnull`, {
      method: 'GET',
      headers: {
        token: tokenn,
        uid: terminal,
      },
    }).then(results => {
      results.json().then(async resp => {
        console.log('resp ', resp);
        if (resp.response === "success") {
          this.setState({
            data: resp.data,
            loader: false,
          });
          if (resp.data.length === 0) {
            console.log("empty")
            this.setState({
              ErroMessage: true
            })
          }
        } else {
          ToastAndroid.show(
            resp.message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }


      });
    }).catch(error => {
      this.setState({
        loader: false
      })
      ToastAndroid.show(
        error,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    });
  }






  deletedSelectedItems(i, item) {
    this.setState({
      loader: true
    })
    // let helperArray = this.state.data;
    // let helperArray2 = this.state.deletionArray;
    // console.log("helperArray2.length", helperArray2.length)
    // for (let i = helperArray2.length - 1; i >= 0; i--) {
    //   helperArray.splice(helperArray2[i], 1);

    //   let newData = helperArray2.splice(i, 1)
    //   console.log("helperArray2 ---", newData[0],)

    //   this.exitVisitor(newData[0]);

    //   this.setState({
    //     data: helperArray,
    //     deletionArray: helperArray2,
    //   });

    // }

    if (this.state.deletionArray.length === 0) {
      this.setState({
        loader: false
      })
      Alert.alert('', "Please select something.", [{ text: 'Okay' }],{cancelable:true});

    } else {
      console.log('22')
      let newData = this.state.deletionArray
      this.exitVisitor(newData);

    }
  }

  async exitVisitor(newData) {

    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    fetch(`https://ashoka.vizsense.in/api/exit?slipNo=${newData}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: tokenn,
        uid: terminal,
      },
    })
      .then(result => {
        result.json().then(resp => {
          console.log("deleted visitor -------", resp);
          if (resp.response === 'success') {

            this.getVisitorInside()
            this.state.deletionArray.length =0
            this.setState({
              loader: false,
              
            })
            console.log(resp)
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
            // this.props.navigation.navigate("Home")
          } else {
            this.setState({
              loader: false
            })
            console.log("error in deleting")
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            )
          }
        });
      })
      .catch(error => {
        this.setState({
          loader: false
        })
        ToastAndroid.show(
          error,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      });
  }

  deleteAllData() {
    this.selectAll()
  }

  selectAll() {
    this.setState({
      loader: true
    })
    let helperArray = [];
    let helperArray2 = this.state.data;
    for (let i = helperArray2.length - 1; i >= 0; i--) {

      if (!this.state.allSelected) {

        let newData = helperArray2.splice(i, 1)

        helperArray.push(newData[0].vSlipNo);
        // console.log("helperArray2 ---", newData[0].vSlipNo,)
      } else if (this.state.allSelected) {
        helperArray = [];
      }
    }
    this.state.deletionArray = helperArray

    console.log("this.state.deletionArray :-", this.state.deletionArray)
    this.deletePer()
  }



  async deletePer() {

    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));

    fetch(`https://ashoka.vizsense.in/api/exit?slipNo=${this.state.deletionArray}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: tokenn,
        uid: terminal,
      },
    })
      .then(result => {
        result.json().then(resp => {
          console.log("deleted visitor -------", resp);
          if (resp.response === 'success') {
            this.state.deletionArray.length =0
            this.setState({
              loader: false
            })
            console.log(resp)
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
            this.getVisitorInside()
            // this.props.navigation.navigate("Home")
          } else {
            console.log("this.state.data[0].vSlipNo", resp.message)

            this.setState({
              loader: false
            })
            console.log("error in deleting")
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            )
          }
        });
      })
      .catch(error => {
        this.setState({
          loader: false
        })
        ToastAndroid.show(
          error,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      });
  }

  selectAnItem(i, item) {
    console.log(i)

    let helperArray = this.state.deletionArray;
    let itemIndex = helperArray.indexOf(item.vSlipNo);
    console.log("itemIndex ", itemIndex)
    if (helperArray.includes(item.vSlipNo)) {
      helperArray.splice(itemIndex, 1);
      this.setState({ allSelected: false });
    } else {
      helperArray.push(item.vSlipNo);
      // console.log("helperArray.push(item.vSlipNo)", helperArray.push(item.vSlipNo))
      if (helperArray.length == this.state.data.length) {
        this.setState({ allSelected: true });
      }
    }
    console.log("deletionArray", helperArray)
    this.setState({
      deletionArray: helperArray,
    });
  }

  render() {
    return (
      <Animatable.View
      animation="fadeInRight"
      duration={400} style={styles.container}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{ paddingLeft: '2%' }}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>

          <Appbar.Content title="Visitor In Compus - Ashoka University, Sonipat" />
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

        <View style={styles.cr}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flexDirection:"row"}}>
            <Text style={{width:"18%"}}>Total Users</Text><Text>: {this.state.data.length}</Text>
            </View>
            <Text>Selected Users : {this.state.deletionArray.length}</Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                borderBottomWidth: 1,justifyContent:"space-between"
              }}>
             
              <TouchableOpacity
                style={[styles.btnd, { marginLeft: "2%" }]}
                onPress={() => this.deletedSelectedItems()}>
                <Text style={[styles.title, { fontSize: 12 }]}>
                  Delete Selected
                </Text>
              </TouchableOpacity>
              

              <TouchableOpacity
                onPress={() => this.deleteAllData()}
                style={[styles.btnd]}>
                <Text style={[styles.title]}>Delete all</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: '10%' }}>

              {this.state.ErroMessage ? (
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: "20%" }}>
                  <Text style={{ color: "red", fontSize: 20 }}>No Data Found</Text>
                </View>
              ) : null}

              {this.state.data.map((item, i) => {
                {console.log(item.dtEntryDate.replace("T"," "))}
                return (
                  <React.Fragment key={i}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginVertical: '3%',
                        borderBottomWidth: 0.5,
                        paddingBottom: 10,
                        borderBottomColor: '#DDDDDD',
                      }}>
                      <View style={{ marginRight: '2%',marginLeft:"2%",marginTop:"2%" }}>
                        <Checkbox
                          // status={this.state.checkeds ? 'checked' : 'unchecked'}
                          status={
                            this.state.deletionArray.includes(item.vSlipNo)
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => this.selectAnItem(i, item)}
                        />
                      </View>
                      <View style={{}}>
                        <Text style={[styles.title,]} >
                          {item.vSlipNo}
                        </Text>
                        <Text style={[styles.title,]}>{item.vFirstName} {item.vLastName}</Text>
                        <Text style={[styles.title,]}>{item.dtEntryDate.replace("T"," ")}</Text>
                      </View>

                      {/* <TouchableOpacity
                        style={styles.deleteicon}
                        onPress={() => this.deleteItem(i)}>
                        <MaterialCommunityIcons
                          name="delete-outline"
                          color="#fff"
                          size={25}
                        />
                      </TouchableOpacity> */}
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
  },
  title: {
    marginTop: '1.5%',
  },

  deleteicon: {
    borderRadius: 5,
    padding: '2%',
    backgroundColor: '#ddd',
    backgroundColor: '#C70039',
    height: 40,
  },
  btnd: {
    padding: '2%',
    backgroundColor: '#ddf',
    marginRight: '2%',
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
