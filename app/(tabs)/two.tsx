//@ts-nocheck
import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, Text, View, ScrollView, Animated, TouchableOpacity, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {useTranslation} from 'react-i18next';  // <-- Import the hook
import {FONTS} from "../../assets/constant/constant";
import AccountCircleIcon from "../../assets/images/icons/account_circle.svg";
import DistanceIcon from "../../assets/images/icons/distance.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import RestaurantIcon from "../../assets/images/icons/restaurant_menu.svg";

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

    const AnimatedRectangle = ({height, color, children, onPress}) => {
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
                <Animated.View style={[styles.roundedRectangle, {
                    height: height,
                    backgroundColor: color,
                    transform: [{scale: scaleAnim}]
                }]}>
                    {children}
                </Animated.View>
            </TouchableOpacity>
        );
    }
    AnimatedRectangle.defaultProps = {
        height: 120,
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{t('home:title')}</Text>
                    <AccountCircleIcon
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
                    <View style={styles.marginTop}>
                        <AnimatedRectangle color="#DEE1FF" onPress={handleStartClick}>
                            <View style={[styles.flexRow, {flex: 1, alignItems: 'center'}]}>
                                <DistanceIcon
                                    width={styles.iconNav.width}
                                    height={styles.iconNav.height}
                                    style={styles.iconNav}

                                />
                                <View style={[{alignContent: 'center'}, styles.flexColumn]}>
                                    <Text style={styles.textStartCard}>{t('home:startCard')}</Text>
                                    <Text style={styles.textStartCardInfo}>{t('home:startCardInfo')}</Text>
                                </View>
                            </View>
                        </AnimatedRectangle>
                    </View>
                </View>
                <View style={styles.rowHistory}>
                    <View style={styles.flexRow}>
                        <Text style={styles.titleSecond}>{t('home:historyTitle')}</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { /* handle action */
                        }}>
                            <View style={[styles.flexRow, {alignItems: 'center', marginRight: 30, marginTop: 10}]}>
                                <Text style={styles.textMore}>{t('home:more')}</Text>
                                <ArrowIcon
                                    width={styles.iconArrow.width}
                                    height={styles.iconArrow.height}
                                    fill={styles.iconArrow.fill}
                                    style={styles.iconArrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.marginTop}>
                        <View style={styles.flexRow}>
                            <Text style={styles.textDate}>WEDNESDAY 13 JULY</Text>
                        </View>
                        <AnimatedRectangle height={100} color="#EDEBDA" onPress={handleStartClick}>
                            <View style={[styles.flexRow, {flex: 1, alignItems: 'center'}]}>
                                <View style={styles.iconHistoryWrapper}>
                                    <RestaurantIcon
                                        width={styles.iconHistory.width}
                                        height={styles.iconHistory.height}
                                        style={styles.iconHistory}
                                    />
                                </View>
                                <View style={[{flex: 2}, styles.flexColumn]}>
                                    <Text style={[styles.textStartCard,{fontSize: FONTS.Mid}]}>{t('home:startCard')}</Text>
                                    <Text style={styles.textStartCardInfo}>{t('home:startCardInfo')}</Text>
                                </View>
                            </View>
                        </AnimatedRectangle>
                    </View>
                </View>
                <View style={styles.rowBeloved}>
                    <View style={styles.flexRow}>
                        <Text style={styles.titleSecond}>{t('home:belovedRoutine')}</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => { /* ***** */
                        }}>
                            <View style={[styles.flexRow, {alignItems: 'center', marginRight: 30, marginTop: 10}]}>
                                <Text style={styles.textMore}>{t('home:more')}</Text>
                                <ArrowIcon
                                    width={styles.iconArrow.width}
                                    height={styles.iconArrow.height}
                                    fill={styles.iconArrow.fill}
                                    style={styles.iconArrow}/>
                            </View>
                        </TouchableOpacity>
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
        marginLeft: 30,
        marginBottom: 0,
        flex: 3,
        fontSize: FONTS.Large,
        fontWeight: 'bold',
        margin: 10,
    },
    iconAccount: {
        marginTop: 30,
        marginRight: 30,
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
        marginVertical: 10,
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
        fill: '#5B4E77',
        marginLeft: 20,
    },
    iconHistory: {
        width: 35,
        height: 35,
        fill: '#5B4E77',
    },

    iconHistoryWrapper: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#FFFFCC',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 30,

    },
    textStartCard: {
        marginTop: 40,
        marginLeft: 20,
        height: 30,
        fontSize: FONTS.Large,
        flex: 3,
        fontWeight: 'bold',
    },
    textStartCardInfo: {
        marginBottom: 30,
        marginLeft: 20,
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
        fill: "#1436B8",
        resizeMode: 'contain',
    },
});
