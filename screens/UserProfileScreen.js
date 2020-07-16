// Thee screen display data of login user.
// The working is it get all the data from global states by using useSelector hook below 
// and display the data in to this screen
import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, TouchableOpacity, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Header, Title, Tab, Tabs, TabHeading } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import FollowerScreen from './FollowerScreen';
import FollowingScreen from './FollowingScreen';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const UserProfileScreen = ({ navigation }) => {
    const user = useSelector(state => state.UserReducer.user);
    const follower = useSelector(state => state.FollowReducer.followers);
    const following = useSelector(state => state.FollowReducer.followings);
    const userImg = useSelector(state => state.UserReducer.userImg);

    return (
        <View style={styles.container}>
            <Header style={styles.headerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" /> 
                <View>
                    {/* go back to previouse screen */}
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}> 
                        <Icon name='arrow-back' style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View> 
                <View>
                    <Title style={styles.header}>User Profile</Title>
                </View>

                {/* navigate to user to update user profile data like login user email, password, name etc */}
                <TouchableOpacity onPress={() => navigation.navigate('user')} style={styles.brushContainer}>
                    <Ionicons name='ios-settings' style={styles.brushText} />
                </TouchableOpacity>
            </Header>
            <View style={styles.secondContainer}>
                <View style={styles.imgContainer}>
                    { userImg != ''  ? // to user image if=g userImg globalstate is not empty if empty thwen display gravatar
                            <Image source={{ uri: `data:${userImg.type};base64,${userImg.data}` }} style={styles.img} />
                        :
                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.img} />
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {/* display user given name and family name */}
                        { user != null && user.given_name } { user != null && user.family_name }
                    </Text>
                </View>
                <View style={styles.marginTop}>
                    <View style={styles.followerContainer}>
                        <Text style={{ ...styles.followerText, marginRight: 6 }}>
                            {/* follower global state length write here  on line 19 */}
                            { follower.length }
                        </Text>
                        <Text style={styles.followerText}>
                            Followers
                        </Text>
                    </View>
                    <View style={{...styles.followerContainer, marginTop: hp(1), marginBottom: hp(3.5)}}>
                        <Text style={{ ...styles.followerText, marginRight: 6 }}>
                            {/* following global state length write here  on line 20 */}
                            { following.length }
                        </Text>
                        <Text style={styles.followerText}>
                            Following
                        </Text>
                    </View>
                </View>
            </View>
            {/* tabs are used from native base lie folowers and following */}

            {/* tabBarUnderlineStyle={{ backgroundColor: 'silver' }} => it gives the tab underlined color */}
            <Tabs tabBarUnderlineStyle={{ backgroundColor: 'silver' }} >
                <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Followers</Text></TabHeading>}>
                    {/*  follower screen.js use here, import above on line 11. it is a child of userprofilescreen.js */}
                    <FollowerScreen /> 
                </Tab>
                <Tab heading={ <TabHeading style={styles.tab}><Text style={styles.tabTextColor}>Following</Text></TabHeading>}>
                    {/*  FollowingScreen.js use here import above on line 12. it is a child of userprofilescreen.js */}
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
        alignItems: 'center' 
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