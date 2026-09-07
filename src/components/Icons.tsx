import React from 'react';
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  Octicons,
} from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Navigation & Tab Icons
export const DashboardIcon = ({ size = 22, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="grid-outline" size={size} color={color} style={style} />
);

export const DashboardIconActive = ({ size = 22, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="grid" size={size} color={color} style={style} />
);

export const CoursesIcon = ({ size = 22, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="book-outline" size={size} color={color} style={style} />
);

export const CoursesIconActive = ({ size = 22, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="book" size={size} color={color} style={style} />
);

export const ResultsIcon = ({ size = 22, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="document-text-outline" size={size} color={color} style={style} />
);

export const ResultsIconActive = ({ size = 22, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="document-text" size={size} color={color} style={style} />
);

export const PaymentsIcon = ({ size = 22, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="card-outline" size={size} color={color} style={style} />
);

export const PaymentsIconActive = ({ size = 22, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="card" size={size} color={color} style={style} />
);

export const HostelsIcon = ({ size = 22, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="home-outline" size={size} color={color} style={style} />
);

export const HostelsIconActive = ({ size = 22, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="home" size={size} color={color} style={style} />
);

export const ProfileIcon = ({ size = 22, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="person-outline" size={size} color={color} style={style} />
);

export const ProfileIconActive = ({ size = 22, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="person" size={size} color={color} style={style} />
);

// UI Action Icons
export const CheckIcon = ({ size = 20, color = Colors.success, style }: IconProps) => (
  <Ionicons name="checkmark-circle-outline" size={size} color={color} style={style} />
);

export const AlertIcon = ({ size = 20, color = Colors.warning, style }: IconProps) => (
  <Ionicons name="alert-circle-outline" size={size} color={color} style={style} />
);

export const ErrorIcon = ({ size = 20, color = Colors.danger, style }: IconProps) => (
  <Ionicons name="close-circle-outline" size={size} color={color} style={style} />
);

export const LockIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="lock-closed-outline" size={size} color={color} style={style} />
);

export const MailIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="mail-outline" size={size} color={color} style={style} />
);

export const IDCardIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="id-card-outline" size={size} color={color} style={style} />
);

export const EyeIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="eye-outline" size={size} color={color} style={style} />
);

export const EyeOffIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="eye-off-outline" size={size} color={color} style={style} />
);

export const LogoutIcon = ({ size = 20, color = Colors.danger, style }: IconProps) => (
  <Ionicons name="log-out-outline" size={size} color={color} style={style} />
);

export const CalendarIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="calendar-outline" size={size} color={color} style={style} />
);

export const PhoneIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="call-outline" size={size} color={color} style={style} />
);

export const FileIcon = ({ size = 18, color = Colors.textSecondary, style }: IconProps) => (
  <Ionicons name="document-attach-outline" size={size} color={color} style={style} />
);

export const SchoolIcon = ({ size = 20, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="school-outline" size={size} color={color} style={style} />
);

export const ChevronRightIcon = ({ size = 18, color = Colors.textMuted, style }: IconProps) => (
  <Ionicons name="chevron-forward-outline" size={size} color={color} style={style} />
);

export const RefreshIcon = ({ size = 18, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="refresh-outline" size={size} color={color} style={style} />
);

export const DownloadIcon = ({ size = 18, color = Colors.textPrimary, style }: IconProps) => (
  <Ionicons name="download-outline" size={size} color={color} style={style} />
);

export const FilterIcon = ({ size = 18, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="funnel-outline" size={size} color={color} style={style} />
);

export const BedIcon = ({ size = 20, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="bed-outline" size={size} color={color} style={style} />
);

export const ReceiptIcon = ({ size = 20, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="receipt-outline" size={size} color={color} style={style} />
);

export const HomeIcon = ({ size = 20, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="home-outline" size={size} color={color} style={style} />
);

export const CloseIcon = ({ size = 20, color = Colors.textMuted, style }: IconProps) => (
  <Ionicons name="close-outline" size={size} color={color} style={style} />
);

export const KeyIcon = ({ size = 20, color = Colors.accent, style }: IconProps) => (
  <Ionicons name="key-outline" size={size} color={color} style={style} />
);

