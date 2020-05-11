import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import { useSelector } from 'react-redux';

const medium = 'AirbnbCerealMedium';

const FollowerScreen = () => {
    const follower = useSelector(state => state.FollowReducer.followers);

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
                                            <Image source={require('../assets/images/person_image.jpg')} style={styles.userImgFront} />
                                            <View style={styles.innerViewSecond}>
                                                <Text style={styles.innerViewText}>
                                                    {  item.user.given_name }
                                                </Text>
                                                <Text style={styles.innerViewTag}>
                                                    { tem.user.email.substring(0, 7) }
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => followUser(item.user.user_id)} style={styles.followContainer}>
                                                { !isFollowing ? 
                                                    <Text style={styles.followText}>
                                                        Follow
                                                    </Text>
                                                : 
                                                    <ActivityIndicator size='small' color='white' />
                                                }
                                            </TouchableOpacity>
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
})

export default FollowerScreen;