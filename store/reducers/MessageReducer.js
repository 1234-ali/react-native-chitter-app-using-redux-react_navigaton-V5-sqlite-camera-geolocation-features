import {
  POST_USER_MESSAGE, 
  ERROR_USER_MESSAGE,
  GET_USER_MESSAGE
} from '../actions/types';

const initialState = {
  users: [],
  conversations: [],
  loading: true,
  error: '',
  msg: ''
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case POST_USER_MESSAGE: {
      return {
        ...state,
        msg: payload,
        loading: false
      }
    }
    case GET_USER_MESSAGE: {
      return {
        ...state,
        users: payload,
        error: '',
        msg: '',
        loading: false
      }
    }
    case ERROR_USER_MESSAGE: {
      return {
        ...state,
        error: payload,
        msg: ''
      }
    }
    // case "users_online":
    //   const conversations = { ...state.conversations };
    //   const usersOnline = action.data;
    //   for (let i = 0; i < usersOnline.length; i++) {
    //     const userId = usersOnline[i].userId;
    //     if (conversations[userId] === undefined) {
    //       conversations[userId] = {
    //         messages: [],
    //         username: usersOnline[i].username
    //       };
    //     }
    //   }
    //   return { ...state, usersOnline, conversations };
    // case "private_message":
    //   const conversationId = action.data.conversationId;
    //   return {
    //     ...state,
    //     conversations: {
    //       ...state.conversations,
    //       [conversationId]: {
    //         ...state.conversations[conversationId],
    //         messages: [
    //           action.data.message,
    //           ...state.conversations[conversationId].messages
    //         ]
    //       }
    //     }
    //   };
    // case "self_user":
    //   return { ...state, selfUser: action.data };
    default:
      return state;
  }
};