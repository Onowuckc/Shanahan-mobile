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
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import {
  SchoolIcon,
  IDCardIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertIcon,
  ChevronRightIcon,
  CheckIcon,
} from '../../components/Icons';

export const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both Matric Number/Email and Password');
      return;
    }

    try {
      setErrorMsg('');
      setLoading(true);
      await login(username.trim(), password);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bgDark }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* University Header Branding */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <SchoolIcon size={36} color={Colors.accent} />
          </View>
          <Text style={styles.universityTitle}>SHANAHAN UNIVERSITY</Text>
          <Text style={styles.portalSubTitle}>Student Mobile Portal</Text>
        </View>

        {/* Login Card */}
        <Card style={styles.card}>
          <Text style={styles.formTitle}>Student Sign In</Text>
          <Text style={styles.formSubtitle}>
            Access your courses, results slips, hostel status & financial ledger.
          </Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <AlertIcon size={20} color={Colors.danger} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <Input
            label="Matriculation ID or Email"
            placeholder="e.g. SU/2024/CSC/042 or student@shanahan.edu"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            leftIcon={<IDCardIcon size={20} color={Colors.accent} />}
          />

          <Input
            label="Account Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<LockIcon size={20} color={Colors.accent} />}
            rightIcon={
              showPassword ? (
                <EyeOffIcon size={20} color={Colors.textMuted} />
              ) : (
                <EyeIcon size={20} color={Colors.textMuted} />
              )
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In to Portal"
            onPress={handleLogin}
            loading={loading}
            variant="gold"
            icon={<CheckIcon size={20} color={Colors.primaryDark} />}
            style={{ marginTop: 12 }}
          />
        </Card>

        {/* Claim Account Navigation Box */}
        <Card variant="outlined" style={styles.claimCard}>
          <View style={styles.claimContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.claimTitle}>First Time Student?</Text>
              <Text style={styles.claimDesc}>
                Claim & activate your new institutional portal account.
              </Text>
            </View>
            <Button
              title="Claim Account"
              onPress={() => navigation.navigate('ClaimAccount')}
              variant="outline"
              icon={<ChevronRightIcon size={18} color={Colors.accent} />}
              style={{ height: 40, paddingHorizontal: 14 }}
              textStyle={{ fontSize: 13 }}
            />
          </View>
        </Card>

        <Text style={styles.footerNote}>
          Shanahan University Academic Management Information System (UMIS)
        </Text>
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
    alignItems: 'center',
    marginVertical: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 8,
  },
  universityTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  portalSubTitle: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    padding: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  formSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: Colors.dangerBg,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    flex: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    paddingVertical: 4,
  },
  forgotText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  claimCard: {
    marginTop: 16,
    padding: 16,
  },
  claimContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  claimTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  claimDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 24,
  },
});
