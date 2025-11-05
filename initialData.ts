import { Field, QuestionType, User, Role, Submission } from './types';

export const sampleUsers: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: Role.ADMIN },
    { id: 'user-2', name: 'Agent Smith', email: 'agent.smith@example.com', role: Role.AGENT },
    { id: 'user-3', name: 'Agent Jones', email: 'agent.jones@example.com', role: Role.AGENT },
    { id: 'user-4', name: 'Agent Brown', email: 'agent.brown@example.com', role: Role.AGENT },
    { id: 'guest-user', name: 'Public Guest', email: '', role: Role.GUEST },
];

export const initialFields: Field[] = [
  {
    id: '1',
    name: 'Welcome Field',
    parentId: null,
    access: 'public',
    assignedAgentIds: [],
    forms: [
      {
        id: 'form-1',
        title: 'Welcome Survey',
        description: 'Please tell us a bit about yourself.',
        questions: [
          { id: 'q1', type: QuestionType.SHORT_ANSWER, title: 'What is your name?', options: [], required: true, },
          { id: 'q2', type: QuestionType.MULTIPLE_CHOICE, title: 'How did you hear about us?', options: [ { id: 'o1', value: 'Social Media' }, { id: 'o2', value: 'Friend' }, { id: 'o3', value: 'Search Engine' }, ], required: false, },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Internal Feedback',
    parentId: null,
    access: 'private',
    assignedAgentIds: ['user-2', 'user-3'],
    forms: [
        { id: 'form-2', title: 'Q3 Internal Feedback Form', description: 'For authorized agents only.', questions: [], }
    ],
  },
  {
    id: '3',
    name: 'Team Onboarding',
    parentId: '2',
    access: 'private',
    assignedAgentIds: ['user-2'],
    forms: [],
  },
  {
    id: '4',
    name: 'Public Contact',
    parentId: null,
    access: 'public',
    assignedAgentIds: [],
    forms: [
      {
        id: 'form-3',
        title: 'Contact Us',
        description: 'Feel free to reach out!',
        questions: [ { id: 'q3', type: QuestionType.PARAGRAPH, title: 'Your Message', options: [], required: true, }, ],
      },
    ],
  },
];


export const sampleSubmissions: Submission[] = [
    {
        id: 'sub-1',
        formId: 'form-1',
        agentId: null,
        submittedAt: '2024-05-20T10:00:00Z',
        data: {
            'q1': 'Alice',
            'q2': 'Social Media',
        },
    },
    {
        id: 'sub-2',
        formId: 'form-1',
        agentId: null,
        submittedAt: '2024-05-21T11:30:00Z',
        data: {
            'q1': 'Bob',
            'q2': 'Friend',
        },
    },
     {
        id: 'sub-3',
        formId: 'form-3',
        agentId: null,
        submittedAt: '2024-05-22T14:00:00Z',
        data: {
            'q3': 'This is a test message for the contact form.',
        },
    },
];