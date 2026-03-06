import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Text, Pressable } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import type { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { hapticSelection } from '@/utils/haptics';
import { getRecentEmojis, addRecentEmoji } from '@/utils/emojiRecents';
import { StyleSheet } from 'react-native-unistyles';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { EmojiItem } from '@/assets/emoji-data';
import { emojiData } from '@/assets/emoji-data';

// ─── Constants ─────────────────────────────────────────────────────────────────

const SNAP_POINTS = ['50%', '80%'];
const NUM_COLUMNS = 8;
const EMOJI_SIZE = 32;
const CELL_PADDING = 4;
const ROW_HEIGHT = EMOJI_SIZE + CELL_PADDING * 2;
const HEADER_HEIGHT = 32;

// ─── Row types ─────────────────────────────────────────────────────────────────

type HeaderRow = { type: 'header'; title: string; categoryKey: string };
type EmojiGridRow = { type: 'row'; emojis: EmojiItem[]; rowKey: string };
type FlatRow = HeaderRow | EmojiGridRow;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Chunk an array into groups of `size` */
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function buildRows(
  recents: string[],
): FlatRow[] {
  const rows: FlatRow[] = [];

  // Recents section
  if (recents.length > 0) {
    rows.push({ type: 'header', title: 'Recently Used', categoryKey: 'recents' });
    const recentItems: EmojiItem[] = recents.map((emoji) => ({
      emoji,
      name: '',
      keywords: [],
    }));
    chunk(recentItems, NUM_COLUMNS).forEach((group, i) => {
      rows.push({ type: 'row', emojis: group, rowKey: `recents-row-${i}` });
    });
  }

  // Standard categories
  emojiData.forEach((cat) => {
    rows.push({ type: 'header', title: cat.title, categoryKey: cat.key });
    chunk(cat.data, NUM_COLUMNS).forEach((group, i) => {
      rows.push({ type: 'row', emojis: group, rowKey: `${cat.key}-row-${i}` });
    });
  });

  return rows;
}

function buildSearchRows(query: string): FlatRow[] {
  const q = query.toLowerCase().trim();
  const rows: FlatRow[] = [];

  emojiData.forEach((cat) => {
    const matches = cat.data.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(q)),
    );
    if (matches.length > 0) {
      rows.push({ type: 'header', title: cat.title, categoryKey: cat.key });
      chunk(matches, NUM_COLUMNS).forEach((group, i) => {
        rows.push({ type: 'row', emojis: group, rowKey: `search-${cat.key}-row-${i}` });
      });
    }
  });

  return rows;
}

