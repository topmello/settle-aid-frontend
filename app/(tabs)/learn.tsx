import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import tips from "../../tips/tips.json";

export default function LearnScreen() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleActivityChange = (activityIndex) => {
    if (selectedActivity === activityIndex) {
      setSelectedActivity(null);
    } else {
      setSelectedActivity(activityIndex);
      setSelectedItem(null); // Reset selectedItem when changing activities
    }
  };

  const handleItemClick = (itemIndex) => {
    if (selectedItem === itemIndex) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemIndex);
    }
  };

  const holder = tips.tips.map((activity, activityIndex) => (
    <View key={`activity_${activityIndex}`} style={styles.activityCard}>
      <View style={styles.titleActivityContainer}>
        <TouchableOpacity onPress={() => handleActivityChange(activityIndex)}>
          <View style={styles.flex}>
            <Ionicons name={iconList[activityIndex]} size={24} color='grey' style={styles.icon} />
            <Text style={styles.titleActivity}>
              {activity.title}
            </Text>
          </View>
        </TouchableOpacity>
        {selectedActivity === activityIndex && (
          <View>
            {activity.tips.map((item, itemIndex) => (
              <View key={`item_${itemIndex}`} style={styles.titleContentContainer}>
                <TouchableOpacity onPress={() => handleItemClick(itemIndex)}>
                  <Text style={styles.titleContent}>
                    {item.mode}
                  </Text>
                </TouchableOpacity>
                {selectedItem === itemIndex && (
                  <View style={styles.contentContainer}>
                    {item.type.map((typeItem, typeIndex) => (
                      <Text key={`typeItem_${typeIndex}`} style={styles.contentContainer}>
                        {typeIndex + 1} {". "}
                        {typeItem.description + '\n'}
                        {typeItem.content + '\n\n\n'}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  ));
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cultural Tips</Text>
      <ScrollView>{holder}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '',
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleActivity: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  titleContent: {
    fontSize: 15,
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  content: {},
  titleContentContainer: {
    padding: 10,
  },
  titleActivityContainer: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  flex: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 70,
  },
  activityCard: {
    // backgroundColor: 'grey',
    borderRadius: 6,
    marginBottom: 2,
    padding: 10, 
  },
  icon: {
    paddingTop: 15,
    paddingRight: 20,
  }
});

const iconList = ["airplane-outline", "flag-outline", "restaurant-outline", "bag-handle-outline", "sunny-outline", "call-outline", "medkit-outline", "wallet-outline", "people-outline"]

