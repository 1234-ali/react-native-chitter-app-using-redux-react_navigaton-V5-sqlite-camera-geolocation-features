import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Card, CardItem, Body } from 'native-base';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const ForgetPasswordScreen = ({ navigation }) => {
    // const token = useSelector(state => state.UserReducer);

    const [fadeAnim] = useState(new Animated.Value(0));

    const [email, setEmail] = useState('');

    // const dispatch = useDispatch();

    const [textError, setTextError] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const [isError, setIsError] = useState();
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

    const onSubmit = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (email == '') {
            Alert.alert('Field is empty');
            setTextError(true);
        } else if (reg.test(email) == false) {
            Alert.alert('Email is invalid.Enter correct email');
        } else {
            // setIsError(null);
            // setIsMessage(null);
            // setIsFetching(true);
            // try {
            //     console.log('231');
            //     await dispatch(UserActions.resetPassword(email));
            // } catch (error) {
            //     console.log(error);
            //     Alert.alert(error.message);
            // }
            // setIsFetching(false);
            // setIsMessage(true);
            // setIsError(true);
        }
    };


    return (
         <View style={styles.container}>
             <KeyboardAvoidingView behavior='position'>
                {/* <View style={{ height: 150, marginTop: hp(5) }}>
                    <Image source={require('../assets/images/book.jpg')} style={{ height: null, flex: 1 }} />
                </View> */}
                <Card style={styles.cardContainer}>
                    <CardItem style={styles.cardItem}>
                        <Body style={styles.cardBody}>
                            <Text style={styles.loginText}>
                                Reset Password
                            </Text>
                            <Item rounded style={styles.itemContainer}>
                                <Input 
                                    placeholder='Email' 
                                    placeholderTextColor={textError ? 'red' : 'grey'}
                                    autoCorrect={false} 
                                    keyboardType='email-address'
                                    style={ email.length == 0 ? textError ? {...styles.itemText, borderColor: 'red' } : styles.itemText : styles.itemText }
                                    value={email}
                                    onChangeText={(text) => setEmail(text)}
                                />
                            </Item>
                            <Animated.View style={{ opacity: fadeAnim }}>
                                <Button onPress={onSubmit} rounded success style={styles.buttonContainer}>
                                    <Text  style={styles.buttonText}>Reset</Text>
                                </Button>
                            </Animated.View>
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
        height: hp(35),
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
   }
});

export default ForgetPasswordScreen;