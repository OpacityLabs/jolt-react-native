import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { joltProve, joltVerify } from "./modules/my-rust-module";
import { useEffect, useState } from "react";
joltProve(5).then(async (result) => {
  console.log("Jolt proof", result);


  joltVerify(result as string).catch((error) => {
    console.error("Error while proving", error);
  }).then((result) => {
    console.log("Is proof valid", result);
  });
})
export default function App() {
  const [value, setValue] = useState<null | number>(null);


  // useEffect(() => {
  
  // }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ }</Text>
      <Text style={styles.text}>
        {value === null ? "Loading..." : `The value is: ${value}`}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 42,
  },
});
