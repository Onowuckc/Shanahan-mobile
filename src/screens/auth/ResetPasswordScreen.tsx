import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import api from '../../api/client';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { MailIcon, LockIcon, KeyIcon, CheckIcon, AlertIcon } from '../../components/Icons';

export const ResetPasswordScreen = ({ navigation }: any) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRequestToken = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    try {
      setMessage(null);
      setLoading(true);
      await api.post('/auth/forgot-password', { email: email.trim() });
      setStep(2);
      setMessage({
        type: 'success',
        text: 'Reset instructions & verification token have been sent to your email address.',
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to request reset. Check your email address.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token.trim()) {
      setMessage({ type: 'error', text: 'Please enter the reset token sent to your email.' });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      setMessage(null);
      setLoading(true);
      await api.post('/auth/reset-password', {
        email: email.trim(),
        token: token.trim(),
        newPassword,
      });
      setMessage({ type: 'success', text: 'Password reset successful! Redirecting to Sign In...' });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1800);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Password reset failed. Invalid or expired token.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bgDark }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Reset Portal Password</Text>
          <Text style={styles.subtitle}>
            Step {step} of 2: {step === 1 ? 'Request Reset Token' : 'Set New Credentials'}
          </Text>
        </View>

        {message ? (
          <View
            style={[
              styles.msgBox,
              message.type === 'success' ? styles.msgSuccess : styles.msgError,
            ]}
          >
            {message.type === 'success' ? (
              <CheckIcon size={20} color={Colors.success} style={{ marginRight: 8 }} />
            ) : (
              <AlertIcon size={20} color={Colors.danger} style={{ marginRight: 8 }} />
            )}
            <Text
              style={[
                styles.msgText,
                { color: message.type === 'success' ? Colors.success : Colors.danger },
              ]}
            >
              {message.text}
            </Text>
          </View>
        ) : null}

        {step === 1 ? (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Forgot Your Password?</Text>
            <Text style={styles.cardDesc}>
              Enter your registered student email address. We will send a secure reset token.
            </Text>

            <Input
              label="Student Email Address"
              placeholder="e.g. student@shanahan.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<MailIcon size={20} color={Colors.accent} />}
            />

            <Button
              title="Send Reset Token"
              onPress={handleRequestToken}
              loading={loading}
              variant="gold"
              icon={<MailIcon size={20} color={Colors.primaryDark} />}
              style={{ marginTop: 8 }}
            />
          </Card>
        ) : (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Set New Password</Text>
            <Text style={styles.cardDesc}>
              Enter the reset token sent to <Text style={{ color: Colors.accent }}>{email}</Text> and choose a new password.
            </Text>

            <Input
              label="Reset Verification Token"
              placeholder="Paste token from email"
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              leftIcon={<LockIcon size={20} color={Colors.accent} />}
            />

            <Input
              label="New Password (min 8 characters)"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              leftIcon={<LockIcon size={20} color={Colors.accent} />}
            />

            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon={<LockIcon size={20} color={Colors.accent} />}
            />

            <Button
              title="Reset Password & Sign In"
              onPress={handleResetPassword}
              loading={loading}
              variant="gold"
              icon={<CheckIcon size={20} color={Colors.primaryDark} />}
              style={{ marginTop: 8 }}
            />
          </Card>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backText}>Return to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.accent,
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  msgBox: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  msgSuccess: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
  },
  msgError: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.danger,
  },
  msgText: {
    fontSize: 13,
    flex: 1,
  },
  backBtn: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 8,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
