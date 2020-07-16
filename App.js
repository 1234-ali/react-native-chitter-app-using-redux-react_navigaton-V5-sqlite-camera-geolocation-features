import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'; // it is a middle ware

import { init } from './helpers/db'; // the line is to import init function form db.js to start sqlite storage

const middleware = [thunk];  // This is the middleware connect react native code to redux

// all the app reducer import here from store folder and create store
import UserReducer from './store/reducers/UserReducer';
import DraftReducer from './store/reducers/DraftReducer';
import ChitReducer from './store/reducers/ChitReducer';
import FollowReducer from './store/reducers/FollowReducer';

// we combine all the reducer below
const rootReducer = combineReducers({
  UserReducer,
  DraftReducer,
  ChitReducer,
  FollowReducer,
});

// now we create a store of reducers and applying middleware
const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

import ChitterNavigator from './navigation/ChitterNavigator';

init() //This is starting or inializing the sqlite storage database
  .then(() => {
    console.log('Initialized database');
  })
  .catch(err => {
    console.log('Initializing db failed.');
    console.log(err);
  });

const App = () => {
  return (
    // provider is from react-redux, it provide the store of reducer to the app, thats all the state are used on every screen
    <Provider store={store}>
      {/* ChitterNavigator is from navigation folder it is the main file where all the screen we place. */}
      <ChitterNavigator /> 
    </Provider>
  );
};

export default App;
