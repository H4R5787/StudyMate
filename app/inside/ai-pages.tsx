import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Explain Newton's 2nd Law in simple terms",
  "How to balance a chemical equation?",
  "Difference between mitosis and meiosis",
  "How to find the derivative of x² · sin(x)?",
  "Give me 3 tips for studying physics formulas"
];

// Offline Study Tutor knowledge base when Gemini API key is not yet set
function getOfflineTutorResponse(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('newton') || lower.includes('law of motion') || lower.includes('inertia') || lower.includes('f=ma')) {
    return "💡 **Newton's 3 Laws of Motion Explained:**\n\n1. **First Law (Inertia):** An object stays at rest or continues at constant velocity unless acted upon by a net external force.\n2. **Second Law (F = ma):** Net force equals mass multiplied by acceleration. If you double the force on an object, its acceleration doubles.\n3. **Third Law (Action-Reaction):** For every action force, there is an equal and opposite reaction force acting on a different body simultaneously.";
  }

  if (lower.includes('balance') || lower.includes('chemical equation') || lower.includes('stoichiometry')) {
    return "🧪 **How to Balance Chemical Equations:**\n\n1. Write out the unbalanced formula equation.\n2. Count the atoms of each element on both reactant and product sides.\n3. Adjust coefficients (the numbers in front), **NEVER** change the subscripts!\n4. Balance polyatomic ions as single units if they appear on both sides.\n5. Balance hydrogen and oxygen atoms last.\n6. Double check that total atoms on the left equal total atoms on the right!";
  }

  if (lower.includes('mitosis') || lower.includes('meiosis') || lower.includes('cell division')) {
    return "🧬 **Mitosis vs Meiosis:**\n\n• **Mitosis:** Produces 2 genetically identical diploid daughter cells. Used for growth, tissue repair, and asexual reproduction. (Phases: Prophase, Metaphase, Anaphase, Telophase).\n• **Meiosis:** Produces 4 genetically diverse haploid gametes (sperm/egg cells) through two rounds of division with crossing over in Prophase I.";
  }

  if (lower.includes('derivative') || lower.includes('calculus') || lower.includes('product rule')) {
    return "📐 **Derivative & Calculus Help:**\n\nTo differentiate **f(x) = x² · sin(x)**, use the **Product Rule**:\n`d/dx [u · v] = u' · v + u · v'`\n\n1. Let `u = x²` ➔ `u' = 2x`\n2. Let `v = sin(x)` ➔ `v' = cos(x)`\n3. Combine: `f'(x) = 2x · sin(x) + x² · cos(x)`\n\nFactor out `x`: **f'(x) = x(2·sin(x) + x·cos(x))**.";
  }

  if (lower.includes('kinetic') || lower.includes('energy') || lower.includes('potential')) {
    return "⚡ **Kinetic & Potential Energy:**\n\n• **Kinetic Energy (KE):** `KE = ½ · m · v²` (where m is mass in kg, v is velocity in m/s). It quadruples if you double your speed!\n• **Gravitational Potential Energy (PE):** `PE = m · g · h` (where g ≈ 9.8 m/s², h is height in meters).\n• **Conservation:** In frictionless motion, `KE_initial + PE_initial = KE_final + PE_final`.";
  }

  if (lower.includes('tip') || lower.includes('study') || lower.includes('exam') || lower.includes('pomodoro')) {
    return "🎯 **Top StudyMate Learning Techniques:**\n\n1. **Feynman Technique:** Teach the concept out loud using simple, jargon-free analogies.\n2. **Active Recall:** Instead of passively re-reading notes, quiz yourself with flashcards and practice problems.\n3. **Spaced Repetition:** Review material after 1 day, 3 days, 7 days, and 14 days to lock it into long-term memory.\n4. **Pomodoro Intervals:** Study in 25-minute sprints followed by 5-minute restorative breaks.";
  }

  return `🤖 **StudyMate Tutor Response:**\n\nGreat question regarding "${query}"!\n\nHere is how to approach mastering this concept:\n1. **Core Concept:** Break down the definition into your own words.\n2. **Identify Variables & Rules:** List the fundamental formulas, definitions, or principles that apply.\n3. **Practice Application:** Solve 2-3 standard problems from simple to complex.\n\n*Tip: You can configure your Google Gemini API key via the key icon above for full real-time AI capabilities!*`;
}

