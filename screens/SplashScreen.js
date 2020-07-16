import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Dimensions, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

const { height } = Dimensions.get('window');

//  All above are same please check other files like draft Screen.js

const SplashScreen = () => {
    const [error, setError] = useState(); // to display error if error occurs on api call
 
    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    // this function used to check if user is login or not, if not login then move to ligin screen else move to home screen 
    // all the auth flow process is in navigation folder/ chitter navigation.js file
    const screenNavigation = async () => {
        setError(null);
        try {
            await dispatch(UserActions.loadUser()); // used to get the user from server. dispatching actions from UserActions file.
            await dispatch(UserActions.loadImage()); // used to get the user image from server. dispatching actions from UserActions file
        } catch (error) {
            setError(true); // if true error display below line 34
        }
    };

    useEffect(() => {  // when screen open, it automatically call the screenNavigation function on line 18 and fetching data from server
        setTimeout(() => { // setTimeout is used to call screenNavigation function after 500 seconds wait
            screenNavigation();
        }, 500);
    }, []);

    if (error) { //It is used to display error
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button 
                    title='Try again' 
                    onPress={screenNavigation}
                    color='#020F59'
                />
            </View>
        );
    };
    
    return (
        <View style={styles.container}>
            {/*  to display staus bar */}
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            {/* to display logo image of chitter app */}
            <Image source={require('../assets/images/logo5.jpg')} style={styles.logo} />
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
    logo: {
        marginTop: hp('30%'),
        width: height > 800 ? hp(30) : 200,
        height: height > 800 ? hp(30) : 200,
        resizeMode: 'contain'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default SplashScreen;