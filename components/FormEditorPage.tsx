import React, { useState, useCallback } from 'react';
import { Field, Form, Question, QuestionType, Submission, View } from '../types';
import ControlPanel from './ControlPanel';
import FormCanvas from './FormCanvas';
import ReportsView from './ReportsView';
import { FileTextIcon, PlusIcon, EyeIcon } from './icons';

interface FormEditorPageProps {
  field: Field;
  form: Form;
  submissions: Submission[];
  updateForm: (fieldId: string, formId: string, updatedForm: Partial<Form>) => void;
  setView: (view: View) => void;
}

const AddQuestionModal: React.FC<{isOpen: boolean, onClose: () => void, addQuestion: (type: QuestionType) => void}> = ({ isOpen, onClose, addQuestion }) => {
    if (!isOpen) return null;
    
    const handleAddQuestion = (type: QuestionType) => {
        addQuestion(type);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <ControlPanel addQuestion={handleAddQuestion} />
            </div>
        </div>
    );
};


const FormEditorPage: React.FC<FormEditorPageProps> = ({ field, form, submissions, updateForm, setView }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'reports'>('editor');
  const [isAddQuestionModalOpen, setAddQuestionModalOpen] = useState(false);

  const setFormTitle = (title: string) => {
    updateForm(field.id, form.id, { title });
  }
  
  const setFormDescription = (description: string) => {
    updateForm(field.id, form.id, { description });
  }

  const addQuestion = useCallback((type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: 'Untitled Question',
      required: false,
      options: type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.CHECKBOXES || type === QuestionType.DROPDOWN
        ? [{ id: Date.now().toString(), value: 'Option 1' }]
        : [],
    };
    updateForm(field.id, form.id, { questions: [...form.questions, newQuestion] });
  }, [field.id, form, updateForm]);

  const updateQuestion = useCallback((id: string, updatedQuestion: Partial<Question>) => {
    const newQuestions = form.questions.map(q => q.id === id ? { ...q, ...updatedQuestion } : q);
    updateForm(field.id, form.id, { questions: newQuestions });
  }, [field.id, form, updateForm]);

  const deleteQuestion = useCallback((id: string) => {
    const newQuestions = form.questions.filter(q => q.id !== id);
    updateForm(field.id, form.id, { questions: newQuestions });
  }, [field.id, form, updateForm]);
  
  const tabs: { id: 'editor' | 'reports'; name: string; icon: React.ReactNode }[] = [
      { id: 'editor', name: 'Form Editor', icon: <FileTextIcon className="h-5 w-5 mr-2" /> },
      { id: 'reports', name: `Reports (${submissions.length})`, icon: <FileTextIcon className="h-5 w-5 mr-2" /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
        case 'editor':
            return (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="hidden lg:block">
                        <ControlPanel addQuestion={addQuestion} />
                    </div>
                    <div className="flex-grow min-w-0">
                        <FormCanvas
                            formTitle={form.title}
                            setFormTitle={setFormTitle}
                            formDescription={form.description}
                            setFormDescription={setFormDescription}
                            questions={form.questions}
                            updateQuestion={updateQuestion}
                            deleteQuestion={deleteQuestion}
                        />
                    </div>
                </div>
            );
        case 'reports':
            return <ReportsView questions={form.questions} submissions={submissions} />;
    }
  }

  return (
    <>
    <div className="bg-gray-100/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 flex-wrap">
        <div>
            <button className="text-sm text-indigo-600 hover:underline mb-1" onClick={() => setView({type: 'field', fieldId: field.id})}>&larr; Back to {field.name}</button>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">{form.title}</h1>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setView({type: 'fill', formId: form.id})}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                <EyeIcon className="h-5 w-5"/>
                Preview
            </button>
            <button
              onClick={() => setView({type: 'field', fieldId: field.id})}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors"
            >
              Save & Close
            </button>
        </div>
      </header>
      
      <div className="border-b border-gray-300 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                    {tab.icon} {tab.name}
                </button>
            ))}
        </nav>
      </div>

      <main className="flex-grow overflow-y-auto pr-2 -mr-2">
        {renderContent()}
      </main>
    </div>
    <div className="block lg:hidden fixed bottom-6 right-6 z-20">
         <button 
            onClick={() => setAddQuestionModalOpen(true)}
            className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform hover:scale-110"
            aria-label="Add Question"
        >
            <PlusIcon className="h-6 w-6" />
         </button>
      </div>
    <AddQuestionModal isOpen={isAddQuestionModalOpen} onClose={() => setAddQuestionModalOpen(false)} addQuestion={addQuestion}/>
    </>
  );
};

export default FormEditorPage;