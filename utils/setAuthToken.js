import axios from 'axios';  // used for api call

const setAuthToken = token => {
  if (token) { // if there is token then toen send to the server from header
    axios.defaults.headers.common['X-Authorization'] = token;

  } else {  // other wise delete default token from header
    delete axios.defaults.headers.common['X-Authorization'];
  }
};

export default setAuthToken;