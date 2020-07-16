// This screen file is used to display following user. this a following screen

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';

import * as FollowActions from '../store/actions/FollowActions'; // import all the function from FollowActions file

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

//  All above are same please check other files like draftn Screen.js

const FollowingScreen = () => {
    // // useSelector is a hook from react-redux. used to select global state (followings) from the FollowReducer and used in the screen
    const following = useSelector(state => state.FollowReducer.followings); 

    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const [error, setError] = useState(); // If any error occurs in calling api for example in availability of internet.
    // then error is true other wise empty or false.

    const [isRefreshing, setIsRefreshing] = useState(false);
    // It is used for refreshing app by dragging down the screen

    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    // async await is used with useCallback hook and try catch. please search on the internet.
    const userFollowing = useCallback(async () => {
        setError(null); // this line make  error null on line 23
        setIsRefreshing(true); // this line make  isRefreshing true on line 26 used for pull to refresh. flatlist and scroll view
        try {
            await dispatch(FollowActions.getFollowings());
            // this line is calling function from FollowActions file. imported from FollowActions file on line 7. getFollowings is the name of functions
        } catch (err) {
            setError(true); // this line make error true on line 32 and appears error part on the screen below on line 61
        }
        setIsRefreshing(false); // this line make  isRefreshing false on line 26.used for pull to refresh. flatlist and scroll view
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {   // useEffect hook is used to automatically render the component when the screen is open.
        setIsFetching(true); // when data is fetching from server the setIsFetching make is fetching true. 
        //you can see above on line 28
        userFollowing().then(() => {  // userFollowing is a function. see above on line 32, this is used for dispatching actions and calling api
            setIsFetching(false); // when data fetching from server is complete the setIsFetching make is fetching false. 
            //you can see above on line 19
        });
    }, []); // empty arrays not runs the ueeffect hook again and again. use effect hooks runs only once

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
                    onPress={userFollowing} // => when button  press then userFollowing function calls on line 32
                    color='#020F59'
                />
            </View>
        );
    }

    // unFollowUser is used to unfoollow he user. it dispatch the action and send id of the user whom unfollow
    const unFollowUser = async (id) => {  
        try {
            await dispatch(FollowActions.unFollowUser(id));  // dispatch the action from then FollowActions.js file imported above see line 7
        } catch (error) {
            Alert.alert(error.message); // on error occurs it display the error message
        }
    }

    return (
        <View style={styles.container}>
            {/* following.length === 0 ? , follower from line 17 is array. if arrray is empty then if part display otherwise else part*/}
            { following.length === 0 ?
                // Card, CardItem, Body import from native base ui library
                <Card style={styles.cardContainer}>
                    <CardItem>
                        <Body style={styles.alignItems}>
                            <Text style={styles.fontFamily}>
                                {/* if Following is empty then No Followings Found ! text appears in card  */}
                                No Followings Found !
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            :
                // this is else part if following is not empty, following.length != 0 this flatlist data display
                <FlatList
                    onRefresh={userFollowing} // this is for pull to refresh calling userFollowing function see above on line 32
                    refreshing={isRefreshing} // if is Refreshing true then pull to refresh appears otherwise not
                    data={following} // following from line 17, global state from follow reducer 
                    keyExtractor={item => (item.user_id).toString()}  // user id is a number so toString() converts anything in to string
                    showsVerticalScrollIndicator={false}  // it disappers the scroll indicator
                    renderItem={({ item }) => { // it is for render the data
                        return (
                            // Card, CardItem, Body import from native base ui library
                            <Card style={styles.secondViewCard}>
                                <CardItem>
                                    <Body>
                                        <View style={styles.innerView}>
                                            {/* gravatr image showing line 115 */}
                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImgFront} /> 
                                            <View style={styles.innerViewContainer}>
                                                <View style={styles.innerViewSecond}>
                                                    <Text style={styles.innerViewText}>
                                                        {/* following user name  */}
                                                        {  item.given_name }
                                                    </Text>
                                                    <Text style={styles.innerViewTag}>
                                                        {/* following user email to display only from 7 characters  */}
                                                        { item.email.substring(0, 7) }
                                                    </Text>
                                                </View>
                                                {/* onPress calls unFollowUser(item.user_id) 
                                                // functions and sending the id as argument see above line 76. it is for to unfollow user. */}
                                                <TouchableOpacity onPress={() => unFollowUser(item.user_id)} style={styles.followContainer}>
                                                        <Text style={styles.followText}>
                                                            un follow
                                                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>
                        );
                    }} />
            }
            
        </View>
    );
}

//The below is all css and styling of screen
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
    secondViewCard: { 
        marginTop: hp(1), 
        width: wp(97), 
        elevation: 5,
        alignSelf: 'center'
    },
    innerView: { 
        flexDirection: 'row',
        width: wp(85), 
        marginLeft: height > 800 ?  wp(0) :  wp(-3) 
    },
    innerViewText: { 
        fontSize: hp(2.6), 
        fontFamily: medium 
    },
    userImgFront: {
        width: 54,
        height: 54,
        borderRadius: 30,
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
    },
    innerViewSecond: { 
        marginLeft: wp(3), 
        marginTop: hp(.1) 
    },
    innerViewTag: { 
        fontFamily: book, 
        marginTop: hp(.7), 
        fontSize: height > 800 ?  hp(2.1) : hp(2.5), 
        marginTop: height > 800 ?  hp(.4) : hp(.6) 
    },
    innerViewContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width:  height > 800 ?  wp(82) : wp(77)
    },
    followContainer: { 
        backgroundColor: '#00acee',
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 12,
        height: 35,
        borderRadius: 5,
        marginTop: hp(-.2),
    },
    followText: { 
        color: 'white', 
        fontSize: hp(2.5), 
        fontFamily: medium 
    },
    paragraph: { 
        fontSize: hp(2.2), 
        marginTop: hp(1) 
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default FollowingScreen;