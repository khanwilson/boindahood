import React, { useCallback, useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextStyle,
  View
} from 'react-native';

interface IProps {
  children?: string;
  textStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  textShowMore?: string;
  textShowLess?: string;
  textShowMoreStyle?: StyleProp<TextStyle>;
  textShowLessStyle?: StyleProp<TextStyle>;
}

export const TextMoreLess = React.memo((props: IProps) => {
  const { children, textStyle, numberOfLines, textShowLessStyle, textShowMoreStyle, textShowLess = 'Show less', textShowMore = 'Show more' } = props;
  const [textTruncate, setTextTruncate] = useState<string | undefined>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [dontNeedToShowMore, setDontNeedToShowMore] = useState<boolean>(true);

  const toggleShowMore = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const changeTextTruncate = useCallback((text?: string) => {
    setTextTruncate(text);
  }, []);

  const changeDontNeedToShowMore = useCallback((dontNeed: boolean) => {
    setDontNeedToShowMore(dontNeed);
  }, []);

  const renderButtonMoreLess = useCallback(() => {
    if (dontNeedToShowMore) return;

    if (expanded) return <Text
      style={[styles.defaultStyleTextMore, textShowLessStyle]}
      suppressHighlighting={true}
      onPress={toggleShowMore}
    >
      {textShowLess}
    </Text>

    return <Text
      style={[styles.defaultStyleTextMore, textShowMoreStyle]}
      suppressHighlighting={true}
      onPress={toggleShowMore}
    >
      {textShowMore}
    </Text>
  }, [expanded, toggleShowMore, dontNeedToShowMore, textShowMore, textShowLess, textShowMoreStyle, textShowLessStyle]);

  return <>
    <Text style={[styles.defaultStyle, textStyle]}
      numberOfLines={expanded ? undefined : numberOfLines}>
      {!expanded ? textTruncate : children}
      {renderButtonMoreLess()}
    </Text>

    {/* clone raw text, full line */}
    <TextCloneCaculate
      changeTextTruncate={changeTextTruncate}
      changeDontNeedToShowMore={changeDontNeedToShowMore}
      textStyle={textStyle}
      numberOfLines={numberOfLines}
      textShowMore={textShowMore}
      textShowMoreStyle={textShowMoreStyle}
      textShowLess={textShowLess}
      textShowLessStyle={textShowLessStyle}
    >{children}</TextCloneCaculate>
  </>
});

// private components
interface ITextCloneCaculate extends IProps {
  changeTextTruncate: (text?: string) => void;
  changeDontNeedToShowMore: (value: boolean) => void;
}
const TextCloneCaculate = React.memo((props: ITextCloneCaculate) => {
  const { numberOfLines, textShowMoreStyle, textShowMore, textShowLess, children, textStyle, changeTextTruncate, changeDontNeedToShowMore } = props;
  const [textLineNormal, setTextLineNormal] = useState<string | undefined>();
  const [textLastLine, setTextLastLine] = useState<string | undefined>();
  const prevTextLastLine = React.useRef<string>('');
  const rawTextLastLine = React.useRef<string>('');

  const onTextLayoutClone = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    // dont need to show more
    if (!numberOfLines || lines?.length <= numberOfLines) {
      changeDontNeedToShowMore(true);
      changeTextTruncate(children)
      return;
    }
    // need to show more
    changeDontNeedToShowMore(false);
    let textTruncateWillShow = '';
    lines.forEach((line, index) => {
      if (index < numberOfLines - 1) {
        textTruncateWillShow += line.text;
      }
      if (index === numberOfLines - 1) {
        setTextLastLine(line.text);
        rawTextLastLine.current = line.text;
      }
    });
    setTextLineNormal(textTruncateWillShow);
  }, [numberOfLines, children, changeDontNeedToShowMore, changeTextTruncate]);

  const onTextLayoutLastLine = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { lines } = e.nativeEvent;
    if (!lines) return;
    const textLastLine = lines?.[0]?.text;
    // caculate last line done
    if (lines?.length === 1) {
      changeTextTruncate(textLineNormal + prevTextLastLine.current.trim() + '...');
      return;
    }
    // caulate 
    const shorterListString = textLastLine?.split(' ').slice(0, -1);
    const shorterString = shorterListString.join(' ');
    setTextLastLine(shorterString);
    prevTextLastLine.current = textLastLine
  }, [textLineNormal, changeTextTruncate]);

  useEffect(() => {
    setTextLastLine(rawTextLastLine.current);
  }, [textShowMore, textShowLess]);

  return (
    <View style={styles.viewClone} pointerEvents='none'>
      <Text
        numberOfLines={undefined}
        onTextLayout={onTextLayoutClone}
        style={[styles.defaultStyle, textStyle]}
      >
        {children}
      </Text>
      <Text style={[styles.defaultStyle, textStyle]}
        onTextLayout={onTextLayoutLastLine}
      >
        {textLastLine}{'...'}
        <Text
          style={[styles.defaultStyleTextMore, textShowMoreStyle]}
        >
          {textShowMore}
        </Text>
      </Text>
    </View>
  );
})

// styles
const styles = StyleSheet.create({
  defaultStyle: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'monospace',
  },
  defaultStyleTextMore: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  viewClone: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
  },
  viewStroke: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
    height: 1,
    marginBottom: 10,
  },
});
