import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export const saveSharedList = (listid: string, name: string, member: string) => {
    createList(listid, name)
    addListRef(listid, member, name)
}

const createList = (listid: string, name: string) => {
    database()
    .ref('/articles/' + listid)
    .set({
        name: name,
    })
}

const addListRef = (listid: string, member: string, name: string) => {
    var listObj = {listid: listid, name: name}

    // add list ref to curr user
    const user = auth().currentUser.email
    database()
    .ref('/users/' + user.replace(".", ",") + '/sharedLists')
    .push(
        listObj,
    )

    // add list ref to invited user
    database()
    .ref('/users/' + member.replace(".", ",") + '/sharedLists')
    .push(
        listObj
    )
}
