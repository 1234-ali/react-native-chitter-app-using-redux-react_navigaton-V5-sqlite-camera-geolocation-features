import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { init } from './helpers/db';

const middleware = [thunk];

import UserReducer from './store/reducers/UserReducer';
import DraftReducer from './store/reducers/DraftReducer';
import ChitReducer from './store/reducers/ChitReducer';
// import OrderReducer from './store/reducers/OrderReducer';
// import ReviewReducer from './store/reducers/ReviewReducer';

const rootReducer = combineReducers({
  UserReducer,
  DraftReducer,
  ChitReducer
  // PortfolioReducer,
  // MessageReducer,
  // OrderReducer,
  // ReviewReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

import ChitterNavigator from './navigation/ChitterNavigator';

init()
  .then(() => {
    console.log('Initialized database');
  })
  .catch(err => {
    console.log('Initializing db failed.');
    console.log(err);
  });

const App = () => {
  return (
    <Provider store={store}>
      <ChitterNavigator />
    </Provider>
  );
};

export default App;
