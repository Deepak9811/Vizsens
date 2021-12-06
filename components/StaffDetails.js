import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Alert,
    ToastAndroid,BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appbar } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StaffDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: true,
            showpage: true,
        };
    }

   
    
      



    async componentDidMount() {
        const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
        const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
        const loc = (await AsyncStorage.getItem('staffId'))
        const purp = (await AsyncStorage.getItem('purposeValue'))



        console.log(loc, purp)
        fetch(
            `https://ashoka.vizsense.in/api/supportstaff?vendorId=${purp}&prefix=&staffId=${loc}`,
            {
                method: 'GET',
                headers: {
                    token: tokenn,
                    uid: terminal,
                },
            },
        )
            .then(result => {
                result.json().then(resp => {
                    console.log('userAddress : ', resp.data[0]);

                    if (resp.response === 'success') {
                        this.setState({
                            employeeId: resp.data[0].employeeId,
                            fname: resp.data[0].fname,
                            lname: resp.data[0].lname,
                            vendor: resp.data[0].vendor,
                            mobile: resp.data[0].mobile,
                            joinedon: resp.data[0].joinedon,
                            validtill: resp.data[0].validtill,

                            showPhoto: true,
                            loader: false,
                        });

                        if (resp.data[0].photo === "") {
                            console.log("empt")
                            this.setState({
                                showPhoto: false,
                            })
                        } else {
                            this.setState({
                                image1: resp.data[0].photo,
                                showPhoto: true,
                            })
                        }
                    } else {
                        this.setState({
                            loader: false,
                        });
                        ToastAndroid.show(
                            'Something wents wrong.',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                        );
                    }

                    // console.log(this.state.image);
                });
            })
            .catch(error => {
                this.setState({
                    loader: false,
                });
                Alert.alert('Error', error.message, [{ text: 'Okay' }], { cancelable: true });
            });


    }


    async StaffIN() {
        console.log(this.state.employeeId)
        const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
        const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
        if (this.state.slipID !== '') {
            console.log('this.state.mobile :-', this.state.employeeId);
            this.setState({
                loader: true,
            });

            fetch(`https://ashoka.vizsense.in/api/sslog?id=${this.state.employeeId}&mode=1`, {
                method: "POST",
                headers: {
                    token: tokenn,
                    uid: terminal,
                },

            }).then((result) => {
                result.json().then(resp => {
                    console.log(resp)
                    if (resp.response === 'success') {
                        if (resp.message === "Can't check in. Last check out is missing") {
                            const sl = resp.message
                            console.log(sl)
                            ToastAndroid.show(
                                resp.message,
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        } else {
                            const sl = resp.message
                            console.log(sl)
                            this.props.navigation.navigate('Home')
                            ToastAndroid.show(
                                resp.message,
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        }
                        
                        this.setState({
                            loader: false,
                        });
                    } else {
                        console.log("error")
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
            Alert.alert('Wrong Input', 'Please fill all the fields.', [
                { text: 'Okay' },
            ], { cancelable: true });
        }
    }




    async StaffOut() {
        console.log(this.state.employeeId)
        const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
        const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
        if (this.state.slipID !== '') {
            console.log('this.state.mobile :-', this.state.employeeId);
            this.setState({
                loader: true,
            });

            fetch(`https://ashoka.vizsense.in/api/sslog?id=${this.state.employeeId}&mode=2`, {
                method: "POST",
                headers: {
                    token: tokenn,
                    uid: terminal,
                },

            }).then((result) => {
                result.json().then(resp => {
                    console.log(resp)
                    if (resp.response === 'success') {
                        if (resp.message === "Can't check out. Last check in is missing") {
                            console.log("Can't check in")
                            const sl = resp.message
                            console.log(sl)
                            ToastAndroid.show(
                                resp.message,
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        } else {
                            const sl = resp.message
                            console.log(sl)
                            this.props.navigation.navigate('Home')
                            ToastAndroid.show(
                                resp.message,
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        }
                       
                        this.setState({
                            loader: false,
                        });
                    } else {
                        console.log("error")
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
            Alert.alert('Wrong Input', 'Please fill all the fields.', [
                { text: 'Okay' },
            ], { cancelable: true });
        }
    }

    render() {
        return (
            <Animatable.View animation="fadeInRight" duration={400} style={styles.container}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <Appbar.Header style={styles.ttl}>
                    <TouchableOpacity
                        style={{ paddingLeft: '2%' }}
                        onPress={() => this.props.navigation.navigate('Staff')}>
                        <AntDesign name="arrowleft" color="#05375a" size={25} />
                    </TouchableOpacity>
                    <Appbar.Content title="Staff Details" />
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("StaffEdit")}>
                    <MaterialCommunityIcons
                        name="account-edit-outline"
                        color="#05375a"
                        size={35}
                        style={{ marginRight: 25, marginLeft: 10 }}
                    />
                    </TouchableOpacity>
                </Appbar.Header>

                {!this.state.loader ? (
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}>
                            {this.state.showpage ? (
                                <View style={{ flex: 1 }}>

                                    {/* ========================-----INFO----======================= */}
                                    <View style={{ margin: '5%' }}>


                                        {/* ==============IMAGE==================== */}
                                        <View style={{ alignItems: "center", marginBottom: "5%" }}>
                                            <View style={styles.img} >

                                                {!this.state.showPhoto ? (
                                                    <View style={{
                                                        justifyContent: "center", alignItems: "center", height: 350,
                                                        width: 530
                                                    }}>
                                                        <Feather name="user" size={220} color="#fe8c00" />
                                                    </View>
                                                ) : (
                                                    <>
                                                        <Image
                                                            style={{
                                                                height: 350,
                                                                width: 530,
                                                                borderRadius: 5,
                                                            }}
                                                            source={{
                                                                uri: `data:${this.state.mime};base64,${this.state.image1}`,
                                                            }}
                                                        />
                                                    </>
                                                )}


                                            </View>
                                        </View>

                                        {/* ================Staff-Name====================== */}

                                        <LinearGradient
                                            colors={['#fff', '#fff']}
                                            style={styles.commonGradient}>
                                            <View style={{ marginBottom: '4%' }}>
                                                <Text style={styles.text_footer}>First Name :</Text>

                                                <View style={styles.editInfo}>
                                                    <View style={styles.iconC}>
                                                        <Feather name="user" color="#05375a" size={20} />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.fillDetails}>
                                                            {this.state.fname}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </LinearGradient>

                                        {/* ================last-Name====================== */}

                                        <LinearGradient
                                            colors={['#fff', '#fff']}
                                            style={styles.commonGradient}>
                                            <View style={{ marginBottom: '4%' }}>
                                                <Text style={styles.text_footer}>Last Name :</Text>

                                                <View style={styles.editInfo}>
                                                    <View style={styles.iconC}>
                                                        <Feather name="user" color="#05375a" size={20} />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.fillDetails}>
                                                            {this.state.lname}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </LinearGradient>

                                        {/* ================mobile====================== */}
                                        <LinearGradient
                                            colors={['#fff', '#fff']}
                                            style={styles.commonGradient}>
                                            <View style={{ marginBottom: '4%' }}>
                                                <Text style={styles.text_footer}>mobile :</Text>

                                                <View style={styles.editInfo}>
                                                    <View style={styles.iconC}>
                                                        <FontAwesome5
                                                            name="mobile-alt"
                                                            color="#05375a"
                                                            size={20}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text
                                                            style={[styles.fillDetails, { color: '#05375a' }]}>
                                                            {this.state.mobile}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </LinearGradient>


                                        {/* ================vendor====================== */}

                                        <LinearGradient
                                            colors={['#fff', '#fff']}
                                            style={styles.commonGradient}>
                                            <View style={{ marginBottom: '4%' }}>
                                                <Text style={styles.text_footer}>vendor :</Text>

                                                <View style={styles.editInfo}>
                                                    <View style={styles.iconC}>
                                                        <Feather
                                                            name="user-check"
                                                            color="#05375a"
                                                            size={20}
                                                        />
                                                    </View>
                                                    <View>
                                                        <Text
                                                            style={[styles.fillDetails, { color: '#05375a' }]}>
                                                            {this.state.vendor}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </LinearGradient>


                                        


                                    </View>
                                    {/* =====================================---BUTTONS---================================================ */}

                                    <View style={{ marginBottom: '15%' }}>
                                        <View style={styles.cdm}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={styles.wd}>
                                                    <LinearGradient
                                                        colors={['#fe8c00', '#fe8c00']}
                                                        style={{ borderRadius: 5 }}>
                                                        <TouchableOpacity
                                                            onPress={() => this.StaffOut()}
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
                                                            onPress={() => this.StaffIN()}
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
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                        }}>
                                        {this.state.message}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.activityIndicatorStyle}>
                        <ActivityIndicator color="#57A3FF" size="large" />
                    </View>
                )}
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    ttl: {
        backgroundColor: '#ffffff',
    },
    cdm: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '5%',
    },
    wd: {
        width: '33%',
    },
    img: { borderRadius: 5, borderWidth: 1, backgroundColor: "#fff" },
    btnTouch: {
        flexDirection: 'row',
        padding: '5%',
        borderRadius: 5,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    empIN: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: '10%',
        fontSize: 16,
    },
    text_footer: {
        color: '#BDBDBD',
        fontSize: 16,
        marginBottom: '2%',
        marginTop: 5,
    },
    fillDetails: {
        flexDirection: 'row',
        fontSize: 17,
        color: '#0B0B0B',
        marginBottom: '3%',
    },


    editInfo: {
        flexDirection: 'row',

    },
    activityIndicatorStyle: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    commonGradient: {
        width: '100%',
        justifyContent: 'center',
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 10,
    },
    iconC: {
        marginTop: 3,
        marginRight: 10,
    },



});