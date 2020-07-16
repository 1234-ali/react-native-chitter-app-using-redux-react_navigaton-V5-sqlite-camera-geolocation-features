// This screen file is used to display followers. this a follower display screen

import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // package used to make screen responsive
import { Card, CardItem, Body } from 'native-base'; // native-base is used a ui library. buuton is used from native base on this screen
import { useSelector } from 'react-redux'; // this is used to dispatching actions and selecting global states

const { height } = Dimensions.get('window'); // dimensions is used to find width and height of the device screen

const medium = 'AirbnbCerealMedium'; // this is a custom font 
const book = 'AirbnbCerealBook'; // this is a custom font 

const FollowerScreen = () => {
    const follower = useSelector(state => state.FollowReducer.followers); // useSelector is a hook from react-redux. used to select global state (followers) from the FollowReducer and used in the screen

    return (
        <View style={styles.container}>
            {/* follower.length === 0 ? , follower from line 13 is array. if arrray is empty then if part display otherwise else part*/}
            { follower.length === 0 ?
                // Card, CardItem, Body import from native base ui library
                <Card style={styles.cardContainer}>
                    <CardItem>
                        <Body style={styles.alignItems}>
                            <Text style={styles.fontFamily}>
                                {/* if follower is empty then No Followers Found ! text appears in card  */}
                                No Followers Found !
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            :
                // this is else part if follower is not empty, follower.length != 0 this flatlist data display
                <FlatList 
                    data={follower} // follower from line 13, global state from follow reducer 
                    keyExtractor={item => (item.user_id).toString()} // user id is a number so toString() converts anything in to string
                    showsVerticalScrollIndicator={false} // it disappers the scroll indicator
                    renderItem={({ item }) => { // render the data 
                        return (
                            // Card, CardItem, Body import from native base ui library
                            <Card style={styles.secondViewCard}>
                                <CardItem>
                                    <Body>
                                        <View style={styles.innerView}>
                                            {/* this is a gravatar image */}
                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImgFront} />
                                            <View style={styles.innerViewSecond}>
                                                <Text style={styles.innerViewText}>
                                                    {/* follower name  */}
                                                    {  item.given_name }
                                                </Text>
                                                <Text style={styles.innerViewTag}>
                                                    {/* follower email to display only from 7 characters  */}
                                                    { item.email.substring(0, 7) }
                                                </Text>
                                            </View>
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card>
                        );
                    }} 
                />
            }
        </View>
    );
}

//The below is all css and styling of screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    cardContainer: {
        marginTop: hp(3), 
        width: wp('80%'), 
        alignSelf: 'center', 
        elevation: 5,
        backgroundColor: 'white'
    },
    alignItems: {  
        alignItems: 'center' 
    },
    fontFamily: { 
        fontFamily: medium,
        color: 'rgba(1 , 1 , 1 , .45)' 
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
        marginLeft: wp(2)
    },
    innerView: { 
        flexDirection: 'row',
        width: wp(85), 
        marginLeft:  height > 800 ?  wp(0) : wp(-5) 
    },
    innerViewSecond: { 
        marginLeft: wp(3), 
        marginTop: hp(.1) 
    },
    innerViewTag: { 
        fontFamily: book, 
        fontSize:  height > 800 ?  hp(2) : hp(2.5), 
        marginTop: hp(.6) 
    },
    followContainer: { 
        backgroundColor: '#00acee',
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 12,
        height: 35,
        borderRadius: 5,
        marginLeft: wp(10),
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
    secondViewCard: { 
        marginTop: hp(1), 
        width: wp(97), 
        elevation: 5,
        alignSelf: 'center'
    },
})

export default FollowerScreen;