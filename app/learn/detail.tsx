import { Button, Text } from "react-native-paper";
import { useTip } from "../../store/TipContext";
import { useAppTheme } from "../../theme/theme";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useMemo, useEffect } from "react";

export default function LearnDetailScreen() {
  const { currentTip, canNext, canPrev, nextTip, prevTip, category, resultTip, setResultTip } = useTip();
  const theme = useAppTheme();

  const colorCombinations = useMemo(() => {
    return [
      {
        primary: theme.colors.primary,
        onPrimary: theme.colors.onPrimary,
        primaryContainer: theme.colors.primaryContainer,
        onPrimaryContainer: theme.colors.onPrimaryContainer,
      },
      {
        primary: theme.colors.tertiary,
        onPrimary: theme.colors.onTertiary,
        primaryContainer: theme.colors.tertiaryContainer,
        onPrimaryContainer: theme.colors.onTertiaryContainer,
      },
      {
        primary: theme.colors.error,
        onPrimary: theme.colors.onError,
        primaryContainer: theme.colors.errorContainer,
        onPrimaryContainer: theme.colors.onErrorContainer,
      },
      {
        primary: theme.colors.success,
        onPrimary: theme.colors.onSuccess,
        primaryContainer: theme.colors.successContainer,
        onPrimaryContainer: theme.colors.onSuccessContainer,
      },
      {
        primary: theme.colors.info,
        onPrimary: theme.colors.onInfo,
        primaryContainer: theme.colors.infoContainer,
        onPrimaryContainer: theme.colors.onInfoContainer,
      },
    ];
  }, [theme.colors]);

  useEffect(() => {
    return ()=> {
      setResultTip({
        description: "",
        content: "",
      });
    }
  }, [])

  const randomColor = useMemo(() => {
    return colorCombinations[
      Math.floor(Math.random() * colorCombinations.length)
    ];
  }, [colorCombinations]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 20,
        backgroundColor: randomColor.primaryContainer,
      }}
    >
      <View
        style={{
          marginTop: 32,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {router.canGoBack() ? (
          <Pressable onPress={() => router.back()}>
            <ArrowBackIcon
              fill={randomColor.onPrimaryContainer}
              width={34}
              height={34}
            />
          </Pressable>
        ) : (
          <View></View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          paddingVertical: 40,
          paddingHorizontal: 8,
        }}
      >
        <Text
          variant="headlineLarge"
          style={{
            color: randomColor.onPrimaryContainer,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          {
            resultTip?.description? resultTip.description : currentTip?.description
          }
        </Text>
        <Text
          variant="headlineSmall"
          style={{
            color: randomColor.onPrimaryContainer,
            lineHeight: 34,
          }}
        >
          {
            resultTip?.content? resultTip.content : currentTip?.content
          }
        </Text>
      </View>
      <View
        style={{
          height: 140,
          alignItems: "center",
          gap: 32,
        }}
      >
        {canNext && (
          <Button
            style={{
              width: 140,
            }}
            buttonColor={randomColor.primary}
            textColor={randomColor.onPrimary}
            mode="contained"
            onPress={nextTip}
            disabled={!canNext}
          >
            Next
          </Button>
        )}
        {canPrev && (
          <Button
            style={{
              width: 140,
            }}
            textColor={randomColor.primary}
            onPress={prevTip}
            disabled={!canPrev}
          >
            Previous
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
