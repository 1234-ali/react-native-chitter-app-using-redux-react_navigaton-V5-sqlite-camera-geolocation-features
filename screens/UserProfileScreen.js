import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, TouchableWithoutFeedback, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Icon, Header, Left, Title, Tab, Tabs, TabHeading, Right, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

import FollowerScreen from './FollowerScreen';
import ChitterScreen from './ChitterScreen';
import FollowingScreen from './FollowingScreen';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const UserProfileScreen = ({ navigation }) => {
    const user = useSelector(state => state.UserReducer.user);
    const follower = useSelector(state => state.FollowReducer.followers);
    const following = useSelector(state => state.FollowReducer.followings);

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
                    <Title style={styles.header}>User Profile</Title>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('post')} style={styles.brushContainer}>
                    <Ionicons name='ios-brush' style={styles.brushText} />
                </TouchableOpacity>
            </Header>
            <View style={styles.secondContainer}>
                <View style={styles.imgContainer}>
                    <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.img} />
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
            <Tabs tabBarUnderlineStyle={{ backgroundColor: 'silver' }} >
                <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Followers</Text></TabHeading>}>
                    <FollowerScreen />
                </Tab>
                {/* <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Chitters</Text></TabHeading>}>
                    <ChitterScreen />
                </Tab> */}
                <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Following</Text></TabHeading>}>
                    <FollowingScreen />
                </Tab>
            </Tabs>
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
    secondContainer: { 
        backgroundColor: 'rgba(1 , 1 , 1 , .6)', 
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
    tabTextColor: {
        color:'rgba(0 , 0 , 0, .8)',
        fontFamily: medium,
        fontSize: hp(2.3)
    },
    marginTop: { 
        marginTop: hp(2) 
    }
})

export default UserProfileScreen;