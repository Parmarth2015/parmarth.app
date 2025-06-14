import { memo, useContext, useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

import AppNavigator from "./AppNavigator";
import AttendanceScreen from "../screens/AttendanceScreen";
import StudyUploadScreen from "../screens/StudyUploadScreen";
import EventUploadScreen from "../screens/EventUploadScreen";
import MentorScreen from "../screens/MentorScreen";
import TotalAttendanceScreen from "../screens/TotalAttendanceScreen";
import AuthContext from "../store/AuthContext";
import backendUrl from "../../backendUrl";
import LiveUpdateScreen from "../screens/LiveUpdateScreen";

const MemoizedTabs = memo(AppNavigator);
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const authCtx = useContext(AuthContext);
  const drawerStatus = useDrawerStatus();
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset states when drawer closes or auth state changes
  useEffect(() => {
    if (drawerStatus === 'closed' && !authCtx.isLoggedIn) {
      setShowPasswordLogin(false);
      setShowOtpLogin(false);
      setOtpSent(false);
      setOtp("");
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [drawerStatus, authCtx.isLoggedIn]);

  // Reset states when auth state changes
  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      setShowPasswordLogin(false);
      setShowOtpLogin(false);
      setOtpSent(false);
      setOtp("");
      setName("");
      setEmail("");
      setPassword("");
      props.navigation.closeDrawer();
      props.navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [authCtx.isLoggedIn]);

  const isEmailValid = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const isPasswordValid = (password) => password.length >= 8;

  const handleSendOtp = async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Please enter your name." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true);
      Toast.show({ type: "success", text1: "OTP sent to your email." });
    } catch (error) {
      Toast.show({ type: "error", text1: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Toast.show({ type: "error", text1: "Please enter the OTP." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/login/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");

      // Set expiration time to 1 minute from now for OTP login
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 1);

      authCtx.login(
        data.token,
        expirationTime.toISOString(),
        data.userId,
        "otp"
      );
      Toast.show({ type: "success", text1: "Logged in successfully!" });
      setShowOtpLogin(false);
      setOtpSent(false);
      setOtp("");
      setName("");
    } catch (error) {
      Toast.show({ type: "error", text1: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const loginHandler = async (method) => {
    setIsLoading(true);

    if (method === "password") {
      if (!isEmailValid(email)) {
        Toast.show({ type: "error", text1: "Enter a valid email" });
        setIsLoading(false);
        return;
      }

      if (!isPasswordValid(password)) {
        Toast.show({
          type: "error",
          text1: "Password must be at least 8 characters",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email, password }),

      });

      const resData = await response.json();

      if (resData.error) {
        Toast.show({ type: "error", text1: resData.error });
      } else if (resData.token) {
        const expirationTime = new Date();
        if (method === "password") {
          expirationTime.setMinutes(expirationTime.getMinutes() + 5); // 5 minutes for password login
        } else {
          expirationTime.setMinutes(expirationTime.getMinutes() + 1); // 1 minute for OTP
        }

        authCtx.login(
          resData.token,
          expirationTime.toISOString(),
          resData.userId,
          method
        );
        Toast.show({ type: "success", text1: "Successfully logged in" });
        setShowPasswordLogin(false);
        setName("");
        setPassword("");
      } else if (
        resData.message === "Successfully sent 2FA code to email" &&
        resData.userId
      ) {
        Toast.show({ type: "success", text1: resData.message });
        authCtx.setPending2FAUser(resData.userId);
      }
    } catch (err) {
      Toast.show({ type: "error", text1: err.message });
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    authCtx.logout();
  };

  const renderLoginForm = () => {
    if (showPasswordLogin) {
      return (
        <>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter your password"
              style={[styles.input, { paddingRight: 40 }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => loginHandler("password")}
            style={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : (
              <Text style={styles.authButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowPasswordLogin(false);
              setEmail("");
              setPassword("");
            }}
            style={[styles.authButton, { marginTop: 10 }]}
          >
            <Text style={styles.authButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (showOtpLogin) {
      return (
        <>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          {otpSent ? (
            <>
              <TextInput
                placeholder="Enter OTP"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={handleVerifyOtp}
                style={styles.authButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#000" />
                  </View>
                ) : (
                  <Text style={styles.authButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleSendOtp}
              style={styles.authButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) : (
                <Text style={styles.authButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setShowOtpLogin(false);
              setOtpSent(false);
              setOtp("");
              setName("");
            }}
            style={[styles.authButton, { marginTop: 10 }]}
          >
            <Text style={styles.authButtonText}>Back</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => setShowOtpLogin(true)}
          style={styles.authButton}
        >
          <Ionicons
            name="key-outline"
            size={20}
            color="#000"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.authButtonText}>Login using OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowPasswordLogin(true)}
          style={[styles.authButton, { marginTop: 15 }]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#000"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.authButtonText}>Login using Password</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <BlurView intensity={60} style={styles.blurBackground}>
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/logo.jpg")}
            style={styles.profilePic}
          />
          <Text style={styles.username}>PARMARTH IET Lucknow</Text>
          {authCtx.isLoggedIn && authCtx.loginMethod && (
            <Text style={styles.loginMethod}>
              {authCtx.loginMethod.charAt(0).toUpperCase() +
                authCtx.loginMethod.slice(1)}{" "}
              Login
            </Text>
          )}
        </View>

        {authCtx.isLoggedIn ? (
          <>
            <DrawerItemList {...props} />
            <View style={styles.authButtonContainer}>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.authButton}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#000"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.authButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.centeredLoginContainer}>{renderLoginForm()}</View>
        )}
      </BlurView>
    </DrawerContentScrollView>
  );
};

export default function DrawerNavigator() {
  const progress = useSharedValue(0);
  const authCtx = useContext(AuthContext);

  const animatedScreenStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 0.88]) },
      { translateX: interpolate(progress.value, [0, 1], [0, 50]) },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [0, 20]),
    overflow: "hidden",
    flex: 1,
  }));

  return (
    <Drawer.Navigator
      key={authCtx.isLoggedIn ? 'logged-in' : 'logged-out'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: "slide",
        overlayColor: "transparent",
        drawerStyle: styles.drawerStyle,
        sceneContainerStyle: { backgroundColor: "transparent" },
        headerShown: false,
        drawerPosition: "left",
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <Image
              source={require('../../assets/logo.jpg')}
              style={{
                width: 50,
                height: 50,
                marginRight: 10,
                borderWidth: 0.8,
                borderRadius: 18,
              }}
              resizeMode="contain"
            />
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Main">
        {(props) => (
          <Animated.View style={animatedScreenStyle}>
            <MemoizedTabs {...props} />
          </Animated.View>
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Mark Volunteers Attendance"
        component={AttendanceScreen}
        options={{
          headerShown: true,
          drawerItemStyle: {
            display:
              authCtx.loginMethod === "password" ||
              authCtx.loginMethod === "otp"
                ? "flex"
                : "none",
          },
        }}
      />
      <Drawer.Screen
        name="Mark Mentors Attendance"
        component={MentorScreen}
        options={{
          headerShown: true,
          drawerItemStyle: {
            display:
              authCtx.loginMethod === "password" ||
              authCtx.loginMethod === "otp"
                ? "flex"
                : "none",
          },
        }}
      />
      <Drawer.Screen
        name="Upload Study Materials"
        component={StudyUploadScreen}
        options={{
          headerShown: true,
          drawerItemStyle: {
            display:
              authCtx.loginMethod === "password" ||
              authCtx.loginMethod === "otp"
                ? "flex"
                : "none",
          },
        }}
      />
      <Drawer.Screen
        name="Upload Events Photos"
        component={EventUploadScreen}
        options={{
          headerShown: true,
          drawerItemStyle: {
            display:
              authCtx.loginMethod === "password" ||
              authCtx.loginMethod === "otp"
                ? "flex"
                : "none",
          },
        }}
      />
      <Drawer.Screen
        name="Days of Service"
        component={TotalAttendanceScreen}
        options={{ 
          headerShown: true,
          drawerItemStyle: { display: (authCtx.loginMethod === "password") ? "flex" : "none" }
        }}
      />
      <Drawer.Screen
        name="Add Live Updates"
        component={LiveUpdateScreen}
        options={{
          headerShown: true,
          drawerItemStyle: {
            display:
              authCtx.loginMethod === "password"
                ? "flex"
                : "none",
          },
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  blurBackground: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  drawerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: 270,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: -2, height: 2 },
    shadowRadius: 6,
    elevation: 8,
  },
  authButtonContainer: {
    marginTop: "auto",
    paddingVertical: 25,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    minHeight: 45,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  centeredLoginContainer: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  loginMethod: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    minWidth: 200,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    backgroundColor: "#4CAF50",
  },
  errorToast: {
    backgroundColor: "#F44336",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
    zIndex: 1,
  },
});
