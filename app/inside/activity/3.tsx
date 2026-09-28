import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/theme';
import { AppHeader } from '../../../components/AppHeader';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const CHEMISTRY_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What does the atomic number of an element strictly represent?',
    options: [
      'Number of protons in the nucleus',
      'Number of neutrons in the nucleus',
      'Total number of nucleons',
      'Valence electrons only'
    ],
    correctAnswer: 'Number of protons in the nucleus',
    explanation: 'The atomic number (Z) defines the identity of an element by the count of protons in its nucleus.',
  },
  {
    id: '2',
    question: 'When balancing a chemical reaction, which component are you permitted to modify?',
    options: [
      'Coefficients in front of formulas',
      'Subscripts within formulas',
      'Superscripts denoting charge',
      'Elemental symbols'
    ],
    correctAnswer: 'Coefficients in front of formulas',
    explanation: 'Altering subscripts changes the chemical identity of the compound, which violates the Law of Conservation of Mass.',
  },
  {
    id: '3',
    question: 'What is the molarity of a solution containing 0.5 moles of NaCl dissolved in 2.0 L of solution?',
    options: ['0.25 M', '1.00 M', '2.50 M', '4.00 M'],
    correctAnswer: '0.25 M',
    explanation: 'Molarity = moles of solute / volume in liters = 0.5 mol / 2.0 L = 0.25 M.',
  },
  {
    id: '4',
    question: 'Which group in the Periodic Table contains the noble gases with complete valence octets?',
    options: ['Group 18', 'Group 17', 'Group 2', 'Group 1'],
    correctAnswer: 'Group 18',
    explanation: 'Group 18 elements (He, Ne, Ar, Kr, Xe, Rn) possess full valence shells making them chemically inert.',
  },
  {
    id: '5',
    question: 'Identify the reaction type: 2H₂ + O₂ → 2H₂O',
    options: [
      'Synthesis (Combination)',
      'Single Displacement',
      'Decomposition',
      'Acid-Base Neutralization'
    ],
    correctAnswer: 'Synthesis (Combination)',
    explanation: 'Two simpler reactants combine directly to form a single chemical product (water).',
  }
];

export default function ChemistryTest() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 mins
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showResults) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentIndex + 1) / CHEMISTRY_QUESTIONS.length,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < CHEMISTRY_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let finalScore = 0;
    CHEMISTRY_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setShowResults(true);
    setIsSubmitted(true);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setTimeRemaining(600);
    setShowResults(false);
    setIsSubmitted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = CHEMISTRY_QUESTIONS[currentIndex];
  const userSelected = selectedAnswers[currentIndex];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Chemistry Assessment"
        subtitle={showResults ? "Results & Review" : `Question ${currentIndex + 1} of ${CHEMISTRY_QUESTIONS.length}`}
      />

      {/* Progress Bar & Timer Header */}
      {!showResults && (
        <View style={[styles.quizSubHeader, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={16} color="#f72585" />
            <Text style={[styles.timerDigits, { color: '#f72585' }]}>{formatTime(timeRemaining)}</Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: '#f72585',
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          {showResults ? (
            /* Results Screen */
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.resultsHeader}>
                <View style={[styles.trophyCircle, { backgroundColor: 'rgba(247, 37, 133, 0.12)' }]}>
                  <Ionicons name="flask" size={44} color="#f72585" />
                </View>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>Chemistry Test Completed!</Text>
                <Text style={[styles.resultsSub, { color: colors.secondaryText }]}>
                  You scored {score} out of {CHEMISTRY_QUESTIONS.length} ({Math.round((score / CHEMISTRY_QUESTIONS.length) * 100)}%)
                </Text>
              </View>

              {/* Explanations Review */}
              <View style={styles.reviewSection}>
                <Text style={[styles.reviewHeading, { color: colors.text }]}>Answers & Explanations</Text>
                {CHEMISTRY_QUESTIONS.map((q, idx) => {
                  const wasCorrect = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <View
                      key={q.id}
                      style={[
                        styles.reviewCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: wasCorrect ? Colors.light.success : colors.danger,
                        },
                      ]}
                    >
                      <View style={styles.reviewTopRow}>
                        <Text style={[styles.reviewNumber, { color: colors.secondaryText }]}>#{idx + 1}</Text>
                        <Text style={[styles.reviewQuestion, { color: colors.text }]}>{q.question}</Text>
                        <Ionicons
                          name={wasCorrect ? "checkmark-circle" : "close-circle"}
                          size={20}
                          color={wasCorrect ? Colors.light.success : colors.danger}
                        />
                      </View>

                      <Text style={[styles.reviewAnswerText, { color: colors.secondaryText }]}>
                        Your answer:{' '}
                        <Text style={{ fontWeight: '700', color: wasCorrect ? Colors.light.success : colors.danger }}>
                          {selectedAnswers[idx] || 'Not answered'}
                        </Text>
                      </Text>
                      {!wasCorrect && (
                        <Text style={[styles.reviewAnswerText, { color: colors.secondaryText }]}>
                          Correct answer:{' '}
                          <Text style={{ fontWeight: '700', color: Colors.light.success }}>
                            {q.correctAnswer}
                          </Text>
                        </Text>
                      )}
                      <Text style={[styles.explanationText, { color: colors.secondaryText }]}>
                        💡 {q.explanation}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: '#f72585' }]}
                  onPress={restartQuiz}
                >
                  <Ionicons name="refresh" size={18} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Retry Test</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, { borderColor: colors.border }]}
                  onPress={() => router.replace('/inside/Home')}
                >
                  <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Return to Dashboard</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Active Question Screen */
            <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.questionHeader}>
                <Text style={[styles.questionCounter, { color: '#f72585' }]}>
                  QUESTION {currentIndex + 1}
                </Text>
                <Text style={[styles.questionTitle, { color: colors.text }]}>{currentQ.question}</Text>
              </View>

              <View style={styles.optionsList}>
                {currentQ.options.map((option, idx) => {
                  const isSelected = userSelected === option;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectOption(option)}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: isSelected ? 'rgba(247, 37, 133, 0.08)' : colors.surface,
                          borderColor: isSelected ? '#f72585' : colors.border,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.optionPill,
                          {
                            backgroundColor: isSelected ? '#f72585' : 'transparent',
                            borderColor: isSelected ? '#f72585' : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionLetter,
                            { color: isSelected ? '#ffffff' : colors.secondaryText },
                          ]}
                        >
                          {String.fromCharCode(65 + idx)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.optionLabel,
                          { color: isSelected ? '#f72585' : colors.text, fontWeight: isSelected ? '700' : '500' },
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={!userSelected}
                style={[
                  styles.nextButton,
                  {
                    backgroundColor: userSelected ? '#f72585' : colors.border,
                    opacity: userSelected ? 1 : 0.6,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === CHEMISTRY_QUESTIONS.length - 1 ? 'Submit Test' : 'Next Question'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  quizSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 16,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerDigits: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  questionHeader: {
    marginBottom: 24,
  },
  questionCounter: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  optionsList: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 14,
  },
  optionPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetter: {
    fontSize: 13,
    fontWeight: '700',
  },
  optionLabel: {
    fontSize: 15,
    flex: 1,
  },
  nextButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  trophyCircle: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  resultsSub: {
    fontSize: 14,
  },
  reviewSection: {
    gap: 12,
    marginBottom: 24,
  },
  reviewHeading: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewAnswerText: {
    fontSize: 13,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});