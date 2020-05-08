import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import DraftScreen from '../screens/DraftScreen';
import PostScreen from '../screens/PostScreen';

import CustomDrawerContent from '../components/CustomDrawerContent';

function ChitterTab({ navigation }) {
    return (
        <Tab.Navigator 
            tabBarOptions={{
                activeTintColor: '#1774FF',
                showLabel: false,
                keyboardHidesTabBar: true
            }}
        >
            <Tab.Screen 
                name="home" 
                component={HomeScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="home" color={color} size={size} />
                    ),
                }}
            /> 
            <Tab.Screen 
                name="search" 
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Fontisto name="search" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="feed" 
                component={FeedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="feed" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="profile" 
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" color={color} size={size} />
                    ),
                    tabBarButton: props => <TouchableOpacity {...props} onPress={() => navigation.toggleDrawer()} />
                }}
            />
        </Tab.Navigator>
    );
};

function MyDrawer() {
    return (
        <Drawer.Navigator 
            drawerContent={props => <CustomDrawerContent {...props} />} 
            drawerType={'slide'}
            drawerContentOptions={{
                activeTintColor: 'black'
            }}
            drawerPosition='right'
        >
            <Drawer.Screen name="Dashboard" component={ChitterTab} />
            <Drawer.Screen name="Profile" component={UserProfileScreen} />
            <Drawer.Screen name="Drafts" component={DraftScreen} />
            <Drawer.Screen name="About Us" component={ChitterTab} />
        </Drawer.Navigator>
    );
};


const ChitterNavigator = () => {    
    const token = useSelector(state => state.UserReducer);
    
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="splash" headerMode="none">
                { token.loading ? 
                    <Stack.Screen name="splash" component={SplashScreen} />
                : token.isAuthenticated === null || !token.isAuthenticated ?
                    <>
                        <Stack.Screen name="login" component={LoginScreen} />
                        <Stack.Screen name="signup" component={SignUpScreen}  />
                        <Stack.Screen name="forgetPassword" component={ForgetPasswordScreen} />
                    </>
                :
                    <>
                        <Stack.Screen name="drawer" component={MyDrawer} />
                        <Stack.Screen name="post" component={PostScreen} />
                    </>
                }
                
                
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default ChitterNavigator;