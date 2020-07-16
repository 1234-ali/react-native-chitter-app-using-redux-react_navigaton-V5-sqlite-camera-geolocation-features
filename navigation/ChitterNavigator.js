// This is the main file base of the app. it i exported 
// and imported in the app.js file. This file place in app.js return () method

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

const Stack = createStackNavigator();  // from @react-navigation/stack to create stack. please see documentation for more
const Tab = createBottomTabNavigator(); // from @react-navigation/bottom-tabs to create bottom tabs like home screen , search screen , opening drwaer
const Drawer = createDrawerNavigator(); // from @react-navigation/drawer to create drawer navigatior


//  all the screens from the screen folder import here 
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ChitImageScreen from '../screens/ChitImageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import DraftScreen from '../screens/DraftScreen';
import PostScreen from '../screens/PostScreen';
import UpdateDraftScreen from '../screens/UpdateDraftScreen';
import PrivateUserScreen from '../screens/PrivateUserScreen';
import UserScreen from '../screens/UserScreen';


// I make custom darawer navigator to display user image / followers length, following length below is the file
import CustomDrawerContent from '../components/CustomDrawerContent';


function ChitterTab({ navigation }) {
    // This is the bottom tab navigator. please watch any youtube video of 5 mins to now more
    return (
        <Tab.Navigator 
            tabBarOptions={{
                activeTintColor: '#1774FF',
                showLabel: false,
                keyboardHidesTabBar: true,
            }}
        >
            <Tab.Screen 
                name="home" 
                component={HomeScreen}  // imported screen place here
                options={{
                    tabBarIcon: ({ color, size }) => ( // icon of the screen
                        <FontAwesome5 name="home" color={color} size={size} />
                    ),
                }}
            /> 
            <Tab.Screen 
                name="search" 
                component={SearchScreen} // imported screen place here
                options={{
                    tabBarIcon: ({ color, size }) => ( // icon of the screen
                        <Fontisto name="search" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen 
                name="profile" 
                component={ProfileScreen} // imported screen place here. this screen is empty used for to open drawer
                options={{
                    tabBarIcon: ({ color, size }) => ( // icon of the screen
                        <FontAwesome name="user" color={color} size={size} />
                    ),
                    tabBarButton: props => <TouchableOpacity {...props} onPress={() => navigation.toggleDrawer()} /> // on clicking toggleDrawer() function call and drawer open fron right
                }}
            />
        </Tab.Navigator>
    );
};

function MyDrawer() {
    return (
        <Drawer.Navigator 
            drawerContent={props => <CustomDrawerContent {...props} />} // custom drawer navigator file place here 
            drawerType={'slide'} //  i make the drawer to also slide 
            drawerContentOptions={{
                activeTintColor: 'black'
            }}
            drawerPosition='right' // drawer open from right side not left
        >
            {/* options in drawer navigator and in component different screen placed */}
            {/* component={ChitterTab} => chittedTab is the bottom tab navigator you can see above on line 41 others are just screens */}
            <Drawer.Screen name="Dashboard" component={ChitterTab} /> 
            <Drawer.Screen name="Profile" component={UserProfileScreen} />
            <Drawer.Screen name="Drafts" component={DraftScreen} />
            <Drawer.Screen name="About Us" component={ChitterTab} />
        </Drawer.Navigator>
    );
};


const ChitterNavigator = () => {    
    const user = useSelector(state => state.UserReducer); // This is global state use here to check if user is login or not
    // first splash screen opens then screen navigation function calls if user login then state are initialized in userReducer file
    
    return (
        <NavigationContainer>
            {/* stack is the name of stack navigator you can check at the top */}
            <Stack.Navigator initialRouteName="splash" headerMode="none">
                { user.loading ? // when app open. then loding state check,
                //  when api data get from the server succesfully the loading state = false, them check if user is authenticated or not,
                // if authenticated no 3 part display otherwise no 2 part display display
                    <Stack.Screen name="splash" component={SplashScreen} />
                : user.isAuthenticated === null || !user.isAuthenticated ?
                    <>
                    {/* no 2 part is , login or sign up screen*/}
                        <Stack.Screen name="login" component={LoginScreen} />
                        <Stack.Screen name="signup" component={SignUpScreen}  />
                    </>
                :
                    <>
                    {/* no 3 part is all the other screen */}
                        <Stack.Screen name="drawer" component={MyDrawer} />
                        <Stack.Screen name="post" component={PostScreen} />
                        <Stack.Screen name="updateDraft" component={UpdateDraftScreen} />
                        <Stack.Screen name="privateUser" component={PrivateUserScreen} />
                        <Stack.Screen name="user" component={UserScreen} options={{ ...TransitionPresets.SlideFromRightIOS, gestureDirection: 'horizontal' }} />
                        <Stack.Screen name="chitImage" component={ChitImageScreen} options={{ ...TransitionPresets.SlideFromRightIOS, gestureDirection: 'horizontal' }} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
};

//  now chitternavigator is eported from here and imported in app.js file.
export default ChitterNavigator; 