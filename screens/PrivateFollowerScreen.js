import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import { useSelector } from 'react-redux';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const PrivateFollowerScreen = () => {
    const follower = useSelector(state => state.FollowReducer.privatefollower);

    return (
        <View style={styles.container}>
            { follower.length === 0 ?
                <Card style={styles.cardContainer}>
                    <CardItem>
                        <Body style={styles.alignItems}>
                            <Text style={styles.fontFamily}>
                                No Followers Found !
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            :
                <FlatList 
                    data={follower}
                    keyExtractor={item => (item.user_id).toString()} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <Card style={styles.secondViewCard}>
                                <CardItem>
                                    <Body>
                                        <View style={styles.innerView}>
                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImgFront} />
                                            <View style={styles.innerViewSecond}>
                                                <Text style={styles.innerViewText}>
                                                    {  item.given_name }
                                                </Text>
                                                <Text style={styles.innerViewTag}>
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
        marginLeft: height > 800 ?  wp(0) : wp(-5) 
    },
    innerViewSecond: { 
        marginLeft: wp(3), 
        marginTop: hp(.1) 
    },
    innerViewTag: { 
        fontFamily: book,  
        fontSize: height > 800 ?  hp(2) : hp(2.5), 
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

export default PrivateFollowerScreen;