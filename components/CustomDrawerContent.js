import React, { useState } from 'react';
import { View, Text, Image, StatusBar, StyleSheet, Dimensions, Share, Alert } from 'react-native';
import { Container, Content, Header, Body } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';

let width =  Dimensions.get('window').width;

const medium = 'AirbnbCerealMedium';

const CustomDrawerContent = (props) => {
    const token = useSelector(state => state.UserReducer.user);

    const dispatch = useDispatch();

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

    return (
        <DrawerContentScrollView>
            <Container>
                <Header style={styles.header}>
                    <StatusBar backgroundColor='white' barStyle='dark-content' />
                    <Body style={styles.body}>
                        <View style={styles.imgContainer}>
                            <Image source={require('../assets/images/person_image.jpg')} style={styles.img} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>
                                {token != null && token.given_name} {token != null && token.family_name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 250 }}>
                            <View style={styles.followerContainer}>
                                <Text style={{ ...styles.followerText, marginRight: 4 }}>
                                    0
                                </Text>
                                <Text style={styles.followerText}>
                                    Followers
                                </Text>
                            </View>
                            <View style={styles.followerContainer}>
                                <Text style={{ ...styles.followerText, marginRight: 4 }}>
                                    0
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
        borderColor: 'blue' 
    },
    img: { 
        width: null, 
        flex: 1, 
        height: null 
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