export default function AIPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [apiKey, setApiKey] = useState(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hello! I'm your StudyMate AI Tutor. Ask me any homework question, request formula explanations, or get study tips for Mathematics, Physics, Chemistry, and Biology.",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || query).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    // If an API key is provided, try calling the Gemini API
    if (apiKey.trim()) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: textToSend }] }],
            }),
          }
        );

        const data = await response.json();
        const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponseText) {
          const aiMessage: ChatMessage = {
            id: String(Date.now() + 1),
            role: 'ai',
            content: aiResponseText,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local tutor:', err);
      }
    }

    // Fallback to intelligent offline study tutor response
    setTimeout(() => {
      const offlineReply = getOfflineTutorResponse(textToSend);
      const aiMessage: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'ai',
        content: offlineReply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 600);
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey.trim());
    setShowKeyModal(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="AI Study Assistant"
        subtitle={apiKey ? "Connected to Gemini AI" : "Built-in Study Tutor Mode"}
        rightAction={{
          icon: apiKey ? 'key' : 'key-outline',
          onPress: () => {
            setTempApiKey(apiKey);
            setShowKeyModal(true);
          },
          label: 'API Key Settings',
        }}
      />

      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          {/* Quick Prompts Bar */}
          <View style={styles.quickPromptsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickPromptsScroll}
            >
              {QUICK_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.quickPromptChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => handleSend(prompt)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="flash-outline" size={13} color={colors.primary} />
                  <Text style={[styles.quickPromptText, { color: colors.text }]} numberOfLines={1}>
                    {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages Stream */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesScroll}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubbleWrapper,
                    isUser ? styles.userWrapper : styles.aiWrapper,
                  ]}
                >
                  {!isUser && (
                    <View style={[styles.botAvatarCircle, { backgroundColor: colors.primary }]}>
                      <Ionicons name="sparkles" size={14} color="#ffffff" />
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageBubble,
                      isUser
                        ? [styles.userBubble, { backgroundColor: colors.primary }]
                        : [styles.aiBubble, { backgroundColor: colors.cardBackground, borderColor: colors.border }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: isUser ? '#ffffff' : colors.text },
                      ]}
                      selectable
                    >
                      {msg.content}
                    </Text>
                    <Text
                      style={[
                        styles.timestampText,
                        { color: isUser ? 'rgba(255,255,255,0.7)' : colors.secondaryText },
                      ]}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              );
            })}

            {loading && (
              <View style={[styles.loadingIndicatorWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
                  StudyMate is formulating an answer...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={[styles.inputBar, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Ask a question or paste a problem..."
              placeholderTextColor={colors.placeholder}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSend()}
              multiline
              maxLength={1000}
            />

            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={loading || !query.trim()}
              style={[
                styles.sendButton,
                {
                  backgroundColor: query.trim() ? colors.primary : colors.surface,
                  opacity: query.trim() ? 1 : 0.5,
                },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={query.trim() ? '#ffffff' : colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <BottomNav />
      </View>

      {/* API Key Modal */}
      <Modal visible={showKeyModal} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Gemini AI Configuration</Text>
              <TouchableOpacity onPress={() => setShowKeyModal(false)}>
                <Ionicons name="close" size={24} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: colors.secondaryText }]}>
              Enter your Google Gemini API key to enable live generative AI responses. If omitted, StudyMate will use its built-in offline study tutor.
            </Text>

            <TextInput
              placeholder="AIzaSy..."
              placeholderTextColor={colors.placeholder}
              value={tempApiKey}
              onChangeText={setTempApiKey}
              secureTextEntry
              autoCapitalize="none"
              style={[
                styles.keyInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowKeyModal(false)}
                style={[styles.modalSecondaryBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveApiKey}
                style={[styles.modalPrimaryBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.modalBtnText, { color: '#ffffff' }]}>Save Key</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    paddingBottom: 70,
  },
  quickPromptsContainer: {
    paddingVertical: 10,
  },
  quickPromptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickPromptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  quickPromptText: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 240,
  },
  messagesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
  },
  messageBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  botAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 10,
    marginLeft: 36,
  },
  loadingText: {
    fontSize: 13,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    maxHeight: 120,
    lineHeight: 20,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    maxWidth: 460,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  keyInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalSecondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalPrimaryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
