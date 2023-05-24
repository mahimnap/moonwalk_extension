import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export const saveLaunch = (data: any) => {
    const userID = auth().currentUser.uid
    const email = auth().currentUser.email?.replace(".", ",")
    console.log(email);

    const launchObj = {
      id: data.id,
      name: data.name,
      wiki_url: data.wiki_url,
      net: data.net,
      status: {
        id: data.status.id,
        name: data.status.name,
        abbrev: data.status.abbrev,
        description: data.status.description,
      },
      rocket: {
        id: data.rocket.id, 
        configuration: {
          id: data.rocket?.configuration.id,
          launch_library_id: data.rocket?.configuration.launch_library_id,
          url: data.rocket?.configuration.url,
          name: data.rocket?.configuration.name,
          description: data.rocket?.configuration.description ?? "Unknown",
          family: data.rocket?.configuration.family ?? "Unknown",
          full_name: data.rocket?.configuration.full_name ?? "Unknown",
          image_url: data.rocket?.configuration.image_url,
        },
      },
      mission: {
        description: data.mission?.description,
        type: data.mission?.type
      },
      image: data.image || data.rocket.configuration.image_url,
      missionType: data.mission ? data.mission.type : "Unknown",
      missionDescription: data.mission ? data.mission.description : "No Description Available",
      launch_service_provider: {
        name: data.launch_service_provider.name,
        abbrev: data.launch_service_provider.abbrev,
        wiki_url: data.launch_service_provider.wiki_url,
      },
      pad : {
        name: data.pad.name,
        url: data.pad.url,
        wiki_url: data.pad.wiki_url,
        location: {
          id: data.pad.location.id,
          url: data.pad.location.url,
          country_code: data.pad.location.country_code,
          map_image: data.pad.location.map_image,
          name: data.pad.location.name,
        },
      },
      latitude: data.pad.latitude,
      longitude: data.pad.longitude,
      //check if video urls is null and if array has elements
      //map to videoURLs array if it does else empty array
      videoUrls: data.vidURLs && data.vidURLs.length > 0 ? data.vidURLs.map((video: any) => video.url) : []
    };

    database()
    .ref('/users/' + email + '/savedLaunches')
    .push(
        launchObj
      )
}