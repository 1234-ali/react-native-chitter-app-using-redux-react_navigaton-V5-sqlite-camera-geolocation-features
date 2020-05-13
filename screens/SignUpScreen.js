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

const SignUpScreen = ({ navigation }) => {
    const token = useSelector(state => state.UserReducer);

    const [fadeAnim] = useState(new Animated.Value(0));

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [hidePassword, setHidePassword] = useState(true);
    const [hideRePassword, setHideRePassword] = useState(true);

    const [isFetching, setIsFetching] = useState(false);
    const [isMessage, setIsMessage] = useState();

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

    const dispatch = useDispatch();

    const onSubmit = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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
                await dispatch(UserActions.register(firstName, lastName, email, password));
            } catch (error) {
                Alert.alert(error.message);
            }
            setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setRePassword('');
            setIsFetching(false);
            setIsMessage(true);
        }
    };

    const message = (msg) => {
        Alert.alert(msg, '', [{text: 'OK', onPress: () => setIsMessage()}]);
    };

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