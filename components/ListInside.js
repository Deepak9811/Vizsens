import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {Checkbox, Appbar, TextInput} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    };
  }

  componentDidMount() {
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-typee': 'application/json',
      },
    }).then(results => {
      results.json().then(async resp => {
        // console.log('resp ', resp);
        this.setState({
          data: resp,
        });
      });
    });
  }



  deleteAllData() {
    this.setState({
      data: [],
      checkeds: false,
    });
  }

  deleteItem(i) {
    console.log('i :', i); 
    let helperArray = this.state.data;
    let helperArray2 = this.state.deletionArray;
    helperArray.splice(i, 1);
    helperArray2.splice(i, 1);
    this.setState({
      data: helperArray,
      deletionArray: helperArray2,
    });
  }

  deletedSelectedItems(i) {
    console.log('hl');
    let helperArray = this.state.data;
    let helperArray2 = this.state.deletionArray;
    for (let i = helperArray2.length - 1; i >= 0; i--) {
      helperArray.splice(helperArray2[i], 1);
      helperArray2.splice(i, 1);
      this.setState({
        data: helperArray,
        deletionArray: helperArray2,
      });
    }
  }

  selectAll() {
    let helperArray = [];
    for (let i = 0; i < this.state.data.length; i++) {
      if (!this.state.allSelected) {
        helperArray.push(i);
      } else if (this.state.allSelected) {
        helperArray = [];
      }
    }
    this.setState({
      deletionArray: helperArray,
      allSelected: !this.state.allSelected,
    });
  }

  selectAnItem(i) {
    let helperArray = this.state.deletionArray;
    let itemIndex = helperArray.indexOf(i);

    if (helperArray.includes(i)) {
      helperArray.splice(itemIndex, 1);
      this.setState({allSelected: false});
    } else {
      helperArray.push(i);
      if (helperArray.length == this.state.data.length) {
        this.setState({allSelected: true});
      }
    }
    this.setState({
      deletionArray: helperArray,
    });
  }

  render() {
    return (
      <View animation="fadeInRight" style={styles.container}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>

          <Appbar.Content title="Visitor In Compus - Ashoka University, Sonipat" />
        </Appbar.Header>

        <View style={styles.cr}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text>Total Users : {this.state.data.length}</Text>
            <Text>Selected Users : {this.state.deletionArray.length}</Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                borderBottomWidth: 1,
              }}>
              {/* <Checkbox
                status={this.state.checkeds ? 'checked' : 'unchecked'}
                onPress={() => this.Checkbox()}
              /> */}
              <TouchableOpacity
                style={styles.btnd}
                onPress={() => this.deletedSelectedItems()}>
                <Text style={[styles.title, {fontSize: 12}]}>
                  Delete Selected
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnd]}
                onPress={() => this.selectAll()}>
                <Text style={[styles.title]}>
                  {this.state.allSelected ? 'Unselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.deleteAllData()}
                style={[styles.btnd]}>
                <Text style={[styles.title]}>Delete all</Text>
              </TouchableOpacity>
            </View>

            <View style={{marginBottom: '10%'}}>
              {this.state.data.map((item, i) => {
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
                      <View style={{marginRight: '2%'}}>
                        <Checkbox
                          // status={this.state.checkeds ? 'checked' : 'unchecked'}
                          status={
                            this.state.deletionArray.includes(i)
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => this.selectAnItem(i)}
                        />
                      </View>
                      <Text style={[styles.title, styles.wdt]}>
                        {item.id}+{item.title}
                      </Text>

                      {/* {this.state.showSingleDeleteIcon && ( */}
                      <TouchableOpacity
                        style={styles.deleteicon}
                        onPress={() => this.deleteItem(i)}>
                        <MaterialCommunityIcons
                          name="delete-outline"
                          color="#fff"
                          size={25}
                        />
                      </TouchableOpacity>
                      {/* )} */}
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
  },
  title: {
    marginTop: '1.5%',
  },
  wdt: {
    width: '75%',
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
