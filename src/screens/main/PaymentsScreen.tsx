import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import api from '../../api/client';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import {
  PaymentsIcon,
  ReceiptIcon,
  CheckIcon,
  AlertIcon,
  CloseIcon,
} from '../../components/Icons';

export const PaymentsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [paymentsData, setPaymentsData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [feeType, setFeeType] = useState('TUITION');
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/payments').catch(() => ({ data: null }));
      setPaymentsData(res.data);
    } catch (err) {
      console.error('Failed to fetch payments data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializePayment = async () => {
    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to pay.');
      return;
    }

    try {
      setInitializing(true);
      const res = await api.post('/student/payments/initialize', {
        feeType,
        amount: amountNum,
      });

      setShowModal(false);
      setPayAmount('');
      Alert.alert(
        'Payment Gateway Initialized',
        `Payment reference ${res.data?.reference || 'SU-PAY-REF'} generated. Opening secure checkout portal.`
      );
      fetchPayments();
    } catch (err: any) {
      Alert.alert('Initialization Failed', err.response?.data?.error || 'Failed to initialize payment.');
    } finally {
      setInitializing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading Payment Ledger...</Text>
      </View>
    );
  }

  const totals = paymentsData?.totals || { totalDue: 0, totalPaid: 0, outstanding: 0 };
  const history = paymentsData?.payments || [];
  const feeStructures = paymentsData?.feeStructures || [];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Ledger Overview Header */}
        <Card variant="accent" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PaymentsIcon size={24} color={Colors.accent} style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Financial Statement</Text>
            </View>
            <Badge
              label={totals.outstanding > 0 ? 'Pending Balance' : 'Cleared'}
              variant={totals.outstanding > 0 ? 'danger' : 'success'}
            />
          </View>

          <View style={styles.ledgerDivider} />

          <View style={styles.ledgerRow}>
            <Text style={styles.ledgerLabel}>Total Session Due:</Text>
            <Text style={styles.ledgerVal}>₦{totals.totalDue.toLocaleString()}</Text>
          </View>
          <View style={styles.ledgerRow}>
            <Text style={styles.ledgerLabel}>Total Amount Paid:</Text>
            <Text style={[styles.ledgerVal, { color: Colors.success }]}>
              ₦{totals.totalPaid.toLocaleString()}
            </Text>
          </View>
          <View style={styles.ledgerRowLarge}>
            <Text style={styles.ledgerLabelLarge}>Outstanding Balance:</Text>
            <Text
              style={[
                styles.ledgerValLarge,
                { color: totals.outstanding > 0 ? Colors.danger : Colors.success },
              ]}
            >
              ₦{totals.outstanding.toLocaleString()}
            </Text>
          </View>

          <Button
            title="Make Online Fee Payment"
            onPress={() => setShowModal(true)}
            variant="gold"
            icon={<ReceiptIcon size={20} color={Colors.primaryDark} />}
            style={{ marginTop: 10 }}
          />
        </Card>

        {/* Fee Structures Breakdown */}
        {feeStructures.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Session Fee Invoices</Text>
            {feeStructures.map((fee: any) => (
              <Card key={fee.id} style={styles.feeCard}>
                <View style={styles.feeHeader}>
                  <Text style={styles.feeName}>{fee.name || fee.feeType}</Text>
                  <Text style={styles.feeAmount}>₦{fee.amount.toLocaleString()}</Text>
                </View>
                <Text style={styles.feeDesc}>{fee.description || 'Mandatory Institutional Fee'}</Text>
              </Card>
            ))}
          </>
        )}

        {/* Payment History */}
        <Text style={styles.sectionHeading}>Payment History & Receipts</Text>

        {history.length === 0 ? (
          <Card style={styles.emptyCard}>
            <ReceiptIcon size={36} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No payment transaction records found.</Text>
          </Card>
        ) : (
          history.map((pay: any) => (
            <Card key={pay.id || pay.reference} style={styles.historyCard}>
              <View style={styles.historyTop}>
                <Text style={styles.historyRef}>{pay.reference}</Text>
                <Badge
                  label={pay.status}
                  variant={
                    pay.status === 'SUCCESS' || pay.status === 'COMPLETED'
                      ? 'success'
                      : pay.status === 'PENDING'
                      ? 'warning'
                      : 'danger'
                  }
                />
              </View>

              <Text style={styles.historyFeeType}>{pay.feeType || 'Institutional Fee'}</Text>

              <View style={styles.historyFooter}>
                <Text style={styles.historyDate}>
                  {new Date(pay.createdAt || pay.paidAt || Date.now()).toLocaleDateString()}
                </Text>
                <Text style={styles.historyAmount}>₦{pay.amount?.toLocaleString()}</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Payment Initialization Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Initialize Fee Payment</Text>
              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={{ height: 32, paddingHorizontal: 10 }}
                textStyle={{ fontSize: 12 }}
              />
            </View>

            <Input
              label="Payment Amount (₦)"
              placeholder="e.g. 50000"
              value={payAmount}
              onChangeText={setPayAmount}
              keyboardType="numeric"
              leftIcon={<PaymentsIcon size={20} color={Colors.accent} />}
            />

            <Button
              title="Proceed to Secure Checkout"
              onPress={handleInitializePayment}
              loading={initializing}
              variant="gold"
              icon={<CheckIcon size={20} color={Colors.primaryDark} />}
              style={{ marginTop: 12 }}
            />
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
  ledgerDivider: {
    height: 1,
    backgroundColor: Colors.borderGold,
    marginVertical: 12,
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ledgerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  ledgerVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ledgerRowLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  ledgerLabelLarge: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  ledgerValLarge: {
    fontSize: 20,
    fontWeight: '900',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 12,
  },
  feeCard: {
    padding: 14,
    marginBottom: 10,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feeName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  feeDesc: {
    fontSize: 12,
    color: Colors.textMuted,
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
  historyCard: {
    padding: 14,
    marginBottom: 10,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyRef: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: Colors.accent,
    fontWeight: '700',
  },
  historyFeeType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 6,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
});
