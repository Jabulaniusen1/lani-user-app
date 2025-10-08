import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import GoogleLogo from "@/components/icons/GoogleLogo";
import FacebookLogo from "@/components/icons/FacebookLogo";
import AppleLogo from "@/components/icons/AppleLogo";
import { useSession } from "../../auth/ctx";
import { Color } from "@/constants/Colour";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegistrationForm() {
  const { register } = useSession();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    const isValid = validateForm();

    if (isValid) {
      register(email, password);
      router.replace("/(tabs)");
    }
  };

  const handleContinueAsGuest = () => {
    Alert.alert(
      "Continue as Guest",
      "You can browse the app without creating an account. Some features may be limited.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: () => router.replace("/(tabs)") },
      ]
    );
  };

  const handleSocialLogin = (platform: string) => {
    Alert.alert(
      `${platform} Login`,
      `${platform} login functionality will be implemented here.`,
      [{ text: "OK" }]
    );
  };

  const handleLogin = () => {
    router.push("/auth/LoginForm");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Let's get started</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Let's know your full name</Text>
        <TextInput
          style={[styles.input, errors.fullName ? styles.inputError : null]}
          placeholder="Full name here"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="example@email.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : null]}
          placeholder="Enter password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      {/* Continue */}
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.continueButton, styles.pressed]
            : styles.continueButton
        }
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>

      {/* Continue as Guest */}
      <Pressable style={styles.guestButton} onPress={handleContinueAsGuest}>
        <Text style={styles.guestButtonText}>Continue as guest</Text>
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Logins */}
      <View style={styles.socialContainer}>
        <Pressable
          style={styles.socialButton}
          onPress={() => handleSocialLogin("Google")}
        >
          <GoogleLogo width={24} height={24} />
        </Pressable>

        <Pressable
          style={styles.socialButton}
          onPress={() => handleSocialLogin("Facebook")}
        >
          <FacebookLogo width={24} height={24} />
        </Pressable>

        <Pressable
          style={styles.socialButton}
          onPress={() => handleSocialLogin("Apple")}
        >
          <AppleLogo width={24} height={24} />
        </Pressable>
      </View>

      {/* Login */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Pressable onPress={handleLogin}>
          <Text style={styles.loginLink}>Log in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: "30%",
    backgroundColor: Color.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pressed: {
    opacity: 0.65,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  guestButton: {
    alignItems: "center",
    marginTop: 16,
  },
  guestButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#1A1A1A",
    fontSize: 16,
  },
  loginLink: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
