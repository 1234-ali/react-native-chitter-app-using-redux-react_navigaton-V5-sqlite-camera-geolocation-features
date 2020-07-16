// This screen is used to display user by user Id. user id is coing from home screen by clicking on chit this screen appear.
// This screen styling and code is same as userProfilescreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Image, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, Icon, Tab, Tabs, TabHeading } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';
import * as FollowActions from '../store/actions/FollowActions';

import PrivateFollowerScreen from './PrivateFollowerScreen';
import PrivateFollowingScreen from './PrivateFollowingScreen';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const PrivateUserScreen = ({ navigation, route }) => {
    const user = useSelector(state => state.UserReducer.allUsers);
    const follower = useSelector(state => state.FollowReducer.privatefollower);
    const following = useSelector(state => state.FollowReducer.privatefollowings);
    const userImg = useSelector(state => state.UserReducer.allImg);

    // all above state are global state coming from reducers 

    // this is the userId coming from homescreen.js by route.params
    const { userId } = route.params; 

    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const [error, setError] = useState(); // If any error occurs in calling api for example in availability of internet.
    // then error is true other wise empty or false.

    const [isRefreshing, setIsRefreshing] = useState(false);
    // It is used for refreshing app by dragging down the screen

    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    // async await is used with useCallback hook and try catch. please search on the internet.
    const userData = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            // below all actions are dispatching from action folder file. all the private user dat display by their id.
            // passing id in function as argument
            await dispatch(UserActions.getUserById(userId));
            await dispatch(UserActions.getImageById(userId));
            await dispatch(FollowActions.getFollowersById(userId));
            await dispatch(FollowActions.getFollowingsById(userId));
        } catch (err) {
            setError(true); // this line make  error true on line 28 if error true then line 65 code appears on screen
        }
        setIsRefreshing(false); // this line make  isRefreshing false on line 31. used for pull to refresh. flatlist and scroll view
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {   // useEffect hook is used to automatically render the component when the screen is open.
        setIsFetching(true); // when data is fetching from server the setIsFetching make is fetching true. 
        //you can see above on line 24
        userData().then(() => {  // userData is a function. see above on line 36, this is used for dispatching actions and calling api
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
                    onPress={userData} // => when button  press then userData function calls on line 36
                    color='#020F59'
                />
            </View>
        );
    }

    return (
        <ScrollView 
            style={{ flex: 1, backgroundColor: 'white' }}
            showsVerticalScrollIndicator={false} 
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={userData} />
            }
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="rgba(1 , 1 , 1 , .6)" /> 
                <View>
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}> 
                        <Icon name='arrow-back' style={{ ...styles.backIcon }} />
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.secondContainer}>
                    <View style={styles.imgContainer}>
                        { userImg != ''  ?
                            <Image source={{ uri: `data:${userImg.type};base64,${userImg.data}` }} style={styles.img} />
                        :
                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.img} />
                        }
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>
                            { user != null && user.given_name } { user != null && user.family_name }
                        </Text>
                    </View>
                    <View style={styles.marginTop}>
                        <View style={styles.followerContainer}>
                            <Text style={{ ...styles.followerText, marginRight: 6 }}>
                                { follower.length }
                            </Text>
                            <Text style={styles.followerText}>
                                Followers
                            </Text>
                        </View>
                        <View style={{...styles.followerContainer, marginTop: hp(1), marginBottom: hp(3.5)}}>
                            <Text style={{ ...styles.followerText, marginRight: 6 }}>
                                { following.length }
                            </Text>
                            <Text style={styles.followerText}>
                                Following
                            </Text>
                        </View>
                    </View>
                </View>
                <Tabs tabBarUnderlineStyle={styles.tabColor} >
                    <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Followers</Text></TabHeading>}>
                        <PrivateFollowerScreen />
                    </Tab>
                    <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Following</Text></TabHeading>}>
                        <PrivateFollowingScreen />
                    </Tab>
                </Tabs>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(1 , 1 , 1 , .6)'
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
    brushText: { 
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: 25, 
        padding: 9, 
        paddingHorizontal: 10, 
        alignSelf:'center'  
    },
    backIcon: { 
        color: 'white', 
        fontSize: hp(5),
        marginLeft: 15  
    },
    secondContainer: { 
        alignItems: 'center' 
    },
    imgContainer: { 
        width: 250,
        height: 250,
        borderRadius: 40, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'white',
        marginTop: hp(3) 
    },
    img: { 
        width: null, 
        flex: 1, 
        height: null 
    },
    textContainer: { 
        marginTop: hp(2.5)
    },
    text: { 
        fontSize: hp(3), 
        fontFamily: medium,
        color: 'white' 
    },
    followerContainer: {
        flexDirection: 'row'
    },
    followerText: {
        fontSize: hp(2.2), 
        fontFamily: medium, 
        color: 'white' 
    },
    tab: {
        backgroundColor: 'white'
    },
    tabColor: { 
        backgroundColor: 'silver' 
    },
    tabTextColor: {
        color:'rgba(0 , 0 , 0, .8)',
        fontFamily: medium,
        fontSize: hp(2.3)
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    marginTop: { 
        marginTop: hp(2) 
    }
})

export default PrivateUserScreen;