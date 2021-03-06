require("node-libs-react-native/globals");
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FriendScreen from "./component/Friends/FriendScreen.js";
import HomeScreen from "./component/HomeScreen.js";
import SettingScreen from "./component/SettingScreen.js";
import AddBilScreen from "./component/AddBilScreen.js";
import { useEffect } from "react";
import LoginTabs from "./component/Login/LoginScreen.js";
import AsyncStorage from "@react-native-community/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LoginHome,
  Reset,
  LoadingSc,
  SignUp,
} from "./component/Login/Screen.js";
import AuthaContext from "./component/Login/Context.js";
import { type } from "os";
const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ----------------------------------------------------
// Note:
// By default the Login Id and Password is "admin" , "debug"
// ----------------------------------------------------

export default function App() {
  const [logged, setLogged] = React.useState(0);
  
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // the temp local URL for connecting to the DataBase
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  var loginURL = "http://10.0.2.2:3000/users/";
  var tempt_URL = "http://10.0.2.2:3000/";

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // this function consists of two parts
  // 1. the const address where it fetch contents of specified URL
  // 2. the function calling for updating the const address
  // this is used for checking login details 
  // in order to update the application's login status
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  function updateLoginState(URL) {
    const address = fetch(URL)
      .then((response) => response.json())
      .then((user) => {
        setLogged(parseInt(user.a));
        return user.a;
      });

    const printAddress = () => {
      address.then((a) => {
      });
    };
    printAddress();
  }
  
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // this function is called by the resigter operation
  // with given ID and PW the login URL will be generated
  // the application will attempt to connect via this URL
  // to extract info in the DB
  // this part is also related to backend routing
  // see userRoute.js for more details
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  function triggerSignUp(UN,PW) {
    const t_url = loginURL + "reg/"+UN + "/" + PW;
    const address = fetch(t_url)
      .then((response) => response.json())
      .then((user) => {
        return user.a;
      });

    const printAddress = () => {
      address.then((a) => {
      });
    };
    printAddress();
  }
  
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // in the first run of the application, we initialize
  // the login status to false and entered userName and userToken to null
  // userToken is the identifier for the application to know 
  // which user is the current one
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const initialLogin = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // this is the manager function for login operations
  // switching 4 cases: 
  // First: first time opening the application
  // Login: when users try to login with ID and PW
  // Logout: user operation asking the application to logout
  // Register: users try to sign up with ID and PW
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const loginManager = (prevState, action) => {
    switch (action.type) {
      case "FIRST":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false, 
        };
    }
  };
  
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // function for setting Login/Logout status
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  function setLogOut() {
    setLogged(0);
  }
  
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // const terms for telling the application to use loginManger as the login handling function
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const [loginState, dispatch] = React.useReducer(loginManager, initialLogin);
  
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // the authContext is the authorization part for the application, mainly handling login authorization
  // consists of signIn(), signOut(), signUp(), resetPW()
  // these are contained inside the React.memorization so they can be passed to different .js file
  // signIn: calling updateLoginState() -> return true -> set userToken; else -> alert users
  // signOut: calling setLogOut() -> set loginState -> false
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const authContext = React.useMemo(
    () => ({
      signIn: async (userName, password) => {
        let userToken;
        let passed;
        userToken = null;
        if (userName == "admin" && password == "debug") passed = true;
        tempt_URL = loginURL + userName + "/" + password;
        updateLoginState(tempt_URL);
        if (passed || logged) {
          userToken = userName;
          try {
            await AsyncStorage.setItem("userToken", userToken);
          } catch (e) {
            console.log(e);
          }
        } else {
          alert("Incorrect login ID/password");
        }
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },

      signOut: async () => {
        setLogOut();
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      
      
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      // This function will be called at register,
      // it returns username and password demanded by the user
      // insert these two value with proper schema/relation into correct table in the DB
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      signUp: (userName, password) => {
        alert("Closed beta period, your sign up will be handled soon.");
        let userToken;
        userToken = null;
        // triggerSignUp(userName,password);
        dispatch({ type: "REGISTER", id: userName, token: userToken });
      },
      resetPW: () => {
        alert(
          "You case will be handled in quick. Please await for our response."
        );
      },
    }),
    []
  );

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // This userEffect will try to login automatically
  // with previous saved data after opening the app for 1 seconds
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "REGISTER", token: userToken });
    }, 0);
  }, []);

  {
    return (
      // Note:
      // AuthaContext for checking loggin
      // else it directs to login screen

      <AuthaContext.Provider value={authContext}>
        <NavigationContainer independent={true}>
          {loginState.userToken != null ? (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === "Home") {
                    iconName = focused ? "md-home" : "ios-home";
                  } else if (route.name === "Setting") {
                    iconName = focused ? "ios-settings" : "ios-settings";
                  } else if (route.name === "Add Bil") {
                    iconName = focused ? "ios-add-circle" : "ios-add-circle";
                  } else if (route.name === "Friend") {
                    iconName = focused ? "people" : "people";
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: "#e91e63",
                labelStyle: {
                  fontSize: 12,
                },
              }}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Friend" component={FriendScreen} />
              <Tab.Screen name="Add Bil" component={AddBilScreen} />
              <Tab.Screen name="Setting" component={SettingScreen} />
            </Tab.Navigator>
          ) : (
            // Note:
            // This part below is the login screen
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
            // if the useEffect doesn't pass -> previous saved data fails the login -> old/invalid/wrong
            // asking users to input ID and PW again, also showing other functions like signUp/forgot PW
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
            <AuthStack.Navigator initialRouteName="Login">
              <AuthStack.Screen name="Login" component={LoginHome} />
              <AuthStack.Screen name="Reset" component={Reset} />
              <AuthStack.Screen name="SignUp" component={SignUp} />
            </AuthStack.Navigator>
          )}
        </NavigationContainer>
      </AuthaContext.Provider>
    );
  }
}
