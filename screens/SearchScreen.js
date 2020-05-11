import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Button, Icon, Header, Card, CardItem, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import * as ChitActions from '../store/actions/ChitActions';
import * as FollowActions from '../store/actions/FollowActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const SearchScreen = () => {
    const user = useSelector(state => state.UserReducer.user);
    const chits = useSelector(state => state.ChitReducer.chits);
    const searchUser = useSelector(state => state.FollowReducer.users);
    const following = useSelector(state => state.FollowReducer.followings);

    const filteredArray = chits.filter(function(item) {
            return !following.includes(item.user.user_id); 
    });
    
    const [query, setQuery] = useState('');

    const [changeView, setChangeView] = useState(false);

    const [isSearching, setIsSearching] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [isFollowing, setIsFollowing] = useState([]);

    const dispatch = useDispatch();

    const userChits = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(ChitActions.getChits());
        } catch (err) {
            setError(true);
        }
        setIsRefreshing(false);
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {
        setIsFetching(true);
        userChits().then(() => {
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

    const userSearch = async (text) => {
        setQuery(text);

        if (query.length > 5) {
            setIsSearching(true);
            try {
                await dispatch(FollowActions.userSearch(text));
            } catch (error) {
                // Alert.alert(error.message);
            }
            setIsSearching(false);
        }
    };

    const followUser = async (id) => {
        try {
            await dispatch(FollowActions.followUser(id));
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    return (
        <View style={styles.container}>
           <Header style={styles.headerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                { !changeView ?   
                    <View style={styles.flexDirection}>
                        <View>
                            { user != null && user.hasOwnProperty('user_profile_photo_path') ?
                                <Image source={{ uri: `${user.user_profile_photo_path}` }} style={styles.imgFront} />
                            :
                                <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.imgFront} />
                            }
                        </View>
                        <TouchableOpacity onPress={() => setChangeView(true)} style={styles.inputContainer}>
                            <Input 
                                autoCorrect={false}
                                style={styles.searchInput}
                                disabled
                                placeholder='Search'
                            />
                        </TouchableOpacity>
                        <Entypo name='water' style={styles.waterIcon} />
                    </View>
                :
                    <View style={styles.flexDirection}>
                        <TouchableOpacity onPress={() => setChangeView(false)} style={styles.margin}> 
                            <Icon name='arrow-back' style={styles.backIcon} />
                        </TouchableOpacity>
                        <View style={{ ...styles.flexDirection, width: wp(85) }}>
                            <Input 
                                autoCorrect={false}
                                autoFocus
                                style={styles.liveSearchInput}
                                value={query}
                                onChangeText={(text) => userSearch(text)}
                            />
                            { query.length > 0 &&
                                <TouchableOpacity onPress={() => setQuery('')} style={{...styles.brushContainer, marginTop: hp(0) }}>
                                    <Ionicons name='ios-close' style={styles.brushText} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                }
            </Header>
            { !changeView ? 
                <View style={styles.container}>
                    <Card style={styles.mainCardContainer}>
                        <CardItem>
                            <Body>
                                <View style={styles.mainCardView}>
                                    <Text style={styles.suggestionText}>
                                        Suggestions ?
                                    </Text>
                                    <View style={styles.secondView}>
                                        { chits.length === 0 ?
                                            <Card style={styles.noCardContainer}>
                                                <CardItem>
                                                    <Body style={styles.alignItems}>
                                                        <Text style={styles.fontFamily}>
                                                            No Suggestions !
                                                        </Text>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        :
                                            <FlatList 
                                                onRefresh={userChits}
                                                refreshing={isRefreshing}
                                                data={filteredArray}
                                                keyExtractor={item => (item.chit_id).toString()} 
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) => {
                                                    return (

                                                    <Card style={styles.secondViewCard}>
                                                            <CardItem>
                                                                <Body>
                                                                    <View style={styles.innerView}>
                                                                        <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImgFront} />
                                                                        <View style={styles.innerViewWidthContainer}>
                                                                            <View style={styles.innerViewSecond}>
                                                                                <Text style={styles.innerViewText}>
                                                                                    {  item.user.given_name }
                                                                                </Text>
                                                                                <Text style={styles.innerViewTag}>
                                                                                    { item.user.email.substring(0, 7) }
                                                                                </Text>
                                                                            </View>
                                                                            <TouchableOpacity onPress={() => followUser(item.user.user_id)} style={styles.followContainer}>
                                                                                {/* { isFollowing ?  */}
                                                                                    <Text style={styles.followText}>
                                                                                        Follow
                                                                                    </Text>
                                                                                {/* : 
                                                                                    <ActivityIndicator size='small' color='white' />
                                                                                } */}
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                </Body>
                                                            </CardItem>
                                                        </Card>
                                                    )
                                                }} 
                                            />
                                        }
                                    </View>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </View>
            :  
                <View style={{...styles.container, backgroundColor: '#F0F0F0' }}>
                    { isSearching ? 
                        <View style={styles.centered}>
                            <ActivityIndicator size='large' color='#027373' />
                        </View>
                    :
                        <View style={styles.liveSearchView}>
                            { searchUser.length === 0 ?
                                <Card style={styles.noCardContainer}>
                                    <CardItem>
                                        <Body style={styles.alignItems}>
                                            <Text style={styles.fontFamily}>
                                                Search Users !
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            :
                                <FlatList 
                                    data={searchUser}
                                    keyExtractor={item => (item.user_id).toString()} 
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <Card style={styles.liveSearchCard}>
                                                <CardItem>
                                                    <Body>
                                                        <View style={styles.flexDirection}>
                                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userSearchImgFront} />
                                                            <View style={styles.marginLeft}>
                                                                <Text style={{ ...styles.innerViewText, fontSize: hp(2.7), marginTop: hp(-.2) }}>
                                                                    { item.given_name }
                                                                </Text>
                                                                <Text style={{...styles.innerViewTag, fontSize: 18, marginTop: hp(-.1),  color: 'rgba(0 , 0, 0, .8)' }}>
                                                                    { item.email.substring(0, 7) }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </Body>
                                                </CardItem>
                                            </Card>
                                        )
                                    }}
                                />
                            }
                        </View>
                    }
                </View>
            }
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
    flexDirection: { 
        flexDirection: 'row' 
    },
    searchInput: { 
        paddingLeft: 10, 
        fontSize: hp(2.3), 
        fontFamily: book 
    },
    waterIcon: { 
        marginLeft: wp(5), 
        fontSize: hp(3.1),  
        color: 'blue', 
        marginTop: hp(.5) 
    },
    liveSearchInput: { 
        width: wp(50), 
        padding: 10,
        marginLeft: wp(2)
    },
    imgFront: {
        width: wp('12%'),
        height: hp('6%'),
        borderRadius: wp('30%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
        marginLeft: wp(2)
    },
    inputContainer: { 
        width: wp(64), 
        height: hp(5.7), 
        backgroundColor: 'white', 
        borderRadius: 30,
        borderWidth: 1, 
        overflow: 'hidden', 
        marginLeft: wp(3)
    },
    brushContainer: {
        width: wp('12%'),
        height: hp('6%'),
        marginLeft: wp(5),
        marginTop: hp(1),
        alignItems: 'center'
    },
    innerViewWidthContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: wp(74) 
    },
    brushText: { 
        color: '#2C7BBF', 
        fontSize: hp(7),
    },
    backIcon: { 
        marginLeft: 8, 
        color: '#024873', 
        fontSize: 30,
        marginTop: hp(1) 
    },
    mainCardContainer: { 
        marginTop: hp(10) 
    },
    mainCardView: { 
        width: wp(90) 
    },
    marginLeft: { 
        marginLeft: hp(1) 
    },
    suggestionText: { 
        fontSize: hp(4), 
        fontFamily: book 
    },
    secondView: { 
        width: wp(100), 
        alignItems: 'center', 
        marginLeft: wp(-5),  
        marginTop: hp(1)
    },
    secondViewCard: { 
        marginTop: hp(1), 
        width: wp(95), 
        elevation: 5
    },
    innerView: { 
        flexDirection: 'row',
        width: wp(85), 
        marginLeft: wp(-3) 
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
    innerViewSecond: { 
        marginLeft: wp(3), 
        marginTop: hp(.1) 
    },
    innerViewTag: { 
        fontFamily: book, 
        marginTop: hp(.7), 
        fontSize: hp(2.5), 
        marginTop: hp(.6) 
    },
    followContainer: { 
        backgroundColor: '#00acee',
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 12,
        height: 35,
        borderRadius: 5,
        // marginLeft: wp(11),
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
    userSearchImgFront: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
        marginLeft: wp(2)
    },
    liveSearchView: {
        marginTop: hp(5) 
    },
    liveSearchCard: { 
        width: wp(98), 
        alignSelf: 'center', 
        elevation: 5
    },
    margin: { 
        marginRight: 10 
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
})

export default SearchScreen;