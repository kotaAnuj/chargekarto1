export enum QuestionType {
  SHORT_ANSWER = 'SHORT_ANSWER',
  PARAGRAPH = 'PARAGRAPH',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOXES = 'CHECKBOXES',
  DROPDOWN = 'DROPDOWN',
}

export interface Option {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options: Option[];
  required: boolean;
}

export interface Form {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

export enum Role {
    ADMIN = 'ADMIN',
    AGENT = 'AGENT',
    GUEST = 'GUEST',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Submission {
    id: string;
    formId: string;
    agentId: string | null; // Can be null for public submissions
    submittedAt: string;
    data: Record<string, any>;
}

export interface Field {
    id: string;
    name: string;
    parentId: string | null;
    forms: Form[];
    access: 'public' | 'private';
    assignedAgentIds: string[];
}

export type View = {
    type: 'admin';
} | {
    type: 'field';
    fieldId: string;
} | {
    type: 'form';
    fieldId: string;
    formId: string;
} | {
    type: 'fill';
    formId: string;
} | {
    type: 'user_dashboard';
};