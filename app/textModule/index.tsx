import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TextShowMore from './components/TextShowMore';

export default function MoreLess() {
  return <View style={{ flex: 1, backgroundColor: 'white' }}>
    <Text>{`Yellow background: content view area\nBorder: actual size of the text`}</Text>
    <View style={styles.container}>
      <View style={styles.containerBorder}>
        <TextShowMore
          numberOfLines={2}
          textShowMore={'Hiện thêm'}
          textShowMoreStyle={{ color: 'red' }}
          textShowLess={'Show less'}
          textShowLessStyle={{ color: 'blue' }}
        >
          {`Lorem ipsum dolor\nsit amet, confsectetur adipiscing i i i i i i smod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`}
        </TextShowMore>
        {/* <View style={styles.viewStroke} /> */}
        {/* <TextTruncate
        numberOfLines={2}
        >
        "Lorem ipsum dolor sit amet, asfasdf  fsf sf s as.f, aslkjf aslfk jaslfj 
        </TextTruncate> */}
      </View>
    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignItems: 'flex-start',
    backgroundColor: 'yellow',
  },
  containerBorder: {
    borderWidth: 1,
    borderColor: 'gray',
  },
  viewStroke: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    height: 1,
    marginBottom: 10,
  }
});
