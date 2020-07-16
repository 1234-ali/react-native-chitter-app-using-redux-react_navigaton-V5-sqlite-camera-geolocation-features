// This screen file is used to display image, attach with chit.

import React, { useState, useEffect, useCallback } from 'react';  //hooks import from react
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, StatusBar, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // package used to make screen responsive
import { Button } from 'native-base'; // native-base is used a ui library. buuton is used from native base on this screen
import Ionicons from 'react-native-vector-icons/Ionicons'; // This package is used for displaying icons
import { useSelector, useDispatch } from 'react-redux'; // this is used to dispatching actions and selecting global states

import * as ChitActions from '../store/actions/ChitActions';  // this line is to import all the functions from chitAction.js in this file

const { height } = Dimensions.get('window'); // dimensions is used to find width and height of the device screen

const medium = 'AirbnbCerealMedium'; // this is a custom font 

const ChitImageScreen = ({ navigation, route }) => {
    const chitImg = useSelector(state => state.ChitReducer.chitImg); // useSelector is a hook from react-redux. used to select global state from the reducer and used in the screen

    const { chitId } = route.params; 
    // route.params is from react-navigation.if we send data from one screen to another then on recieving data screen.
    //we used route.params to recive data.
    // chitId  is the id the id of the chit. when we click on any chit black arrow button then this screen is open where image is shown

    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const [error, setError] = useState(); // If any error occurs in calling api for example in availability of internet.
    // then error is true other wise empty or false.

    const [isRefreshing, setIsRefreshing] = useState(false);
    // It is used for refreshing app by dragging down the screen

    const dispatch = useDispatch();  // it is used to dispatch the action from every screens. call the functions from action folders.

    // async await is used with useCallback hook and try catch. please search on the internet.
    const userChits = useCallback(async () => {
        setError(null); // this line make  error null on line 28
        setIsRefreshing(true); // this line make  isRefreshing true on line 31.used for pull to refresh. flatlist and scroll view
        try {
            await dispatch(ChitActions.ChitImage(chitId)); 
            // this line is calling function from chit action file. imported from chit action file on line 10. 
            //and sending chitId bcz to display image of only that chit from the server
        } catch (err) {
            setError(true); // this line make  error true on line 28 if error true then line 65 code appears on screen
        }
        setIsRefreshing(false); // this line make  isRefreshing false on line 31. used for pull to refresh. flatlist and scroll view
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {   // useEffect hook is used to automatically render the component when the screen is open.
        setIsFetching(true); // when data is fetching from server the setIsFetching make is fetching true. 
        //you can see above on line 24
        userChits().then(() => {  // userChits is a function. see above on line 36, this is used for dispatching actions and calling api
            setIsFetching(false); // when data fetching from server is complete the setIsFetching make is fetching false. 
            //you can see above on line 24
        });
    }, []);

    if (isFetching) { // when is fetching is true then this calls and activity indicator appears, when it false then this not appears
        return ( //you can check all the styles below
            <View style={styles.centered}>
                <ActivityIndicator size='large' color='#027373' />
            </View>
        );
    }

    if (error) { // when error is true then this calls and appears on screen, when it false then this not appears
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text> 
                <Button 
                    title='Try again' 
                    onPress={userChits} // => when button  press then userChits function calls on line 36
                    color='#020F59'
                />
            </View>
        );
    }

    return (
        <ScrollView  // it is used to scroll the screen
            style={styles.scroll}
            showsVerticalScrollIndicator={false} // false disappear the scroll view line
            refreshControl={ // resfresh control is from react native used with ScrollView. used for pull to refereh
                <RefreshControl refreshing={isRefreshing} onRefresh={userChits} /> // onRefresh it calls userChits functions on line 36 above
            }
        >
            <View style={styles.modalView}>
                {/* used to display statusbar */}
                <StatusBar barStyle="dark-content" backgroundColor="white" />  
                {/* TouchableOpacity is used to mke touchable button with opacity effect. onPrees event go back to previouse screen */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.brushContainer}>
                    {/* Ionicons import from react native icons to display icon */}
                    <Ionicons name='ios-close' style={styles.brushText} />
                </TouchableOpacity>
                { chitImg != null  ?  // This is a conditional rendering statement. when there is chit image then this calls line 95 else line 97 appears on screen 
                    <Image source={{ uri: `data:${chitImg.type};base64,${chitImg.data}` }} style={styles.modalbigImage} />  // display chit image of base64
                :
                    <Text style={styles.text}>No Image Attach</Text> // to show if there is no image
                }
            </View>
        </ScrollView>
    );
};

//The below is all css and styling of screen

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
