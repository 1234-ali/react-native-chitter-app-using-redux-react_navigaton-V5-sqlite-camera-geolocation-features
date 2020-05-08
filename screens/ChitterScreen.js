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

const ChitterScreen = () => {
    return (
        <View style={styles.container}>
            <Card style={styles.cardContainer}>
                <CardItem>
                    <Body style={styles.alignItems}>
                        <Text style={styles.fontFamily}>
                            Post New Chitters !
                        </Text>
                    </Body>
                </CardItem>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardContainer: {
        marginTop: hp(3), 
        width: wp('80%'), 
        alignSelf: 'center', 
        elevation: 5 
    },
    alignItems: {  
        alignItems: 'center' 
    },
    fontFamily: { 
        fontFamily: medium,
        color: 'rgba(1 , 1 , 1 , .45)'  
    },
})

export default ChitterScreen;