/** Map category keys to their row index for tab scrolling */
function getCategoryIndices(rows: FlatRow[]): Map<string, number> {
  const map = new Map<string, number>();
  rows.forEach((row, i) => {
    if (row.type === 'header') {
      map.set(row.categoryKey, i);
    }
  });
  return map;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const EmojiCell = React.memo(
  ({ emoji, onPress }: { emoji: string; onPress: (emoji: string) => void }) => (
    <Pressable onPress={() => onPress(emoji)} style={styles.emojiCell}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </Pressable>
  ),
);
EmojiCell.displayName = 'EmojiCell';

// ─── Component ─────────────────────────────────────────────────────────────────

interface EmojiSheetProps {
  onEmojiSelected: (emoji: string) => void;
}

const EmojiSheet = forwardRef<BottomSheet, EmojiSheetProps>(
  ({ onEmojiSelected }, ref) => {
    const { theme } = useAppTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const listRef = useRef<BottomSheetFlatListMethods>(null);

    const recents = useMemo(() => getRecentEmojis(), []);

    const allRows = useMemo(() => buildRows(recents), [recents]);
    const filteredRows = useMemo(
      () => (searchQuery ? buildSearchRows(searchQuery) : allRows),
      [searchQuery, allRows],
    );
    const categoryIndices = useMemo(() => getCategoryIndices(allRows), [allRows]);

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      stiffness: 400,
      mass: 0.5,
      overshootClamping: false,
    });

    const renderBackdrop = useCallback(
      (props: BottomSheetDefaultBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
        />
      ),
      [],
    );

    const handleSheetChange = useCallback((index: number) => {
      if (index >= 0) hapticSelection();
      if (index === -1) setSearchQuery('');
    }, []);

    const handleEmojiPress = useCallback(
      (emoji: string) => {
        hapticSelection();
        addRecentEmoji(emoji);
        onEmojiSelected(emoji);
      },
      [onEmojiSelected],
    );

    const scrollToCategory = useCallback(
      (categoryKey: string) => {
        const index = categoryIndices.get(categoryKey);
        if (index != null && listRef.current) {
          listRef.current.scrollToIndex({ index, animated: true, viewOffset: 0 });
        }
      },
      [categoryIndices],
    );

    const renderItem = useCallback(
      ({ item }: { item: FlatRow }) => {
        if (item.type === 'header') {
          return (
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionHeaderText,
                  { color: theme.colors.emojiKeyboardHeader },
                ]}
              >
                {item.title}
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.emojiRow}>
            {item.emojis.map((emojiItem) => (
              <EmojiCell
                key={emojiItem.emoji}
                emoji={emojiItem.emoji}
                onPress={handleEmojiPress}
              />
            ))}
            {/* Pad empty cells to keep alignment when row is incomplete */}
            {item.emojis.length < NUM_COLUMNS &&
              Array.from({ length: NUM_COLUMNS - item.emojis.length }).map((_, i) => (
                <View key={`pad-${i}`} style={styles.emojiCell} />
              ))}
          </View>
        );
      },
      [handleEmojiPress, theme],
    );

    const keyExtractor = useCallback((item: FlatRow) => {
      return item.type === 'header' ? `header-${item.categoryKey}` : item.rowKey;
    }, []);

    const getItemLayout = useCallback(
      (_data: ArrayLike<FlatRow> | null | undefined, index: number) => {
        // All items have predictable heights — headers are HEADER_HEIGHT, rows are ROW_HEIGHT
        // We use a uniform estimate for scrollToIndex (close enough for smooth scrolling)
        const height = ROW_HEIGHT;
        return { length: height, offset: height * index, index };
      },
      [],
    );

    // Category tabs
    const categoryTabs = useMemo(() => {
      const tabs: { key: string; icon: string }[] = [];
      if (recents.length > 0) {
        tabs.push({ key: 'recents', icon: '🕐' });
      }
      emojiData.forEach((cat) => {
        tabs.push({ key: cat.key, icon: cat.icon });
      });
      return tabs;
    }, [recents]);

    const listHeader = useMemo(
      () => (
        <View>
          {/* Search bar */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: theme.colors.emojiKeyboardBg },
            ]}
          >
            <View
              style={[
                styles.searchBar,
                { backgroundColor: theme.colors.emojiKeyboardSearch },
              ]}
            >
              <Ionicons
                name="search"
                size={16}
                color={theme.colors.emojiKeyboardIndicator}
                style={styles.searchIcon}
              />
              <BottomSheetTextInput
                placeholder="Search emoji"
                placeholderTextColor={theme.colors.emojiKeyboardIndicator}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[
                  styles.searchInput,
                  { color: theme.colors.emojiKeyboardHeader },
                ]}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={theme.colors.emojiKeyboardIndicator}
                  />
                </Pressable>
              )}
            </View>
          </View>

          {/* Category tabs */}
          {!searchQuery && (
            <View
              style={[
                styles.categoryBar,
                { backgroundColor: theme.colors.emojiKeyboardBg },
              ]}
            >
              {categoryTabs.map((tab) => (
                <Pressable
                  key={tab.key}
                  onPress={() => scrollToCategory(tab.key)}
                  style={styles.categoryTab}
                  hitSlop={4}
                >
                  <Text style={styles.categoryIcon}>{tab.icon}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      ),
      [theme, searchQuery, categoryTabs, scrollToCategory],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleSheetChange}
        animationConfigs={animationConfigs}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={[
          styles.sheetBackground,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <BottomSheetFlatList
          ref={listRef}
          data={filteredRows}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          ListHeaderComponent={listHeader}
          stickyHeaderIndices={[0]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          initialNumToRender={30}
          maxToRenderPerBatch={20}
          windowSize={5}
        />
      </BottomSheet>
    );
  },
);

EmojiSheet.displayName = 'EmojiSheet';

export default EmojiSheet;

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create((theme) => ({
  sheetBackground: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  indicator: {
    backgroundColor: theme.colors.dragHandle,
    width: 36,
  },
  // Search
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.typography.font.regular,
    paddingVertical: 0,
  },
  // Category tabs
  categoryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.separator,
  },
  categoryTab: {
    padding: 4,
  },
  categoryIcon: {
    fontSize: 20,
  },
  // Grid
  gridContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 6,
    paddingTop: 12,
    paddingBottom: 4,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontFamily: theme.typography.font.semibold,
  },
  emojiRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
  },
  emojiCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: EMOJI_SIZE,
  },
}));
