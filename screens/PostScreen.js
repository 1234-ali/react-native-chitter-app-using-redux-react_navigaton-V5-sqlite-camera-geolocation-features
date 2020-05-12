import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import * as DraftActions from '../store/actions/DraftActions';
import * as ChitActions from '../store/actions/ChitActions';

const { height } = Dimensions.get('window');

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const PostScreen = ({ navigation, route }) => {
    const user = useSelector(state => state.UserReducer.user);

    const { userImg } = route.params;

    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const [isPosting, setIsPosting] = useState(false);

    const [isDrafting, setIsDrafting] = useState(false);
    const [isCreated, setIsCreated] = useState(false);
    const [isError, setIsError] = useState(false);

    const launchCamera = ()  => {
        let options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
        };
        
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
            
                setImage(source.uri);
            }
        });
    };

    const launchImageLibrary = () => {
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

                setImage(source.uri);
            }
        });
    
    }

    const getLocationHandler =  () => {
        setFetchingLocation(true);
        Geolocation.getCurrentPosition(
            position => {
              setLng(position.coords.longitude);
              setLat(position.coords.latitude);
            },
            error => {
                Alert.alert('Error', error.message);
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        );
        setFetchingLocation(false);
    };

    const dispatch = useDispatch();

    const postSubmission = async () => {
        setIsPosting(true);
        try {
            await dispatch(ChitActions.postChits(title, lng, lat));
            setIsCreated(true);
        } catch (error) {
            setIsError(true);
        }
    };

    const draftSubmission = async () => {
        setIsDrafting(true);
        try {
            await dispatch(DraftActions.addDraft(user != null && (user.user_id).toString(), title, image, new Date().toString()));
            setIsCreated(true);
        } catch (error) {
            setIsError(true);
        }
    };

    const onError = () => {
        setIsError(false);
        setIsCreated(false);
        setIsDrafting(false);
        setIsPosting(false);
    };

    const onNavigate = () => {
        navigation.navigate('home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.firstContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.brushContainer}>
                    <Ionicons name='ios-close' style={styles.brushText} />
                </TouchableOpacity>
                <View style={styles.flexDirection}>
                <TouchableOpacity onPress={postSubmission} style={{ ...styles.PostContainer }}>
                    <Text style={styles.postText}>
                        Post
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={draftSubmission} style={styles.PostContainer}>
                    <Text style={styles.postText}>
                        Save Draft
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.secondContainer}>
                <View style={styles.flexDirection}>
                    <Image source={{ uri: `${userImg}` }} style={styles.imgFront} />
                    <TextInput 
                        multiline={true}
                        autoCorrect={false}
                        autoFocus
                        placeholder="What's happening?"
                        style={styles.input}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                </View>
                <View style={styles.subContainer}>
                    <View style={styles.locationSubContainer}>
                        { lat != '' &&  lng != '' &&
                            <>
                                <View style={styles.locationContainer}>
                                    <Text style={styles.locationText}>
                                        Latitude: 
                                    </Text>
                                    <Text style={{...styles.locationText, marginLeft: wp(1)}}>
                                        {lat.toFixed(3)} 
                                    </Text>
                                </View>
                                <View style={styles.locationContainer}>
                                    <Text style={styles.locationText}>
                                        Longitude: 
                                    </Text>
                                    <Text style={{...styles.locationText, marginLeft: wp(1)}}>
                                        {lng.toFixed(2)}
                                    </Text>
                                </View>
                            </>
                        }
                    </View>

                    { image != '' &&
                        <View >
                            <Image source={{ uri: `${image}` }} style={styles.img} />
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
            <Modal isVisible={isPosting} hasBackdrop={true} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionOutTiming={0}>
                    <View style={styles.modalCardView}>
                        { !isCreated ? 
                            <ActivityIndicator size='large' color='white' />
                        :
                            <Card style={styles.modalCardContainer}>
                                <CardItem style={styles.modalCardItem}>
                                    <Body style={styles.modalPortfolio}>
                                        <Text style={styles.modalPortfolioText}>
                                            {isError ? 'An Error Occured' : 'Chit Post'}
                                        </Text>
                                        <TouchableOpacity 
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
            <Modal isVisible={isDrafting} hasBackdrop={true} animationIn="fadeIn" animationOut="fadeOut" backdropTransitionOutTiming={0}>
                    <View style={styles.modalCardView}>
                        { !isCreated ? 
                            <ActivityIndicator size='large' color='white' />
                        :
                            <Card style={styles.modalCardContainer}>
                                <CardItem style={styles.modalCardItem}>
                                    <Body style={styles.modalPortfolio}>
                                        <Text style={styles.modalPortfolioText}>
                                            {isError ? 'An Error Occured' : 'Draft Saved'}
                                        </Text>
                                        <TouchableOpacity 
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
        </View>
    );
}

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