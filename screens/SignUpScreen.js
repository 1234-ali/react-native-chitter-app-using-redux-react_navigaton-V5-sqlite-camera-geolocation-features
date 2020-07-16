import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Animated, TouchableOpacity, Image, ScrollView, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Card, CardItem, Body } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

//  All above are same please check other files like draft Screen.js

const SignUpScreen = ({ navigation }) => {
    const token = useSelector(state => state.UserReducer);

    const [fadeAnim] = useState(new Animated.Value(0));  // used for button animation initial value is 0

    const [firstName, setFirstName] = useState(''); // for firstName from text input below
    const [lastName, setLastName] = useState(''); // for lastName from text input below
    const [email, setEmail] = useState(''); // for email from text input below
    const [password, setPassword] = useState(''); // for password from text input below
    const [rePassword, setRePassword] = useState(''); // for rePassword from text input below

    const [hidePassword, setHidePassword] = useState(true);   // states for hide and show password. 
    const [hideRePassword, setHideRePassword] = useState(true); // states for hide and show re enterpassword. 

    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const [isMessage, setIsMessage] = useState(); // is used to display meesage that user is registerd from the server

    // below useEffect same as login screen
    useEffect(() => {   // it is used for button animation, when screens opens it automatically animates the button
        Animated.timing(
            fadeAnim, // it is initialize in line 19 with intial animation state 0
            {
            toValue: 1,  // changing animation value from 0 to 1
            duration: 2000,  // times taken to change value
            useNativeDriver: true // used for animation
            }
        ).start();  // to start the animation
    }, []);


    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    const onSubmit = async () => { // function to submit signup form 
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // to check user enter the correct email syntax

        // below are conditions to check validity
        if (firstName == '' || lastName == '' || email == '' || password == '' || rePassword == '' || reg.test(email) == false) {
            Alert.alert('Enter the valid credentials');
        } else if (password != rePassword) {
            Alert.alert('Password does not match');
        } else if (password.length < 6) {
            Alert.alert('Password length must be greater than 6 digits');
        } else {
            setIsMessage(null);
            setIsFetching(true);
            try {
                await dispatch(UserActions.register(firstName, lastName, email, password));  // used to sign up user from server. dispatching actions from UserActions file. imported above
            } catch (error) {
                Alert.alert(error.message); // if error occurs during sign up, error message shown 
            }
            setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRePassword(''); // after sign up set the state to initaial state
            setIsFetching(false);
            setIsMessage(true); // if message is true then it display message
        }
    };

    const message = (msg) => { // used for display message from the server lie user is sign up or registered 
        Alert.alert(msg, '', [{text: 'OK', onPress: () => setIsMessage()}]);
    };

    // below is same as login screen code pls check login screen return 

    return (
        <ScrollView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.container}>
                { isMessage && token.msg != '' && message(token.msg) }
                <KeyboardAvoidingView behavior='position'>
                    <View style={styles.imageContainer}>
                        <Image source={require('../assets/images/logo5.jpg')} style={styles.image} />
                    </View>
                    <Card style={styles.cardContainer}>
                        <CardItem style={styles.cardItem}>
                            <Body style={styles.cardBody}>
                                <Text style={styles.loginText}>
                                    Sign Up
                                </Text>
                                <Item rounded style={styles.itemContainer}>
                                    <Input 
                                        placeholder='First Name' 
                                        autoCorrect={false} 
                                        keyboardType='default'
                                        style={styles.itemText}
                                        value={firstName}
                                        onChangeText={(text) => setFirstName(text)}
                                    />
                                </Item>
                                <Item rounded style={{ ...styles.itemContainer, marginTop: hp(2.5) }}>
                                    <Input 
                                        placeholder='Last Name' 
                                        autoCorrect={false} 
                                        keyboardType='default' 
                                        style={styles.itemText}
                                        value={lastName}
                                        onChangeText={(text) => setLastName(text)}
                                    />
                                </Item>
                                <Item rounded style={{ ...styles.itemContainer, marginTop: hp(2.5) }}>
                                    <Input 
                                        placeholder='Email' 
                                        autoCorrect={false} 
                                        keyboardType='email-address' 
                                        style={styles.itemText}
                                        value={email}
                                        onChangeText={(text) => setEmail(text)}
                                    />
                                </Item>
                                <Item rounded style={{ ...styles.itemContainer, marginTop: hp(2.5) }}>
                                    <Input 
                                        placeholder='Password' 
                                        autoCorrect={false} 
                                        secureTextEntry={hidePassword} 
                                        style={styles.itemText} 
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                    />
                                    { hidePassword ? 
                                        <Feather name='eye' size={hp('2.5%')} color='#3A403D' onPress={() => setHidePassword(false)} style={styles.hideIcon} />
                                    :   
                                        <Feather name='eye-off' size={hp('2.5%')} color='#3A403D' onPress={() => setHidePassword(true)} style={styles.hideIcon} />
                                    }   
                                </Item>
                                <Item rounded style={{ ...styles.itemContainer, marginTop: hp(2.5) }}>
                                    <Input 
                                        placeholder='Confirm Password' 
                                        autoCorrect={false} 
                                        secureTextEntry={hideRePassword} 
                                        style={styles.itemText} 
                                        value={rePassword}
                                        onChangeText={(text) => setRePassword(text)}
                                    />
                                    { hideRePassword ? 
                                        <Feather name='eye' size={hp('2.5%')} color='#3A403D' onPress={() => setHideRePassword(false)} style={styles.hideIcon} />
                                    :   
                                        <Feather name='eye-off' size={hp('2.5%')} color='#3A403D' onPress={() => setHideRePassword(true)} style={styles.hideIcon} />
                                    }   
                                </Item>
                                <Animated.View style={{ opacity: fadeAnim }}>
                                    <Button onPress={onSubmit} rounded success style={styles.buttonContainer}>
                                        <Text  style={styles.buttonText}>Sign Up</Text>
                                    </Button>
                                </Animated.View>
                            </Body>
                        </CardItem>
                    </Card>
                </KeyboardAvoidingView>
                <View style={styles.signupContainer}> 
                    <Text style={styles.createText}>
                        Already have an account ? 
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <Text style={styles.signupText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
                <Modal isVisible={isFetching}>
                    <View style={styles.indicator}>
                        <ActivityIndicator size='large' color='white' />
                    </View>
                </Modal> 
            </View>
        </ScrollView>
    );
};

