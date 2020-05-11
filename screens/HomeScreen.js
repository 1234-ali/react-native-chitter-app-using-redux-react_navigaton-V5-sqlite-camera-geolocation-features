import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Icon, Header, Left, Title, Tab, Tabs, TabHeading, Right, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as ChitActions from '../store/actions/ChitActions';
import * as FollowActions from '../store/actions/FollowActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const HomeScreen = ({ navigation }) => {
    const user = useSelector(state => state.UserReducer.user);
    const chits = useSelector(state => state.ChitReducer.chits);

    const [openImage, setOpenImage] = useState(false);
    
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const dispatch = useDispatch();

    const userChits = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(ChitActions.getChits());
            await dispatch(FollowActions.getFollowers());
            await dispatch(FollowActions.getFollowings());
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

    return (
        <View style={styles.container}>
            <Header style={styles.headerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" /> 
                <View>
                    { user != null && user.hasOwnProperty('user_profile_photo_path') ?
                        <Image source={{ uri: `${user.user_profile_photo_path}` }} style={styles.imgFront} />
                    :
                        <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.imgFront} />
                    }
                </View> 
                <View>
                    <Title style={styles.header}>Home</Title>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('post', { userImg: user != null && user.hasOwnProperty('user_profile_photo_path') ? user.user_profile_photo_path : 'http://www.gravatar.com/avatar/?d=mm' }) } style={styles.brushContainer}>
                    <Ionicons name='ios-brush' style={styles.brushText} />
                </TouchableOpacity>
            </Header>
            <View style={{ marginTop: hp(1) }}>
                { chits.length === 0 ?
                        <Card style={styles.noCardContainer}>
                            <CardItem>
                                <Body style={styles.alignItems}>
                                    <Text style={styles.fontFamily}>
                                        No Chits found!
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    :
                        <FlatList 
                            onRefresh={userChits}
                            refreshing={isRefreshing}
                            data={chits}
                            keyExtractor={item => (item.chit_id).toString()} 
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity  
                                        activeOpacity={0.7} 
                                        onPress={() => navigation.navigate('privateUser', { userId: item.user.user_id })}
                                    >
                                        <Card>
                                            <CardItem>
                                                <Body>
                                                    <View style={styles.cardViewContainer}>
                                                        { item.user.hasOwnProperty('user_profile_photo_path') ?
                                                            <Image source={{ uri: `${item.user.user_profile_photo_path}` }} style={styles.userImg} />
                                                        :
                                                            <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.userImg} />
                                                        }

                                                        <View style={styles.textViewContainer}>
                                                            <Text style={styles.userText}>
                                                                {item.user.given_name} {item.user.Family_name}
                                                            </Text>
                                                            <Text style={styles.hashTagText}>
                                                                @Alih12
                                                            </Text>
                                                        </View>
                                                        <Text style={styles.timeText}>
                                                            {moment.utc(item.timestamp).local().startOf('seconds').fromNow()}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.chitContent}>
                                                            {item.chit_content}
                                                        </Text>
                                                        { item.hasOwnProperty('chittr_chit_photo') && 
                                                            <TouchableOpacity onPress={() => setOpenImage(true)} style={styles.bigImageContainer}>
                                                                <Image  source={{ uri: `${item.chittr_chit_photo.photo_path}` }} style={styles.bigImage} />
                                                            </TouchableOpacity>
                                                        }
                                                    </View>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </TouchableOpacity>
                                )
                            }}
                    />
                }
            </View>
            <Modal isVisible={openImage}  style={styles.modalContainer} >
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => setOpenImage(false)} style={{...styles.brushContainer, backgroundColor: '#00acee', marginTop: hp(12), marginBottom: hp(10) }}>
                        <Ionicons name='ios-close' style={{...styles.brushText, color: 'white', fontSize: hp(6)}} />
                    </TouchableOpacity>
                    <Image source={require('../assets/images/person_image.jpg')} style={styles.modalbigImage} />
                </View>
            </Modal>
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
        color: 'rgba(0 , 0 , 0, .7)', 
        fontFamily: medium, 
        fontSize:hp(4)
    },
    imgFront: {
        width: wp('12%'),
        height: hp('6%'),
        borderRadius: wp('30%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
    },
    brushContainer: { 
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: 120, 
        alignItems: 'center',
        width: wp('12%'),
        height: hp('6%'), 
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
        width: wp('15%'),
        height: hp('7.5%'),
        borderRadius: wp('32%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
    },
    cardViewContainer: { 
        flexDirection: 'row', 
        marginLeft: wp(-2) 
    },
    textViewContainer: { 
        marginLeft: wp(2), 
        width: wp('50%') 
    },
    userText: { 
        fontSize: hp(2.5), 
        fontFamily: medium 
    },
    hashTagText: { 
        fontFamily: book, 
        marginTop: hp(.5), 
        fontSize: hp(2.2) 
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
});

export default HomeScreen;