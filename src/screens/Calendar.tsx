import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  ScrollView, 
  View
} from "react-native";
import styled from "styled-components/native";
import { Calendar as RNCalendar } from 'react-native-calendars';

import ErrorCard from "../common/ErrorCard";
import Loader from "../common/Loader";
import CalendarCard from "../components/CalendarCard";
import { CALENDAR_TABS, STATES } from "../constants";
import Launches from "../stores/Launches";
import Events from "../stores/Events";
import EventPreview from "../components/EventPreview";

const Wrapper = styled.View`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  margin: 10px 0;
`;

const TabButton = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 5px 20px;
  margin: 0 10px;
  height: 30px;
  width: 30%;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${({ selected, theme }) => selected ? theme.colors.uiAccent : theme.colors.secondary};
`;

const TabButtonTitle = styled.Text<{ selected: boolean }>`
  flex: 1;
  font-size: 16px;
  color: ${({ theme, selected }) => selected ? theme.colors.text : theme.colors.secondaryText};
`;

const LaunchesContainer = styled.View`
  margin: 20px 16px 10px 16px;
`;

const Calendar = observer(() => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const [selectedTab, setSelectedTab] = useState(CALENDAR_TABS.LAUNCHES)
  const launchesStore = useContext(Launches);
  const eventsStore = useContext(Events);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const refreshCalendar = useCallback(() => {
    if (selectedTab === CALENDAR_TABS.LAUNCHES) {
      setPage(0);
      launchesStore.loadNextLaunches(5);
    } else if (selectedTab === CALENDAR_TABS.EVENTS) {
      eventsStore.loadEvents()
    }
  }, [launchesStore]);

  useEffect(() => {
    refreshCalendar();
  }, []);

  useEffect(() => {
    if (launchesStore.launches.length > 0) {
      const newMarkedDates = {};

      launchesStore.launches.forEach((launch) => {
        const launchDate = new Date(launch.net).toISOString().split("T")[0];
        newMarkedDates[launchDate] = {
          selected: true,
          selectedColor: "yellow",
        };
      });

      setMarkedDates(newMarkedDates);
    }
  }, [launchesStore.launches]);

  const loadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    launchesStore.loadMoreLaunches(5);
  };

  const switchTab = (newTab: CALENDAR_TABS) => {
    if (newTab === CALENDAR_TABS.EVENTS) {
      eventsStore.loadEvents();
    }
    setSelectedTab(newTab);
  };

  const onDateSelected = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
  };

  const renderSelectedDateLaunches = () => {
    if (!selectedDate) return null;

    const launchesOnSelectedDate = launchesStore.launches.filter((launch) => {
      const launchDate = new Date(launch.net).toISOString().split("T")[0];
      return launchDate === selectedDate;
    });

    return (
      <LaunchesContainer>
        {launchesOnSelectedDate.map((launch) => (
          <TouchableOpacity
            key={launch.id}
            onPress={() => navigation.navigate("Details", { data: launch })}
          >
            <CalendarCard data={launch} isFirst={false} />
          </TouchableOpacity>
        ))}
      </LaunchesContainer>
    );
  };

  if (launchesStore.state === STATES.ERROR || eventsStore.state === STATES.ERROR) {
    return (
      <Wrapper>
        <ErrorCard
          onRetry={() => refreshCalendar()}
          message="Could not retrieve upcoming launches or events, make sure your device is online. If you think this is a bug, go to settings and tap 'Report an issue', or send me a message on Twitter."
          detail={launchesStore.error || eventsStore.error}
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper testID="Calendar">
      <Row>
        <TabButton selected={selectedTab === CALENDAR_TABS.LAUNCHES} onPress={() => switchTab(CALENDAR_TABS.LAUNCHES)}>
          <TabButtonTitle selected={selectedTab === CALENDAR_TABS.LAUNCHES}>Launches</TabButtonTitle>
        </TabButton>
        <TabButton selected={selectedTab === CALENDAR_TABS.EVENTS} onPress={() => switchTab(CALENDAR_TABS.EVENTS)}>
          <TabButtonTitle selected={selectedTab === CALENDAR_TABS.EVENTS}>Events</TabButtonTitle>
        </TabButton>
      </Row>
      {selectedTab === CALENDAR_TABS.LAUNCHES && (
        <ScrollView>
          <RNCalendar
            markedDates={markedDates}
            onDayPress={onDateSelected}
          />
          {renderSelectedDateLaunches()}
          <View style={{ margin: 20 }}>
            {launchesStore.state === STATES.LOADING ? (
              <ActivityIndicator />
            ) : (
              <Button
                title="Load more"
                onPress={loadMore}
                disabled={launchesStore.state === STATES.LOADING}
              />
            )}
          </View>
        </ScrollView>
      )}
      {selectedTab === CALENDAR_TABS.EVENTS && (
        <FlatList
          style={{ paddingTop: 20 }}
          data={eventsStore.events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => 
              <EventPreview event={item} timePosted={{}} />
          }
          ListFooterComponent={() => (
            <View style={{ margin: 20 }}/>
          )}
          refreshControl={
            <RefreshControl
              refreshing={eventsStore.state === STATES.LOADING && page === 0}
              onRefresh={refreshCalendar}
              tintColor={colors.text}
            />
          }
        />
      )}
    </Wrapper>
  );
});

export default Calendar;

     

