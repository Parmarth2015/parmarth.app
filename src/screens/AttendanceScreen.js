import React, { useState } from "react";
import backendUrl from "../../backendUrl";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const AttendanceScreen = () => {
  const classGroups = [
    "group 0-",
    "group 0+",
    "group 0",
    "group 1",
    "group 2",
    "group JNV",
    "group GE",
  ];

  const [volunteers, setVolunteers] = useState([
    { volName: "", rollNo: "", branch: "" },
  ]);

  const [classWise, setClassWise] = useState(
    classGroups.map(group => ({ className: group, count: "" }))
  );
  const [photos, setPhotos] = useState([]);

  const branches = [
    "CSE",
    "CSE-SF",
    "CSE-AI",
    "ECE",
    "EE",
    "ME",
    "CE",
    "CHE",
    "MBA",
    "MCA",
    "MTech",
  ];

  const getAvailableClasses = (excludeIndex) => {
    const selectedClasses = classWise
      .map((item, i) => (i !== excludeIndex ? item.className : null))
      .filter(Boolean);
    return classGroups.filter((cls) => !selectedClasses.includes(cls));
  };

  const handleAddClass = () => {
    setClassWise([...classWise, { className: "", count: "" }]);
  };

  const handleAddVolunteer = () => {
    setVolunteers([...volunteers, { volName: "", rollNo: "", branch: "" }]);
  };

  const handleAddPhoto = async () => {
    if (photos.length >= 7) {
      alert("Maximum 7 photos allowed!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotos((prev) => {
        if (prev.length < 7) {
          return [...prev, { uri: result.assets[0].uri }];
        } else {
          alert("Maximum 7 photos allowed!");
          return prev;
        }
      });
    }
  };

  const handleSubmit = async () => {
    for (let vol of volunteers) {
      if (!vol.volName.trim() || !vol.rollNo.trim() || !vol.branch) {
        Alert.alert("Error", "Please fill all volunteer details.");
        return;
      }

      const rollRegex = /^\d{13}$/;
      if (!rollRegex.test(vol.rollNo)) {
        Alert.alert("Invalid", "Each Roll Number must be 13 digits.");
        return;
      }
    }

    const classWiseMap = {};
    for (let item of classWise) {
      if (!item.className || isNaN(Number(item.count))) {
        Alert.alert("Error", "Fill valid class and count.");
        return;
      }
      classWiseMap[item.className] = Number(item.count);
    }

    const formData = new FormData();
    formData.append("volunteers", JSON.stringify(volunteers));
    formData.append("classWise", JSON.stringify(classWiseMap));

    photos.forEach((photo, index) => {
      formData.append("photos", {
        uri: photo.uri,
        name: `photo${index}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const response = await fetch(`${backendUrl}/attendance/volunteer`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        const text = await response.text();
        console.error('Server Response:', text);
        throw new Error("Invalid response from server");
      }
      
      if (!response.ok) throw new Error(data.message || "Submission failed");

      Alert.alert("Success", data.message || "Attendance marked!");
      setVolunteers([{ volName: "", rollNo: "", branch: "" }]);
      setClassWise(classGroups.map(group => ({ className: group, count: "" })));
      setPhotos([]);
    } catch (error) {
      // console.error('Error details:', error);
      Alert.alert(
        "Error", 
        error.message || "Network request failed. Please check your connection and try again."
      );
    }
  };

  const handleRemoveVolunteer = (index) => {
    if (volunteers.length > 1) {
      const updated = volunteers.filter((_, i) => i !== index);
      setVolunteers(updated);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#002855', '#003f88']}
        style={styles.header}
      >
        <FontAwesome5 name="users" size={40} color="#fff" />
        <Text style={styles.headerTitle}>Mark Volunteer Attendance</Text>
        <Text style={styles.headerSubtitle}>Record volunteer attendance details</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Volunteers Section */}
        {volunteers.map((vol, index) => (
          <View key={index} style={styles.volunteerCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <FontAwesome5 name="user" size={20} color="#002855" />
              </View>
              <Text style={styles.cardTitle}>Volunteer {index + 1}</Text>
              {index > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveVolunteer(index)}
                >
                  <FontAwesome5 name="times" size={16} color="#dc3545" />
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              placeholder="Enter Volunteer Name"
              value={vol.volName}
              onChangeText={(text) => {
                const updated = [...volunteers];
                updated[index].volName = text;
                setVolunteers(updated);
              }}
              style={styles.input}
              placeholderTextColor="#6c757d"
            />
            <TextInput
              placeholder="Enter Roll Number"
              value={vol.rollNo}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "").slice(0, 13);
                const updated = [...volunteers];
                updated[index].rollNo = numericText;
                setVolunteers(updated);
              }}
              style={styles.input}
              placeholderTextColor="#6c757d"
              keyboardType="numeric"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={vol.branch}
                onValueChange={(value) => {
                  const updated = [...volunteers];
                  updated[index].branch = value;
                  setVolunteers(updated);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Select Branch"
                  value=""
                  enabled={false}
                />
                {branches.map((b) => (
                  <Picker.Item key={b} label={b} value={b} />
                ))}
              </Picker>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddVolunteer}>
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.buttonGradient}
          >
            <FontAwesome5 name="plus" size={16} color="#fff" />
            <Text style={styles.buttonText}>Add Volunteer</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Class-wise Attendance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5 name="chalkboard" size={20} color="#002855" />
            </View>
            <Text style={styles.sectionTitle}>Class-wise Attendance</Text>
          </View>

          {classWise.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.classRow}>
                <View style={[styles.pickerContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.className}>{item.className}</Text>
                </View>
                <TextInput
                  placeholder="Count"
                  value={item.count}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const updated = [...classWise];
                    updated[index].count = text;
                    setClassWise(updated);
                  }}
                  style={[styles.input, { flex: 1 }]}
                  placeholderTextColor="#6c757d"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <FontAwesome5 name="camera" size={20} color="#002855" />
            </View>
            <Text style={styles.sectionTitle}>Class Photos</Text>
          </View>

          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => {
                    setPhotos(photos.filter((_, i) => i !== index));
                  }}
                >
                  <FontAwesome5 name="times" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 7 && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <FontAwesome5 name="plus" size={24} color="#002855" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#002855', '#003f88']}
            style={styles.buttonGradient}
          >
            <FontAwesome5 name="check" size={16} color="#fff" />
            <Text style={styles.buttonText}>Submit Attendance</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
  },
  volunteerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#002855',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#2c3e50',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2c3e50',
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginBottom: 50,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002855',
    padding: 12,
  },
  removeButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
});

export default AttendanceScreen;
