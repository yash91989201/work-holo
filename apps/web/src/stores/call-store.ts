import { useEffect, useState } from "react";
import { create } from "zustand";

export type CallType = "voice" | "video";
export type CallSourceType = "dm" | "channel";

export interface ActiveCall {
  callId: string;
  isHost: boolean;
  livekitToken: string;
  roomName: string;
  sourceConversationId: string | null;
  sourceType: CallSourceType | null;
  type: CallType;
}

export interface IncomingCall {
  callerAvatar: string | null;
  callerId: string;
  callerName: string;
  callId: string;
  type: CallType;
}

export interface SoftSwitchPending {
  callerName: string;
  callId: string;
  type: CallType;
}

interface ChannelCallInfo {
  callId: string;
  participantCount: number;
  type: CallType;
}

interface CallState {
  activeCall: ActiveCall | null;
  /** channelId → live channel call, populated by use-org-call-events */
  activeChannelCalls: Record<string, ChannelCallInfo>;
  clearIncomingCall: () => void;
  clearMissedCount: () => void;
  clearSoftSwitch: () => void;
  endCall: () => void;
  incomingCall: IncomingCall | null;
  incrementMissedCount: () => void;
  isMinimized: boolean;
  /** count of DM missed calls not yet viewed in Recents */
  missedCallCount: number;

  setActiveCall: (call: ActiveCall | null) => void;
  setChannelCall: (channelId: string, info: ChannelCallInfo | null) => void;
  setIncomingCall: (call: IncomingCall | null) => void;
  setMinimized: (minimized: boolean) => void;
  setSoftSwitchPending: (call: SoftSwitchPending | null) => void;
  softSwitchPending: SoftSwitchPending | null;
  /** epoch ms when the active call started — survives minimize/maximize remounts */
  startedAt: number | null;
  toggleMinimized: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeCall: null,
  activeChannelCalls: {},
  incomingCall: null,
  isMinimized: false,
  missedCallCount: 0,
  softSwitchPending: null,
  startedAt: null,

  setActiveCall: (call) =>
    set({
      activeCall: call,
      isMinimized: false,
      startedAt: call ? Date.now() : null,
    }),
  setChannelCall: (channelId, info) =>
    set((state) => {
      const next = { ...state.activeChannelCalls };
      if (info) {
        next[channelId] = info;
      } else {
        delete next[channelId];
      }
      return { activeChannelCalls: next };
    }),
  setIncomingCall: (call) => set({ incomingCall: call }),
  clearIncomingCall: () => set({ incomingCall: null }),
  endCall: () => set({ activeCall: null, isMinimized: false, startedAt: null }),
  toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
  setMinimized: (minimized) => set({ isMinimized: minimized }),
  setSoftSwitchPending: (call) => set({ softSwitchPending: call }),
  clearSoftSwitch: () => set({ softSwitchPending: null }),
  incrementMissedCount: () =>
    set((state) => ({ missedCallCount: state.missedCallCount + 1 })),
  clearMissedCount: () => set({ missedCallCount: 0 }),
}));

// Selector hooks — keep components subscribed to only what they need.
export const useActiveCall = () => useCallStore((s) => s.activeCall);
export const useIncomingCall = () => useCallStore((s) => s.incomingCall);
export const useIsCallMinimized = () => useCallStore((s) => s.isMinimized);
export const useSoftSwitchPending = () =>
  useCallStore((s) => s.softSwitchPending);
export const useChannelCall = (channelId: string) =>
  useCallStore((s) => s.activeChannelCalls[channelId]);
export const useMissedCallCount = () => useCallStore((s) => s.missedCallCount);

/**
 * Live call duration in seconds, derived from the store's startedAt so it
 * survives CallStage/CallPill remounts on minimize/maximize.
 */
export function useCallElapsed(): number {
  const startedAt = useCallStore((s) => s.startedAt);
  const [, tick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => tick((v) => v + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  return startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
}

export function formatCallDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
