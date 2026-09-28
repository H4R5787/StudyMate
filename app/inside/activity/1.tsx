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

const MATH_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What is the value of π (pi) rounded to two decimal places?',
    options: ['3.14', '3.16', '3.12', '3.18'],
    correctAnswer: '3.14',
    explanation: 'π is an irrational constant representing the ratio of a circle\'s circumference to its diameter, approximately 3.14159...',
  },
  {
    id: '2',
    question: 'Solve for x: 2x + 5 = 15',
    options: ['5', '10', '7.5', '2.5'],
    correctAnswer: '5',
    explanation: 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5.',
  },
  {
    id: '3',
    question: 'What is the area of a rectangle with length 8 cm and width 5 cm?',
    options: ['13 cm²', '40 cm²', '26 cm²', '30 cm²'],
    correctAnswer: '40 cm²',
    explanation: 'Area of a rectangle = length × width = 8 × 5 = 40 cm².',
  },
  {
    id: '4',
    question: 'Calculate 7² + 3³',
    options: ['76', '85', '49', '58'],
    correctAnswer: '76',
    explanation: '7² = 49 and 3³ = 27. 49 + 27 = 76.',
  },
  {
    id: '5',
    question: 'What is the square root of 144?',
    options: ['12', '14', '16', '18'],
    correctAnswer: '12',
    explanation: '12 × 12 = 144, so √144 = 12.',
  },
];

export default function MathematicsQuiz() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins
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
      toValue: (currentIndex + 1) / MATH_QUESTIONS.length,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < MATH_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let finalScore = 0;
    MATH_QUESTIONS.forEach((q, idx) => {
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
    setTimeRemaining(300);
    setShowResults(false);
    setIsSubmitted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = MATH_QUESTIONS[currentIndex];
  const userSelected = selectedAnswers[currentIndex];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Mathematics Quiz"
        subtitle={showResults ? "Results & Review" : `Question ${currentIndex + 1} of ${MATH_QUESTIONS.length}`}
      />

      {/* Progress Bar & Timer Header */}
      {!showResults && (
        <View style={[styles.quizSubHeader, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.timerDigits, { color: colors.primary }]}>{formatTime(timeRemaining)}</Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: colors.primary,
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
                <View style={[styles.trophyCircle, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="trophy" size={44} color={colors.primary} />
                </View>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>Quiz Completed!</Text>
                <Text style={[styles.resultsSub, { color: colors.secondaryText }]}>
                  You scored {score} out of {MATH_QUESTIONS.length} ({Math.round((score / MATH_QUESTIONS.length) * 100)}%)
                </Text>
              </View>

              {/* Explanations Review */}
              <View style={styles.reviewSection}>
                <Text style={[styles.reviewHeading, { color: colors.text }]}>Answers & Explanations</Text>
                {MATH_QUESTIONS.map((q, idx) => {
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
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={restartQuiz}
                >
                  <Ionicons name="refresh" size={18} color="#ffffff" />
                  <Text style={styles.primaryButtonText}>Try Again</Text>
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
                <Text style={[styles.questionCounter, { color: colors.primary }]}>
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
                          backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.optionPill,
                          {
                            backgroundColor: isSelected ? colors.primary : 'transparent',
                            borderColor: isSelected ? colors.primary : colors.border,
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
                          { color: isSelected ? colors.primary : colors.text, fontWeight: isSelected ? '700' : '500' },
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
                    backgroundColor: userSelected ? colors.primary : colors.border,
                    opacity: userSelected ? 1 : 0.6,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === MATH_QUESTIONS.length - 1 ? 'Submit Quiz' : 'Next Question'}
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