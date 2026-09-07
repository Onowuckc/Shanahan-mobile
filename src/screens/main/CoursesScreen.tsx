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
import { Colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import {
  CoursesIcon,
  CheckIcon,
  AlertIcon,
  RefreshIcon,
} from '../../components/Icons';

export const CoursesScreen = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'registered'>('register');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Available courses state
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState('');
  const [activeSemester, setActiveSemester] = useState('');

  // Registered courses state
  const [registeredData, setRegisteredData] = useState<any>(null);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [availRes, regRes] = await Promise.all([
        api.get('/student/courses/available').catch(() => ({ data: { courses: [] } })),
        api.get('/student/courses/registered').catch(() => ({ data: null })),
      ]);

      if (availRes.data) {
        setAvailableCourses(availRes.data.courses || []);
        setActiveSession(availRes.data.session || 'Current');
        setActiveSemester(availRes.data.semester || 'Current');

        // Pre-select all available core courses
        const coreIds = (availRes.data.courses || [])
          .filter((c: any) => c.isCore)
          .map((c: any) => c.id);
        setSelectedCourseIds(coreIds);
      }

      if (regRes.data) {
        setRegisteredData(regRes.data);
      }
    } catch (err) {
      console.error('Failed to load courses data', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseSelection = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRegisterCourses = async () => {
    if (selectedCourseIds.length === 0) {
      Alert.alert('No Courses Selected', 'Please select at least one course to submit your registration.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/student/courses/register', { courseIds: selectedCourseIds });
      Alert.alert(
        'Registration Submitted',
        'Your course registration has been submitted successfully for Academic Advisor approval!'
      );
      fetchCourseData();
      setActiveTab('registered');
    } catch (err: any) {
      Alert.alert('Submission Error', err.response?.data?.error || 'Failed to submit course registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateSelectedUnits = () => {
    return availableCourses
      .filter((c) => selectedCourseIds.includes(c.id))
      .reduce((sum, c) => sum + (c.creditUnit || c.units || 0), 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Fetching Course Offerings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Tab Bar */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'register' && styles.tabActive]}
          onPress={() => setActiveTab('register')}
        >
          <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
            Course Registration
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'registered' && styles.tabActive]}
          onPress={() => setActiveTab('registered')}
        >
          <Text style={[styles.tabText, activeTab === 'registered' && styles.tabTextActive]}>
            Registered Courses
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {activeTab === 'register' ? (
          <View>
            <Card style={styles.summaryHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.periodTitle}>
                  {activeSession} Session ({activeSemester} Semester)
                </Text>
                <Text style={styles.periodDesc}>
                  Select required core & elective courses to register.
                </Text>
              </View>
              <Badge label={`${calculateSelectedUnits()} Units`} variant="gold" />
            </Card>

            <Text style={styles.sectionHeading}>Available Courses ({availableCourses.length})</Text>

            {availableCourses.length === 0 ? (
              <Card style={styles.emptyCard}>
                <AlertIcon size={32} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No available course registration forms found.</Text>
              </Card>
            ) : (
              availableCourses.map((course) => {
                const isSelected = selectedCourseIds.includes(course.id);
                return (
                  <TouchableOpacity
                    key={course.id}
                    activeOpacity={0.8}
                    onPress={() => toggleCourseSelection(course.id)}
                  >
                    <Card
                      style={isSelected ? [styles.courseCard, styles.courseCardSelected] : styles.courseCard}
                    >
                      <View style={styles.courseHeader}>
                        <View style={styles.checkboxWrapper}>
                          <View
                            style={[
                              styles.checkbox,
                              isSelected && styles.checkboxActive,
                            ]}
                          >
                            {isSelected ? <CheckIcon size={16} color={Colors.primaryDark} /> : null}
                          </View>
                          <Text style={styles.courseCode}>{course.code}</Text>
                        </View>
                        <Badge
                          label={course.isCore ? 'CORE' : 'ELECTIVE'}
                          variant={course.isCore ? 'gold' : 'info'}
                        />
                      </View>

                      <Text style={styles.courseTitle}>{course.title}</Text>
                      <View style={styles.courseFooter}>
                        <Text style={styles.courseUnits}>
                          {course.creditUnit || course.units || 3} Credit Units
                        </Text>
                        {course.department ? (
                          <Text style={styles.courseDept}>{course.department.name}</Text>
                        ) : null}
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })
            )}

            {availableCourses.length > 0 && (
              <Button
                title={`Submit Registration (${calculateSelectedUnits()} Units)`}
                onPress={handleRegisterCourses}
                loading={submitting}
                variant="gold"
                icon={<CheckIcon size={20} color={Colors.primaryDark} />}
                style={{ marginTop: 16 }}
              />
            )}
          </View>
        ) : (
          <View>
            <Card style={styles.summaryHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.periodTitle}>Course Registration Record</Text>
                <Text style={styles.periodDesc}>
                  Verified courses for the active academic session.
                </Text>
              </View>
              <Badge
                label={registeredData?.status || 'APPROVED'}
                variant={registeredData?.status === 'APPROVED' ? 'success' : 'warning'}
              />
            </Card>

            <Text style={styles.sectionHeading}>Enrolled Courses</Text>

            {!registeredData?.courses || registeredData.courses.length === 0 ? (
              <Card style={styles.emptyCard}>
                <CoursesIcon size={32} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No registered courses found for this session.</Text>
              </Card>
            ) : (
              registeredData.courses.map((item: any) => (
                <Card key={item.id || item.code} style={styles.registeredCard}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseCode}>{item.code || item.course?.code}</Text>
                    <Badge label={`${item.units || item.course?.creditUnit || 3} Units`} variant="gold" />
                  </View>
                  <Text style={styles.courseTitle}>{item.title || item.course?.title}</Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.accent,
    fontWeight: '800',
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
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  periodDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  emptyText: {
    color: Colors.textMuted,
    marginTop: 10,
    fontSize: 14,
  },
  courseCard: {
    padding: 14,
    marginBottom: 10,
  },
  courseCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
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
    marginBottom: 8,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseUnits: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  courseDept: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  registeredCard: {
    padding: 14,
    marginBottom: 10,
  },
});
