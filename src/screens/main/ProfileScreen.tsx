import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import {
  ProfileIcon,
  LockIcon,
  FileIcon,
  LogoutIcon,
  CheckIcon,
  AlertIcon,
  KeyIcon,
} from '../../components/Icons';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'security' | 'biodata' | 'history'>('security');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Security / Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Biodata Form
  const [biodataForm, setBiodataForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'MALE',
    dateOfBirth: '',
    phoneNumber: '',
    state: '',
    lga: '',
    reason: '',
    documentUrl: '',
  });
  const [biodataLoading, setBiodataLoading] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [meRes, reqRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/student/biodata-requests').catch(() => ({ data: { requests: [] } })),
      ]);

      const uData = meRes.data?.user;
      setProfile(uData);

      if (uData?.student) {
        setBiodataForm({
          firstName: uData.student.firstName || '',
          lastName: uData.student.lastName || '',
          gender: uData.student.gender || 'MALE',
          dateOfBirth: uData.student.dateOfBirth ? uData.student.dateOfBirth.split('T')[0] : '',
          phoneNumber: uData.student.phoneNumber || '',
          state: uData.student.state || '',
          lga: uData.student.lga || '',
          reason: '',
          documentUrl: '',
        });
      }

      setMyRequests(reqRes.data?.requests || []);
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Incomplete Form', 'Please enter your current and new password.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Weak Password', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Success', 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      Alert.alert('Update Failed', err.response?.data?.error || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleBiodataSubmit = async () => {
    if (!biodataForm.reason.trim()) {
      Alert.alert('Reason Required', 'Please provide a clear reason for requesting a biodata change.');
      return;
    }

    const requestedData: any = {};
    if (biodataForm.firstName !== profile?.student?.firstName) requestedData.firstName = biodataForm.firstName;
    if (biodataForm.lastName !== profile?.student?.lastName) requestedData.lastName = biodataForm.lastName;
    if (biodataForm.gender !== profile?.student?.gender) requestedData.gender = biodataForm.gender;
    if (biodataForm.dateOfBirth) requestedData.dateOfBirth = biodataForm.dateOfBirth;
    if (biodataForm.phoneNumber !== profile?.student?.phoneNumber) requestedData.phoneNumber = biodataForm.phoneNumber;
    if (biodataForm.state !== profile?.student?.state) requestedData.state = biodataForm.state;
    if (biodataForm.lga !== profile?.student?.lga) requestedData.lga = biodataForm.lga;

    if (Object.keys(requestedData).length === 0) {
      Alert.alert('No Changes Detected', 'Please modify at least one field before submitting.');
      return;
    }

    try {
      setBiodataLoading(true);
      await api.post('/student/biodata-request', {
        requestedData,
        reason: biodataForm.reason.trim(),
        documentUrl: biodataForm.documentUrl.trim(),
      });
      Alert.alert('Request Submitted', 'Biodata change request submitted to Registry for approval.');
      fetchProfileData();
      setActiveTab('history');
    } catch (err: any) {
      Alert.alert('Submission Error', err.response?.data?.error || 'Failed to submit request.');
    } finally {
      setBiodataLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of the student portal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Profile & Settings...</Text>
      </View>
    );
  }

  const student = profile?.student;
  const initials = `${student?.firstName?.[0] || 'S'}${student?.lastName?.[0] || 'U'}`.toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Profile Card Header */}
        <Card variant="accent" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.profileName}>
                {student?.firstName} {student?.lastName}
              </Text>
              <Text style={styles.profileMatric}>Matric: {student?.matricNumber}</Text>
              <Text style={styles.profileDept}>
                {student?.department?.name || 'Department of Computer Science'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.profileFooter}>
            <Text style={styles.footerLevel}>{student?.level || 100} Level Student</Text>
            <Button
              title="Sign Out"
              onPress={handleLogout}
              variant="danger"
              icon={<LogoutIcon size={16} color={Colors.danger} />}
              style={{ height: 34, paddingHorizontal: 12 }}
              textStyle={{ fontSize: 12 }}
            />
          </View>
        </Card>

        {/* Tab Buttons */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'security' && styles.tabBtnActive]}
            onPress={() => setActiveTab('security')}
          >
            <Text style={[styles.tabText, activeTab === 'security' && styles.tabTextActive]}>
              Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'biodata' && styles.tabBtnActive]}
            onPress={() => setActiveTab('biodata')}
          >
            <Text style={[styles.tabText, activeTab === 'biodata' && styles.tabTextActive]}>
              Biodata Change
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              Requests ({myRequests.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'security' && (
          <Card style={styles.contentCard}>
            <Text style={styles.cardTitle}>Change Portal Password</Text>
            <Text style={styles.cardDesc}>
              Update your security credentials regularly to secure your portal account.
            </Text>

            <Input
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
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
              title="Update Password"
              onPress={handlePasswordChange}
              loading={passwordLoading}
              variant="gold"
              icon={<CheckIcon size={20} color={Colors.primaryDark} />}
              style={{ marginTop: 8 }}
            />
          </Card>
        )}

        {activeTab === 'biodata' && (
          <Card style={styles.contentCard}>
            <Text style={styles.cardTitle}>Apply for Biodata Correction</Text>
            <Text style={styles.cardDesc}>
              Institutional records require Registry approval. Submit proposed modifications and supporting document link.
            </Text>

            <Input
              label="First Name"
              value={biodataForm.firstName}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, firstName: text })}
            />

            <Input
              label="Last Name"
              value={biodataForm.lastName}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, lastName: text })}
            />

            <Input
              label="Phone Number"
              value={biodataForm.phoneNumber}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, phoneNumber: text })}
              keyboardType="phone-pad"
            />

            <Input
              label="State of Origin"
              value={biodataForm.state}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, state: text })}
            />

            <Input
              label="Local Government Area (LGA)"
              value={biodataForm.lga}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, lga: text })}
            />

            <Input
              label="Supporting Document URL (Affidavit / Gazette)"
              placeholder="https://drive.google.com/..."
              value={biodataForm.documentUrl}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, documentUrl: text })}
            />

            <Input
              label="Reason for Change Request *"
              placeholder="Explain why biodata modification is requested"
              value={biodataForm.reason}
              onChangeText={(text: string) => setBiodataForm({ ...biodataForm, reason: text })}
              multiline
              numberOfLines={3}
              style={{ height: 70 }}
            />

            <Button
              title="Submit Request to Registry"
              onPress={handleBiodataSubmit}
              loading={biodataLoading}
              variant="gold"
              icon={<CheckIcon size={20} color={Colors.primaryDark} />}
              style={{ marginTop: 10 }}
            />
          </Card>
        )}

        {activeTab === 'history' && (
          <View>
            {myRequests.length === 0 ? (
              <Card style={styles.emptyCard}>
                <FileIcon size={36} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No biodata change requests submitted yet.</Text>
              </Card>
            ) : (
              myRequests.map((req: any) => (
                <Card key={req.id} style={styles.reqCard}>
                  <View style={styles.reqHeader}>
                    <Text style={styles.reqDate}>
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
                    </Text>
                    <Badge
                      label={req.status}
                      variant={
                        req.status === 'APPROVED'
                          ? 'success'
                          : req.status === 'REJECTED'
                          ? 'danger'
                          : 'warning'
                      }
                    />
                  </View>

                  <Text style={styles.reqReason}>
                    <Text style={{ fontWeight: '700' }}>Reason: </Text>
                    {req.reason}
                  </Text>

                  {req.adminNote ? (
                    <View style={styles.adminNoteBox}>
                      <Text style={styles.adminNoteText}>
                        <Text style={{ fontWeight: '700' }}>Registry Note: </Text>
                        {req.adminNote}
                      </Text>
                    </View>
                  ) : null}
                </Card>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 12,
  },
  profileCard: {
    padding: 18,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileMatric: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  profileDept: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGold,
    marginVertical: 14,
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLevel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.borderGold,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.accent,
    fontWeight: '800',
  },
  contentCard: {
    padding: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: Colors.textMuted,
    marginTop: 10,
    fontSize: 14,
  },
  reqCard: {
    padding: 14,
    marginBottom: 10,
  },
  reqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reqDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  reqReason: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  adminNoteBox: {
    backgroundColor: Colors.bgInput,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  adminNoteText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
