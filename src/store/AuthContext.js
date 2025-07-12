import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

let logoutTimer;
let navigationRef;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  loginMethod: "",
  login: (token, loginMethod) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = async () => {
  const storedToken = await AsyncStorage.getItem("token");
  const storedExpirationDate = await AsyncStorage.getItem("expirationTime");
  const storedLoginMethod = await AsyncStorage.getItem("loginMethod");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 0) {
    await AsyncStorage.multiRemove(["token", "expirationTime", "loginMethod", "userId"]);
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    loginMethod: storedLoginMethod,
  };
};

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [loginMethod, setLoginMethod] = useState("");
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(async () => {
    setToken(null);
    setLoginMethod("");
    await AsyncStorage.multiRemove(["token", "expirationTime", "loginMethod", "userId"]);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    // Force navigation to Home screen
    if (navigationRef) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              state: {
                routes: [
                  {
                    name: 'Home',
                    params: { timestamp: Date.now() }
                  }
                ]
              }
            }
          ]
        })
      );

      // Show toast after navigation
      setTimeout(() => {
        Toast.show({
          type: "error",
          text1: "You are logged out, Thank you",
          position: "top",
          visibilityTime: 3000,
        });
      }, 1000);
    }
  }, []);

  const loginHandler = async (token, expirationTime, userId, loginMethod) => {
    if (!["password", "otp"].includes(loginMethod)) {
      throw new Error("Invalid login method");
    }
    
    setToken(token);
    setLoginMethod(loginMethod);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("expirationTime", expirationTime);
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem("loginMethod", loginMethod);

    if (loginMethod === "otp") {
      // Only set logout timer for OTP login
      const remainingTime = calculateRemainingTime(expirationTime);
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      // For password login, do not set logout timer
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    }
  };

  // Add session check interval
  useEffect(() => {
    const checkSession = async () => {
      const tokenData = await retrieveStoredToken();
      if (!tokenData) {
        logoutHandler();
      }
    };

    // Only check session for OTP login
    if (loginMethod === "otp") {
      const sessionCheckInterval = setInterval(checkSession, 45 * 60 * 1000);
      return () => {
        clearInterval(sessionCheckInterval);
      };
    }
  }, [logoutHandler, loginMethod]);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenData = await retrieveStoredToken();

      if (tokenData) {
        setToken(tokenData.token);
        setLoginMethod(tokenData.loginMethod);
        if (tokenData.loginMethod === "otp") {
          if (logoutTimer) {
            clearTimeout(logoutTimer);
          }
          logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        } else {
          if (logoutTimer) {
            clearTimeout(logoutTimer);
          }
        }
      }
    };

    fetchToken();
  }, [logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    loginMethod: loginMethod,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
