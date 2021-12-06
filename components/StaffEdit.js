


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
    ToastAndroid,BackHandler
} from 'react-native';
import IconAntDesign from 'react-native-vector-icons/MaterialIcons';
import { Appbar, Card } from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import { Picker as SelectPicker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

export default class Staff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            showPhoto: false,
            firstName: "",
            lastName: "",
            mobile: "",
            vendorName: "",
            image1:""

        };
    }


    


    async componentDidMount() {

        this.setState({
            loader:true
        })


                const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
                const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
                const loc = (await AsyncStorage.getItem('staffId'))
                const purp = (await AsyncStorage.getItem('purposeValue'))
                const vendroID = (await AsyncStorage.getItem('vendorID'))
        
        
                console.log(loc, purp,vendroID)
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
                                    staffId: resp.data[0].staffId,
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
                                    // alert("empt")
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
        
        
        
            cameraCapture() {
        
                ImagePicker.openCamera({
                    width: 300,
                    height: 400,
                    cropping: false,
                    includeBase64: true,
                    compressImageQuality: 0.18,
                    size: 25,
                })
                    .then(image => {
                        console.warn(image);
                        this.setState({
                            image1: image.data,
                            mime: image.mime,
                            showPhoto: true,
                        });
        
                        // this.onChangeImage(image)
                    })
                    .catch(error => {
                        console.log(error.message);
        
                    });
            }
        
            checkAllField() {
                console.log("SupportStaffID :",this.state.staffId,
                    "fname: ",this.state.fname,
                    "lname: ",this.state.lname,
                    "mobile: ",this.state.mobile,
                    "vendorId: ",this.state.vendor,
                    )
                        if (this.state.fname !== "" && this.state.lname !== ""   && this.state.mobile !== "" && this.state.vendor !== "" && this.state.image1.length !== 0) {
                            this.checkNumber()
                            // console.log("hello world")
                        } else {
                            Alert.alert('Wrong Input', 'Please fill all the fields.', [
                                { text: 'Okay' },
                            ],{cancelable:true});
                        }
                    }
                
                    checkNumber(){
                        if(this.state.mobile.length < 10){
                           alert('Please check mobile number. ');
                       }else{
                        this.saveVendorData()
                       }
                   }
        
        
                   async saveVendorData() {
                    console.log(this.state.firstName, this.state.lastName, this.state.mobile, this.state.vendor)
                    this.setState({
                        loader: true
                    })
            
            
            
                    const tokenn = JSON.parse(await AsyncStorage.getItem('token'));
                    const terminal = JSON.parse(await AsyncStorage.getItem('terminalid'));
                    const vendroID = (await AsyncStorage.getItem('vendorID'))
            
                    console.log("staff id "+this.state.staffId)
            
                    fetch(`https://ashoka.vizsense.in/api/ssentry`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            token: tokenn,
                            uid: terminal,
                        },
                        body: JSON.stringify({
                            SupportStaffID:this.state.staffId,
                            fname: this.state.fname,
                            lname: this.state.lname,
                            mobile: this.state.mobile,
                            vendorId: vendroID,
                            ssPhoto: this.state.image1,
                        })
                    }).then(result => {
                        result.json().then(async resp => {
                            console.log('reasone =>', resp.data);
                            if (resp.response === "success") {
                                ToastAndroid.show(
                                    resp.message,
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    );
                                    this.props.navigation.navigate('Staff')
                                    this.setState({
                                        loader: false
                                })
            
                            }else{
                                ToastAndroid.show(
                                    resp.message,
                                    ToastAndroid.LONG,
                                    ToastAndroid.BOTTOM,
                                    );
                                this.setState({
                                    loader: false
                            })
                            }
                        });
                    })
                        .catch(error => {
                            console.log(
                                'There has been a problem with your fetch operation: ' +
                                error.message,
                            );
                            this.setState({
                                loader: false
                        })
                        });
                }
        
        



    render() {
        return (
            <Animatable.View animation="fadeInRight" style={styles.container} duration={400}>
                <Appbar.Header style={styles.ttl}>
                    <TouchableOpacity
                        style={{ paddingLeft: '2%' }}
                        onPress={() =>  this.props.navigation.navigate('Staff')}>
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

                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={styles.cr}>

                        <View style={[styles.cdm]}>
                            <View style={{ marginVertical: "5%" }}>
                                <Text style={{ color: '#959595' }}>
                                    Please check the details below to proceed further...
                                </Text>
                            </View>


                            <View style={{ alignItems: "center", }}>
                                <TouchableOpacity style={{ borderRadius: 5, borderWidth: 1,marginBottom:"5%" }} onPress={() => this.cameraCapture()}>

                                    {!this.state.showPhoto ? (
                                        <View style={{
                                            justifyContent: "center", alignItems: "center", height: 350,
                                            width: 490
                                        }}>
                                            <Feather name="user" size={220} color="#fe8c00" />
                                        </View>
                                    ) : (
                                        <>
                                            <Image
                                                style={{
                                                    height: 350,
                                                                width: 490,
                                                    borderRadius: 5,
                                                }}
                                                source={{
                                                    uri: `data:${this.state.mime};base64,${this.state.image1}`,
                                                }}
                                            />
                                        </>
                                    )}


                                </TouchableOpacity>
                            </View>




                            <Text style={styles.cl}>First Name <Text style={{ color: "#FF2020" }}>*</Text></Text>
                            <View style={styles.searchSt}>
                                <TextInput
                                    placeholder="First Name"
                                    placeholderTextColor="#696969"
                                    style={styles.searchInputStyle}
                                    value={
                                        this.state.fname
                                    }
                                    onChangeText={value => {
                                        this.setState({ fname: value });
                                    }}

                                />

                            </View>



                            <View style={{ marginTop: "5%" }}>

                                <Text style={styles.cl}>Last Name </Text>
                                <View style={styles.searchSt}>
                                    <TextInput
                                        placeholder="Last Name"
                                        placeholderTextColor="#696969"
                                        style={styles.searchInputStyle}
                                        value={
                                            this.state.lname
                                        }
                                        onChangeText={value => {
                                            this.setState({ lname: value });

                                        }}

                                    />

                                </View>
                            </View>

                            <View style={{ marginTop: "5%" }}>

                                <Text style={styles.cl}>Mobile <Text style={{ color: "#FF2020" }}>*</Text></Text>
                                <View style={styles.searchSt}>
                                    <TextInput
                                        maxLength={10}
                                        keyboardType="numeric"
                                        placeholder="Mobile"
                                        placeholderTextColor="#696969"
                                        style={styles.searchInputStyle}
                                        value={
                                            this.state.mobile
                                        }
                                        onChangeText={value => {
                                            this.setState({ mobile: value });
                                            
                                        }}

                                    />

                                </View>
                            </View>



                            <View style={{ marginTop: "5%" }}>

                                <Text style={styles.cl}>Vendor <Text style={{ color: "#FF2020" }}>*</Text></Text>
                                <View style={styles.searchSt}>
                                    <TextInput
                                        placeholder="Vendor"
                                        placeholderTextColor="#696969"
                                        style={styles.searchInputStyle}
                                        value={
                                            this.state.vendor
                                        }
                                        editable={false}

                                    />

                                </View>
                            </View>



                            <View style={{ marginTop: '10%', marginBottom: '5%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.wd}>
                                        <LinearGradient
                                            colors={['#fe8c00', '#fe8c00']}
                                            style={{ borderRadius: 5 }}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate('Staff')}

                                                style={styles.btnTouch}>
                                                <Text
                                                    style={{
                                                        padding: '5%',
                                                        // marginLeft: '5%',
                                                        marginTop: '2%',
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
                                                        marginRight: '5%',
                                                        fontSize: 16,
                                                    }}>
                                                    Back
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
                                                onPress={() => this.checkAllField()}
                                                style={styles.btnTouch}>
                                                <Text
                                                    style={styles.empIN}>
                                                    Save
                                                </Text>
                                                <Text style={{ padding: '5%', marginTop: '2%' }}>
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
                    <View
                    style={{
                        marginBottom: '3%',
                        marginLeft: '5%',
                        alignItems: 'center',
                    }}>
                    <View style={styles.link}>
                        <Image
                            source={require('./image/partner.png')}
                            style={{ width: 200, height: 40 }}
                        />
                    </View>
                </View>

                </ScrollView>

                
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
        height: 100,
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
