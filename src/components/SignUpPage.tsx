import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, DevSettings } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import React, { useState } from "react";
import LoginPage from './LoginPage';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
// import App from '../../App';
// import { navigationRef } from './RootNavigation';
import { NavigationContainer } from '@react-navigation/native';


const SignUpPage = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateEmail = () => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(username);
    }

    function navToLogin() {
      navigation.navigate('LoginPage');
    }

    const createAccount = async () => {
      if (!validateEmail()) {
        Alert.alert('Error', 'Invalid email address given');
        return;
      }

      // if (password !== confirmPassword || password == '' || confirmPassword === '') {
      //   Alert.alert('Error', 'Passwords do not match');
      //   return;
      // }
      
      auth()
      .createUserWithEmailAndPassword(username, password)
      .then((userCredential) => {
        console.log('User account created & signed in!');
        const user = userCredential.user;
        user.getIdToken()
          .then((idToken) => {
            AsyncStorage.setItem('token', idToken);
            DevSettings.reload()
            // console.log(idToken)
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/5invalid-email') {
          console.log('That email address is invalid!');
        }
    
        console.error(error);
      });
    };
  
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={createAccount}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherButton} onPress={navToLogin}>
            <Text style={styles.otherButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
    );
  };
  
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
  
export default SignUpPage
  