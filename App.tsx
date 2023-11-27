import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Navigation from './components/Navigation'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

function HomeScreen() {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
  );
}

function SettingsScreen() {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={Auth}/>
              <Stack.Screen name="Mavigation" component={Navigation} initialParams={{ session: session }}/>
          </Stack.Navigator>
      </NavigationContainer>
  );
}
