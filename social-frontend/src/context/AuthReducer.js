const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { user: null, isFetching: true, error: false };
    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { user: action.payload, isFetching: false, error: false };
    case "LOGIN_FAILURE":
      return { user: null, isFetching: false, error: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { user: null, isFetching: false, error: false };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (uid) => uid !== action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;
