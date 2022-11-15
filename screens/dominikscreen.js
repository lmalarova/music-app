import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  TextInput,
} from "react-native";
import { Card, Badge, Button, ListItem, Icon } from "react-native-elements";
import {
  useNavigation,
  useRoute,
  useIsFocused,
  CommonActions,
} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";

import TabMarginBar from "../../components/tabMarginBar.js";
import Services from "../../services/services.js";
import getSportNameFromId from "../../util/getSportNameFromId.js";
import getLevelNameFromId from "../../util/getLevelNameFromId.js";

const SummaryScreen = (props) => {
  // event, this will be passed to another screens
  let emptyEvent = {
    id: null,
    name: null,
    sportType: {
      id: null,
    },
    eventType: 1,
    level: null,
    maxNumberOfParticipants: null,
    place: {},
    description: null,
    descriptionPrivate: null,
    startsOn: new Date(),
    endsOn: new Date(),
    isActive: 1,
  };

  const navigation = useNavigation();
  const route = useRoute();
  const scrollRef = useRef();

  // the event can come from the EventDetails screen, or when opened from tab the event is empty
  // i set it in useState, because I dont want to propage it to screen before, I want to hold the
  // new event only here, must be confirmed with save
  const [event, setEvent] = useState(
    route.params.mode == "create"
      ? emptyEvent
      : JSON.parse(JSON.stringify(route.params.event))
  );
  const [wasFetched, setWasFetched] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isCorrectInput, setIsCorrectInput] = useState(false);

  useEffect(() => {
    // initially fetch the event if editing the event
    if (route.params.mode == "edit" && !wasFetched) {
      Services.call(`events/${event.id}`, "GET").then((data) => {
        //parse the date to Date format
        console.log("initial fetch");
        data.endsOn = new Date(data.endsOn);
        data.startsOn = new Date(data.startsOn);
        setEvent(data);
        setWasFetched(true);
      });
    }

    if (isSaved) {
      saveEvent(event);
    }

    if (isCorrectInput) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: "Home Tab" }],
        })
      );
    }

    setIsSaved(false);

    console.log(event);
  }, [wasFetched, errors, isSaved, isCorrectInput]);

  /*useLayoutEffect(() => {
    setEvent(event);

    console.log(event);
  });*/

  const saveEvent = async (event) => {
    const res = await Services.call(
      `events`,
      route.params.mode == "create" ? "POST" : "PUT",
      event,
      true
    );

    // if res contains errors, set the errors state
    if (res.errors) {
      setErrors(res.errors);
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    } else {
      setIsCorrectInput(true);
    }
  };

  const getColor = (fieldName) => {
    if (errors.filter((e) => e.param == fieldName).length > 0) return "#ffb5b5";
    else return "transparent";
  };

  const getErrorMessage = (fieldName) => {
    const filteredErrors = errors.filter((e) => e.param == fieldName);

    if (filteredErrors.length > 0) return filteredErrors[0].msg;
    else return "";
  };

  const onChangeName = (value) => {
    event.name = value;
    setEvent(event);
  };

  const onChangeDescription = (value) => {
    event.description = value;
    setEvent(event);
  };

  const onChangePrivateDescription = (value) => {
    event.descriptionPrivate = value;
    setEvent(event);
  };

  const onChangeNumberOfParticipants = (value) => {
    event.maxNumberOfParticipants = Number(value);
    setEvent(event);
  };

  const onStartDateChange = (innerEvent, selectedDate) => {
    event.startsOn.setDate(selectedDate.getDate());
    event.startsOn.setMonth(selectedDate.getMonth());
    event.startsOn.setFullYear(selectedDate.getFullYear());
    event.startsOn.setSeconds(0);
    setEvent(event);
  };

  const onStartTimeChange = (innerEvent, selectedDate) => {
    event.startsOn.setHours(selectedDate.getHours());
    event.startsOn.setMinutes(selectedDate.getMinutes());
    event.startsOn.setSeconds(0);
    setEvent(event);
  };

  const onEndDateChange = (innerEvent, selectedDate) => {
    event.endsOn.setDate(selectedDate.getDate());
    event.endsOn.setMonth(selectedDate.getMonth());
    event.endsOn.setFullYear(selectedDate.getFullYear());
    event.endsOn.setSeconds(0);
    setEvent(event);
  };

  const onEndTimeChange = (innerEvent, selectedDate) => {
    event.endsOn.setHours(selectedDate.getHours());
    event.endsOn.setMinutes(selectedDate.getMinutes());
    event.endsOn.setSeconds(0);
    setEvent(event);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "flex-start",
    },
    row: {
      backgroundColor: "transparent",
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: 15,
    },
    textAndErrorContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    descriptionRow: {
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      flexDirection: "column",
      justifyContent: "flex-start",
      padding: 15,
    },
    timeDateRow: {
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      padding: 15,
      paddingRight: 0,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      flexDirection: "row",
      alignItems: "flex-end",
      padding: 15,
      height: 75,
    },
    firstDivider: {
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      flexDirection: "row",
      alignItems: "flex-end",
      padding: 15,
    },

    placeholder: { fontSize: 14, color: "grey" },
    dividerText: { fontSize: 17, color: "grey", fontWeight: "bold" },
    input: {
      fontSize: 17,
      fontWeight: "bold",
      flexGrow: 1,
      textAlign: "left",
    },
    errorText: {
      fontSize: 14,
      textAlign: "left",
      color: "red",
      marginLeft: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView ref={scrollRef} style={{ padding: 8 }}>
        <View style={styles.row}>
          <View style={styles.textAndErrorContainer}>
            <Text style={styles.placeholder}>Name</Text>
            <Text style={styles.errorText}>{getErrorMessage("name")}</Text>
          </View>
          <TextInput
            maxLength={30}
            style={styles.input}
            defaultValue={event.name}
            onChangeText={(value) => {
              onChangeName(value);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.push("Choose a Sport", {
              event: event,
              setEvent: setEvent,
            })
          }
        >
          <View style={styles.row}>
            <View style={styles.textAndErrorContainer}>
              <Text style={styles.placeholder}>Sport</Text>
              <Text style={styles.errorText}>
                {getErrorMessage("sportType")}
              </Text>
            </View>
            <Text style={styles.input}>
              {getSportNameFromId(event.sportType?.id)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider}>
          <Text style={styles.dividerText}>Details</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.textAndErrorContainer}>
            <Text style={styles.placeholder}>Max. number of participants</Text>
            <Text style={styles.errorText}>
              {getErrorMessage("maxNumberOfParticipants")}
            </Text>
          </View>
          <TextInput
            keyboardType="numeric"
            maxLength={2}
            defaultValue={
              event.maxNumberOfParticipants
                ? event.maxNumberOfParticipants.toString()
                : event.maxNumberOfParticipants
            }
            style={styles.input}
            onChangeText={(value) => {
              onChangeNumberOfParticipants(value);
            }}
          />
        </View>
        <View style={styles.descriptionRow}>
          <View style={styles.textAndErrorContainer}>
            <Text style={styles.placeholder}>Description</Text>
            <Text style={styles.errorText}>
              {getErrorMessage("description")}
            </Text>
          </View>
          <TextInput
            placeholder="Visible for all users"
            defaultValue={event.description}
            multiline={true}
            numberOfLines={4}
            maxLength={150}
            style={{
              fontSize: 17,
              flexGrow: 1,
              textAlign: "left",
            }}
            onChangeText={(value) => {
              onChangeDescription(value);
            }}
          />
        </View>
        <View style={styles.descriptionRow}>
          <View style={styles.textAndErrorContainer}>
            <Text style={styles.placeholder}>Private description</Text>
            <Text style={styles.errorText}>
              {getErrorMessage("descriptionPrivate")}
            </Text>
          </View>
          <TextInput
            placeholder="Visible only for participants"
            defaultValue={event.descriptionPrivate}
            multiline={true}
            numberOfLines={4}
            maxLength={150}
            style={{
              fontSize: 17,
              flexGrow: 1,
              textAlign: "left",
            }}
            onChangeText={(value) => {
              onChangePrivateDescription(value);
            }}
          />
        </View>
        <View style={styles.divider}>
          <Text style={styles.dividerText}>Time & Place</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.push("Choose Place", {
              event: event,
              setEvent: setEvent,
            })
          }
        >
          <View style={styles.row}>
            <View style={styles.textAndErrorContainer}>
              <Text style={styles.placeholder}>Place</Text>
              <Text style={styles.errorText}>
                {getErrorMessage("place.placeName")}
              </Text>
            </View>
            <Text style={styles.input}>{event.place?.placeName}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.timeDateRow}>
          <View style={styles.textAndErrorContainer}>
            <Text style={styles.placeholder}>Starts On</Text>
            <Text style={styles.errorText}>{getErrorMessage("startsOn")}</Text>
          </View>
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              flexDirection: "row",
            }}
          >
            <DateTimePicker
              testID="startDatePicker"
              value={event.startsOn}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onStartDateChange}
              style={{ width: 120 }}
            />
            <DateTimePicker
              testID="startTimePicker"
              value={event.startsOn}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onStartTimeChange}
              style={{ width: 70 }}
            />
          </View>
        </View>
        <View style={styles.timeDateRow}>
          <View style={styles.textAndErrorContainer}>
            <Text style={styles.placeholder}>Ends On</Text>
            <Text style={styles.errorText}>{getErrorMessage("endsOn")}</Text>
          </View>
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              flexDirection: "row",
            }}
          >
            <DateTimePicker
              testID="endDatePicker"
              value={event.endsOn}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onEndDateChange}
              style={{ width: 120 }}
            />
            <DateTimePicker
              testID="endTimePicker"
              value={event.endsOn}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onEndTimeChange}
              style={{ width: 70 }}
            />
          </View>
        </View>
        <View style={styles.divider}>
          <Text style={styles.dividerText}>Visibility</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.push("Choose Level", {
              event: event,
              setEvent: setEvent,
            })
          }
        >
          <View style={styles.row}>
            <View style={styles.textAndErrorContainer}>
              <Text style={styles.placeholder}>Level</Text>
              <Text style={styles.errorText}>{getErrorMessage("level")}</Text>
            </View>
            <Text style={styles.input}>{getLevelNameFromId(event.level)}</Text>
          </View>
        </TouchableOpacity>
        <Button
          buttonStyle={{
            backgroundColor: "#4BB543",
          }}
          containerStyle={{ margin: 15 }}
          title="Save"
          raised="true"
          onPress={async () => {
            setIsSaved(true);
          }}
        />
        <TabMarginBar height={225} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SummaryScreen;
