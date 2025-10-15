import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import GoogleLogo from "@/components/icons/GoogleLogo";
import FacebookLogo from "@/components/icons/FacebookLogo";
import AppleLogo from "@/components/icons/AppleLogo";
import { useSession } from "@/auth/ctx";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "@/constants/Colour";
import LoadingButton from "@/components/LoadingButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const { login } = useSession();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by the auth state change
    } catch (error) {
      // Error notification is already handled in the auth context
      console.log('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "A password reset link will be sent to your email address.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Reset Link",
          onPress: () => console.log("Reset link sent"),
        },
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

  const handleRegister = () => {
    router.replace("/auth/RegistrationForm");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/laanieats-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>
          </View>
          {/* <View style={styles.checkboxContainer}>
          <Pressable
            style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]}
            onPress={() => setKeepLoggedIn(!keepLoggedIn)}
          >
            {keepLoggedIn && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
          <Text style={styles.checkboxText}>Keep me logged in</Text>
        </View> */}
          <LoadingButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or log in with</Text>
            <View style={styles.dividerLine} />
          </View>
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
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Pressable onPress={handleRegister}>
              <Text style={styles.registerLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.tabBar,
  },
  header: {
    backgroundColor: Color.tabBar,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 120,
    height: 80,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B35",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
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
    marginBottom: 32,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialLogo: {
    width: 24,
    height: 24,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#1A1A1A",
    fontSize: 16,
  },
  registerLink: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
