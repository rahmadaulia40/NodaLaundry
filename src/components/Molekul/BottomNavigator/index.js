import React from 'react';
import {StyleSheet, View} from 'react-native';
import { colors } from '../../../utils';
import { TabItem } from '../../Atom';

const BottomNavigator = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
    {state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label =
        options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      return (
        <TabItem 
            title ={label} 
            active={isFocused} 
            onPress={onPress} 
            onLongPress={onLongPress}
            key={index}
        />
      );
    })}
  </View>
  )
}

export default BottomNavigator

const styles = StyleSheet.create({
    container : {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: colors.secondary,
        elevation: 10,
        borderWidth: 1,
        borderColor: colors.border.onBlur
    }
})