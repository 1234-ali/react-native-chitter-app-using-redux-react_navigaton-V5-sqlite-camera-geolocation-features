import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Image, TouchableWithoutFeedback, Animated, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Icon, Header, Title, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const UserScreen = ({ navigation }) => {
    const user = useSelector(state => state.UserReducer.user);

    const [fadeAnim] = useState(new Animated.Value(0));

    const [firstName, setFirstName] = useState(user != null && user.given_name);
    const [lastName, setLastName] = useState(user != null && user.family_name);
    const [email, setEmail] = useState(user != null && user.email);
    const [password, setPassword] = useState('');

    const [hidePassword, setHidePassword] = useState(true);

    const [isFetching, setIsFetching] = useState(false);

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

        if (firstName == '' || lastName == '' || email == '' || password == '' || reg.test(email) == false) {
            Alert.alert('Enter the valid credentials');
        } else if (password.length < 6) {
            Alert.alert('Password length must be greater than 6 digits');
        } else {
            setIsFetching(true);
            try {
                await dispatch(UserActions.UpdateUser(firstName, lastName, email, password));
            } catch (error) {
                Alert.alert(error.message);
            }
            setIsFetching(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header style={styles.headerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" /> 
                <View>
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}> 
                        <Icon name='arrow-back' style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View> 
                <View>
                    <Title style={styles.header}>Edit Profile</Title>
                </View>
                <Entypo name='water' style={styles.waterIcon} />
            </Header>
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior='position'>
                    <View style={styles.imageContainer}>
                        <Image source={require('../assets/images/logo5.jpg')} style={styles.image} />
                    </View>
                    <Card style={styles.cardContainer}>
                        <CardItem style={styles.cardItem}>
                            <Body style={styles.cardBody}>
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
                                <Animated.View style={{ opacity: fadeAnim }}>
                                    <Button onPress={onSubmit} rounded success style={styles.buttonContainer}>
                                        <Text  style={styles.buttonText}>Submit</Text>
                                    </Button>
                                </Animated.View>
                            </Body>
                        </CardItem>
                    </Card>
                </KeyboardAvoidingView>
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
        backgroundColor: 'white',
    },
    headerContainer: { 
        backgroundColor: 'white', 
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    header: { 
        color: '#024873', 
        fontFamily: book, 
        fontSize:hp(3.5)
    },
    brushContainer: {
        alignItems: 'center' 
    },
    brushText: { 
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: 25, 
        alignSelf:'center'  
    },
    backIcon: { 
        color: '#024873', 
        fontSize: 30,
        marginLeft: 5  
    },
    waterIcon: { 
        marginLeft: wp(5), 
        fontSize: hp(3.1),  
        color: 'blue', 
        marginTop: hp(.5) 
    },
    
    cardContainer: { 
        width: wp(95), 
        backgroundColor:  '#F0F0F0',  
        justifyContent: 'center', 
        elevation: 8,  
        marginTop: hp('5%'),
        alignSelf: 'center' 
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
        height: 150, 
        width: 150, 
        marginTop: hp(4), 
        alignSelf: 'center' 
    },
    image: { 
        height: null, 
        width: null, 
        flex: 1
    }
});

export default UserScreen;