import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import api from '../../api/client';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import {
  CoursesIcon,
  ResultsIcon,
  HostelsIcon,
  PaymentsIcon,
  CheckIcon,
  AlertIcon,
  ChevronRightIcon,
  RefreshIcon,
} from '../../components/Icons';

interface DashboardData {
  profile: {
    id: string;
    matricNumber: string;
    firstName: string;
    lastName: string;
    level: number;
    gender: string;
    phoneNumber: string | null;
    metadata: Record<string, any> | null;
    department: {
      name: string;
      faculty: { name: string };
    };
    program: {
      name: string;
    };
  };
  activeSession: string;
  activeSemester: string;
  financials: {
    totalDue: number;
    totalPaid: number;
    outstanding: number;
  };
  academic: {
    courseRegStatus: 'NOT_REGISTERED' | 'PENDING_APPROVAL' | 'APPROVED';
    hostelStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
    allocatedHostelName: string | null;
  };
}

export const DashboardScreen = ({ navigation }: any) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, fieldsRes] = await Promise.all([
        api.get('/student/dashboard-stats'),
        api.get('/admin/settings/custom-fields?key=custom_student_fields').catch(() => ({ data: { data: [] } })),
      ]);
      setData(dashRes.data);
      setCustomFields(fieldsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Student Dashboard...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <AlertIcon size={40} color={Colors.danger} />
        <Text style={styles.emptyTitle}>Failed to Load Dashboard</Text>
        <Text style={styles.emptySubtitle}>Unable to retrieve your student profile.</Text>
        <Button
          title="Retry Loading"
          onPress={fetchDashboardData}
          variant="outline"
          icon={<RefreshIcon size={18} color={Colors.accent} />}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const { profile, activeSession, activeSemester, financials, academic } = data;
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
      }
    >
      {/* Hero Welcome Banner */}
      <Card variant="accent" style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.heroWelcome}>Welcome back,</Text>
            <Text style={styles.heroName}>{profile.firstName} {profile.lastName}</Text>
            <Text style={styles.heroMatric}>Matric: {profile.matricNumber}</Text>
          </View>
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.heroFooter}>
          <View>
            <Text style={styles.heroProgram}>{profile.program.name}</Text>
            <Text style={styles.heroSession}>
              {activeSession} Session • {activeSemester} Semester
            </Text>
          </View>
          <Badge label={`${profile.level}L Enrolled`} variant="gold" />
        </View>
      </Card>

      {/* Course Registration Warning Banner if NOT_REGISTERED */}
      {academic.courseRegStatus === 'NOT_REGISTERED' && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Courses')}
          style={styles.regBanner}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.regTitle}>Semester Course Registration Open</Text>
            <Text style={styles.regDesc}>
              Course enrollment is active for the current semester. Tap to register now.
            </Text>
          </View>
          <ChevronRightIcon size={20} color={Colors.primaryDark} />
        </TouchableOpacity>
      )}

      {/* KPI Grid */}
      <Text style={styles.sectionHeading}>Academic Summary</Text>
      <View style={styles.kpiGrid}>
        <Card style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Academic Level</Text>
            <CoursesIcon size={20} color={Colors.accent} />
          </View>
          <Text style={styles.kpiValue}>{profile.level} Level</Text>
          <Text style={styles.kpiSubText}>{profile.department.faculty.name}</Text>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Active Period</Text>
            <ResultsIcon size={20} color={Colors.accent} />
          </View>
          <Text style={styles.kpiValue}>{activeSession}</Text>
          <Text style={styles.kpiSubText}>{activeSemester} Semester</Text>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Course Reg</Text>
            <CheckIcon
              size={20}
              color={academic.courseRegStatus === 'APPROVED' ? Colors.success : Colors.warning}
            />
          </View>
          <Text
            style={[
              styles.kpiValue,
              {
                fontSize: 14,
                color: academic.courseRegStatus === 'APPROVED' ? Colors.success : Colors.warning,
              },
            ]}
          >
            {academic.courseRegStatus === 'APPROVED'
              ? 'Enrolled'
              : academic.courseRegStatus === 'PENDING_APPROVAL'
              ? 'Pending'
              : 'Unregistered'}
          </Text>
          <Text style={styles.kpiSubText}>Current Status</Text>
        </Card>

        <Card style={styles.kpiCard}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Hostel Bedspace</Text>
            <HostelsIcon size={20} color={Colors.accent} />
          </View>
          <Text
            style={[
              styles.kpiValue,
              {
                fontSize: 14,
                color: academic.hostelStatus === 'APPROVED' ? Colors.success : Colors.textPrimary,
              },
            ]}
          >
            {academic.hostelStatus === 'APPROVED'
              ? academic.allocatedHostelName
              : academic.hostelStatus === 'PENDING'
              ? 'Awaiting'
              : 'Off-Campus'}
          </Text>
          <Text style={styles.kpiSubText}>Allocation Status</Text>
        </Card>
      </View>

      {/* Financial Outstanding Box */}
      <Text style={styles.sectionHeading}>Financial Overview</Text>
      <Card style={styles.finCard}>
        <View style={styles.finHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PaymentsIcon size={22} color={Colors.accent} style={{ marginRight: 8 }} />
            <Text style={styles.finTitle}>Fee Ledger Status</Text>
          </View>
          <Badge
            label={financials.outstanding > 0 ? 'Pending Balance' : 'Cleared'}
            variant={financials.outstanding > 0 ? 'danger' : 'success'}
          />
        </View>

        <View style={styles.finRow}>
          <Text style={styles.finLabel}>Total Session Invoiced:</Text>
          <Text style={styles.finVal}>₦{financials.totalDue.toLocaleString()}</Text>
        </View>

        <View style={styles.finRow}>
          <Text style={styles.finLabel}>Total Amount Paid:</Text>
          <Text style={[styles.finVal, { color: Colors.success }]}>
            ₦{financials.totalPaid.toLocaleString()}
          </Text>
        </View>

        <View style={styles.finRowLarge}>
          <Text style={styles.finLabelLarge}>Outstanding Balance:</Text>
          <Text
            style={[
              styles.finValLarge,
              { color: financials.outstanding > 0 ? Colors.danger : Colors.success },
            ]}
          >
            ₦{financials.outstanding.toLocaleString()}
          </Text>
        </View>

        {financials.outstanding > 0 ? (
          <View style={styles.alertBox}>
            <AlertIcon size={18} color={Colors.danger} style={{ marginRight: 6 }} />
            <Text style={styles.alertText}>
              Outstanding balance detected. Proceed to the Payments Ledger to complete your fee payment.
            </Text>
          </View>
        ) : (
          <View style={styles.successBox}>
            <CheckIcon size={18} color={Colors.success} style={{ marginRight: 6 }} />
            <Text style={styles.successText}>All session fees cleared in full!</Text>
          </View>
        )}

        <Button
          title="Open Payments Ledger"
          onPress={() => navigation.navigate('Payments')}
          variant="gold"
          icon={<ChevronRightIcon size={18} color={Colors.primaryDark} />}
          style={{ marginTop: 12 }}
        />
      </Card>

      {/* Profile Specifications & Custom Info */}
      <Text style={styles.sectionHeading}>Profile Specifications</Text>
      <Card style={styles.specCard}>
        <View style={styles.specGrid}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Faculty</Text>
            <Text style={styles.specVal}>{profile.department.faculty.name}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Department</Text>
            <Text style={styles.specVal}>{profile.department.name}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Gender</Text>
            <Text style={styles.specVal}>{profile.gender}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Contact Phone</Text>
            <Text style={styles.specVal}>{profile.phoneNumber || 'N/A'}</Text>
          </View>
        </View>

        {profile.metadata && Object.keys(profile.metadata).length > 0 && (
          <>
            <View style={styles.specDivider} />
            <Text style={styles.metaHeading}>Custom Record Details</Text>
            <View style={styles.specGrid}>
              {Object.entries(profile.metadata)
                .filter(([key]) => key !== 'dateOfBirth')
                .map(([key, val]) => {
                  const label =
                    customFields.find((f: any) => f.name === key)?.label ||
                    key.replace(/_/g, ' ');
                  return (
                    <View key={key} style={styles.specItem}>
                      <Text style={styles.specLabel}>{label}</Text>
                      <Text style={styles.specVal}>{String(val)}</Text>
                    </View>
                  );
                })}
            </View>
          </>
        )}
      </Card>
    </ScrollView>
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
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  heroCard: {
    padding: 20,
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  heroWelcome: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  heroMatric: {
    fontSize: 13,
    color: Colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: Colors.borderGold,
    marginVertical: 14,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroProgram: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heroSession: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  regBanner: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FDE047',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  regTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#854D0E',
  },
  regDesc: {
    fontSize: 12,
    color: '#713F12',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpiCard: {
    width: '48%',
    padding: 14,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  kpiSubText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  finCard: {
    padding: 18,
    marginBottom: 12,
  },
  finHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  finTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  finRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  finLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  finVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  finRowLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  finLabelLarge: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  finValLarge: {
    fontSize: 20,
    fontWeight: '900',
  },
  alertBox: {
    backgroundColor: Colors.dangerBg,
    borderColor: Colors.danger,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 12,
    color: Colors.danger,
    flex: 1,
  },
  successBox: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: 12,
    color: Colors.success,
    flex: 1,
  },
  specCard: {
    padding: 16,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specItem: {
    width: '50%',
    marginBottom: 12,
  },
  specLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  specVal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  specDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  metaHeading: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
});
