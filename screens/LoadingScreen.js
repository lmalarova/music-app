import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const LoadingCircle = () => {
  return <ActivityIndicator size="large" color="#0000ff" />;
};

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Generujem odporúčania</Text>
      <View style={styles.loadingContainer}>
        <LoadingCircle />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    paddingTop: 20,
    alignItems: "center",
  },
});

export default LoadingScreen;
