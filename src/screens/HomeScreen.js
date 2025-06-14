import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import backendUrl from '../../backendUrl';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

// Add date formatting function
const formatUpdateTime = (dateString) => {
  try {
    // If no date is provided, return a default message
    if (!dateString) {
      return 'Recently added';
    }

    // First try parsing the date string
    let updateDate;
    if (typeof dateString === 'string') {
      updateDate = new Date(dateString);
    } else if (dateString && dateString.$date) {
      // Handle MongoDB date format
      updateDate = new Date(dateString.$date);
    } else {
      return 'Recently added';
    }

    // Check if date is valid
    if (isNaN(updateDate.getTime())) {
      return 'Recently added';
    }

    // Format the date in Indian format
    const day = updateDate.getDate();
    const month = updateDate.toLocaleString('en-IN', { month: 'short' });
    const year = updateDate.getFullYear();
    const hours = updateDate.getHours();
    const minutes = updateDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Recently added';
  }
};

// Counter Component with animation
const Counter = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: end,
      duration: duration,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value }) => {
      setCount(Math.ceil(value));
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [end, duration]);

  return (
    <Animated.Text style={styles.statNumber}>
      {count}+
    </Animated.Text>
  );
};

// Data for impact stats
const impactData = [
  {
    title: "SLUM AREAS",
    count: 6,
    description: "Contribute through financial support and volunteer engagement.",
    icon: "home",
  },
  {
    title: "STUDENTS",
    count: 200,
    description: "Hundreds of students actively engage in learning, and making a difference through our club.",
    icon: "graduation-cap",
  },
  {
    title: "Families",
    count: 300,
    description: "Providing warm clothes to underprivileged families annually",
    icon: "users",
  },
  {
    title: "RTE ADMISSION",
    count: 400,
    description: "Students of parmarth have got admission in various private schools",
    icon: "school",
  },
];

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <FontAwesome5 name={icon} size={24} color="#fff" />
    </View>
    <Text style={styles.menuLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const fetchLiveUpdates = async () => {
    try {
      const response = await fetch(`${backendUrl}/live-updates/`);
      const data = await response.json();
      if (response.ok) {
        setLiveUpdates(data.updates);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      // Silently handle error and set default update
      setLiveUpdates([{
        _id: 'default',
        text: 'Welcome to Parmarth! Stay tuned for updates.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add focus effect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchLiveUpdates();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Initial load
  useEffect(() => {
    fetchLiveUpdates();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Modern Header */}
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        {/* <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.title}>PARMARTH</Text>
        <Text style={styles.subtitle}>The Social Club of IET Lucknow</Text>
      </LinearGradient>

      {/* Blood Donation Box */}
      {/* <View style={styles.bannerBox}>
        <LinearGradient
          colors={['#ff4b4b', '#ff6b6b']}
          style={styles.bannerGradient}
        >
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>Blood Donation Drive</Text>
              <Text style={styles.bannerDate}>21 MAY</Text>
            </View>
            <FontAwesome5 name="heartbeat" size={32} color="#fff" />
          </View>
        </LinearGradient>
      </View> */}

      {/* Menu Options */}
      {/* <View style={styles.menuContainer}>
        <MenuItem icon="calendar" label="Events" />
        <MenuItem icon="handshake" label="Volunteer" />
        <MenuItem icon="images" label="Gallery" />
        <MenuItem icon="info-circle" label="About" />
      </View> */}

      {/* Live Updates */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <FontAwesome5 name="bell" size={20} color="#002855" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>LIVE UPDATES</Text>
          </View>
          <View style={styles.updateCount}>
            <Text style={styles.updateCountText}>{liveUpdates.length} Updates</Text>
          </View>
        </View>
        {!isLoading && liveUpdates.length > 0 ? (
          liveUpdates.map((update, index) => (
            <View key={update._id || index} style={styles.liveUpdateBox}>
              <View style={styles.updateContent}>
                <View style={styles.dot} />
                <Text style={styles.liveText}>{update.text}</Text>
              </View>
              <View style={styles.updateTime}>
                <FontAwesome5 name="clock" size={12} color="#666" />
                <Text style={styles.timeText}>{formatUpdateTime(update.createdAt)}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.liveUpdateBox}>
            <View style={styles.updateContent}>
              <View style={styles.dot} />
              <Text style={styles.liveText}>Welcome to Parmarth! Stay tuned for updates.</Text>
            </View>
          </View>
        )}
      </View>

      {/* Join Us Button */}
      <TouchableOpacity 
        style={styles.joinButton}
        onPress={() => navigation.navigate('Contact')}
      >
        <LinearGradient
          colors={['#002855', '#003f88']}
          style={styles.joinButtonGradient}
        >
          <Text style={styles.joinText}>Connect With Us</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Featured Stories */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>FEATURED STORIES</Text>
        <View style={styles.featureRow}>
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <FontAwesome5 name="hand-holding-heart" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>500+</Text>
            <Text style={styles.featureDesc}>lives impacted</Text>
          </View>
          <View style={styles.featureBox}>
            <View style={styles.featureIconContainer}>
              <FontAwesome5 name="hands-helping" size={32} color="#fff" />
            </View>
            <Text style={styles.featureTitle}>200+</Text>
            <Text style={styles.featureDesc}>Volunteers</Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <LinearGradient
          colors={['#002855', '#003f88', '#0055b3']}
          style={styles.statsGradient}
        >
          <Text style={styles.statsTitle}>Our Impact</Text>
          <View style={styles.statsContainer}>
            {impactData.map((item, index) => (
              <View key={item.title} style={styles.statCard}>
                <LinearGradient
                  colors={['#ffffff', '#f8f9fa']}
                  style={styles.statCardGradient}
                >
                  <View style={styles.statIconContainer}>
                    <FontAwesome5 name={item.icon} size={24} color="#002855" />
                  </View>
                  <Counter end={item.count} />
                  <Text style={styles.statTitle}>{item.title}</Text>
                  <Text style={styles.statDescription}>{item.description}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: width * 0.05,
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    alignItems: "center",
    borderBottomLeftRadius: width * 0.075,
    borderBottomRightRadius: width * 0.075,
  },
  logo: {
    width: Math.min(width * 0.2, 80),
    height: Math.min(width * 0.2, 80),
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: Math.min(width * 0.2, 48),
    fontWeight: "bold",
    color: "#fff",
    marginTop: height * 0.01,
  },
  subtitle: {
    fontSize: Math.min(width * 0.05, 16),
    color: "#fff",
    opacity: 0.9,
    marginBottom: height * 0.02,
  },
  bannerBox: {
    margin: width * 0.04,
    borderRadius: width * 0.04,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerGradient: {
    padding: width * 0.05,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: Math.min(width * 0.055, 18),
    color: "#fff",
    fontWeight: "bold",
  },
  bannerDate: {
    fontSize: Math.min(width * 0.045, 16),
    color: "#fff",
    marginTop: height * 0.005,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: height * 0.02,
    backgroundColor: "#fff",
    marginHorizontal: width * 0.04,
    borderRadius: width * 0.04,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuItem: {
    alignItems: "center",
    width: width * 0.2,
  },
  menuIconContainer: {
    width: Math.min(width * 0.125, 50),
    height: Math.min(width * 0.125, 50),
    borderRadius: Math.min(width * 0.0625, 25),
    backgroundColor: "#002855",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  menuLabel: {
    fontSize: Math.min(width * 0.03, 12),
    color: "#333",
    fontWeight: "500",
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: width * 0.05,
    marginHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: width * 0.02,
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.045, 16),
    fontWeight: 'bold',
    color: '#002855',
  },
  updateCount: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: width * 0.02,
  },
  updateCountText: {
    fontSize: Math.min(width * 0.03, 12),
    color: '#666',
  },
  liveUpdateBox: {
    backgroundColor: '#f8f9fa',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.01,
  },
  updateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: Math.min(width * 0.02, 8),
    height: Math.min(width * 0.02, 8),
    borderRadius: Math.min(width * 0.01, 4),
    backgroundColor: '#002855',
    marginRight: width * 0.02,
  },
  liveText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#333',
    flex: 1,
  },
  updateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.01,
    marginLeft: width * 0.04,
  },
  timeText: {
    fontSize: Math.min(width * 0.03, 12),
    color: '#666',
    marginLeft: width * 0.01,
  },
  joinButton: {
    marginHorizontal: width * 0.04,
    marginTop: height * 0.02,
    borderRadius: width * 0.05,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  joinButtonGradient: {
    paddingVertical: height * 0.015,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontSize: Math.min(width * 0.045, 16),
    fontWeight: 'bold',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  featureBox: {
    width: width * 0.4,
    backgroundColor: '#f8f9fa',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: Math.min(width * 0.15, 60),
    height: Math.min(width * 0.15, 60),
    borderRadius: Math.min(width * 0.075, 30),
    backgroundColor: '#002855',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  featureTitle: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    color: '#002855',
  },
  featureDesc: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
    marginTop: height * 0.005,
  },
  statsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
    borderRadius: 20,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
  },
  statsTitle: {
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  statsContainer: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: "48%",
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    overflow: 'hidden',
  },
  statCardGradient: {
    // padding: 16,
    // borderRadius: 16,

    width: width * 0.43,
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: 250,
    justifyContent: 'space-between',
  },
  statIconContainer: {
    width: Math.min(width * 0.1, 40),
    height: Math.min(width * 0.1, 40),
    borderRadius: Math.min(width * 0.05, 20),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  statNumber: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: height * 0.005,
  },
  statTitle: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.005,
  },
  statDescription: {
    fontSize: Math.min(width * 0.03, 12),
    color: '#666',
    lineHeight: Math.min(width * 0.04, 16),
  },
});

export default HomeScreen;