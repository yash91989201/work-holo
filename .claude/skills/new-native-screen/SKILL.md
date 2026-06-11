---
name: new-native-screen
description: Scaffold a complete new Expo screen for work-holo's native app (apps/native) following Expo Router conventions. Creates the screen file, navigation wiring, and API integration.
---

You are scaffolding a new Expo screen for work-holo's native app (`apps/native`).

## Step 1 — Gather Info

Ask the user (if not already provided):
1. What is this screen? (one sentence)
2. Where does it live in the navigation? (drawer / tabs / modal / stack)
3. What data does it need from the API?
4. What actions can the user take?
5. Does it need auth? (default: yes)

## Step 2 — Determine File Location

Expo Router uses file-based routing:
- Drawer screens: `apps/native/app/(drawer)/<screen>.tsx`
- Tab screens: `apps/native/app/(drawer)/(tabs)/<screen>.tsx`
- Modal: `apps/native/app/modal.tsx` pattern, or `apps/native/app/<feature>/modal.tsx`
- Stack within drawer: `apps/native/app/(drawer)/(stack)/<screen>.tsx`

## Step 3 — Create the Screen File

```tsx
import { Stack } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function <ScreenName>Screen() {
  return (
    <>
      <Stack.Screen options={{ title: "<Screen Title>" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* content */}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
})
```

## Step 4 — API Integration in Native

The native app uses Better Auth's React Native client. For API calls, use fetch directly against the server URL (oRPC client can be wired in the same way as web if configured, otherwise use direct fetch).

Check `apps/native/contexts/` for existing auth context and API client patterns.

```tsx
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client" // if it exists

function useAttendanceData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use whatever API client is configured in native
    // Check apps/native/lib/ or apps/native/contexts/ for the pattern
    setLoading(false)
  }, [])

  return { data, loading }
}
```

## Step 5 — Add to Navigation (if needed)

If adding a new drawer item, update:
`apps/native/app/(drawer)/_layout.tsx`

If adding a new tab, update:
`apps/native/app/(drawer)/(tabs)/_layout.tsx`

## Step 6 — Checklist

- [ ] `Stack.Screen` options set with a title
- [ ] Loading state handled (show `ActivityIndicator` while fetching)
- [ ] Error state handled with a user-readable message
- [ ] Screen is accessible (uses `Text`, `View`, semantic elements — not just positioned divs)
- [ ] Navigation registered in the appropriate `_layout.tsx`
- [ ] Styles use `StyleSheet.create()` — no inline style objects in render
