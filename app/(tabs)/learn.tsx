import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { tips } from "../../tips/tips.json";
import { Ionicons } from "@expo/vector-icons";

const iconList = [
  "airplane-outline",
  "flag-outline",
  "restaurant-outline",
  "sunny-outline",
  "call-outline",
  "medkit-outline",
  "wallet-outline",
  "people-outline",
  "chatbubble-outline",
];

export default function LearnScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 20,
      }}
    >
      <Text variant="titleLarge">Cultural Tips</Text>
      <ScrollView
        style={{
          paddingTop: 20,
        }}
      >
        {tips.map((category, cateIndex) => {
          return (
            <View
              key={cateIndex}
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Ionicons
                size={24}
                style={{ marginTop: 20 }}
                color={theme.colors.primary}
                name={iconList[cateIndex]}
              />
              <List.Section title={category.title} key={`${cateIndex}`} style={{
                flex: 1,
              }}>
                {category.tips.map((subcate, subcateIndex) => {
                  return (
                    <List.Accordion
                      key={`${cateIndex}-${subcateIndex}`}
                      title={subcate.mode}
                    >
                      {subcate.type.map((tip, itemIndex) => {
                        return (
                          <List.Item
                            title={tip.description}
                            description={tip.content}
                            key={`${cateIndex}-${subcateIndex}-${itemIndex}`}
                          />
                        );
                      })}
                    </List.Accordion>
                  );
                })}
              </List.Section>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
