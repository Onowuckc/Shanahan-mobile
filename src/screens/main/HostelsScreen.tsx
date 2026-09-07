import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import api from '../../api/client';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import {
  HostelsIcon,
  BedIcon,
  CheckIcon,
  AlertIcon,
  HomeIcon,
} from '../../components/Icons';

export const HostelsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hostelData, setHostelData] = useState<any>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showOffCampusModal, setShowOffCampusModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/hostels').catch(() => ({ data: null }));
      setHostelData(res.data);
    } catch (err) {
      console.error('Failed to fetch hostels', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyHostel = async () => {
    if (!selectedHostel) return;

    try {
      setSubmitting(true);
      await api.post('/student/hostels/allocate', { hostelId: selectedHostel.id });
      setShowAllocateModal(false);
      Alert.alert(
        'Allocation Requested',
        `Your application for bed space in ${selectedHostel.name} has been submitted to Student Affairs!`
      );
      fetchHostels();
    } catch (err: any) {
      Alert.alert('Application Failed', err.response?.data?.error || 'Failed to submit hostel application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyOffCampus = async () => {
    if (!address.trim() || !reason.trim()) {
      Alert.alert('Incomplete Application', 'Please fill in your off-campus residence address and reason.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/student/hostels/off-campus', { address: address.trim(), reason: reason.trim() });
      setShowOffCampusModal(false);
      setAddress('');
      setReason('');
      Alert.alert('Application Submitted', 'Your Off-Campus stay application has been submitted!');
      fetchHostels();
    } catch (err: any) {
      Alert.alert('Submission Error', err.response?.data?.error || 'Failed to submit off-campus application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Hostel Accommodations...</Text>
      </View>
    );
  }

  const allocation = hostelData?.allocation;
  const hostels = hostelData?.hostels || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Allocation Status Header */}
        <Card variant="accent" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <BedIcon size={24} color={Colors.accent} style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Hostel Allocation Status</Text>
            </View>
            <Badge
              label={
                allocation?.status === 'APPROVED'
                  ? 'Allocated'
                  : allocation?.status === 'PENDING'
                  ? 'Pending'
                  : 'Off-Campus'
              }
              variant={
                allocation?.status === 'APPROVED'
                  ? 'success'
                  : allocation?.status === 'PENDING'
                  ? 'warning'
                  : 'muted'
              }
            />
          </View>

          <View style={styles.divider} />

          {allocation?.status === 'APPROVED' ? (
            <View style={styles.allocDetails}>
              <View style={styles.allocRow}>
                <Text style={styles.allocLabel}>Hostel Name:</Text>
                <Text style={styles.allocVal}>{allocation.hostel?.name}</Text>
              </View>
              <View style={styles.allocRow}>
                <Text style={styles.allocLabel}>Room Number:</Text>
                <Text style={styles.allocVal}>Room {allocation.roomNumber || 'A-12'}</Text>
              </View>
              <View style={styles.allocRow}>
                <Text style={styles.allocLabel}>Bedspace Number:</Text>
                <Text style={styles.allocVal}>Bed {allocation.bedNumber || '02'}</Text>
              </View>
            </View>
          ) : (
            <View style={{ marginVertical: 6 }}>
              <Text style={styles.unallocText}>
                {allocation?.status === 'PENDING'
                  ? 'Your hostel allocation request is currently being processed by Student Affairs.'
                  : 'You have not been assigned a university hostel room for this session.'}
              </Text>
              <Button
                title="Apply for Off-Campus Residence"
                onPress={() => setShowOffCampusModal(true)}
                variant="outline"
                style={{ marginTop: 10, height: 40 }}
                textStyle={{ fontSize: 13 }}
              />
            </View>
          )}
        </Card>

        {/* Hostels Catalog */}
        <Text style={styles.sectionHeading}>Available University Hostels</Text>

        {hostels.length === 0 ? (
          <Card style={styles.emptyCard}>
            <HostelsIcon size={36} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No hostel spaces available for booking at this time.</Text>
          </Card>
        ) : (
          hostels.map((h: any) => (
            <Card key={h.id} style={styles.hostelCard}>
              <View style={styles.hostelHeader}>
                <Text style={styles.hostelName}>{h.name}</Text>
                <Badge label={h.gender} variant={h.gender === 'MALE' ? 'info' : 'gold'} />
              </View>

              <Text style={styles.hostelDesc}>
                Capacity: {h.capacity || 200} Beds • Fee: ₦{(h.fee || 60000).toLocaleString()}/Session
              </Text>

              <View style={styles.hostelFooter}>
                <Text style={styles.availableCount}>
                  Available: <Text style={styles.highlight}>{h.availableSpaces || 24} Spaces</Text>
                </Text>
                <Button
                  title="Apply Bedspace"
                  onPress={() => {
                    setSelectedHostel(h);
                    setShowAllocateModal(true);
                  }}
                  variant="gold"
                  style={{ height: 36, paddingHorizontal: 14 }}
                  textStyle={{ fontSize: 12 }}
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Hostel Allocation Confirmation Modal */}
      <Modal visible={showAllocateModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Hostel Application</Text>
            <Text style={styles.modalDesc}>
              Apply for accommodation in <Text style={{ color: Colors.accent }}>{selectedHostel?.name}</Text>.
            </Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Gender Policy: {selectedHostel?.gender}</Text>
              <Text style={styles.summaryLabel}>
                Session Accommodation Fee: ₦{(selectedHostel?.fee || 60000).toLocaleString()}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Button
                title="Cancel"
                onPress={() => setShowAllocateModal(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Submit Application"
                onPress={handleApplyHostel}
                loading={submitting}
                variant="gold"
                icon={<CheckIcon size={18} color={Colors.primaryDark} />}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      </Modal>

      {/* Off Campus Modal */}
      <Modal visible={showOffCampusModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply for Off-Campus Residence</Text>
            <Text style={styles.modalDesc}>
              Submit details of your off-campus accommodation for Registry clearance.
            </Text>

            <Input
              label="Off-Campus Residential Address"
              placeholder="Enter full physical address"
              value={address}
              onChangeText={setAddress}
            />

            <Input
              label="Reason for Staying Off-Campus"
              placeholder="e.g. Living with parents/guardians, Medical clearance"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              style={{ height: 70 }}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Button
                title="Cancel"
                onPress={() => setShowOffCampusModal(false)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Submit Request"
                onPress={handleApplyOffCampus}
                loading={submitting}
                variant="gold"
                icon={<CheckIcon size={18} color={Colors.primaryDark} />}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        </View>
      </Modal>
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
  headerCard: {
    padding: 18,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGold,
    marginVertical: 12,
  },
  allocDetails: {
    marginVertical: 4,
  },
  allocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  allocLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  allocVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unallocText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 12,
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
  hostelCard: {
    padding: 14,
    marginBottom: 10,
  },
  hostelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hostelName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  hostelDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  hostelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  availableCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  highlight: {
    fontWeight: '700',
    color: Colors.accent,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  summaryBox: {
    backgroundColor: Colors.bgInput,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
});
