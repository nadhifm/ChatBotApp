import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from './env';

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '2',
      text: 'How can I help You ?',
      userId: 2,
    },
    {
      id: '1',
      text: 'Hi, I am Dialog Flow Aggent',
      userId: 2,
    },
  ]);

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }, []);

  const submitHandler = (text) => {
    setMessages(prevMessages => {
      return [
        {
          id: Math.random().toString(),
          text: text,
          userId: 1,
        },
        ...prevMessages
      ];
    });

    setMessage('');

    Dialogflow_V2.requestQuery(
      text,
      result => handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  const handleGoogleResponse = (result) => {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    sendBotResponse(text);
  }

  const sendBotResponse = (text) => {
    setMessages(prevMessages => {
      return [
        {
          id: Math.random().toString(),
          text: text,
          userId: 2,
        },
        ...prevMessages
      ];
    });
  }
  
  const MessageBubble = ({item}) => {
    if (item.userId == 1) {
      return (
        <View
          style={[styles.messageBubble, styles.myMessageBubble]}>
          <Text style={styles.myMessageText}>{item.text}</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerMessage}>
        <FlatList
          data={messages}
          renderItem={MessageBubble}
          keyExtractor={item => item.id}
          inverted
        />
      </View>
      <View style={styles.containerSubmitMessage}>
        <TextInput
          style={styles.input}
          onChangeText={setMessage}
          value={message}
          placeholder="Input message"
        />
        <Pressable style={styles.button} onPress={() => submitHandler(message)}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  containerMessage: {
    flex: 10,
  },
  containerSubmitMessage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#3784FF',
    marginLeft: 14,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  messageBubble: {
    alignSelf: 'flex-start',
    maxWidth: 280,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F1F0F0',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3784FF',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
    fontSize: 16,
  },
});
