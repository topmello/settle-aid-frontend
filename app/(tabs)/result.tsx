import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import useLogin from '../../hooks/useLogin';

import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';

export default function TabTwoScreen() {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();

  const { isLoading, token, error } = useSelector((state: RootState) => state.login)
  useLogin('admin','admin')
  console.log(isLoading, token, error)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two {count}</Text>
      <Text onPress={() => dispatch({ type: 'counter/increment' })}>Increment</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
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
