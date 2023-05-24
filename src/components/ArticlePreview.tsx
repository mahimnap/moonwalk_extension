import React, { useContext, useEffect, useState } from "react";
import analytics from '@react-native-firebase/analytics';
import styled from "styled-components/native";
import { saveArticle } from "../helpers/SaveArticle";

import { openLink } from "../helpers/OpenLink";
import AppState from "../stores/AppState";
import { Alert, Modal, Pressable, Share, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { saveSharedArticle } from '../helpers/SaveSharedArticle'

const Wrapper = styled.TouchableOpacity<{ isFirst: boolean }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-top-width: ${({ isFirst }) => (isFirst ? 0 : 1)}px;
  background: ${({ theme }) => theme.colors.secondary};
  border-color: ${({ theme }) => theme.colors.uiAccent};
`;

const Thumbnail = styled.ImageBackground`
  height: 100px;
  width: 100px;
  border-radius: 10px;
  overflow: hidden;
  margin-right: 10px;
`;

const Title = styled.Text`
  text-align: left;
  padding-bottom: 5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const DetailsWrapper = styled.View`
  flex: 1;
  padding: 10px 5px;
`;

const Dot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.accent};
`;

interface Props {
  article: any;
  timePosted: number;
  isFirst?: boolean;
}

const ArticlePreview: React.FC<Props> = ({
  article,
  timePosted,
  isFirst = false,
}) => {
  const appStateStore = useContext(AppState);
  const [visible, setVisible] = useState(false);

  const onArticlePress = () => {
    analytics().logEvent("OPEN_NEWS_ARTICLE", {
      title: article.title,
      site: article.newsSite,
    });
    openLink(article.url, appStateStore.browser);
  };

  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleLongPress = () => {
    setShowContextMenu(true);
  };

  const handleHideContextMenu = () => {
    setShowContextMenu(false);
  };

  const handleDefaultSave = () => {
    Alert.alert('Saved', 'Save option selected!');
    // Add save article to database logic here.
    // Can also use Object.getOwnPropertyNames(article) to get all the keys from proxy
    // then create new object to store key/value pairs
    // Populate new object with for loop and get key values from proxy object
    saveArticle(JSON.parse(JSON.stringify(article)));
  };

  const handleShareSave = (listid: string) => {
    Alert.alert('Saved', 'Save option selected!');
    // Add save article to database logic here.
    // Can also use Object.getOwnPropertyNames(article) to get all the keys from proxy
    // then create new object to store key/value pairs
    // Populate new object with for loop and get key values from proxy object
    saveSharedArticle(listid, JSON.parse(JSON.stringify(article)));
    closePopup();
  };

  const openPopup = () => {
    setVisible(true);
  };

  const closePopup = () => {
    setVisible(false);
  };

  const Popup = ({ visible, onClose }) => {
    const [shareListArr, setShareListArr] = useState([]);
  
    const email = auth().currentUser.email?.replace(".", ",");
  
    useEffect(() => {
      const sharedListsRef = database().ref('/users/' + email + '/' + 'sharedLists');
      const onSharedListsChange = sharedListsRef.on('value', snapshot => {
        const shareListData = snapshot.val();
        if (shareListData) {
          const shareListArr = Object.values(shareListData);
          setShareListArr(shareListArr);
        }
      });
  
      return () => {
        sharedListsRef.off('value', onSharedListsChange);
      };
    }, [email]);
  
    return (
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Save</Text>
          </View>
          {shareListArr.map(item => (
            <View key={item.listid} style={styles.row}>
              <TouchableOpacity onPress={() => handleShareSave(item.listid)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };  

  return (
    <TouchableWithoutFeedback onPress={handleHideContextMenu}>
      <View style={{ flex: 1 }}>
        {/* <Wrapper onPress={onArticlePress} onLongPress={shareArticle} isFirst={isFirst}> */}
        <Wrapper onPress={onArticlePress} onLongPress={handleLongPress} isFirst={isFirst}>
          <Thumbnail source={{ uri: article.imageUrl }} />
          <DetailsWrapper>
            <Title>{article.title}</Title>
            <Subtitle>
              {article.newsSite} <Dot /> {timePosted}
            </Subtitle>
          </DetailsWrapper>
        </Wrapper>
        {showContextMenu && (
          <Pressable
            onPress={handleHideContextMenu}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 10,
                elevation: 5,
                shadowColor: 'black',
                shadowOpacity: 0.5,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 0 },
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              {/* <TouchableOpacity onPress={openPopup}> */}
              <TouchableOpacity onPress={handleDefaultSave}>
                <Text>Save</Text>
              </TouchableOpacity>
              <View style={{ height: '100%', width: 1, backgroundColor: 'black', marginHorizontal: 10 }} />
                <TouchableOpacity onPress={openPopup}>
                {/* <TouchableOpacity onPress={shareArticle}> */}
                  <Text>Share</Text>
                </TouchableOpacity>
                <Popup visible={visible} onClose={closePopup} />
              </View>
          </Pressable>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#515151',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#515151',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ArticlePreview;
