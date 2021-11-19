import {text} from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function FlatButton({text, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#0d6efd',
    marginBottom:"10%"
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',



     width: '100%',
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    borderColor: 'black',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#f3f3f3',
  },
});
