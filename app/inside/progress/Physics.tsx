import React from 'react';
import { SubjectProgressView, SubjectProgressConfig } from '../../../components/SubjectProgressView';

const config: SubjectProgressConfig = {
  subjectName: 'Physics',
  themeColor: '#06d6a0',
  overallProgress: 60,
  studyTime: '12h 45m',
  grade: 'B+',
  weeklyProgress: [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.0 },
    { day: 'Wed', hours: 2.5 },
    { day: 'Thu', hours: 1.0 },
    { day: 'Fri', hours: 3.0 },
    { day: 'Sat', hours: 1.5 },
    { day: 'Sun', hours: 1.0 },
  ],
  syllabusTopics: [
    { title: 'Kinematics: 1D & 2D Motion', completed: true, hours: '4h' },
    { title: 'Newton\'s Laws of Motion & Friction', completed: true, hours: '5h' },
    { title: 'Work, Energy, and Conservation Laws', completed: true, hours: '6h' },
    { title: 'Rotational Dynamics & Torque', completed: false, hours: '8h' },
    { title: 'Electromagnetism & Waves', completed: false, hours: '12h' },
  ],
  recommendedActivities: [
    { id: '2', title: 'Chapter 2: Mechanics & Dynamics', duration: '35 mins', type: 'Chapter Reader' },
    { id: '1', title: 'Physics Numerical Problem Solver', duration: '20 mins', type: 'Practice Quiz' },
  ],
};

export default function PhysicsProgress() {
  return <SubjectProgressView config={config} />;
}