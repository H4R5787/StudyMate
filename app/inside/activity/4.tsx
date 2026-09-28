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
import { StorageService } from '../../../services/storage';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const BIOLOGY_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'Which intracellular organelle is primarily responsible for protein translation and synthesis?',
    options: ['Ribosome', 'Mitochondria', 'Nucleolus', 'Golgi Apparatus'],
    correctAnswer: 'Ribosome',
    explanation: 'Ribosomes translate messenger RNA (mRNA) into polypeptide amino acid chains during protein synthesis.',
  },
  {
    id: '2',
    question: 'What is the primary function of chlorophyll pigments located within plant chloroplasts?',
    options: ['Light absorption', 'Water absorption', 'Nutrient transport', 'CO₂ fixation'],
    correctAnswer: 'Light absorption',
    explanation: 'Chlorophyll absorbs blue and red wavelengths of solar light to excite electrons for the light-dependent reactions of photosynthesis.',
  },
  {
    id: '3',
    question: 'Which biological transport process describes the net passive movement of solvent water across a semipermeable membrane?',
    options: ['Osmosis', 'Facilitated Diffusion', 'Active Transport', 'Endocytosis'],
    correctAnswer: 'Osmosis',
    explanation: 'Osmosis is the net diffusion of water molecules from regions of lower solute concentration to higher solute concentration.',
  },
  {
    id: '4',
    question: 'What is the correct hierarchical order of biological taxonomic classification from broadest to most specific?',
    options: [
      'Domain > Kingdom > Phylum > Class > Order',
      'Kingdom > Class > Phylum > Order > Family',
      'Phylum > Kingdom > Order > Class > Genus',
      'Order > Family > Genus > Species > Domain'
    ],
    correctAnswer: 'Domain > Kingdom > Phylum > Class > Order',
    explanation: 'The standard Linnaean hierarchy: Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species.',
  },
  {
    id: '5',
    question: 'During which phase of eukaryotic mitosis are sister chromatids pulled apart toward opposite spindle poles?',
    options: ['Anaphase', 'Metaphase', 'Prophase', 'Telophase'],
    correctAnswer: 'Anaphase',
    explanation: 'During anaphase, cohesin proteins are cleaved, allowing spindle fibers to shorten and separate sister chromatids to opposite poles.',
  }
];

export default function BiologyTest() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(480); // 8 mins
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const answersRef = useRef(selectedAnswers);
  useEffect(() => {
    answersRef.current = selectedAnswers;
  }, [selectedAnswers]);

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
      toValue: (currentIndex + 1) / BIOLOGY_QUESTIONS.length,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < BIOLOGY_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    let finalScore = 0;
    const answers = answersRef.current;
    BIOLOGY_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        finalScore += 1;
      }
    });
    setScore(finalScore);
    setShowResults(true);
    setIsSubmitted(true);
    try {
      await StorageService.saveActivity({
        routeId: '4',
        title: 'Cell Biology & Mitosis Test',
        subject: 'Biology',
        duration: '25 mins',
        date: 'Today',
        score: `${finalScore}/${BIOLOGY_QUESTIONS.length}`,
      });
    } catch (e) {
      console.warn('Failed saving quiz score:', e);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setTimeRemaining(480);
    setShowResults(false);
    setIsSubmitted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = BIOLOGY_QUESTIONS[currentIndex];
  const userSelected = selectedAnswers[currentIndex];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title="Biology Assessment"
        subtitle={showResults ? "Results & Review" : `Question ${currentIndex + 1} of ${BIOLOGY_QUESTIONS.length}`}
      />

      {/* Progress Bar & Timer Header */}
      {!showResults && (
        <View style={[styles.quizSubHeader, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={16} color="#ffb703" />
            <Text style={[styles.timerDigits, { color: '#ffb703' }]}>{formatTime(timeRemaining)}</Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: '#ffb703',
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
                <View style={[styles.trophyCircle, { backgroundColor: 'rgba(255, 183, 3, 0.15)' }]}>
                  <Ionicons name="leaf" size={44} color="#ffb703" />
                </View>
                <Text style={[styles.resultsTitle, { color: colors.text }]}>Biology Test Completed!</Text>
                <Text style={[styles.resultsSub, { color: colors.secondaryText }]}>
                  You scored {score} out of {BIOLOGY_QUESTIONS.length} ({Math.round((score / BIOLOGY_QUESTIONS.length) * 100)}%)
                </Text>
              </View>

              {/* Explanations Review */}
              <View style={styles.reviewSection}>
                <Text style={[styles.reviewHeading, { color: colors.text }]}>Answers & Explanations</Text>
                {BIOLOGY_QUESTIONS.map((q, idx) => {
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
                  style={[styles.primaryButton, { backgroundColor: '#ffb703' }]}
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
                <Text style={[styles.questionCounter, { color: '#ffb703' }]}>
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
                          backgroundColor: isSelected ? 'rgba(255, 183, 3, 0.1)' : colors.surface,
                          borderColor: isSelected ? '#ffb703' : colors.border,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.optionPill,
                          {
                            backgroundColor: isSelected ? '#ffb703' : 'transparent',
                            borderColor: isSelected ? '#ffb703' : colors.border,
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
                          { color: isSelected ? '#ffb703' : colors.text, fontWeight: isSelected ? '700' : '500' },
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
                    backgroundColor: userSelected ? '#ffb703' : colors.border,
                    opacity: userSelected ? 1 : 0.6,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex === BIOLOGY_QUESTIONS.length - 1 ? 'Submit Test' : 'Next Question'}
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