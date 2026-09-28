import React from 'react';
import { SubjectProgressView, SubjectProgressConfig } from '../../../components/SubjectProgressView';

const config: SubjectProgressConfig = {
  subjectName: 'Mathematics',
  themeColor: '#4361ee',
  overallProgress: 75,
  studyTime: '18h 30m',
  grade: 'A-',
  weeklyProgress: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 2.0 },
  ],
  syllabusTopics: [
    { title: 'Linear Algebra & System of Equations', completed: true, hours: '6h' },
    { title: 'Quadratic Functions & Parabolas', completed: true, hours: '4.5h' },
    { title: 'Calculus: Derivatives & Rates of Change', completed: true, hours: '8h' },
    { title: 'Integrals & Fundamental Theorem', completed: false, hours: '10h' },
    { title: 'Probability & Distributions', completed: false, hours: '6h' },
  ],
  recommendedActivities: [
    { id: '1', title: 'Algebra & Equations Mastery Quiz', duration: '15 mins', type: 'Quiz' },
    { id: '2', title: 'Calculus Applications Reading', duration: '30 mins', type: 'Study Guide' },
  ],
};

export default function MathematicsProgress() {
  return <SubjectProgressView config={config} />;
}