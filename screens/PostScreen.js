//  this is used to post chits

import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';  // image picker is used to pick image from gallery mobile gallery and from camera
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';  // it is used to pick device location in latitude or longiude
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';

import * as DraftActions from '../store/actions/DraftActions';
import * as ChitActions from '../store/actions/ChitActions';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

//  All above are same please check other files like draft Screen.js

const PostScreen = ({ navigation }) => {
    const user = useSelector(state => state.UserReducer.user); // useSelector is a hook from react-redux. used to select global state (user) from the UserReducer and used in the screen
    const userImg = useSelector(state => state.UserReducer.userImg); // useSelector is a hook from react-redux. used to select global state (userImg) from the UserReducer and used in the screen

    const [title, setTitle] = useState(''); // for chit title
    const [image, setImage] = useState(''); // for chit image
    
    const [fetchingLocation, setFetchingLocation] = useState(false); // for location

    const [isImage, setIsImage] = useState(null); // for image

    const [lat, setLat] = useState(''); // for latitude
    const [lng, setLng] = useState(''); // for longitude

    const [isPosting, setIsPosting] = useState(false);

    const [isDrafting, setIsDrafting] = useState(false);  // for draft saving
    const [isCreated, setIsCreated] = useState(false); // for posting chits
    const [isError, setIsError] = useState(false); //  display error

    const launchCamera = ()  => {  // it is used to pick image from device.
        let options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
        };

        // used to launch camera and click the piture from camera
        
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
            
                setImage(source.uri); // it is used o display image in the post screen

                setIsImage(response);  // set the image uri to send to server
            }
        });
    };

    const launchImageLibrary = () => {  // used to lauch gallery and pick image 
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };

                setImage(source.uri); // it is used o display image in the post screen

                setIsImage(response);  // set the image uri to send to server
            }
        });
    
    }

    const getLocationHandler =  () => {  // used to get location from device
        setFetchingLocation(true);
        Geolocation.getCurrentPosition(  // get position in longitude and latitude
            position => {
              setLng(position.coords.longitude); // set in the lat state
              setLat(position.coords.latitude); // set in the lng state
            },
            error => {
                Alert.alert('Error', error.message); // if any error occurs message display
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}, // options to pick location 
        );
        setFetchingLocation(false);
    };

    const dispatch = useDispatch(); // it is used to dispatch the action from every screens. call the functions from action folders.

    const postSubmission = async () => {  // function used to post the chit and save date to server
        if (title == '') {
            Alert.alert('Write the post'); // if title field is empty
        } else {
            setIsPosting(true);  // onPost chit it display modal 
            try {
                await dispatch(ChitActions.postChits(title, lng, lat, isImage)); // dispatching function from ChitActions file. 
                // post chits() is the function written in  ChitActions file. and sending data as argument to post chit function
                setIsCreated(true);  // if chit successfully create the changing the state to true and displat succes message
            } catch (error) {
                setIsError(true); // it display error if error occurs
            }
        }
    };

    const draftSubmission = async () => {  // for draft saving in sqlite storage
        if (title == '', image == '') {
            Alert.alert('Enter text and image');
        } else {
            setIsDrafting(true);
            try {
                await dispatch(DraftActions.addDraft(user != null && (user.user_id).toString(), title, image, new Date().toString()));
                setIsCreated(true);
            } catch (error) {
                setIsError(true);
            }
        }
    };

    const onError = () => {  // on error set all the states to initial state below
        setIsError(false);
        setIsCreated(false);
        setIsDrafting(false);
        setIsPosting(false);
    };
 
    const onNavigate = () => { // this function is used to navigate to home screen. when post will chits oer drafts are  save
        navigation.navigate('home');
    };


    // all the function above are calling in return

    return (
        <View style={styles.container}>
            <View style={styles.firstContainer}>
                {/* onPress={() => navigation.goBack()} => used to nvigate to previouse screen */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.brushContainer}>
                    <Ionicons name='ios-close' style={styles.brushText} />
                </TouchableOpacity>
                <View style={styles.flexDirection}>

                {/* calling postSubmission  funtion to save chit in database from server* */}
                <TouchableOpacity onPress={postSubmission} style={{ ...styles.PostContainer }}>
                    <Text style={styles.postText}>
                        Post
                    </Text>
                </TouchableOpacity>
                {/* calling draftSubmission  funtion to save draft in database from server* */}
                <TouchableOpacity onPress={draftSubmission} style={styles.PostContainer}>
                    <Text style={styles.postText}>
                        Save Draft
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.secondContainer}>
                <View style={styles.flexDirection}>
                    { userImg != ''  ? //if there is user image then if part display otherwise else part
                        // this is if part
                        <Image source={{ uri: `data:${userImg.type};base64,${userImg.data}` }} style={styles.imgFront} />
                    :
                        // this is else part
                        <Image source={{ uri: 'http://www.gravatar.com/avatar/?d=mm' }} style={styles.imgFront} />
                    }
                    <TextInput 
                        multiline={true}
                        autoCorrect={false}
                        autoFocus
                        placeholder="What's happening?"
                        style={styles.input}
                        value={title} // for title
                        onChangeText={(text) => setTitle(text)} // onchangetext changing the value of title input
                    />
                </View>
                <View style={styles.subContainer}>
                    <View style={styles.locationSubContainer}>
                        { lat != '' &&  lng != '' &&  // if lat or lng state are not empty then below part is appear
                            <>
                                <View style={styles.locationContainer}>
                                    <Text style={styles.locationText}>
                                        Latitude: 
                                    </Text>
                                    <Text style={{...styles.locationText, marginLeft: wp(1)}}>
                                        {/* latitude, tofixed() is built in javascript methd to display float value .3 digits */}
                                        {lat.toFixed(3)}  
                                    </Text>
                                </View>
                                <View style={styles.locationContainer}>
                                    <Text style={styles.locationText}>
                                        Longitude: 
                                    </Text>
                                    <Text style={{...styles.locationText, marginLeft: wp(1)}}>
                                        {/* logitude, tofixed() is built in javascript methd to display float value .2 digits */}
                                        {lng.toFixed(2)}
                                    </Text>
                                </View>
                            </>
                        }
                    </View>

                    { image != '' &&  //if image state is not empty then belo part display
                        <View >
                            {/* image display selected by using image picker */}
                            <Image source={{ uri: `${image}` }} style={styles.img} />
                            {/* onPress={() => setImage('')} => is for to cancel the image or remove he image  */}
                            <TouchableOpacity onPress={() => setImage('')} style={styles.imgIconContainer}>
                                <Ionicons name='ios-close' style={styles.imgIcon} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
            <View style={styles.cameraMainContainer}>
                <TouchableOpacity onPress={launchCamera} style={styles.cameraContainer}>
                    <Feather name='camera' style={styles.cameraIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={launchImageLibrary} style={styles.cameraContainer}>
                    <FontAwesome name='image' style={styles.cameraIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={getLocationHandler} style={styles.cameraContainer}>
                    { !fetchingLocation ?
                        <Entypo name='location-pin' style={styles.cameraIcon} />
                    :
                        <ActivityIndicator size='small' color='rgba(0 , 0 , 0, .7)' />
                    }
                </TouchableOpacity>
            </View>

            {/* below Modal is for display post chits. isVisible={isPosting} , isPosting is true modal dispay else not display  */}
            <Modal isVisible={isPosting} hasBackdrop={true} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionOutTiming={0}>
                    <View style={styles.modalCardView}>
                        { !isCreated ? 
                            <ActivityIndicator size='large' color='white' />
                        :
                            <Card style={styles.modalCardContainer}>
                                <CardItem style={styles.modalCardItem}>
                                    <Body style={styles.modalPortfolio}>
                                        <Text style={styles.modalPortfolioText}>
                                            {/* if error occur then error text display else chit post text display */}
                                            {isError ? 'An Error Occured' : 'Chit Post'}
                                        </Text>
                                        <TouchableOpacity 
                                            // if is error occur the on press onError function calls other wise onNavigate funtion call
                                            onPress={isError ? onError : onNavigate}  
                                            activeOpacity={0.6} 
                                            style={styles.modalCardButtonContainer}
                                        >
                                            <Text style={styles.modalCardButtonText}>

                                                {isError ? 'Try Again' : 'Go To Main Screen'}
                                            </Text>
                                        </TouchableOpacity>
                                    </Body>
                                </CardItem>
                            </Card>
                        }
                    </View>
                </Modal>

                {/* below Modal is for display daft sqlite storage => isVisible={isDrafting} , isDrafting is true modal dispay else not display  */}
                <Modal isVisible={isDrafting} hasBackdrop={true} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionOutTiming={0}>
                    <View style={styles.modalCardView}>
                        { !isCreated ? 
                            <ActivityIndicator size='large' color='white' />
                        :
                            <Card style={styles.modalCardContainer}>
                                <CardItem style={styles.modalCardItem}>
                                    <Body style={styles.modalPortfolio}>
                                        <Text style={styles.modalPortfolioText}>
                                            {/* if error occur then error text display else Draft Saved text display */}
                                            {isError ? 'An Error Occured' : 'Draft Saved'}
                                        </Text>
                                        <TouchableOpacity 
                                            // if is error occur the on press onError function calls other wise onNavigate funtion call
                                            onPress={isError ? onError : onNavigate}  
                                            activeOpacity={0.6} 
                                            style={styles.modalCardButtonContainer}
                                        >
                                            <Text style={styles.modalCardButtonText}>
                                                {/* if error occur then Try Again text display else Go To Main Screen text display */}
                                                {isError ? 'Try Again' : 'Go To Main Screen'}
                                            </Text>
                                        </TouchableOpacity>
                                    </Body>
                                </CardItem>
                            </Card>
                        }
                    </View>
                </Modal>
        </View>
    );
}


//below is the css of this screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    firstContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    brushContainer: {
        width: wp('12%'),
        height: hp('6%'),
        marginLeft: wp(5),
        marginTop: hp(1),
        alignItems: 'center'
    },
    brushText: { 
        color: '#2C7BBF', 
        fontSize: hp(7),
    },
    PostContainer: {
        marginTop: hp(1.5),
        borderWidth: 1,
        marginRight: wp(3),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#00acee',
        borderColor: '#00acee',
        height: hp(6)
    },
    postText: {
        color: 'white', 
        fontSize: hp(2.8),
        paddingHorizontal: 8,
        fontFamily: medium
    },
    flexDirection: { 
        flexDirection: 'row' 
    },
    secondContainer: { 
        flex: 1, 
        marginTop: hp(2) 
    },
    subContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    imgFront: {
        width: height > 800 ?  60 : wp('13%'),
        height: height > 800 ?  60 : hp('6.5%'),
        borderRadius: height > 800 ?  30 : wp('30%'),
        borderColor: '#D9D9D9',
        borderWidth: wp(.5),
        marginLeft: wp(3),
        marginTop: hp(1)
    },
    input: { 
        color: 'rgba(0, 0, 0, .9)', 
        width: wp(80), 
        fontSize: height > 800 ?  32 : 23, 
        marginLeft: wp(2),
        fontFamily: book  
    },
    cameraMainContainer: { 
        flexDirection: 'row', 
        alignSelf: 'flex-end', 
        width: wp(100), 
        marginBottom: hp(2) 
    },
    cameraContainer: { 
        width: wp(20), 
        alignItems: 'center', 
        marginLeft: wp(2.5), 
        height: hp(9), 
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: .9,
        borderColor: 'black' 
    },
    cameraIcon: {
        color: 'rgba(0 , 0 , 0, .7)', 
        fontSize: hp(5),
    },
    img: { 
        width: wp(50), 
        height: hp(40),
        resizeMode: 'cover', 
        margin: 12,
        borderWidth: 1,
        borderRadius: 25,
        overflow: 'hidden' ,
    },
    imgIconContainer: { 
        width: 35,
        height:  35,
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, .15)', 
        borderRadius: 17.5, 
        justifyContent: 'center', 
        alignSelf: 'flex-end', 
        marginRight: wp(6), 
        marginTop: hp(-40) 
    },
    imgIcon: { 
        color: 'white', 
        fontSize: hp(5) 
    },
    modalCardContainer: { 
        width: wp('80%'), 
        height: hp(17.5), 
        justifyContent: 'center', 
        backgroundColor: '#F3F3F3' 
    },
    modalCardItem: { 
        backgroundColor: '#F3F3F3' 
    },
    modalPortfolio: { 
        alignItems: 'center', 
        backgroundColor: '#F3F3F3' 
    },
    modalPortfolioText: { 
        fontSize: hp(3), 
        fontFamily: medium, 
        color: '#595959' 
    },
    modalCardButtonText: { 
        color: 'white', 
        fontSize: hp(3), 
        fontFamily: book, 
        padding: 5, 
        paddingHorizontal: 10 
    },
    modalCardButtonContainer: { 
        marginTop: hp(2.5), 
        borderWidth: 1, 
        backgroundColor: '#A6A6A6', 
        borderColor: '#A6A6A6' 
    },
    modalCardView: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    locationContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        marginVertical: hp(1)
    },
    locationText: { 
        fontFamily: 'medium', 
        fontSize: hp(2.1),
        color:  '#027368'
    },
    locationSubContainer: { 
        marginTop: hp(2), 
        marginLeft: wp(4), 
    }
})

export default PostScreen;