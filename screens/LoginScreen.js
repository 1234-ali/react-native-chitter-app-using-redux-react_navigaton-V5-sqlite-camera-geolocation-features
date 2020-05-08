import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const LoginScreen = ({ navigation }) => {
    const token = useSelector(state => state.UserReducer);

    const [fadeAnim] = useState(new Animated.Value(0));

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const [isFetching, setIsFetching] = useState(false);
    const [isError, setIsError] = useState();
    const [isMessage, setIsMessage] = useState();

    const dispatch = useDispatch();

    const [hidePassword, setHidePassword] = useState(true);

    useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }
        ).start();
    }, []);

    const onSubmit = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (email == '' || password == '' || reg.test(email) == false ) {
            Alert.alert('Enter the valid credentials');
        } else if (password.length < 6) {
            Alert.alert('Password length must be greater than 6 digits');
        } else {
            setIsError(null);
            setIsMessage(null);
            setIsFetching(true);
            try {
                await dispatch(UserActions.login(email, password));
            } catch (error) {
                Alert.alert(error.message);
            }
            setIsFetching(false);
            setIsMessage(true);
            setIsError(true);
        }
    };


    return (
         <View style={styles.container}>
             { isMessage && token.msg != '' && message() }
             <KeyboardAvoidingView behavior='position'>
                {/* <View style={{ height: 150, marginTop: hp(5) }}>
                    <Image source={require('../assets/images/book.jpg')} style={{ height: null, flex: 1 }} />
                </View> */}
                <Card style={styles.cardContainer}>
                    <CardItem style={styles.cardItem}>
                        <Body style={styles.cardBody}>
                            <Text style={styles.loginText}>
                                Login
                            </Text>
                            <Item rounded style={styles.itemContainer}>
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
                            <Animated.View style={{ opacity: fadeAnim }}>
                                <Button onPress={onSubmit} rounded success style={styles.buttonContainer}>
                                    <Text  style={styles.buttonText}>Login</Text>
                                </Button>
                            </Animated.View>
                            <TouchableOpacity onPress={() => navigation.navigate('forgetPassword')} style={styles.forgetButtonContainer}>
                                <Text style={styles.forgetButtonText}>
                                    Forget Password
                                </Text>
                                <AntDesign name="questioncircleo" size={hp(2)} color='#5C257F' style={styles.forgetButtonIcon} />
                            </TouchableOpacity>
                        </Body>
                    </CardItem>
                </Card>
            </KeyboardAvoidingView>
            
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
            <Modal isVisible={isFetching}>
                <View style={styles.indicator}>
                    <ActivityIndicator size='large' color='white' />
                </View>
            </Modal> 
        </View>
    );
};

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
        marginTop: hp(20) 
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
    }
});

export default LoginScreen;