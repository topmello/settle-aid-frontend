//@ts-nocheck
import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Image, ScrollView, Animated, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import {useTranslation} from 'react-i18next';  // <-- Import the hook
import {FONTS} from "../../assets/constant/constant";

export default function TabTwoScreen() {
    const {t} = useTranslation();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    //animation scale
    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };
    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };
    //onclick for startCard
    const handleStartClick = () => {
        console.log("Rectangle clicked!");
    };

    const AnimatedRectangle = ({ color, children, onPress }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const onPressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }).start();
        };

        const onPressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        };

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={onPress}>
                <Animated.View style={[styles.roundedRectangle, {backgroundColor: color, transform: [{ scale: scaleAnim }]}]}>
                    {children}
                </Animated.View>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{t('home:title')}</Text>
                    <Image
                        source={require("../../assets/images/account.png")}
                        fadeDuration={0}
                        style={styles.iconAccount}
                    />
                </View>
                <View style={styles.rowWeather}>
                    <Image
                        source={require("../../assets/images/weather.png")}
                        fadeDuration={0}
                        style={{resizeMode: 'contain', width: '100%', height: '100%'}}
                    />
                </View>
                <View style={styles.rowStart}>
                    <Text style={[styles.titleSecond, {height: 30}]}>{t('home:startTitle')}</Text>
                    <AnimatedRectangle color="#DEE1FF" onPress={handleStartClick}>
                        <View style={[styles.flexRow, {flex: 3}]}>
                            <Image
                                source={require("../../assets/images/nav.png")}
                                fadeDuration={0}
                                style={styles.iconNav}
                            />
                            <View style={styles.flexColumn}>
                                <Text style={styles.textStartCard}>{t('home:startCard')}</Text>
                                <Text style={styles.textStartCardInfo}>{t('home:startCardInfo')}</Text>
                            </View>
                        </View>
                    </AnimatedRectangle>
                </View>
                <View style={styles.rowHistory}>
                    <View style={styles.flexRow}>
                        <Text style={styles.titleSecond}>{t('home:historyTitle')}</Text>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { /* handle action */ }}>
                            <View style={[styles.flexRow, { alignItems: 'center', marginRight: 30, marginTop:10 }]}>
                                <Text style={styles.textMore}>{t('home:more')}</Text>
                                <Image style={styles.iconArrow} source={require("../../assets/images/arrow.png")} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.flexRow}>
                        <Text style={styles.textDate}>WEDNESDAY 13 JULY</Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={styles.marginTop}>
                        <AnimatedRectangle color="#EDEBDA" onPress={handleStartClick}>
                            <View style={[styles.flexRow, {flex: 3}]}>
                                <Image
                                    source={require("../../assets/images/nav.png")}
                                    fadeDuration={0}
                                    style={styles.iconNav}
                                />
                                <View style={styles.flexColumn}>
                                    <Text style={styles.textStartCard}>{t('home:startCard')}</Text>
                                    <Text style={styles.textStartCardInfo}>{t('home:startCardInfo')}</Text>
                                </View>
                            </View>
                        </AnimatedRectangle>
                    </View>

                </View>



            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollViewContent: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    titleRow: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    title: {
        marginTop: 30,
        marginLeft: 20,
        marginBottom: 0,
        flex: 3,
        fontSize: FONTS.Large,
        fontWeight: 'bold',
        margin: 10,
    },
    iconAccount: {
        marginTop: 30,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 18,
        width: 40,
        height: 40,
    },
    rowWeather: {
        height: 120, // Or whatever height you need
    },
    rowStart: {
        height: 170,
    },
    titleSecond: {
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 0,
        height: 30,
        fontSize: FONTS.Mid,
        fontWeight: 'bold',
        margin: 10,
    },
    roundedRectangle: {
        height: 120,
        borderRadius: 15,  // To achieve rounded corners
        marginHorizontal: 20,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    rowHistory: {
        height: 400, // Or whatever height you need
    },
    colorViolet: {
        backgroundColor: '#DEE1FF',
    },
    colorYellow: {
        backgroundColor: '#FFEB3B',
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    iconNav: {
        width: 50,
        height: 50,
        marginLeft: 5,
        marginTop: 30,
        resizeMode: 'contain',
        flex: 1,
        color: '#5B4E77',
    },
    textStartCard: {
        marginTop: 40,
        marginRight: 20,
        height: 30,
        fontSize: FONTS.Large,
        flex: 3,
        fontWeight: 'bold',
    },
    textStartCardInfo: {
        marginBottom: 30,
        color: '#5B4E77',
    },
    textDate: {
        marginLeft: 20,
        marginBottom: 10,
        height: 30,
        fontSize: FONTS.Mid,
        fontWeight: 'bold',
        margin: 10,
        color: '#46464F',
    },
    textMore: {
        color: "#1436B8",
        marginTop: 12,
        textAlign: 'right',
        height: 30,
        fontSize: FONTS.Small,
        fontWeight: 'bold',
    },

    iconArrow: {
        alignSelf: 'top',
        marginTop: 10,
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});
