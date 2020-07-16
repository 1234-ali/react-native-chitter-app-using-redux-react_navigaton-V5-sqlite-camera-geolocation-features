// This screen file is used  a home screen. when user login then this screen appears.

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, StatusBar, Dimensions, ScrollView, RefreshControl, TouchableOpacityBase } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button,  Header, Title, Card, CardItem, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import * as ChitActions from '../store/actions/ChitActions';  // import all the function from ChitActions file
import * as FollowActions from '../store/actions/FollowActions'; // import all the function from FollowActions file

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

//  All above are same please check other files like draftn Screen.js

const HomeScreen = ({ navigation }) => {
    const chits = useSelector(state => state.ChitReducer.chits); // useSelector is a hook from react-redux. used to select global state (chits) from the ChitReducer and used in the screen
    const userImg = useSelector(state => state.UserReducer.userImg); // useSelector is a hook from react-redux. used to select global state (userImg) from the UserReducer and used in the screen
    
    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const [error, setError] = useState(); // If any error occurs in calling api for example in availability of internet.
    // then error is true other wise empty or false.

    const [isRefreshing, setIsRefreshing] = useState(false);
    // It is used for refreshing app by dragging down the screen

    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    // async await is used with useCallback hook and try catch. please search on the internet.
    const userChits = useCallback(async () => {
        setError(null); // this line make  error null on line 29
        setIsRefreshing(true); // this line make  isRefreshing true on line 32 used for pull to refresh. flatlist and scroll view
        try {
            await dispatch(ChitActions.getChits());  // used to get all the chits from server. dispatching actions from ChitActions file.
            await dispatch(FollowActions.getFollowers()); // used to get login user followers. dispatching actions from FollowActions file.
            await dispatch(FollowActions.getFollowings()); // used to ger login user following. dispatching actions from FollowActions file.
        } catch (err) {
            setError(true); // this line make error true on line 32 and appears error part on the screen below on line 61
        }
        setIsRefreshing(false); // this line make  isRefreshing false on line 26.used for pull to refresh. flatlist and scroll view
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {   // useEffect hook is used to automatically render the component when the screen is open.
        setIsFetching(true); // when data is fetching from server the setIsFetching make is fetching true. 
        //you can see above on line 28
        userChits().then(() => {  // userFollowing is a function. see above on line 38, this is used for dispatching actions and calling api
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
                    onPress={userChits} // => when button  press then userChits function calls on line 38
                    color='#020F59'
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header is from native base to display header */}
            <Header style={styles.headerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" /> 
                <View>
                    {/* if there is no image then display gravater image other wise dispay user image in if part */}
                    { userImg != ''  ?

                        // display user image, this is if part
                        <Image source={{ uri: `data:${userImg.type};base64,${userImg.data}` }} style={styles.imgFront} />
                    :
                        // display gravater image if not
                        <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.imgFront} />
                    }
                </View> 
                <View>
                    {/* Title from natie base */}
                    <Title style={styles.header}>Home</Title>
                </View>
                {/* onPress={() => navigation.navigate('post')} => below navigate to post screen, to post chits  */}
                <TouchableOpacity onPress={() => navigation.navigate('post')} style={styles.brushContainer}>
                    {/* Ionicons from vector icons to display icons */}
                    <Ionicons name='ios-brush' style={styles.brushText} />
                </TouchableOpacity>
            </Header>
            <View style={{ marginTop: hp(1), flex: 1 }}>
                {/* chits.length === 0 ? , chits from line 22 is array. if arrray is empty then if part display otherwise else part*/}
                { chits.length === 0 ?
                        <ScrollView  // it is used to scroll the screen
                            style={styles.scroll}
                            showsVerticalScrollIndicator={false} // false disappear the scroll view line
                            refreshControl={ // resfresh control is from react native used with ScrollView. used for pull to refereh
                                <RefreshControl refreshing={isRefreshing} onRefresh={userChits} /> // onRefresh it calls userChits functions on line 38 above
                            }
                        >
                            {/* Card, CardItem, Body import from native base ui library */}
                            <Card style={styles.noCardContainer}>
                                <CardItem>
                                    <Body style={styles.alignItems}>
                                        <Text style={styles.fontFamily}>
                                            {/*  if there is no chits, chits.length === 0 this line appears  */}
                                            No Chits found!
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        </ScrollView>
                    :
                        // this is else part if chits is not empty, chits.length != 0 => this flatlist data display
                        <FlatList 
                            onRefresh={userChits} // this is for pull to refresh calling userChits function see above on line 38
                            refreshing={isRefreshing} // if is Refreshing true then pull to refresh appears otherwise not
                            data={chits} // chits from line 22, global state from chits reducer 
                            keyExtractor={item => (item.chit_id).toString()} // chit_id is a number so toString() converts anything in to string
                            showsVerticalScrollIndicator={false} // it disappers the scroll indicator
                            renderItem={({ item }) => { // it is for render the data
                                return (
                                    <>
                                        {/* onPress={() => navigation.navigate('privateUser', { userId: item.user.user_id })} below
                                         navigate to privateUser screen to display click user profile and send user id in params to privateUser screen
                                         */}
                                        <TouchableOpacity  
                                            activeOpacity={0.7} 
                                            onPress={() => navigation.navigate('privateUser', { userId: item.user.user_id })}
                                        >
                                            {/* Card, CardItem, Body import from native base ui library */}
                                            <Card>
                                                <CardItem>
                                                    <Body>
                                                        <View style={styles.cardViewContainer}>
                                                            {/* simply display gravatar image */}
                                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImg} />
                                                            <View style={styles.textSubContainer}>
                                                                <View style={styles.textViewContainer}>
                                                                    <Text style={styles.userText}>
                                                                        {/* chits user name  */}
                                                                        {item.user.given_name}
                                                                    </Text>
                                                                    <Text style={styles.hashTagText}>
                                                                        {/* chits user email from 0-5 characters  */}
                                                                        { item.user.email.substring(0, 5) }
                                                                    </Text>
                                                                </View>
                                                                <Text style={styles.timeText}>
                                                                    {/* to display time stamp from now in how many minutes the chits is post for eg 4 min ago */}
                                                                    { moment(item.timestamp).fromNow() }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.chitContent}>
                                                                {/* chit content , chit message user write to post */}
                                                                {item.chit_content}
                                                            </Text>
                                                        </View>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        </TouchableOpacity>
                                        {/* it navigate to chitImage screen and sen chot it to display chit image */}
                                        <TouchableOpacity onPress={() => navigation.navigate('chitImage', { chitId : item.chit_id })} style={styles.chitImageIcon}>
                                            {/*  Ionicons from vector icons, it display on home screen on every chit rrow-dropdown-circle  */}
                                            <Ionicons name='ios-arrow-dropdown-circle' size={hp(3.5)} />
                                        </TouchableOpacity>
                                    </>
                                )
                            }}
                    />
                }
            </View>
        </View>
    );
}

//The below is all css and styling of screen
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
        color: 'rgba(0 , 0 , 0, .7)', 
        fontFamily: medium, 
        fontSize:hp(4)
    },
    imgFront: {
        width: height > 800 ?  45 : wp('12%'),
        height: height > 800 ?  45  : hp('6%'),
        borderRadius: height > 800 ?  22.5 : wp('30%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
    },
    brushContainer: { 
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: 22.5, 
        alignItems: 'center',
        width: height > 800 ?  45 : wp('12%'),
        height: height > 800 ?  45 : hp('6%'), 
        justifyContent: 'center' 
    },
    brushText: { 
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: 25,
        alignSelf:'center'  
    },
    backIcon: { 
        marginLeft: 8, 
        color: '#024873', 
        fontSize: 30  
    },
    userImg: {
        width: height > 800 ?  65 : wp('15%'),
        height: height > 800 ?  65 : hp('7.5%'),
        borderRadius: height > 800 ?  32.5 : wp('32%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
    },
    textSubContainer: { 
        flexDirection: 'row', 
        width: height > 800 ? wp('85%') : wp('80%'),  
        justifyContent: 'space-between' 
    },
    cardViewContainer: { 
        flexDirection: 'row', 
        marginLeft: wp(-2) 
    },
    textViewContainer: { 
        marginLeft: wp(2), 
    },
    userText: { 
        fontSize: hp(2.5), 
        fontFamily: medium 
    },
    hashTagText: { 
        fontFamily: book, 
        marginTop: hp(.5), 
        fontSize: height > 800 ? hp(2) : hp(2.2) 
    },
    timeText: { 
        fontSize: hp(2), 
        fontFamily: medium, 
    },
    chitContent: { 
        marginLeft: wp(.5), 
        marginTop: hp(.5) 
    },
    modalView: { 
        flex: 1, 
        alignItems: 'center', 
        backgroundColor: 'white' 
    },
    modalContainer: { 
        margin: 0 
    },
    bigImageContainer: {
        width: 200,
        height: 120,
        marginLeft: wp(35),
        marginTop: hp(1.5),
        marginRight: wp(3),
        overflow: 'hidden'
    },
    bigImage: { 
        borderRadius: 30, 
        borderColor: '#D9D9D9',
        borderWidth: 1, 
        width: null, 
        height: null, 
        flex: 1 
    },
    modalbigImage: {
        width: wp(90),
        height: hp(50),
        borderRadius: 30,
        borderColor: '#D9D9D9',
        borderWidth: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noCardContainer: { 
        marginTop: hp(1.5), 
        width: wp('97%'), 
        alignSelf: 'center', 
        elevation: 5 
    },
    alignItems: {  
        alignItems: 'center' 
    },
    fontFamily: { 
        fontFamily: medium 
    },
    chitImageIcon: { 
        alignSelf: 'center', 
        zIndex: 1, 
        marginTop: hp(-2.5) 
    }
});

export default HomeScreen;