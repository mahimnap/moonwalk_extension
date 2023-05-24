import React, { useState, useContext, useCallback, useEffect} from 'react';
import { InteractionManager, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

//local 
import Launches from "../stores/Launches";
import Preview from "../components/Preview";
import useAppState from "../hooks/useAppState";

const SavedLaunches: React.FC = observer(() => {

  //pulling current launch data from the Launches store //might just be temporary
  const [launches, setLaunches] = useState([]);
  const savedLaunchesArr : JSON[] = [];

  const navigation = useNavigation();
  const email = auth().currentUser.email?.replace(".", ",");
  

  /*try {
    
  } catch(error) {
    console.log(error);
  }*/

  database()
  .ref('/users/' + email + '/savedLaunches')
  .on('value', snapshot => {
    //console.log('User data: ', snapshot.val());
    for (const key in snapshot.val()){
      savedLaunchesArr.push(snapshot.val()[key]);
      }
  });
  useEffect(() => {
    setTimeout(() => {
      setLaunches(savedLaunchesArr);
      }, 1000);
  },);

  let fromDB = [];
  let i = 0 ;
  launches.forEach((launch) => {
    fromDB[i] = launch;
    i++;
  });

  return (
    <ScrollView>
      {fromDB.map((data, index) => (
        <Preview
          data={data}
          key = {data+index} 
          onPress={() => navigation.navigate("Details", { data })}/>
      ))}
    </ScrollView>
  );
});
export default SavedLaunches;