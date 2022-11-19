const redux = require("redux");
const reduxThunk = require("redux-thunk").default;
const axios = require("axios");
const reduxLogger = require("redux-logger");

const createStore = redux.legacy_createStore;
const applyMiddleware = redux.applyMiddleware;
const logger = reduxLogger.createLogger();

const initialState = {
  isLoading: false,
  data: [],
  error: "",
};

const FETCH_USERS_REQUESTED = "FETCH_USERS_REQUESTED";
const FETCH_USERS_SUCCEEDED = "FETCH_USERS_SUCCEEDED";
const FETCH_USERS_FAILED = "FETCH_USERS_FAILED";

const fetchUserRequest = () => {
  return {
    type: FETCH_USERS_REQUESTED,
  };
};

const fetchUserSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCEEDED,
    payload: users,
  };
};

const fetchUserFailure = (users) => {
  return {
    type: FETCH_USERS_FAILED,
    payload: users,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUESTED:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_USERS_SUCCEEDED:
      return {
        isLoading: false,
        data: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILED:
      return {
        isLoading: false,
        data: [],
        error: action.payload,
      };
  }
};

const getUsers = () => {
  return (dispatch) => {
    fetchUserRequest();
    axios
      .get("http://jsonplaceholder.typicode.com/users")
      .then((res) => dispatch(fetchUserSuccess(res.data)))
      .catch((err) => dispatch(fetchUserFailure("error found")));
  };
};

const store = createStore(reducer, applyMiddleware(reduxThunk, logger));

store.subscribe(() => {});
store.dispatch(getUsers());
