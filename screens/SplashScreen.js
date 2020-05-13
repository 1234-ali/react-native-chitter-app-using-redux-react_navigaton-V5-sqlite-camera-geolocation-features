import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Dimensions, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

const { height } = Dimensions.get('window');

const SplashScreen = () => {
    const [error, setError] = useState();

    const dispatch =  useDispatch();

    const screenNavigation = async () => {
        setError(null);
        try {
            await dispatch(UserActions.loadUser());
            await dispatch(UserActions.loadImage());
        } catch (error) {
            setError(true);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            screenNavigation();
        }, 500);
    }, []);

    if (error) {
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
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <Image source={require('../assets/images/logo5.jpg')} style={styles.logo} />
        </View>
    );
};

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