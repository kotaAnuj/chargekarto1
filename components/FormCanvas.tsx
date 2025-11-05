
import React from 'react';
import { Question } from '../types';
import QuestionEditor from './QuestionEditor';

interface FormCanvasProps {
  formTitle: string;
  setFormTitle: (title: string) => void;
  formDescription: string;
  setFormDescription: (desc: string) => void;
  questions: Question[];
  updateQuestion: (id: string, updatedQuestion: Partial<Question>) => void;
  deleteQuestion: (id:string) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  questions,
  updateQuestion,
  deleteQuestion,
}) => {
  return (
    <div className="flex-1">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-8 border-indigo-600 mb-6">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form Title"
          className="text-3xl w-full border-b border-gray-200 focus:border-indigo-500 py-2 mb-2 focus:outline-none"
        />
        <input
          type="text"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Form Description"
          className="text-base w-full border-b border-gray-200 focus:border-indigo-500 py-1 focus:outline-none"
        />
      </div>
      
      {questions.map(q => (
        <QuestionEditor
          key={q.id}
          question={q}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
        />
      ))}

       {questions.length === 0 && (
        <div className="text-center p-10 border-2 border-dashed rounded-lg text-gray-500">
            <h3 className="text-xl font-medium">Your form is empty</h3>
            <p>Use the panel on the left to add questions.</p>
        </div>
       )}
    </div>
  );
};

export default FormCanvas;
