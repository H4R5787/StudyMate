import React from 'react';
import { SubjectProgressView, SubjectProgressConfig } from '../../../components/SubjectProgressView';

const config: SubjectProgressConfig = {
  subjectName: 'Biology',
  themeColor: '#ffb703',
  overallProgress: 30,
  studyTime: '6h 00m',
  grade: 'B-',
  weeklyProgress: [
    { day: 'Mon', hours: 0.5 },
    { day: 'Tue', hours: 1.0 },
    { day: 'Wed', hours: 1.0 },
    { day: 'Thu', hours: 1.5 },
    { day: 'Fri', hours: 0.5 },
    { day: 'Sat', hours: 1.0 },
    { day: 'Sun', hours: 0.5 },
  ],
  syllabusTopics: [
    { title: 'Cell Structure & Organelle Functions', completed: true, hours: '3h' },
    { title: 'Photosynthesis & Cellular Respiration', completed: true, hours: '4h' },
    { title: 'Mitosis, Meiosis & Cell Cycle', completed: false, hours: '5h' },
    { title: 'Mendelian Genetics & DNA Replication', completed: false, hours: '8h' },
    { title: 'Ecology & Evolutionary Biology', completed: false, hours: '6h' },
  ],
  recommendedActivities: [
    { id: '4', title: 'Cell Biology & Mitosis Assessment', duration: '25 mins', type: 'Timed Test' },
    { id: '2', title: 'Photosynthesis Mechanism Overview', duration: '15 mins', type: 'Study Guide' },
  ],
};

export default function BiologyProgress() {
  return <SubjectProgressView config={config} />;
}