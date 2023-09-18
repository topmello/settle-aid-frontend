//@ts-nocheck

import React, {useRef, useState, useEffect} from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
    Animated,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform, Pressable,
} from "react-native";
import {Button, Text} from "react-native-paper";
import {useTranslation} from "react-i18next"; // <-- Import the hook
import {useTheme} from "react-native-paper";
import {router, useLocalSearchParams, useRouter} from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import {useSelector} from "react-redux";
import {selectUserId, selectToken} from "../../store/authSlice";
import RouteCard from "../../components/RouteCard";

export default function HistoryOverviewScreen() {
    const {t} = useTranslation();
    const theme = useTheme();
    const userID = useSelector(selectUserId);
    const token = useSelector(selectToken);

    const {routeJSON} = useLocalSearchParams();
    // const {routeList} = params;
    const routeList = JSON.parse(routeJSON)


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
            // height: 200,
            borderRadius: 15,
            marginHorizontal: 20,
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
            marginBottom: 16,
            marginTop: 2,
        },
        tag: {
            fontSize: 18,
            marginRight: 8
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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
        >
            <ScrollView contentContainerStyle={{
                flexGrow: 1,
                flexDirection: "column",
            }}>
                <View style={styles.row_text}>
                    <Pressable onPress={() => router.back()}>
                        <ArrowBackIcon
                            fill={theme.colors.onPrimaryContainer}
                            width={34}
                            height={34}
                        />
                    </Pressable>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={styles.text_title}>
                            Route History
                        </Text>
                    </View>
                    <View style={{width: 34, height: 34}}></View>
                </View>

                <View>

                    {
                        routeList.map((result, index) => (
                            <RouteCard
                                key={index}
                                routeResult={result}
                                isSimplified={false}
                            />
                        ))
                    }
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