// below is css of this screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    cardContainer: { 
        width: wp(95), 
        backgroundColor:  '#F0F0F0',  
        justifyContent: 'center', 
        elevation: 8,  
        marginTop: hp('5%') 
    },
    cardItem: { 
        backgroundColor:  '#F0F0F0' 
    },
    cardBody: {
        alignItems: 'center', 
        backgroundColor:  '#F0F0F0'  
    },
    loginText: {
        fontSize : hp(4), 
        color: '#230A59', 
        fontFamily:
        medium, 
        marginBottom: hp(3.5) 
    },
    itemContainer: {
        width: wp(80), 
        borderColor: '#192DA1', 
        overflow: 'hidden', 
        backgroundColor:  'white', 
    },
    itemText: {
        paddingLeft: 10, 
        fontFamily: 
        book },
    buttonContainer: {
        marginTop: hp(2.5), 
        marginBottom: hp(2) 
    },
    buttonText: { 
        textAlign: 'center', 
        width: wp(80), 
        color: 'white', 
        fontSize: hp(2.3), 
        fontFamily: book 
    },
    forgetButtonContainer: { 
        flexDirection: 'row', 
        marginTop: hp('15%'), 
    },
    forgetButtonText: {  
        fontSize : hp(2.2), 
        marginRight: wp(1), 
        fontFamily: medium, 
        color: '#126872' 
    },
    forgetButtonIcon: { 
        marginTop: hp(.5), 
        fontFamily: medium 
    },
    signupContainer: { 
        flexDirection: 'row',  
        marginTop: hp(13),
        marginBottom: hp(3) 
    },
    createText: { 
        fontSize : hp(2.2), 
        marginRight: wp(1), 
        color: '#8C3037', 
        fontFamily: medium 
    },
    signupText: { 
        fontSize : hp(2.2), 
        color: '#03A688', 
        fontFamily: medium 
    },
    hideIcon: {
        marginRight: wp('5%'),
    },
    indicator: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    imageContainer: { 
        height: height > 800 ?  175 : 150, 
        width: height > 800 ?  175 : 150, 
        marginTop: hp(5), 
        alignSelf: 'center' 
    },
    image: { 
        height: null,
        width: null, 
        flex: 1 
    }
});

export default SignUpScreen;