import { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Image, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import StudyMaterialScreen from '../screens/StudyMaterialScreen';
import MaterialDetailsScreen from '../screens/MaterialDetailsScreen';
import DatabaseScreen from '../screens/DatabaseScreen';
import ViewAttendanceScreen from '../screens/ViewAttendanceScreen';
import AdmissionScreen from '../screens/RTEAdmissionScreen';
import RTEYearScreen from '../screens/RTEYearScreen';
import StudentsScreen from '../screens/StudentsScreen';
import EventScreen from '../screens/EventScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import AboutScreen from '../screens/AboutScreen';
import TotalAttendanceScreen from '../screens/TotalAttendanceScreen.js';
import ContactScreen from '../screens/ContactScreen';

import AuthContext from '../store/AuthContext';

const StudyStack = createStackNavigator();

function StudyMaterialStack() {
  return (
    <>
       <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <StudyStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#002855',
        },
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
      }}>
        <StudyStack.Screen
          name="Study Material"
          component={StudyMaterialScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ 
                  marginLeft: 16,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#f0f4f8'
                }}
              >
                <FontAwesome5 name="bars" size={20} color="#002855" />
              </TouchableOpacity>
            ),
          })}
        />
        <StudyStack.Screen
          name="MaterialDetails"
          component={MaterialDetailsScreen}
          options={({ route }) => ({
            title: `${route.params.class} Material`,
            headerShown: true,
          })}
        />
      </StudyStack.Navigator>
    </>
  );
}

const Tab = createBottomTabNavigator();

const DbStack = createStackNavigator();

function DatabaseStack() {
  return (
    <>
       <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <DbStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#002855',
        },
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
      }}>
        <DbStack.Screen
          name="Parmarth Database"
          component={DatabaseScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ 
                  marginLeft: 16,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#f0f4f8'
                }}
              >
                <FontAwesome5 name="bars" size={20} color="#002855" />
              </TouchableOpacity>
            ),
          })}
        />
        <DbStack.Screen name="ViewAttendanceScreen" component={ViewAttendanceScreen} options={{ title: "Volunteers Attendence" }} />
        <DbStack.Screen name="AdmissionScreen" component={AdmissionScreen} options={{ title: "Admissions Overview" }} />
        <DbStack.Screen name="RTEYearDetails" component={RTEYearScreen} options={{ title: "RTE Admissions" }} />
        <DbStack.Screen name="StudentsScreen" component={StudentsScreen} options={{ title: "Students Details" }} />
        <DbStack.Screen name="TotalAttendanceScreen" component={TotalAttendanceScreen} options={{ title: "Volunteers Total Attendence" }} />
      </DbStack.Navigator>
    </>
  );
}
const EvStack = createStackNavigator();

function EventStack() {
  return (
    <>
       <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <EvStack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#002855',
        },
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
      }}>
        <EvStack.Screen
          name="Events in Parmarth"
          component={EventScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ 
                  marginLeft: 16,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#f0f4f8'
                }}
              >
                <FontAwesome5 name="bars" size={20} color="#002855" />
              </TouchableOpacity>
            ),
          })}
        />
        <EvStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: "Events Photos" }} />
      </EvStack.Navigator>
    </>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <>
      
         <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <HomeStack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#002855',
          },
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
        <HomeStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Home",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ 
                  marginLeft: 16,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  backgroundColor: '#f0f4f8'
                }}
              >
                <FontAwesome5 name="bars" size={20} color="#002855" />
              </TouchableOpacity>
            ),
          })}
        />
        <HomeStack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ 
            title: "Connect With Us",
            headerShown: true
          }}
        />
      </HomeStack.Navigator>
    </>
  );
}

const AppNavigator = () => {
  const authCtx = useContext(AuthContext);
  const isAuth = authCtx.isLoggedIn;

  return (
    <>
       <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#002855',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack() && route.name !== 'About') {
                  navigation.goBack();
                } else {
                  navigation.openDrawer();
                }
              }}
              style={{ 
                marginLeft: 16,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                backgroundColor: '#f0f4f8'
              }}
            >
              <FontAwesome5 
                name={navigation.canGoBack() && route.name !== 'About' ? 'arrow-left' : 'bars'} 
                size={20} 
                color="#002855" 
              />
            </TouchableOpacity>
          ),
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
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'StudyMaterial') iconName = 'book-outline';
            else if (route.name === 'Database') iconName = 'folder-outline';
            else if (route.name === 'Event') iconName = 'calendar-outline';
            else if (route.name === 'About') iconName = 'information-circle-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false }} />
        <Tab.Screen name="StudyMaterial" component={StudyMaterialStack} options={{ headerShown: false }} />
        <Tab.Screen name="Database" component={DatabaseStack} options={{ headerShown: false }} />
        <Tab.Screen name="Event" component={EventStack} options={{ headerShown: false }} />
        <Tab.Screen 
          name="About" 
          component={AboutScreen} 
          options={{
            headerShown: true,
            title: "About Us"
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default AppNavigator;
