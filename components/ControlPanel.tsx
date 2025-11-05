
import React from 'react';
import { QuestionType } from '../types';
import { ShortTextIcon, ParagraphIcon, MultipleChoiceIcon, CheckboxIcon, DropdownIcon } from './icons';

interface ControlPanelProps {
  addQuestion: (type: QuestionType) => void;
}

const controlOptions = [
  { type: QuestionType.SHORT_ANSWER, icon: <ShortTextIcon />, label: 'Short Answer' },
  { type: QuestionType.PARAGRAPH, icon: <ParagraphIcon />, label: 'Paragraph' },
  { type: QuestionType.MULTIPLE_CHOICE, icon: <MultipleChoiceIcon />, label: 'Multiple Choice' },
  { type: QuestionType.CHECKBOXES, icon: <CheckboxIcon />, label: 'Checkboxes' },
  { type: QuestionType.DROPDOWN, icon: <DropdownIcon />, label: 'Dropdown' },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ addQuestion }) => {
  return (
    <div className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-md self-start sticky top-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Question</h2>
      <div className="space-y-2">
        {controlOptions.map(({ type, icon, label }) => (
          <button
            key={type}
            onClick={() => addQuestion(type)}
            className="w-full flex items-center p-2 text-left text-gray-600 bg-gray-50 hover:bg-indigo-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
