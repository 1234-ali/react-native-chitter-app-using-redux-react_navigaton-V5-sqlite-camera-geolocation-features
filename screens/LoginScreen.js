import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, Image, TouchableOpacity, Dimensions, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';


//  All above are same please check other files like draft Screen.js

const LoginScreen = ({ navigation }) => {
    const [fadeAnim] = useState(new Animated.Value(0));  // used for button animation initial value is 0

    const [email, setEmail] = useState('');  // email
    const [password, setPassword] = useState(''); // for password user write

    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    const [hidePassword, setHidePassword] = useState(true); // states for hide and show password. 
    //when false passwrd show, true not show in tet input

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

    const onSubmit = async () => {  // function to submit login form 
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  // to check user enter the correct email syntax

        if (email == '' || password == '' || reg.test(email) == false ) {  // user enter, no email, password, or incorrect email syntax
            Alert.alert('Enter the valid credentials'); // alert box display
        } else if (password.length < 6) { // password length < 6 this alert box display
            Alert.alert('Password length must be greater than 6 digits');
        } else {
            setIsFetching(true); // if true modal appears 
            try {
                await dispatch(UserActions.login(email, password)); // used to login user from server. dispatching actions from UserActions file. imported above
            } catch (error) {
                Alert.alert(error.message); //if error occurs the message display
            }
            setIsFetching(false); // if false modal disappears 
        }
    };

    return (
         <View style={styles.container}>
             {/* to show status bar */}
             <StatusBar barStyle="dark-content" backgroundColor="white" />
             {/* KeyboardAvoidingView is used to avoid keyborad */}
             <KeyboardAvoidingView behavior='position'> 
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/images/logo5.jpg')} style={styles.image} />
                </View>
                {/* Card, CardItem, Body import from native base ui library */}
                <Card style={styles.cardContainer}>
                    <CardItem style={styles.cardItem}>
                        <Body style={styles.cardBody}>
                            <Text style={styles.loginText}>
                                Login
                            </Text>
                            {/* input, Item rounded is from native base, rounded rount the text input  */}
                            <Item rounded style={styles.itemContainer}>
                                <Input  // it is for email
                                    placeholder='Email' 
                                    autoCorrect={false} 
                                    keyboardType='email-address' 
                                    style={styles.itemText}
                                    value={email} // email value
                                    onChangeText={(text) => setEmail(text)} // onchangetext changing the value of email input
                                />
                            </Item>
                            {/* input, Item rounded is from native bases, rounded rount the text input */}
                            <Item rounded style={{ ...styles.itemContainer, marginTop: hp(2.5) }}>
                                <Input 
                                    placeholder='Password' 
                                    autoCorrect={false} 
                                    secureTextEntry={hidePassword} // used to hide and show password
                                    style={styles.itemText} 
                                    value={password} // password value
                                    onChangeText={(text) => setPassword(text)} // onchangetext changing the value of password input
                                />
                                { hidePassword ?  // below icons used for to hide and show password, you can check on Press event changing the state
                                    <Feather name='eye' size={hp('2.5%')} color='#3A403D' onPress={() => setHidePassword(false)} style={styles.hideIcon} />
                                :   
                                    <Feather name='eye-off' size={hp('2.5%')} color='#3A403D' onPress={() => setHidePassword(true)} style={styles.hideIcon} />
                                }   
                            </Item>
                            {/* Animated.View is for button animation. style={{ opacity: fadeAnim }} => it changing the opacity of button from changing value from 0 to 1.  onPress it calls on Submit function */}
                            <Animated.View style={{ opacity: fadeAnim }}> 
                                <Button onPress={onSubmit} rounded success style={{...styles.buttonContainer, marginBottom: hp(2) }}>
                                    <Text  style={styles.buttonText}>Login</Text>
                                </Button>
                            </Animated.View>
                        </Body>
                    </CardItem>
                </Card>
            </KeyboardAvoidingView>

            {/* the below code is for to create an account. clicking on signup. navigates to sign up screen */}
            
            <View style={styles.signupContainer}> 
                <Text style={styles.createText}>
                    Create an account ? 
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                    <Text style={styles.signupText}>
                        Sign up
                    </Text>
                </TouchableOpacity>
            </View>
            {/* modal from react native modal to display when calling api from this screen and show activity indicator */}
            {/* isVisible={isFetching} => if isFetching true modal display otherwise not display */}
            <Modal isVisible={isFetching}>
                <View style={styles.indicator}>
                    <ActivityIndicator size='large' color='white' />
                </View>
            </Modal> 
        </View>
    );
};

//The below is all css and styling of screen
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
        marginTop:  height > 800 ?  hp('5%') : hp('4%') 
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
        fontFamily: medium, 
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
        fontFamily: book 
    },
    buttonContainer: {
        marginTop: hp(2.5), 
        marginBottom: hp(1) 
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
        marginTop: hp('1.5%'), 
        marginBottom: hp(1) 
    },
    forgetButtonText: {  
        fontSize : hp(2.2), 
        marginRight: wp(1), 
        fontFamily: medium, 
        color: '#5C257F' 
    },
    forgetButtonIcon: { 
        marginTop: hp(.5), 
        fontFamily: medium 
    },
    signupContainer: { 
        flexDirection: 'row',  
        marginTop:  height > 800 ?  hp(29) : hp(24) 
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

export default LoginScreen;