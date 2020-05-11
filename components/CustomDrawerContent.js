import React, { useState } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, Dimensions, Share, Alert, TouchableOpacity, ImageBackground, ActivityIndicator  } from 'react-native';
import { Container, Content, Header, Body } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import ImagePicker from 'react-native-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';
import Feather from 'react-native-vector-icons/Feather';

let width =  Dimensions.get('window').width;

const medium = 'AirbnbCerealMedium';

const CustomDrawerContent = (props) => {
    const token = useSelector(state => state.UserReducer.user);
    const follower = useSelector(state => state.FollowReducer.followers);
    const following = useSelector(state => state.FollowReducer.followings);

    const [isImage, setIsImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [image, setImage] = useState('');

    const dispatch = useDispatch();

    const uploadImage = async () => {
        setIsUploading(true);
        try {
            await dispatch(UserActions.uploadImage(image));
        } catch (error) {
            Alert.alert(error.message);
        }
        setIsUploading(false);
    };

    const logout = async () => {
        try {
            await dispatch(UserActions.logout());
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              'Download the chitter app from google play store',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };

    const pickImage = () => {
        const options = {
            title: 'Chitter App',
            takePhotoButtonTitle: 'Take photo from camera',
            chooseFromLibraryButtonTitle: 'Choose photo from library',
            mediaType: 'photo'
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                
            } else if (response.error) {
              
            } else if (response.customButton) {
              
            } else {
                const source = { uri: response.uri };

                setIsImage(source.uri);

                setImage(response);
            }
        });
    };

    return (
        <DrawerContentScrollView>
            <Container>
                <Header style={styles.header}>
                    <StatusBar backgroundColor='white' barStyle='dark-content' />
                    <Body style={styles.body}>
                        { token != null && token.hasOwnProperty('user_profile_photo_path') ?
                                <View style={styles.uploadImgContainer}>
                                    <Image source={{ uri: `${token.user_profile_photo_path}` }}  style={styles.img} />
                                </View>
                            : isImage == null ?
                                <TouchableOpacity onPress={pickImage} style={{ ...styles.imgContainer, borderColor: '#D9D9D9' }}>
                                        <View style={styles.uploadImg}>
                                            <Feather name='camera' size={60} color='#027368' />
                                        </View> 
                                </TouchableOpacity>
                            :
                                <TouchableOpacity onPress={uploadImage} style={{ ...styles.uploadImgContainer, borderColor: '#D9D9D9' }}>
                                    <ImageBackground  source={{ uri: `${isImage}` }} style={styles.img}>
                                        <View style={styles.uploadImg}>
                                            { isUploading ?
                                                <ActivityIndicator color='red' size={30} />
                                            :
                                                <Text style={{...styles.uploadText, backgroundColor: '#A6ABAB', padding: 3, width: 100, elevation: 5, alignSelf: 'center' }}>
                                                    Upload
                                                </Text> 
                                            }    
                                        </View> 
                                    </ImageBackground>
                                </TouchableOpacity>
                        }
                        
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {token != null && token.given_name} {token != null && token.family_name}
                            </Text>
                        </View>
                        <View style={styles.followContainer}>
                            <View style={styles.followerContainer}>
                                <Text style={{ ...styles.followerText, marginRight: 4 }}>
                                    { follower.length }
                                </Text>
                                <Text style={styles.followerText}>
                                    Followers
                                </Text>
                            </View>
                            <View style={styles.followerContainer}>
                                <Text style={{ ...styles.followerText, marginRight: 4 }}>
                                    { following.length }
                                </Text>
                                <Text style={styles.followerText}>
                                    Following
                                </Text>
                            </View>
                        </View>
                    </Body>
                </Header>
                <Content>
                        <DrawerItemList {...props} />
                        <DrawerItem
                            label="Invite Friends"
                            onPress={onShare}
                            activeTintColor='black'
                        />
                </Content>
                <DrawerItem
                    label="Log out"
                    onPress={logout}
                    activeTintColor='black'
                />
            </Container>
        </DrawerContentScrollView>
        
    );
};

const styles = StyleSheet.create({
    header: { 
        height: hp('40%'), 
        backgroundColor: 'white',
    },
    body: { 
        alignItems: 'center'
    },
    imgContainer: { 
        width: 170,
        height: 170,
        borderRadius: 85, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'blue',
        alignItems: 'center',
        backgroundColor: 'rgba(0 ,0, 0, .1)'  
    },
    uploadImgContainer: {
        width: 170,
        height: 170,
        borderRadius: 85, 
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'blue',
        backgroundColor: 'rgba(0 ,0, 0, .1)'  
    },
    followContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-evenly',
        width: 250 
    },
    img: { 
        width: null, 
        flex: 1, 
        height: null 
    },
    uploadImg: { 
        flex: 1, 
        justifyContent: 'center',
    },
    uploadText: { 
        color:'#F2F2F2', 
        textAlign: 'center',  
        fontSize: 23, 
        fontFamily: medium,
    },
    textContainer: { 
        marginTop: 7
    },
    text: { 
        fontSize: hp(3.6), 
        fontFamily: medium 
    },
    followerContainer: {
        flexDirection: 'row',
        marginTop: 8
    },
    followerText: {
        fontSize: hp(2.1), 
        fontFamily: medium 
    }
});

export default CustomDrawerContent;