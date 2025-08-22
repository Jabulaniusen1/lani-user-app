import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistrationForm from '@/components/auth/RegistrationForm';
import OTPVerification from '@/components/auth/OTPVerification';
import SuccessPopup from '@/components/auth/SuccessPopup';

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState<'registration' | 'otp' | 'success'>('registration');
  const [userData, setUserData] = useState<{ fullName: string; email: string; phone: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegistrationContinue = (data: { fullName: string; email: string; phone: string }) => {
    setUserData(data);
    setCurrentStep('otp');
  };

  const handleVerificationSuccess = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {currentStep === 'registration' && (
        <RegistrationForm onContinue={handleRegistrationContinue} />
      )}
      
      {currentStep === 'otp' && userData && (
        <OTPVerification
          onVerificationSuccess={handleVerificationSuccess}
          phoneNumber={userData.phone}
        />
      )}

      <SuccessPopup visible={showSuccess} onClose={handleSuccessClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
