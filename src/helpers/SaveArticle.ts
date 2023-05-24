import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export const saveArticle = (articleObj: object) => {
    const userID = auth().currentUser.uid
    const email = auth().currentUser.email?.replace(".", ",")
    console.log(email);

    database()
    .ref('/users/' + email + '/savedArticles')
    .push(
        articleObj
      )
}