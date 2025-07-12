import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const DatabaseScreen = () => {
  const navigation = useNavigation();

  const handleNavigation = (screenName) => {
    navigation.navigate(screenName);
  };

  const CustomButton = ({ title, screenName, icon }) => (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => handleNavigation(screenName)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <FontAwesome5 name={icon} size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="database" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Database Management</Text>
        <Text style={styles.headerSubtitle}>Manage your Parmarth data efficiently</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Database Options</Text>
          <Text style={styles.subtitle}>Select a category to manage your data</Text>

          <View style={styles.buttonsWrapper}>
            <CustomButton
              title="View Attendance"
              screenName="ViewAttendanceScreen"
              icon="clipboard-check"
            />
            <CustomButton
              title="Students in Parmarth"
              screenName="StudentsScreen"
              icon="user-graduate"
            />
            <CustomButton
              title="Admission Data"
              screenName="AdmissionScreen"
              icon="school"
            />
          </View>
        </View>
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
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    padding: 15,
    paddingTop: 25,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsWrapper: {
    width: '100%',
  },
  buttonContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  button: {
    padding: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DatabaseScreen;
