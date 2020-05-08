import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Icon, Header, Left, Title, Tab, Tabs, TabHeading, Right, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import * as UserActions from '../store/actions/UserActions';
import Autocomplete  from 'react-native-autocomplete-input';


const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const SearchScreen = () => {
    const [changeView, setChangeView] = useState(false);

    return (
        <View style={styles.container}>
           <Header style={styles.headerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                { !changeView ?   
                    <View style={styles.flexDirection}>
                        <View>
                            <Image source={require('../assets/images/person_image.jpg')} style={styles.imgFront} />
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
                        <TouchableOpacity onPress={() => setChangeView(false)} style={{ marginRight: 10 }}> 
                            <Icon name='arrow-back' style={styles.backIcon} />
                        </TouchableOpacity>
                        <View style={{ ...styles.flexDirection, width: wp(85) }}>
                            <Input 
                                autoCorrect={false}
                                autoFocus
                                style={styles.liveSearchInput}
                            />
                            <TouchableOpacity style={{...styles.brushContainer, marginTop: hp(0) }}>
                                <Ionicons name='ios-close' style={styles.brushText} />
                            </TouchableOpacity>
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
                                        <Card style={styles.secondViewCard}>
                                            <CardItem>
                                                <Body>
                                                    <View style={styles.innerView}>
                                                        <Image source={require('../assets/images/person_image.jpg')} style={styles.userImgFront} />
                                                        <View style={styles.innerViewSecond}>
                                                            <Text style={styles.innerViewText}>
                                                                {'Ali Hassan6879'.substring(0, 10)}
                                                            </Text>
                                                            <Text style={styles.innerViewTag}>
                                                                @Alih12
                                                            </Text>
                                                        </View>
                                                        <TouchableOpacity style={styles.followContainer}>
                                                            <Text style={styles.followText}>
                                                                Follow
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Text style={styles.paragraph}>
                                                        Lorem sunt dolore minim Lorem occaecat voluptate nisi esse e Lorem sunt dolore minim Lorem occaecat voluptate nisi esse enim cillum aute aliqua.
                                                    </Text>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </View>
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </View>
            :
                <View style={{...styles.container, backgroundColor: '#F0F0F0' }}>
                    <View style={{marginTop: hp(5) }}>
                        <Card style={{ width: wp(98), alignSelf: 'center', elevation: 5}}>
                            <CardItem>
                                <Body>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require('../assets/images/person_image.jpg')} style={styles.userSearchImgFront} />
                                        <View style={{ marginLeft: hp(1) }}>
                                            <Text style={{...styles.innerViewText, marginTop: hp(-.2) }}>
                                                {'Ali Hassan6879'.substring(0, 10)}
                                            </Text>
                                            <Text style={{...styles.innerViewTag,fontSize: 16, marginTop: hp(-.01), color: 'rgba(0 , 0, 0, .8)' }}>
                                                @Alih12
                                            </Text>
                                        </View>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
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
        fontSize: hp(3.2), 
        fontFamily: medium 
    },
    userImgFront: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: 'rgba(0, 0, 0, .4)',
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
        fontSize: hp(2.7), 
        marginTop: hp(.6) 
    },
    followContainer: { 
        backgroundColor: '#00acee',
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 15,
        height: 35,
        borderRadius: 5,
        marginLeft: wp(12),
        marginTop: hp(-.2),
    },
    followText: { 
        color: 'white', 
        fontSize: hp(3), 
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
        borderColor: 'rgba(0, 0, 0, .4)',
        borderWidth: wp(.5),
        marginLeft: wp(2)
    }
})

export default SearchScreen;