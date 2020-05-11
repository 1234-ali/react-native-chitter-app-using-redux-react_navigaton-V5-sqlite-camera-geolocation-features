import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableWithoutFeedback, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Header, Title, Card, CardItem, Body } from 'native-base';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import * as DraftActions from '../store/actions/DraftActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const DraftScreen = ({ navigation }) => {
    const draft = useSelector(state => state.DraftReducer.draft);
    const user = useSelector(state => state.UserReducer.user);

    const [openImage, setOpenImage] = useState(false);
    const [modalImage, setModalImage] = useState(false);

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const dispatch = useDispatch();

    const userDrafts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(DraftActions.loadDraft(user != null && user.user_id));
        } catch (err) {
            setError(true);
        }
        setIsRefreshing(false);
    }, [dispatch, setError, setIsRefreshing]);


    useEffect(() => {
        setIsFetching(true);
        userDrafts().then(() => {
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
                <TouchableOpacity onPress={userDrafts} style={{ backgroundColor: '#020F59', marginTop: hp(1), borderRadius: 5 }}>
                    <Text style={{ color: 'white', padding: 10 }}>
                        Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const onDelete = async (id) => {
        try {
            await dispatch(DraftActions.deleteDraft(id));
            userDrafts();
        } catch (error) {
            Alert.alert(error.message);
        }
    };

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
                    <Title style={styles.header}>Drafts</Title>
                </View>
                <Entypo name='water' style={styles.waterIcon} />
            </Header>
            { draft.length === 0 ?
                <Card style={styles.noCardContainer}>
                    <CardItem>
                        <Body style={styles.alignItems}>
                            <Text style={styles.fontFamily}>
                                No draft found!
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            :
                <FlatList 
                    onRefresh={userDrafts}
                    refreshing={isRefreshing}
                    data={draft}
                    keyExtractor={item => item.id} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        var date = new Date(item.date);
                        var formatted = moment(date).format('D MMMM YYYY');
                        return (
                            <Card style={styles.cardContainer}>
                                <CardItem style={styles.cardItem}>
                                    <Body>
                                        <View style={styles.cardView}>
                                            <Text style={styles.time}>{formatted}</Text>
                                            <View style={styles.flexDirection}>
                                                <TouchableOpacity 
                                                    onPress={() => navigation.navigate('updateDraft', { draftId: item.id, draftUserId: user != null && user.user_id, draftTitle: item.title, draftImage: item.imageUri })} 
                                                    activeOpacity={0.6} 
                                                    style={{ ...styles.deleteIcon, padding: 8 }} 
                                                >
                                                    <Entypo name='edit' size={hp('3%')} color='#026873' />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => onDelete(item.id)} activeOpacity={0.6} style={{...styles.deleteIcon, padding: 8}} >
                                                    <MaterialCommunityIcons name='delete-empty' size={hp('3%')} color='#F24130' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.userText}>
                                                {item.title}
                                            </Text>
                                        </View>
                                        { item.imageUri != '' && 
                                            <TouchableOpacity onPress={() => {
                                                setModalImage(item.imageUri);
                                                setOpenImage(true);
                                            }} style={styles.bigImageContainer}>
                                                <Image  source={{ uri: `${item.imageUri}` }} style={styles.bigImage} />
                                            </TouchableOpacity>
                                        }
                                    </Body>
                                </CardItem>
                            </Card> 
                        )
                    }}
                />
            }

            <Modal isVisible={openImage}  style={styles.modalContainer} >
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => {
                        setOpenImage(false);
                    }} style={{ ...styles.brushContainer, backgroundColor: '#00acee', marginTop: hp(12), marginBottom: hp(10) }}>
                        <Ionicons name='ios-close' style={{...styles.brushText, color: 'white', fontSize: hp(6)}} />
                    </TouchableOpacity>
                    <Image source={{ uri: `${modalImage}` }} style={styles.modalbigImage} />
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
        color: '#024873', 
        fontFamily: book, 
        fontSize:hp(3.5)
    },
    brushText: { 
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: 25,
        alignSelf:'center'  
    },
    deleteIcon: {
        marginHorizontal: 5,
        backgroundColor: 'rgba(0, 0, 0, .1)',
        borderRadius: 50
    },
    brushContainer: { 
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: 120, 
        alignItems: 'center' 
    },
    waterIcon: { 
        width: wp(8),
        fontSize: hp(3.1), 
        color: 'blue', 
        marginTop: hp(.5) 
    },
    cardViewContainer: { 
        flexDirection: 'row'
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
    cardContainer: { width: wp(90), alignSelf: 'center', borderRadius: 10, elevation: 5 },
    cardView: { flexDirection: 'row', width: wp(80), justifyContent: 'space-between'},
    time: { fontSize: hp(2), marginTop: hp(1), fontFamily: book },
    flexDirection: { flexDirection: 'row' },
    cardItem: {  borderRadius: 10 },
    brushContainer: { 
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: 120, 
        alignItems: 'center',
        width: wp('12%'),
        height: hp('6%'), 
        justifyContent: 'center' 
    },
    bigImageContainer: {
        width: 200,
        height: 120,
        marginTop: hp(1),
        overflow: 'hidden'
    },
    bigImage: { 
        borderRadius: 15, 
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
    modalView: { 
        flex: 1, 
        alignItems: 'center', 
        backgroundColor: 'white' 
    },
    modalContainer: { 
        margin: 0 
    },
})

export default DraftScreen;