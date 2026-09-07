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
import {
  IDCardIcon,
  LockIcon,
  CheckIcon,
  AlertIcon,
  ChevronRightIcon,
} from '../../components/Icons';

export const ClaimAccountScreen = ({ navigation }: any) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [studentInfo, setStudentInfo] = useState<any>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleVerify = async () => {
    if (!identifier.trim()) {
      setMessage({ type: 'error', text: 'Please input your Matric Number or Email address.' });
      return;
    }

    try {
      setMessage(null);
      setLoading(true);
      const res = await api.post('/auth/claim-account/verify', { identifier: identifier.trim() });
      setStudentInfo(res.data.student);
      setStep(2);
      setMessage({ type: 'success', text: 'Student identity verified! Create your password.' });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Verification failed. Student profile not found or already claimed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!password || password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      setMessage(null);
      setLoading(true);
      await api.post('/auth/claim-account/activate', {
        identifier: identifier.trim(),
        password,
      });
      setMessage({ type: 'success', text: 'Account activated successfully! Redirecting to Sign In...' });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1800);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Account activation failed. Try again.',
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
          <Text style={styles.title}>Claim Student Account</Text>
          <Text style={styles.subtitle}>
            Step {step} of 2: {step === 1 ? 'Verify Identity' : 'Set Portal Credentials'}
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
            <Text style={styles.stepTitle}>Identify Your Record</Text>
            <Text style={styles.stepDesc}>
              Enter your Matriculation Number or institutional email provided during admission.
            </Text>

            <Input
              label="Matric Number or Email"
              placeholder="e.g. SU/2024/CSC/042"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              leftIcon={<IDCardIcon size={20} color={Colors.accent} />}
            />

            <Button
              title="Verify Student Identity"
              onPress={handleVerify}
              loading={loading}
              variant="gold"
              icon={<ChevronRightIcon size={20} color={Colors.primaryDark} />}
              style={{ marginTop: 8 }}
            />
          </Card>
        ) : (
          <Card style={styles.card}>
            <View style={styles.profileBadge}>
              <Text style={styles.profileName}>
                {studentInfo?.firstName} {studentInfo?.lastName}
              </Text>
              <Text style={styles.profileDetail}>
                {studentInfo?.matricNumber} • {studentInfo?.program?.name || 'Student'}
              </Text>
            </View>

            <Input
              label="New Portal Password (min 8 characters)"
              placeholder="Enter strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<LockIcon size={20} color={Colors.accent} />}
            />

            <Input
              label="Confirm New Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon={<LockIcon size={20} color={Colors.accent} />}
            />

            <Button
              title="Activate Account & Set Password"
              onPress={handleActivate}
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
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepDesc: {
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
  profileBadge: {
    backgroundColor: Colors.primary,
    borderColor: Colors.borderGold,
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileDetail: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 2,
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
