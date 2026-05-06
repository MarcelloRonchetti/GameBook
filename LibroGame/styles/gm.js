// styles/gm.js
// Stili condivisi delle schermate del Game Master:
// CreateRoomScreen, RoomListScreen, DashboardScreen, PlayerDetailScreen.

import { StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize, shadows } from './theme';

// ---------------------------------------------------------------------------
// CreateRoomScreen
// ---------------------------------------------------------------------------
export const createRoomStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    backgroundColor: colors.bgLight,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    marginBottom: spacing.xxxl,
    color: colors.textDarkPrimary,
  },
  label: {
    fontSize: fontSize.lg,
    color: colors.textDarkSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.textDarkPrimary,
  },
  pickerWrapper: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.textDarkPrimary,
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  errorBanner: {
    backgroundColor: '#ffe5e5',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginTop: spacing.lg,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: fontSize.md,
  },
});

// ---------------------------------------------------------------------------
// RoomListScreen
// ---------------------------------------------------------------------------
export const roomListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgLight,
    padding: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textFaint,
    fontSize: fontSize.base,
  },
  title: {
    fontSize: fontSize.huge - 4,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    color: colors.textDarkPrimary,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md + 2,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  cardOpen: { borderLeftColor: colors.greenStrong },
  cardClosed: { borderLeftColor: colors.redStrong },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardCode: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textDarkSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 2,
  },
  cardName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textDarkPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeOpen: { backgroundColor: colors.greenLight },
  badgeClosed: { backgroundColor: colors.redLight },
  badgeText: { fontSize: fontSize.xs, fontWeight: '600' },
  cardStory: { fontSize: fontSize.md, color: colors.textDarkSecondary, marginBottom: spacing.xs },
  cardDate: { fontSize: fontSize.sm, color: colors.textFaint, marginBottom: spacing.xs },
  cardHint: { fontSize: fontSize.sm, color: colors.textFaint, marginBottom: spacing.md + 2 },
  // Riga di azioni: Entra/Chiudi (se aperta), Riapri (se chiusa), Elimina
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  enterButton: { backgroundColor: colors.textDarkPrimary },
  closeButton: { backgroundColor: colors.orangeStrong },
  reopenButton: { backgroundColor: '#3b82f6' },
  deleteButton: { backgroundColor: colors.error },
  buttonDisabled: { backgroundColor: '#ccc' },
  actionButtonText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '600' },
  cardInfo: { fontSize: fontSize.sm, color: colors.textFaint, marginBottom: 3 },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: spacing.sm,
  },
  emptyText: { fontSize: fontSize.lg, fontWeight: '600', color: colors.textDarkSecondary },
  emptySubtext: { fontSize: fontSize.md, color: colors.textMuted },
  createButton: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.textDarkPrimary,
    padding: spacing.lg + 2,
    borderRadius: radius.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  createButtonText: { color: colors.white, fontSize: fontSize.lg, fontWeight: 'bold' },
  // Header — bottone logout
  headerButton: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 2,
  },
  headerButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// DashboardScreen
// ---------------------------------------------------------------------------
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.bgLight,
  },
  codeContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xxl,
    ...shadows.md,
  },
  codeLabel: { fontSize: fontSize.md, color: colors.textFaint, marginBottom: spacing.sm },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginBottom: spacing.sm,
    color: colors.textDarkPrimary,
  },
  status: { fontSize: fontSize.md, fontWeight: '600' },
  statusOpen: { color: colors.success },
  statusClosed: { color: colors.error },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.textDarkSecondary,
  },
  list: { flex: 1 },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.huge,
    fontSize: fontSize.base,
  },
  closeButton: {
    backgroundColor: '#cc0000',
    padding: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  closeButtonDisabled: { backgroundColor: colors.textMuted },
  closeButtonText: { color: colors.white, fontSize: fontSize.lg, fontWeight: 'bold' },
  // Header — bottone torna a RoomList
  headerButton: { paddingHorizontal: spacing.md + 2, paddingVertical: spacing.xs + 2 },
  headerButtonText: { color: colors.white, fontSize: fontSize.base, fontWeight: '600' },
});

// ---------------------------------------------------------------------------
// PlayerDetailScreen — layout Marcello con timeline verticale
// ---------------------------------------------------------------------------
export const playerDetailStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.bgLight,
  },
  // Header giocatore
  header: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  playerName: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.textDarkSecondary,
    marginBottom: spacing.xs,
  },
  playerScene: {
    fontSize: fontSize.md,
    color: colors.textFaint,
  },
  // Cronologia
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textDarkSecondary,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  progressItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineColumn: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: spacing.xs,
  },
  dotSolved: { backgroundColor: colors.success },
  dotPending: { backgroundColor: colors.warning },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
    minHeight: 30,
  },
  progressContent: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  progressScene: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textDarkSecondary,
    marginBottom: spacing.xs,
  },
  progressTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  progressStatus: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  statusSolved: { color: colors.success },
  statusPending: { color: colors.warning },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xl,
    fontSize: fontSize.md,
  },
  // Suggerimenti già inviati
  sentHintsContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sentHintsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textDarkSecondary,
    marginBottom: 6,
  },
  sentHintText: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
    lineHeight: 18,
  },
  // Invio suggerimento
  hintSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: spacing.md,
  },
  hintLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textDarkSecondary,
    marginBottom: spacing.sm,
  },
  hintInput: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: colors.success,
    padding: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: colors.textMuted },
  sendButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: 'bold',
  },
});
