import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import {Picker} from "@react-native-picker/picker";
import { colors, fonts } from "../../../utils";

const DropBox = ({ onValueChange, selectedValue, judul}) => {
  return (
    <View>
      <Text style={styles.label}>{judul}</Text>
      <Picker selectedValue={selectedValue} style={styles.dropBox} onValueChange={onValueChange}>
      </Picker>
    </View>
  );
}

export default DropBox;

const styles = StyleSheet.create({
  dropBox: {
    flex: 1,
    backgroundColor: colors.white,
  },
  label : {
    fontSize: 14,
    fontFamily: fonts.primary[700],
    color: colors.text.primary,
    paddingBottom: 10
}
});