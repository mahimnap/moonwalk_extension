import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';

import ListTile from '../components/ListTile';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import uuid from "react-native-uuid";
import { saveSharedList } from '../helpers/SaveSharedList'

const Container = styled.View`
  flex: 1;
  padding: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
`;

const SavedArticles: React.FC = observer(() => {
  const [lists, setLists] = useState([]);
  const [isCreateListModalVisible, setIsCreateListModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const navigation = useNavigation();
  const [newUserEmail, setUserEmail] = useState('');
  const email = auth().currentUser.email?.replace(".", ",");
  var sharedListIDArr = [];

  database()
  .ref('/users/' + email + '/sharedLists')
  .once('value', snapshot => {
    //   console.log('sharedLists data: ', snapshot.val());
      
      for (const key in snapshot.val()){
        // console.log('listid: ' + snapshot.val()[key].listid);
        // console.log('listname: ' + snapshot.val()[key].name);

        const tmp = {id: snapshot.val()[key].listid, name: snapshot.val()[key].name};
        sharedListIDArr.push(tmp);
      }
  });

  useEffect(() => {
    setTimeout(() => {
        lists.push(...sharedListIDArr);
        setLists([...lists]);
    }, 1000);
  }, []);

  //onCreateList() creates a new lists and rerenders bc of setLists() but the list is only made locally
  //it needs to be written to the db
  //or the SharedLists.tsx simply should not have a create list button
  const onCreateList = () => {
    if (newListName.trim() !== '') {
      const tmp = [{id: uuid.v4().toString(), name: newListName}];
      // const tmp = [{id: 'generateID', name: newListName}];
      lists.push(...tmp);
      //below is how setLists() was orginally done
      //setLists([{...lists, id: 'generateID', name: newListName}]);
      setLists([...lists]);
      setNewListName('');
      setIsCreateListModalVisible(false);
      saveSharedList(tmp[0].id, newListName, newUserEmail);
    } else {
      Alert.alert('Error', 'Please enter a valid list name.');
    }
  };

  const toggleCreateListModal = () => {
    setIsCreateListModalVisible(!isCreateListModalVisible);
  };

  const onListPress = (listName: string, listID: string) => {
    navigation.navigate('ListDetails', { listName, listType: 'sharedLists', listID });
  };

  return (
    <Container>
      <ScrollView>
        {lists.map((list, index) => (
          <ListTile key={index} title={list.name} onPress={() => onListPress(list.name, list.id)} />
        ))}
      </ScrollView>
      <Button onPress={toggleCreateListModal}>
        <Text>Create List</Text>
      </Button>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateListModalVisible}
        onRequestClose={toggleCreateListModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text>Create a new list</Text>
            <TextInput
              style={{ borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10 }}
              onChangeText={(text) => setNewListName(text)}
              value={newListName}
              placeholder="List name"
            />
            <Text>User to share list to</Text>
            <TextInput
              style={{ borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10 }}
              autoCapitalize="none"
              onChangeText={(text) => setUserEmail(text)}
              value={newUserEmail}
              placeholder="User email"
            />
            <Button onPress={onCreateList}>
              <Text>Save List</Text>
            </Button>
            <Button onPress={toggleCreateListModal}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </Container>
  );
});

export default SavedArticles;
