import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { joltProve, joltVerify } from "./modules/my-rust-module";
import { useCallback, useEffect, useState } from "react";

export default function App() {
  const [value, setValue] = useState<number>(5);
  const [isProving, setIsProving] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const prove = useCallback(async () => {
    setIsProving(true);
    const proof = await joltProve(value);
    setIsProving(false);
    console.log("Proof", proof);
    const isValid = await joltVerify(proof as string);
    console.log("Is proof valid", isValid);

    setIsValid(isValid);

  }, [setValue, isProving, setIsProving, setIsValid, value])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ }</Text>
      <TextInput
        value={value === null ? "" : value.toString()}
        onChangeText={(text) => text === "" ? null : setValue(parseInt(text))}
        keyboardType="numeric"
        placeholder="Enter a number"
        style={styles.input}
      />
      <Button title="Prove" onPress={prove} />
      <Text style={styles.text}>
        {isProving ? "Proving..." : `${isValid ? "Valid Proof" : "Invalid Proof"}`}
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
