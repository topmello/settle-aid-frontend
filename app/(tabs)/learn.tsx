import { ScrollView, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Button, Text} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import tips from "../../tips/tips.json";

export default function LearnScreen() {
  const holder = tips.tips.map((activity, activityIndex) => (
    <View key={`activity_${activityIndex}`} style={styles.titleActivityContainer}>
      <Text style={styles.titleActivity}>
        {activity.title} {'\n\n'}
        {activity.tips.map((item, index) => (
          <View key={`item_${index}`} style={styles.titleContentContainer}>
            <Text style={styles.titleContent}>
              {item.mode} {"\n\n"}
              {item.type.map((typeItem, typeIndex) => (
                <View key={`typeItem_${typeIndex}`} style={styles.contentContainer}>
                  <Text>
                    {typeIndex + 1} {". "}
                    {typeItem.description + '\n'}
                    {typeItem.content + '\n\n\n'}
                  </Text>
                </View>
              ))}
            </Text>
          </View>
        ))}
      </Text>
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
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
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
  },
  titleContent: {
    fontSize: 15,
    textAlign: 'left',
  },
  content: {},
  titleContentContainer: {
    padding: 10,
  },
  titleActivityContainer: {
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
  }
});
