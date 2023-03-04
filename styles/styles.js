import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#103d69",
    width: "100%",
    padding: 15,
    borderRadius: 10,
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
    fontWeight: "700",
    fontSize: 16,
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
    fontSize: 20,
    padding: 10,
    marginBottom: 30,
    color: "#103d69",
  },
  songAuthor: {
    fontSize: 10,
    color: "#103d69",
  },
  songName: {
    fontSize: 20,
    color: "#103d69",
  },
  songContainer: {
    width: "70%",
    marginBottom: 20
  },
  songRow: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }

});
