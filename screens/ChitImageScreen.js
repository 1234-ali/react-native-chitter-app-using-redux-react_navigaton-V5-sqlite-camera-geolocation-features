import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, StatusBar, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import * as ChitActions from '../store/actions/ChitActions';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';

const ChitImageScreen = ({ navigation, route }) => {
    const chitImg = useSelector(state => state.ChitReducer.chitImg);

    const { chitId } = route.params;

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const dispatch = useDispatch();

    const userChits = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(ChitActions.ChitImage(chitId));
        } catch (err) {
            setError(true);
        }
        setIsRefreshing(false);
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {
        setIsFetching(true);
        userChits().then(() => {
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
                <Button 
                    title='Try again' 
                    onPress={userChits}
                    color='#020F59'
                />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.scroll}
            showsVerticalScrollIndicator={false} 
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={userChits} />
            }
        >
            <View style={styles.modalView}>
                <StatusBar barStyle="dark-content" backgroundColor="white" /> 
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.brushContainer}>
                    <Ionicons name='ios-close' style={styles.brushText} />
                </TouchableOpacity>
                { chitImg != null  ?
                    <Image source={{ uri: `data:${chitImg.type};base64,${chitImg.data}` }} style={styles.modalbigImage} />
                :
                    <Text style={styles.text}>No Image Attach</Text>
                }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1, 
        backgroundColor: 'white' 
    },
    modalView: { 
        flex: 1, 
        alignItems: 'center', 
        backgroundColor: 'white' 
    },
    brushContainer: { 
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: height > 800 ?  30 : 120, 
        alignItems: 'center',
        width: height > 800 ?  60 : wp('12%'),
        height: height > 800 ?  60 : hp('6%'), 
        justifyContent: 'center',
        backgroundColor: '#00acee', 
        marginTop: hp(12), 
        marginBottom: hp(10) 
    },
    modalbigImage: {
        width: wp(90),
        height: hp(50),
        borderRadius: 30,
        borderColor: '#D9D9D9',
        borderWidth: 1,
    },
    brushText: { 
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: 25, 
        padding: 9, 
        paddingHorizontal: 10, 
        alignSelf:'center',
        color: 'white', 
        fontSize: hp(6)  
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: { 
        fontSize: hp(3), 
        fontFamily: medium, 
        color: 'green' 
    }
});

export default ChitImageScreen;
