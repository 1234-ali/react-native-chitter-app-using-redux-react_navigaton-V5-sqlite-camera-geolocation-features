import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, Image, TouchableWithoutFeedback, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Icon, Header, Left, Title, Tab, Tabs, TabHeading, Right, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as DraftActions from '../store/actions/DraftActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const DraftScreen = () => {
    const drafts = useSelector(state => state.DraftReducer.draft);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const dispatch = useDispatch();

    const userDrafts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(DraftActions.loadDraft());
        } catch (err) {
            setError(true);
        }
        setIsRefreshing(false);
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {
        setIsFetching(true);
        userDrafts().then(() => {
            setIsFetching(false);
        });
    }, []);

    if (isFetching) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color='#027373' />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <TouchableOpacity onPress={userDrafts} style={{ backgroundColor: '#020F59', marginTop: hp(1), borderRadius: 5 }}>
                    <Text style={{ color: 'white', padding: 10 }}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
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
                    <Title style={styles.header}>Drafts</Title>
                </View>
                <Entypo name='water' style={styles.waterIcon} />
            </Header>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: 120, 
        alignItems: 'center' 
    },
    waterIcon: { 
        width: wp(8),
        fontSize: hp(3.1), 
        color: 'blue', 
        marginTop: hp(.5) 
    },
    brushText: { 
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: 25, 
        padding: 9, 
        paddingHorizontal: 10, 
        alignSelf:'center'  
    },
    backIcon: { 
        marginLeft: 8, 
        color: '#024873', 
        fontSize: 30  
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default DraftScreen;