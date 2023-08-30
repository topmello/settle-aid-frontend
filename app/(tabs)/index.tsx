import { StyleSheet, Pressable } from 'react-native';
import React, {useState} from 'react';
import * as Location from 'expo-location';
import { Link, Tabs } from 'expo-router';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { useTranslation } from "react-i18next";
import { createContext } from "react";

export default function TabOneScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text>{t("test:helloWorld")}</Text>
      <Link href="/Location" asChild>
      <Pressable
      style={{
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      }}>
        <Text
        style={{ color: 'white', fontSize: 16 }}>Start Planning</Text>
      </Pressable>
    </Link>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
