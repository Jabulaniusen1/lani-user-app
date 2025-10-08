import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="LoginForm" options={{ headerShown: false }} />
      <Stack.Screen name="RegistrationForm" options={{ headerShown: false }} />
    </Stack>
  );
}
