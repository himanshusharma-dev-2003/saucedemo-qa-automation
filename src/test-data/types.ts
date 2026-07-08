export interface LoginTestCase {
  caseId: string;
  description: string;
  username: string;
  password: string;
  expectedOutcome: 'success' | 'error';
  expectedError?: string;
}
