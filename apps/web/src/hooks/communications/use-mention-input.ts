import { useCallback, useMemo, useState } from "react";
import { useMentionUsers } from "@/hooks/communications/use-mention-users";
import type { Mention } from "@/lib/mentions";
import {
  CHANNEL_MENTION,
  getCurrentWord,
  getMentionQuery,
  insertMention as insertMentionUtil,
} from "@/lib/mentions";

export function useMentionInput(channelId: string) {
  const [text, setText] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: mentionUsersData, isFetching: isFetchingUsers } =
    useMentionUsers(
      channelId,
      mentionQuery,
      showSuggestions && mentionQuery.trim().length >= 0
    );

  const suggestions = useMemo(() => {
    const users = mentionUsersData?.users || [];
    const normalizedQuery = mentionQuery.trim().toLowerCase();
    const includeChannelMention =
      normalizedQuery.length === 0 ||
      "channel".startsWith(normalizedQuery.replace("@", ""));

    return includeChannelMention ? [CHANNEL_MENTION, ...users] : users;
  }, [mentionQuery, mentionUsersData]);

  const handleTextChange = useCallback((content: string, position: number) => {
    setText(content);
    setCursorPosition(position);

    // Check if current word is a mention
    const currentWord = getCurrentWord(content, position);

    if (currentWord.startsWith("@")) {
      const query = getMentionQuery(currentWord);
      if (query.length >= 0) {
        setMentionQuery(query);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
        setMentionQuery("");
      }
    } else {
      setShowSuggestions(false);
      setMentionQuery("");
    }
  }, []);

  const insertMention = useCallback(
    (mention: Mention) => {
      const { content: newContent, newCursorPosition } = insertMentionUtil(
        text,
        cursorPosition,
        mention
      );

      setText(newContent);
      setCursorPosition(newCursorPosition);
      setShowSuggestions(false);
      setMentionQuery("");
      setSelectedIndex(0);

      return { newContent, newCursorPosition };
    },
    [text, cursorPosition]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return false;

      const users = suggestions;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % users.length);
        return true;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
        return true;
      }

      if ((e.key === "Enter" || e.key === "Tab") && users[selectedIndex]) {
        e.preventDefault();
        insertMention(users[selectedIndex]);
        return true;
      }

      if (e.key === "Escape") {
        setShowSuggestions(false);
        setMentionQuery("");
        return true;
      }

      return false;
    },
    [showSuggestions, suggestions, selectedIndex, insertMention]
  );

  return {
    text,
    setText,
    cursorPosition,
    setCursorPosition,
    showSuggestions,
    mentionQuery,
    selectedIndex,
    suggestions,
    isFetchingUsers,
    handleTextChange,
    insertMention,
    handleKeyDown,
  };
}
