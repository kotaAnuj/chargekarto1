import React from 'react';
import { Question, Option, QuestionType } from '../types';
import { TrashIcon, XIcon } from './icons';

interface QuestionEditorProps {
  question: Question;
  updateQuestion: (id: string, updatedQuestion: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, updateQuestion, deleteQuestion }) => {
  const { id, title, type, options, required } = question;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuestion(id, { title: e.target.value });
  };
  
  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQuestion(id, { required: e.target.checked });
  };

  const handleOptionChange = (optionId: string, value: string) => {
    const newOptions = options.map(opt => opt.id === optionId ? { ...opt, value } : opt);
    updateQuestion(id, { options: newOptions });
  };

  const addOption = () => {
    const newOption: Option = { id: Date.now().toString(), value: `Option ${options.length + 1}` };
    updateQuestion(id, { options: [...options, newOption] });
  };

  const removeOption = (optionId: string) => {
    const newOptions = options.filter(opt => opt.id !== optionId);
    updateQuestion(id, { options: newOptions });
  };

  const renderOptionsEditor = () => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.CHECKBOXES:
      case QuestionType.DROPDOWN:
        return (
          <div className="mt-4 space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center group">
                <div className="flex-shrink-0 mr-3">
                    {type === QuestionType.MULTIPLE_CHOICE && <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>}
                    {type === QuestionType.CHECKBOXES && <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>}
                    {type === QuestionType.DROPDOWN && <span className="text-gray-500 font-semibold">{index + 1}.</span>}
                </div>
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-1 transition-colors"
                  placeholder="Option"
                />
                {options.length > 1 && (
                    <button onClick={() => removeOption(option.id)} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <XIcon />
                    </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add option
            </button>
          </div>
        );
      case QuestionType.SHORT_ANSWER:
        return <div className="mt-4 border-b-2 border-dotted w-1/2 pb-1 text-gray-500">Short answer text</div>;
      case QuestionType.PARAGRAPH:
        return <div className="mt-4 border-b-2 border-dotted w-full pb-1 text-gray-500">Long answer text</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 mb-6">
      <div className="flex justify-between items-start">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Question Title"
          className="text-lg font-medium text-gray-800 w-full p-2 -ml-2 focus:bg-gray-100 rounded-md focus:outline-none"
        />
        <div className="ml-4 flex-shrink-0">
          <button onClick={() => deleteQuestion(id)}>
            <TrashIcon />
          </button>
        </div>
      </div>
      {renderOptionsEditor()}
      <div className="mt-6 pt-4 border-t flex items-center justify-end gap-4">
        <label htmlFor={`required-${id}`} className="flex items-center cursor-pointer">
          <span className="text-sm font-medium text-gray-600 mr-3">Required</span>
          <div className="relative">
            <input
              type="checkbox"
              id={`required-${id}`}
              checked={required}
              onChange={handleRequiredChange}
              className="sr-only peer"
            />
            <div className="block bg-gray-200 peer-checked:bg-indigo-600 w-10 h-6 rounded-full transition-colors"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default QuestionEditor;