import React from 'react';
import { SubjectProgressView, SubjectProgressConfig } from '../../../components/SubjectProgressView';

const config: SubjectProgressConfig = {
  subjectName: 'Chemistry',
  themeColor: '#f72585',
  overallProgress: 45,
  studyTime: '9h 15m',
  grade: 'B',
  weeklyProgress: [
    { day: 'Mon', hours: 1.0 },
    { day: 'Tue', hours: 1.5 },
    { day: 'Wed', hours: 1.0 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 1.5 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 0.5 },
  ],
  syllabusTopics: [
    { title: 'Atomic Structure & Quantum Numbers', completed: true, hours: '3.5h' },
    { title: 'Periodic Trends & Chemical Bonding', completed: true, hours: '4.5h' },
    { title: 'Stoichiometry & Molar Concentrations', completed: false, hours: '5h' },
    { title: 'Chemical Thermodynamics & Kinetics', completed: false, hours: '8h' },
    { title: 'Equilibrium & Acids/Bases', completed: false, hours: '7h' },
  ],
  recommendedActivities: [
    { id: '3', title: 'Periodic Table & Reactions Test', duration: '20 mins', type: 'Timed Test' },
    { id: '1', title: 'Molarity & Balancing Equations', duration: '15 mins', type: 'Practice Drill' },
  ],
};

export default function ChemistryProgress() {
  return <SubjectProgressView config={config} />;
}