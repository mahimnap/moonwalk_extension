import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export const saveSharedArticle = (listid: string, articleObj: object) => {
  database()
  .ref('/articles/' + listid + '/savedArticles')
  .push(
      articleObj
    )
}
