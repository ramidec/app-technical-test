import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  Pressable,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  getSkeletonEnabled,
  setSkeletonEnabled,
  getSaveMessagesEnabled,
  setSaveMessagesEnabled,
  getAIEnabled,
  setAIEnabled,
} from '@/services/debugSettings';
import { clearCachedMessages } from '@/services/storage';
import { checkConnection } from '@/services/ai';

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

// ─── Accent palette ──────────────────────────────────────────────────────────
const AMBER = '#F59E0B';
const AMBER_MUTED = 'rgba(245, 158, 11, 0.12)';
const GREEN = '#10B981';
const RED = '#EF4444';
const PURPLE = '#8B5CF6';
const PURPLE_MUTED = 'rgba(139, 92, 246, 0.12)';

// ─── Toggle Card ─────────────────────────────────────────────────────────────

interface ToggleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  detail: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}

function ToggleCard({ icon, title, description, detail, value, onToggle }: ToggleCardProps) {
  const { theme, colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: value ? AMBER : (isDark ? '#3A3A3C' : '#D1D5DB') },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: AMBER_MUTED }]}>
          <Ionicons name={icon} size={18} color={AMBER} />
        </View>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: value ? GREEN : (isDark ? '#4B5563' : '#9CA3AF') },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: value ? GREEN : theme.colors.textSecondary },
              ]}
            >
              {value ? 'ACTIVE' : 'OFF'}
            </Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: isDark ? '#3A3A3C' : '#D1D5DB', true: AMBER }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={isDark ? '#3A3A3C' : '#D1D5DB'}
        />
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <View style={styles.detailRow}>
        <Ionicons
          name="information-circle-outline"
          size={13}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.detailText}>{detail}</Text>
      </View>
    </View>
  );
}

// ─── AI Toggle Card (with connection status) ────────────────────────────────

type ConnectionStatus = 'checking' | 'online' | 'offline';

interface AIToggleCardProps {
  value: boolean;
  onToggle: (v: boolean) => void;
}

function AIToggleCard({ value, onToggle }: AIToggleCardProps) {
  const { theme, colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('checking');

  useEffect(() => {
    let cancelled = false;
    setConnStatus('checking');
    checkConnection().then((ok) => {
      if (!cancelled) setConnStatus(ok ? 'online' : 'offline');
    });
    return () => { cancelled = true; };
  }, []);

  const statusColor =
    connStatus === 'online' ? GREEN : connStatus === 'offline' ? RED : theme.colors.textSecondary;
  const statusLabel =
    connStatus === 'online' ? 'ONLINE' : connStatus === 'offline' ? 'OFFLINE' : 'CHECKING';

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: value ? PURPLE : (isDark ? '#3A3A3C' : '#D1D5DB') },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: PURPLE_MUTED }]}>
          <Ionicons name="sparkles" size={18} color={PURPLE} />
        </View>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>AI Formatter</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: value ? GREEN : (isDark ? '#4B5563' : '#9CA3AF') },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: value ? GREEN : theme.colors.textSecondary },
              ]}
            >
              {value ? 'ACTIVE' : 'OFF'}
            </Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: isDark ? '#3A3A3C' : '#D1D5DB', true: PURPLE }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={isDark ? '#3A3A3C' : '#D1D5DB'}
        />
      </View>
      <Text style={styles.cardDescription}>
        Show the AI sparkle button in the chat toolbar. Uses Google Gemini to reformat messages with a chosen tone.
      </Text>

      {/* Connection status row */}
      <View style={styles.connRow}>
        <View style={styles.connLeft}>
          <Text style={[styles.connLabel, { color: theme.colors.textSecondary }]}>
            Gemini API
          </Text>
          {connStatus === 'checking' ? (
            <ActivityIndicator size={10} color={theme.colors.textSecondary} />
          ) : (
            <View style={[styles.connDot, { backgroundColor: statusColor }]} />
          )}
          <Text style={[styles.connStatus, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Dashboard Screen ────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  const [skeletonOn, setSkeletonOn] = useState(() => getSkeletonEnabled());
  const [saveOn, setSaveOn] = useState(() => getSaveMessagesEnabled());
  const [aiOn, setAiOn] = useState(() => getAIEnabled());

  const handleSkeletonToggle = useCallback((value: boolean) => {
    setSkeletonOn(value);
    setSkeletonEnabled(value);
  }, []);

  const handleSaveToggle = useCallback((value: boolean) => {
    setSaveOn(value);
    setSaveMessagesEnabled(value);
    if (!value) {
      clearCachedMessages();
    }
  }, []);

  const handleAIToggle = useCallback((value: boolean) => {
    setAiOn(value);
    setAIEnabled(value);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Amber accent stripe ── */}
      <View style={styles.accentStripe} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconBox, { backgroundColor: AMBER_MUTED }]}>
            <Ionicons name="construct" size={18} color={AMBER} />
          </View>
          <View>
            <Text style={styles.headerTitle}>DEBUG DASHBOARD</Text>
            <Text style={styles.headerSubtitle}>Runtime configuration</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: AMBER_MUTED }]}>
          <Text style={styles.badgeText}>DEV</Text>
        </View>
      </View>

      {/* ── Separator ── */}
      <View style={styles.separator} />

      {/* ── Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section label */}
        <Text style={styles.sectionLabel}>FEATURE FLAGS</Text>

        <ToggleCard
          icon="layers-outline"
          title="Skeleton Loading"
          description="Always display the skeleton shimmer animation when entering the chat. Simulates network loading to test the loading experience."
          detail={skeletonOn ? 'Skeleton shows on every chat open' : 'Skeleton animation disabled'}
          value={skeletonOn}
          onToggle={handleSkeletonToggle}
        />

        <ToggleCard
          icon="save-outline"
          title="Persist Messages"
          description="Save user-sent messages to MMKV local storage so they survive across app restarts."
          detail={saveOn ? 'Messages cached in MMKV' : 'Cache cleared \u2014 mock data only'}
          value={saveOn}
          onToggle={handleSaveToggle}
        />

        <AIToggleCard value={aiOn} onToggle={handleAIToggle} />

        {/* ── System info ── */}
        <Text style={styles.sectionLabel}>SYSTEM INFO</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Platform" value={Platform.OS} />
          <InfoRow label="RN Version" value="0.81.4" />
          <InfoRow label="Storage" value="MMKV" />
          <InfoRow label="State" value="React Query" />
        </View>

        {/* ── Enter Chat CTA ── */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.ctaText}>Enter Chat</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Accent stripe
  accentStripe: {
    height: 3,
    backgroundColor: AMBER,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textPrimary,
    fontFamily: MONO,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AMBER,
    fontFamily: MONO,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: theme.colors.separator,
    marginHorizontal: 20,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    fontFamily: MONO,
  },

  // Card
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleRow: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: MONO,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: MONO,
  },

  // Connection status row (AI card)
  connRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connLabel: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: MONO,
  },
  connDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  connStatus: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: MONO,
  },
  // Info card
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: MONO,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    fontFamily: MONO,
  },

  // CTA Button
  ctaButton: {
    backgroundColor: AMBER,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
}));
