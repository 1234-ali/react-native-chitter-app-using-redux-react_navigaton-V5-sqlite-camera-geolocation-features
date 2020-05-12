import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import * as FollowActions from '../store/actions/FollowActions';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const FollowingScreen = () => {
    const following = useSelector(state => state.FollowReducer.followings);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const dispatch = useDispatch();

    const userFollowing = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(FollowActions.getFollowings());
        } catch (err) {
            setError(true);
        }
        setIsRefreshing(false);
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {
        setIsFetching(true);
        userFollowing().then(() => {
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

    const unFollowUser = async (id) => {
        try {
            await dispatch(FollowActions.unFollowUser(id));
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    return (
        <View style={styles.container}>
            { following.length === 0 ?
                <Card style={styles.cardContainer}>
                    <CardItem>
                        <Body style={styles.alignItems}>
                            <Text style={styles.fontFamily}>
                                No Followings Found !
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            :
                <FlatList
                    onRefresh={userFollowing}
                    refreshing={isRefreshing}
                    data={following}
                    keyExtractor={item => (item.user_id).toString()} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <Card style={styles.secondViewCard}>
                                <CardItem>
                                    <Body>
                                        <View style={styles.innerView}>
                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImgFront} /> 
                                            <View style={styles.innerViewContainer}>
                                                <View style={styles.innerViewSecond}>
                                                    <Text style={styles.innerViewText}>
                                                        {  item.given_name }
                                                    </Text>
                                                    <Text style={styles.innerViewTag}>
                                                        { item.email.substring(0, 7) }
                                                    </Text>
                                                </View>
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