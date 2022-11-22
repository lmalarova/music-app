import {
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "../styles/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import CountryPicker from "react-native-country-picker-modal";
import { Picker } from "@react-native-picker/picker";
import * as firebase from "firebase";

const InitialProfileInfoScreen = ({ navigation }) => {
  const [date_birth, setBirthDate] = useState(new Date());
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState('SK')
  const [gender, setGender] = useState("");

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setBirthDate(currentDate);
  };

  const handleConfirm = async () => {
    const currentUser = await firebase.auth().currentUser;
    await firebase
      .database()
      .ref("users/" + currentUser.uid)
      .update({
        date_birth: date_birth,
        country: country,
        gender: gender,
      });
    navigation.navigate("InitialSongsRateScreen");
  };

  return (
    <KeyboardAvoidingView style={styles.initialContainer} behavior="padding">
      <Text style={styles.initialHeader}>
        Tell us something about yourself!
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.birthDateLabel}>Birth Date</Text>
        <DateTimePicker
          value={date_birth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          style={{
            backgroundColor: "transparent",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 5,
            marginBottom: 15,
          }}
        />
        <Text>Country</Text>
        <CountryPicker
          countryCode={countryCode}
          value={country}
          withCountryNameButton
          withFilter
          containerButtonStyle={{
            backgroundColor: "white",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 5,
            marginBottom: 15,
          }}
          onSelect={(country) => {
            setCountry(country);
            setCountryCode(country.cca2);
          }}
        />
        <Text>Gender</Text>
        <Picker value={gender} style={{height: 44,}} itemStyle={{height: 44, backgroundColor: "#FFFFFF"}} selectedValue={gender} onValueChange={(gender) => setGender(gender)}>
          <Picker.Item label="Man" value="m" />
          <Picker.Item label="Female" value="f" />
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, styles.button]}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default InitialProfileInfoScreen;
