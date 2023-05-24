import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import styled from 'styled-components/native';
import { saveSharedList } from '../helpers/SaveSharedList'
import uuid from 'react-native-uuid';

import ListTile from '../components/ListTile';

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
  const [lists, setLists] = useState(['Default']);
  const [isCreateListModalVisible, setIsCreateListModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newUserEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  const onCreateList = () => {
    if (newListName.trim() !== '') {
      setLists([...lists, newListName]);
      setNewListName('');
      setUserEmail('');
      setIsCreateListModalVisible(false);

      const listId = uuid.v4();

      saveSharedList(listId.toString(), newListName, newUserEmail);
    } else {
      Alert.alert('Error', 'Please enter a valid list name.');
    }
  };

  const toggleCreateListModal = () => {
    setIsCreateListModalVisible(!isCreateListModalVisible);
  };

  const onListPress = (listName: string) => {
    // const param = 'savedArticles';
    navigation.navigate('ListDetails', { listName, listType: 'savedArticles' });
  };

  return (
    <Container>
      <ScrollView>
        {lists.map((list, index) => (
          <ListTile key={index} title={list} onPress={() => onListPress(list)} />
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
