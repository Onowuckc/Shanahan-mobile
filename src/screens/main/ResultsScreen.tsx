import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../../api/client';
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { ResultsIcon, SchoolIcon, AlertIcon } from '../../components/Icons';

export const ResultsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/results').catch(() => ({ data: null }));
      setResultsData(res.data);
    } catch (err) {
      console.error('Failed to fetch student results', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Fetching Academic Transcript...</Text>
      </View>
    );
  }

  const resultsList = resultsData?.results || [];
  const gpa = resultsData?.gpa || '0.00';
  const cgpa = resultsData?.cgpa || '0.00';
  const totalCredits = resultsData?.totalCredits || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {/* Header Transcript Banner */}
      <Card variant="accent" style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>Official Academic Record</Text>
            <Text style={styles.headerTitle}>Semester Results & Transcript</Text>
          </View>
          <SchoolIcon size={28} color={Colors.accent} />
        </View>

        <View style={styles.divider} />

        <View style={styles.scoreRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreVal}>{gpa}</Text>
            <Text style={styles.scoreLabel}>Current GPA</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={[styles.scoreVal, { color: Colors.accent }]}>{cgpa}</Text>
            <Text style={styles.scoreLabel}>Cumulative CGPA</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreVal}>{totalCredits}</Text>
            <Text style={styles.scoreLabel}>Total Credits</Text>
          </View>
        </View>
      </Card>

      {/* Results List */}
      <Text style={styles.sectionHeading}>Grade Breakdown by Course</Text>

      {resultsList.length === 0 ? (
        <Card style={styles.emptyCard}>
          <AlertIcon size={36} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No Published Results Found</Text>
          <Text style={styles.emptyDesc}>
            Results for the current academic session have not been released by the Senate.
          </Text>
        </Card>
      ) : (
        resultsList.map((res: any) => (
          <Card key={res.id || res.courseCode} style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.courseCode}>{res.courseCode || res.course?.code}</Text>
              <Badge
                label={`Grade ${res.grade}`}
                variant={
                  res.grade === 'A' || res.grade === 'B'
                    ? 'success'
                    : res.grade === 'C'
                    ? 'info'
                    : res.grade === 'D'
                    ? 'warning'
                    : 'danger'
                }
              />
            </View>

            <Text style={styles.courseTitle}>{res.courseTitle || res.course?.title}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.footerDetail}>
                Units: <Text style={styles.highlight}>{res.units || res.course?.creditUnit}</Text>
              </Text>
              <Text style={styles.footerDetail}>
                Score: <Text style={styles.highlight}>{res.score}%</Text>
              </Text>
              <Text style={styles.footerDetail}>
                Points: <Text style={styles.highlight}>{res.gradePoint}</Text>
              </Text>
            </View>
          </Card>
        ))
      )}
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
  },
  headerCard: {
    padding: 18,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGold,
    marginVertical: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  scoreBox: {
    alignItems: 'center',
  },
  scoreVal: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  resultCard: {
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  footerDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  highlight: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
