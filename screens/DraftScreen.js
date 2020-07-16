// This screen file is used to display drafts. this a draft screen

import React, { useState, useEffect, useCallback } from 'react';  // hooks import from react
import { View, Text, StyleSheet, Alert, FlatList, Image, TouchableWithoutFeedback, StatusBar, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // package used to make screen responsive
import { Icon, Header, Title, Card, CardItem, Body } from 'native-base'; // native-base is used a ui library. buuton is used from native base on this screen
import moment from 'moment'; // moment is library to display time and date in format 
import Ionicons from 'react-native-vector-icons/Ionicons';  // This package is used for displaying icons
import Modal from 'react-native-modal'; // is used to display modal 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // This package is used for displaying icons
import Entypo from 'react-native-vector-icons/Entypo'; // This package is used for displaying icons
import { useSelector, useDispatch } from 'react-redux'; // this is used to dispatching actions and selecting global states

import * as DraftActions from '../store/actions/DraftActions';  // this line is to import all the functions from DraftActions.js in this file

const { height } = Dimensions.get('window');  // dimensions is used to find width and height of the device screen

const medium = 'AirbnbCerealMedium'; // custom fonts 
const book = 'AirbnbCerealBook'; // custom fonts

const DraftScreen = ({ navigation }) => { //navigation from react-navigation
    const draft = useSelector(state => state.DraftReducer.draft); // useSelector is a hook from react-redux. used to select global state (draft) from the draft reducer and used in the screen
    const user = useSelector(state => state.UserReducer.user); // useSelector is a hook from react-redux. used to select global state (user) from the draft reducer and used in the screen

    const [openImage, setOpenImage] = useState(false);  // if true then draft image display on large view. if false nothing happerns
    const [modalImage, setModalImage] = useState(false); // if true then modal display

    const [isFetching, setIsFetching] = useState(false); 
    // these are the states used for fetching data from the server.
    // when api is calling then isFetching is true then when api call is complete then is fetching is false.

    const [error, setError] = useState(); // If any error occurs in calling api for example in availability of internet.
    // then error is true other wise empty or false.

    const [isRefreshing, setIsRefreshing] = useState(false);
    // It is used for refreshing app by dragging down the screen

    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    // async await is used with useCallback hook and try catch. please search on the internet.
    const userDrafts = useCallback(async () => {
        setError(null); // this line make  error null on line 32
        setIsRefreshing(true); // this line make  isRefreshing true on line 35 used for pull to refresh. flatlist and scroll view
        try {
            await dispatch(DraftActions.loadDraft(user != null && user.user_id)); 
            // this line is calling function from DraftActions file. imported from DraftActions file on line 14. loaddraft is the name of functions
            //and sending chitId bcz to display image of only that chit from the server
        } catch (err) {
            setError(true); // this line make error true on line 32 and appears error part on the screen below on line 70
        }
        setIsRefreshing(false); // this line make  isRefreshing false on line 35.used for pull to refresh. flatlist and scroll view
    }, [dispatch, setError, setIsRefreshing]); // function dependency on which function depends


    useEffect(() => {   // useEffect hook is used to automatically render the component when the screen is open.
        setIsFetching(true); // when data is fetching from server the setIsFetching make is fetching true. 
        //you can see above on line 28
        userDrafts().then(() => {  // userDrafts is a function. see above on line 41, this is used for dispatching actions and calling api
            setIsFetching(false); // when data fetching from server is complete the setIsFetching make is fetching false. 
            //you can see above on line 28
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
                    onPress={userDrafts} // => when button  press then userDrafts function calls on line 41
                    color='#020F59'
                />
            </View>
        );
    }

    const onDelete = async (id) => { // this function is used for deleting draft on draft id. argument is draft id.
        try {
            await dispatch(DraftActions.deleteDraft(id)); 
            // it dispatch the action from DraftActions. deleteDraft is the function on DraftActions file. and sendind id.
            userDrafts(); // this is used when draft is deleted then it refresh the screen. calling userDrafts online 41
        } catch (error) {
            Alert.alert(error.message); // if any error occurs then alert display error message
        }
    };

    return (
        <View style={styles.container}>
            {/* header from native base */}
            <Header style={styles.headerContainer}> 
                {/* to display status */}
                <StatusBar barStyle="dark-content" backgroundColor="white" /> 
                <View>
                    {/* TouchableWithoutFeedback is nothing happens on click. on Press go to previouse screen */}
                    <TouchableWithoutFeedback onPress={() => navigation.goBack()}> 
                        {/* Icon from native base to display icons */}
                        <Icon name='arrow-back' style={styles.backIcon} />
                    </TouchableWithoutFeedback>
                </View> 
                <View>
                    {/* title from native base */}
                    <Title style={styles.header}>Drafts</Title>
                </View>
                {/* Entypo to display icons from react native vector icons */}
                <Entypo name='water' style={styles.waterIcon} />
            </Header>
            {/* if draft.length is 0, drafts are in array then if part display on screen otherwise else part display. draft is from global state, above on line 21 */}
            { draft.length === 0 ? 
                <ScrollView  // it is used to scroll the screen
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false} // false disappear the scroll view line
                    refreshControl={ // resfresh control is from react native used with ScrollView. used for pull to refereh
                        <RefreshControl refreshing={isRefreshing} onRefresh={userDrafts} /> // onRefresh it calls userDrafts functions on line 41 above
                    }
                >
                    {/* Card, CardItem, Body import from native base ui library */}
                    <Card style={styles.noCardContainer}>
                        <CardItem>
                            <Body style={styles.alignItems}>
                                <Text style={styles.fontFamily}>
                                    {/*  if there is no draft, draft.length === 0 this line appears  */}
                                    No draft found!
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </ScrollView>
            :

            // draft.length === 0 ! == 0  , if there is drafts 
                <FlatList 
                    onRefresh={userDrafts} // pusll to refresh calling userDrafts funtion above
                    refreshing={isRefreshing} // if is Refreshing true then pull to refresh appears otherwise not
                    data={draft} // array of draft 
                    keyExtractor={item => item.id} // draft id 
                    showsVerticalScrollIndicator={false} // disappears the scroll indicator
                    renderItem={({ item }) => { // it is for render the data
                        var date = new Date(item.date); 
                        var formatted = moment(date).format('D MMMM YYYY'); // to format date by moment library
                        return (
                            // Card, CardItem, Body import from native base ui library
                            <Card style={styles.cardContainer}>
                                <CardItem style={styles.cardItem}>
                                    <Body>
                                        <View style={styles.cardView}>
                                            {/* formatted = date is fomated */}
                                            <Text style={styles.time}>{formatted}</Text>  
                                            <View style={styles.flexDirection}>
                                                <TouchableOpacity 
                                                    // onPress => navigate to updateDraft screen react navigation . when clicking on update icon.it send draft id, image, title to upate draft screen in params
                                                    onPress={() => navigation.navigate('updateDraft', { draftId: item.id, draftUserId: user != null && user.user_id, draftTitle: item.title, draftImage: item.imageUri })} 
                                                    activeOpacity={0.6} 
                                                    style={{ ...styles.deleteIcon, padding: 8 }} 
                                                >
                                                    {/* icons display from vector icons */}
                                                    <Entypo name='edit' size={hp('3%')} color='#026873' />
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    // onDelete function calls when pressing on delete icon on line 85
                                                    onPress={() => onDelete(item.id)} 
                                                    activeOpacity={0.6} 
                                                    style={{...styles.deleteIcon, padding: 8}} 
                                                >
                                                    {/* icons display from vector icons */}
                                                    <MaterialCommunityIcons name='delete-empty' size={hp('3%')} color='#F24130' />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.userText}>
                                                {/* draft title */}
                                                {item.title}
                                            </Text>
                                        </View>
                                        {/*  if draft has image then this part display  */}
                                        { item.imageUri != '' && 
                                            <TouchableOpacity onPress={() => {
                                                setModalImage(item.imageUri);
                                                setOpenImage(true);
                                                //  on press it display the modal andd change the state
                                                // setModalImage send the url of image to modal to display image in modal
                                                // setOpenImage it opens the modal
                                            }} style={styles.bigImageContainer}>
                                                {/* image of the draft */}
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

            {/* modal is like pop up. modal to display image from react native modal */}

            {/* if isVisible={openImage}  true then modal display other wise not display  */}

            <Modal isVisible={openImage}  style={styles.modalContainer} >
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => {
                        //  setOpenImage(false); on clicking it make isVisible={openImage} to false. modal disappears
                        setOpenImage(false);
                    }} style={{ ...styles.brushContainer, backgroundColor: '#00acee', marginTop: hp(12), marginBottom: hp(10) }}>
                        {/* from vector icons */}
                        <Ionicons name='ios-close' style={{...styles.brushText, color: 'white', fontSize: hp(6)}} />
                    </TouchableOpacity>
                    {/* image to display in modal */}
                    <Image source={{ uri: `${modalImage}` }} style={styles.modalbigImage} />
                </View>
            </Modal>
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
    cardContainer: { 
        width: wp(90), 
        alignSelf: 'center', 
        borderRadius: 10, 
        elevation: 5 
    },
    cardView: { 
        flexDirection: 'row', 
        width: wp(80), 
        justifyContent: 'space-between'
    },
    time: { 
        fontSize: hp(2), 
        marginTop: hp(1), 
        fontFamily: book 
    },
    flexDirection: { 
        flexDirection: 'row' 
    },
    cardItem: { 
        borderRadius: 10 
    },
    brushContainer: { 
        backgroundColor: 'rgba(0 , 0 , 0 , .12)', 
        borderRadius: height > 800 ?  30 : 120, 
        alignItems: 'center',
        width: height > 800 ?  60 : wp('12%'),
        height: height > 800 ?  60 : hp('6%'), 
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