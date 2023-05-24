import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ArticlePreview from '../components/ArticlePreview';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const ListDetails: React.FC = () => {
  const route = useRoute();
//   add one more parameter: listType (which would either be /savedArticles or /sharedLists)
  const { listName, listType, listID } = route.params; 
  const [articles, setArticles] = useState([]);
  const savedArticlesArr : JSON[] = [];
  const sharedListIDArr : JSON[] = [];
  const email = auth().currentUser.email?.replace(".", ",")

//   .ref('/users/' + email + '/' + listType)
  console.log('listType: ' + listType);
  if (listType == "savedArticles"){
    database()
    .ref('/users/' + email + '/' + listType)
    .on('value', snapshot => {
    //   console.log('User data: ', snapshot.val());
      
      // if listType == "savedArticles" then
      for (const key in snapshot.val()){
          console.log(snapshot.val()[key]);
          savedArticlesArr.push(snapshot.val()[key]);
        }
  
      
    });
  } 
  else if (listType == "sharedLists") {
    database()
    .ref('/users/' + email + '/' + listType)
    .on('value', snapshot => {
        // console.log('sharedLists data: ', snapshot.val());
        database()
        .ref('/articles/' + listID)
        .on('value', articleSnapshot => {
            for (const key in articleSnapshot.val()){
                if (key == 'savedArticles') {
                    console.log('key: ' + key);
                    for (const key2 in articleSnapshot.val()[key]){
                        console.log(articleSnapshot.val()[key][key2]);
                        savedArticlesArr.push(articleSnapshot.val()[key][key2]);
                    }
                }
            }
        });
    });
  }

  useEffect(() => {
    // Load data specific to the list (You can filter articles based on the listName)
    setTimeout(() => {
        setArticles(savedArticlesArr);
      }, 1000);
  }, [listName]);

  return (
    <ScrollView>
      <Text>{listName}</Text>
      {articles.map((article, index) => (
        <ArticlePreview key={article.id + index} article={article} />
      ))}
    </ScrollView>
  );
};

export default ListDetails;
