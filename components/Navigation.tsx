import React, { useEffect, useState } from 'react'
import HomeScreen from './HomeScreen';
import MulhouseAPI from "./MulhouseAPI";
import Account from "./Account";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Session } from '@supabase/supabase-js'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Navigation = ({ route }: { route: { params: { session: Session | null } } }) => {
    const { session } = route.params;
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeScreen} initialParams={{ session }} />
            <Tab.Screen name="Mulhouse" component={MulhouseAPI} initialParams={{ session }} />
            <Tab.Screen name="Mon Compte" component={Account} initialParams={{ session }} />
        </Tab.Navigator>
    );
};

export default Navigation;
