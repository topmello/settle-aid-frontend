//@ts-nocheck
import React,{useState} from 'react';
import {View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import {useTheme, Button} from "react-native-paper";
import {AnimatedButton} from "./AnimatedButton";
import {useSelector} from "react-redux";
import {RouteResult} from "../types/route";
import {Menu} from "react-native-popup-menu";

const RouteCard = ({routeResult, isSimplified}) => {
    const theme = useTheme();


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        row_text: {
            paddingHorizontal: 16,
            marginTop: 24,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
        },
        text_title: {
            alignContent: "center",
            fontWeight: "bold",
            fontSize: 28,
        },
        card: {
            backgroundColor: theme.colors.infoContainer,
            height: 170,
            borderRadius: 15,
            marginHorizontal: 20,
            marginBottom: 10,
            marginTop: 10,
        },
        cardSim: {
            backgroundColor: theme.colors.infoContainer,
            height: 90,
            borderRadius: 15,
            marginHorizontal: 10,
            marginBottom: 10,
            marginTop: 20,
        },
        card_title: {
            fontWeight: "bold",
            fontSize: 28,
            marginTop: 20,
            marginLeft: 20,
            color: theme.colors.info
        },
        card_description: {
            fontSize: 20,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 8,
            marginBottom: 8,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        },
        tags_container: {
            flexDirection: 'row',
            marginLeft: 20,
            marginBottom: 20,
            marginTop: 2,
        },
        tag: {
            fontSize: 14,
            marginRight: 8,
            color: theme.colors.info
        },
        button_container: {
            flexDirection: 'row',
            marginLeft: 20,
            marginRight: 16,
            marginTop: 16,
            marginBottom: 20
        },
        circle: {
            marginLeft: 10,
            marginRight: 10,
            width: 44,
            height: 44,
            borderRadius: 42,
            backgroundColor: theme.colors.info,
        },
        button: {
            marginLeft: 8,
            marginRight: 8,
            width: 110,
        }
    });

    return (
        <AnimatedButton height={100} style={isSimplified ? styles.cardSim : styles.card}>
            <Text style={styles.card_title} numberOfLines={1}
                  ellipsizeMode='tail'>{routeResult.route.locations[0]}</Text>
            <View style={styles.tags_container}>

                {
                    routeResult.route.locations.map((location, index) => (
                        <Text key={index}
                              style={styles.tag}
                              numberOfLines={1}
                              ellipsizeMode='tail'>
                            {`#${location}`}
                        </Text>
                    ))
                }
            </View>
        </AnimatedButton>
    );


};

export default RouteCard;
