import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, DevSettings } from 'react-native';
import React, { useState } from "react";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { observer } from "mobx-react";
import { useNavigation } from '@react-navigation/native';

const LoginPage = observer(() => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(username);
  }

  const handleLogin = () => {
      if (!validateEmail()) {
        Alert.alert('Error', 'Invalid email address given');
        return;
      }

      if (password == '') {
        Alert.alert('Error', 'Invalid password given');
        return;
      }

      auth()
      .signInWithEmailAndPassword(username, password)
      .then((userCredential) => {
        console.log("User authentication successful");
        const user = userCredential.user;
        user.getIdToken().then((idToken) => {
          AsyncStorage.setItem('token', idToken);
          DevSettings.reload()
        });
      })
      .catch(error => {
        if (error.code === 'auth/user-disabled' || error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'User account not found. Please try again or create a new account.');
        }
    
        if (error.code === 'auth/5invalid-email') {
          Alert.alert('Error', 'User account not found.');
        }
    
        console.error(error);
      });
  }

  const handleSignUp = () => {
    navigation.navigate("SignUpPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={username}
        onChangeText={setUsername}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.otherButton} onPress={handleSignUp}>
        <Text style={styles.otherButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
});
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '80%',
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  otherButton: {
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  otherButtonText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
  
export default LoginPage
  