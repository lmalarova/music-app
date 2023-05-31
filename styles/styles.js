import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  headerRecommended: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    backgroundColor: "#64becc",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 10,
    paddingRight: 10,
  },
  headerRated: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    backgroundColor: "#64becc",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10,
    paddingLeft: 10,
  },
  headerText: {
    fontSize: 14,
    color: "white",
    padding: 10,
  },
  detailContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#103d69",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
    width: "90%",
    height: "60%",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    alignItems: "center",
  },
  buttonDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#64becc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#103d69",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonOutlineText: {
    color: "#103d69",
    fontWeight: "700",
    fontSize: 16,
  },
  text: {
    paddingTop: 10,
    fontWeight: "500",
    color: "#000000",
  },
  linkText: {
    fontWeight: "500",
    color: "#103d69",
    textDecorationLine: "underline",
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  initialHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  songAuthor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  songName: {
    fontSize: 14,
  },
  songContainer: {
    flex: 1,
    width: "100%",
  },
  songDetailContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  songRow: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    flexDirection: "row",
    alignItems: "center",
  },
  songInfoContainer: {
    flex: 1,
    // marginRight: 10,
  },
  starRatingDetail: {
    marginTop: 20,
  },
});
