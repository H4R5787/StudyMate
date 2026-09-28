import { getOfflineTutorResponse, TUTOR_TOPICS } from '../services/tutor';

describe('Offline Tutor Service', () => {
  it('should return prompt when query is empty', () => {
    const res = getOfflineTutorResponse('');
    expect(res).toContain('ask a question');
  });

  it('should return Newton motion laws for physics questions', () => {
    const res1 = getOfflineTutorResponse("Explain Newton's second law");
    expect(res1).toBe(TUTOR_TOPICS.newton);

    const res2 = getOfflineTutorResponse("What is F=ma?");
    expect(res2).toBe(TUTOR_TOPICS.newton);
  });

  it('should return chemistry balancing steps for chemical equations', () => {
    const res = getOfflineTutorResponse('How to balance chemical equations in stoichiometry?');
    expect(res).toBe(TUTOR_TOPICS.chemistry_balance);
  });

  it('should return cell division explanation for mitosis or meiosis', () => {
    const res = getOfflineTutorResponse('Tell me about mitosis and meiosis');
    expect(res).toBe(TUTOR_TOPICS.mitosis);
  });

  it('should return calculus derivatives advice for derivative questions', () => {
    const res = getOfflineTutorResponse('How to find the derivative using product rule?');
    expect(res).toBe(TUTOR_TOPICS.calculus);
  });

  it('should return kinetic and potential energy explanation', () => {
    const res = getOfflineTutorResponse('Difference between kinetic and potential energy');
    expect(res).toBe(TUTOR_TOPICS.energy);
  });

  it('should return study and exam tips for learning queries', () => {
    const res = getOfflineTutorResponse('Give me study tips for my exam');
    expect(res).toBe(TUTOR_TOPICS.tips);
  });

  it('should return structured study framework for unrecognized queries', () => {
    const res = getOfflineTutorResponse('Quantum entanglement in superconductors');
    expect(res).toContain('Core Concept');
    expect(res).toContain('Identify Variables & Rules');
    expect(res).toContain('Practice Application');
  });
});
