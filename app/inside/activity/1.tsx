import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const MathematicsQuiz = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [showResults, setShowResults] = useState(false);
  const progress = new Animated.Value(0);

  const colors = {
    primary: '#4361ee',
    correct: '#4CAF50',
    incorrect: '#F44336',
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2B2D42',
    secondaryText: isDark ? '#A0A0A0' : '#4A4E69',
    border: isDark ? '#333333' : '#E0E0E0',
  };

  const mathQuestions = [
    {
      id: '1',
      question: 'What is the value of π (pi) rounded to two decimal places?',
      options: ['3.14', '3.16', '3.12', '3.18'],
      correctAnswer: '3.14'
    },
    {
      id: '2',
      question: 'Solve for x: 2x + 5 = 15',
      options: ['5', '10', '7.5', '2.5'],
      correctAnswer: '5'
    },
    {
      id: '3',
      question: 'What is the area of a rectangle with length 8 and width 5?',
      options: ['13', '40', '26', '30'],
      correctAnswer: '40'
    },
    {
      id: '4',
      question: 'Calculate 7² + 3³',
      options: ['76', '85', '49', '58'],
      correctAnswer: '76'
    },
    {
      id: '5',
      question: 'What is the square root of 144?',
      options: ['12', '14', '16', '18'],
      correctAnswer: '12'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  Animated.timing(progress, {
    toValue: (currentQuestionIndex + 1) / mathQuestions.length,
    duration: 500,
    useNativeDriver: false
  }).start();

  const handleAnswer = (selectedAnswer: string) => {
    if (selectedAnswer === mathQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < mathQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleTimeUp = () => {
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.timerText, { color: colors.primary }]}>
          {formatTime(timeRemaining)}
        </Text>
        <Text style={[styles.scoreText, { color: colors.text }]}>
          Score: {score}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[
          styles.progressBar,
          { width: progressWidth, backgroundColor: colors.primary }
        ]} />
      </View>

      {showResults ? (
        <View style={styles.resultsContainer}>
          <Ionicons name="trophy" size={64} color={colors.primary} />
          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            Quiz Complete!
          </Text>
          <Text style={[styles.resultsText, { color: colors.text }]}>
            You scored {score} out of {mathQuestions.length}
          </Text>
          <Text style={[styles.resultsText, { color: colors.text }]}>
            Time Remaining: {formatTime(timeRemaining)}
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setTimeRemaining(300);
              setShowResults(false);
            }}
          >
            <Text style={[styles.buttonText, { color: colors.cardBackground }]}>
              Try Again
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.border }]}
            onPress={() => router.push('/inside/Home')}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Return Home
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.questionNumber, { color: colors.secondaryText }]}>
            Question {currentQuestionIndex + 1} of {mathQuestions.length}
          </Text>
          <Text style={[styles.questionText, { color: colors.text }]}>
            {mathQuestions[currentQuestionIndex].question}
          </Text>

          {mathQuestions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor: colors.cardBackground }]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700'
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600'
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    width: '100%'
  },
  progressBar: {
    height: '100%'
  },
  container: {
    padding: 16,
    paddingBottom: 80
  },
  questionNumber: {
    fontSize: 16,
    marginBottom: 8
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  optionText: {
    fontSize: 16
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 16
  },
  resultsText: {
    fontSize: 18,
    marginBottom: 8
  },
  button: {
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 8
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  }
};

export default MathematicsQuiz;