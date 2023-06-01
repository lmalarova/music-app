import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import { styles } from "../styles/styles";
import * as firebase from "firebase";

const SignUpScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emptyState = () => {
    setNickname("");
    setEmail("");
    setPassword("");
  };

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        await firebase
          .database()
          .ref("users/" + user.uid)
          .set({
            email: user.email,
            nick_name: nickname,
          });
        navigation.navigate("InitialProfileInfoScreen");
        console.log("Registered with: ", user.email);
        emptyState();
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Music-App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Login"
          value={nickname}
          onChangeText={(text) => setNickname(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Heslo"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.button]}
        >
          <Text style={styles.buttonText}>Registrovať</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Máte už konto?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Prihlásiť sa</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
