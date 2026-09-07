import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ClaimAccountScreen } from '../screens/auth/ClaimAccountScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';

// Main Screens
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { CoursesScreen } from '../screens/main/CoursesScreen';
import { ResultsScreen } from '../screens/main/ResultsScreen';
import { PaymentsScreen } from '../screens/main/PaymentsScreen';
import { HostelsScreen } from '../screens/main/HostelsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

// Vector Icons Wrapper
import {
  DashboardIcon,
  DashboardIconActive,
  CoursesIcon,
  CoursesIconActive,
  ResultsIcon,
  ResultsIconActive,
  PaymentsIcon,
  PaymentsIconActive,
  HostelsIcon,
  HostelsIconActive,
  ProfileIcon,
  ProfileIconActive,
} from '../components/Icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.bgCard,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: '800',
          color: Colors.textPrimary,
          fontSize: 17,
        },
        headerTintColor: Colors.accent,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? <DashboardIconActive /> : <DashboardIcon />,
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          title: 'Courses',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? <CoursesIconActive /> : <CoursesIcon />,
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: 'Results',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? <ResultsIconActive /> : <ResultsIcon />,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          title: 'Payments',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? <PaymentsIconActive /> : <PaymentsIcon />,
        }}
      />
      <Tab.Screen
        name="Hostels"
        component={HostelsScreen}
        options={{
          title: 'Hostels',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? <HostelsIconActive /> : <HostelsIcon />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? <ProfileIconActive /> : <ProfileIcon />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bgDark },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClaimAccount" component={ClaimAccountScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
