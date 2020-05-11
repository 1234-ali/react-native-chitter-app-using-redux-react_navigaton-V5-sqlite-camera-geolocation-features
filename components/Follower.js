import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Animated, FlatList, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Input, Item, Button, Icon, Header, Left, Title, Tab, Tabs, TabHeading, Right, Card, CardItem, Body } from 'native-base';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as ChitActions from '../store/actions/ChitActions';

const medium = 'AirbnbCerealMedium';
const book = 'AirbnbCerealBook';

const Chitter = () => {
    return (
        <View style={styles.container}>
            <Text>
                fa;m;l
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default Chitter;