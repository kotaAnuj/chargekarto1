import React, { useState } from 'react';
import { Form, Question, QuestionType } from '../types';

interface FormFillerPageProps {
    form: Form;
    onSubmit: (formId: string, data: Record<string, any>) => void;
    onBack: () => void;
}

const FormFillerPage: React.FC<FormFillerPageProps> = ({ form, onSubmit, onBack }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (questionId: string, value: any, questionType: QuestionType) => {
        setFormData(prev => {
            if (questionType === QuestionType.CHECKBOXES) {
                const existing = prev[questionId] || [];
                const newValues = existing.includes(value)
                    ? existing.filter((v: any) => v !== value)
                    : [...existing, value];
                return { ...prev, [questionId]: newValues };
            }
            return { ...prev, [questionId]: value };
        });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        form.questions.forEach(q => {
            if (q.required) {
                const value = formData[q.id];
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    newErrors[q.id] = 'This field is required.';
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(form.id, formData);
        }
    };

    const renderQuestionInput = (question: Question) => {
        const error = errors[question.id];
        switch (question.type) {
            case QuestionType.SHORT_ANSWER:
                return <input type="text" onChange={e => handleChange(question.id, e.target.value, question.type)} className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
            case QuestionType.PARAGRAPH:
                return <textarea onChange={e => handleChange(question.id, e.target.value, question.type)} className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" rows={4}/>
            case QuestionType.MULTIPLE_CHOICE:
                return <div className="mt-2 space-y-2">{question.options.map(opt => (
                    <label key={opt.id} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <input type="radio" name={question.id} value={opt.value} onChange={e => handleChange(question.id, e.target.value, question.type)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                        <span className="ml-3 text-gray-700">{opt.value}</span>
                    </label>
                ))}</div>
            case QuestionType.CHECKBOXES:
                return <div className="mt-2 space-y-2">{question.options.map(opt => (
                    <label key={opt.id} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                        <input type="checkbox" value={opt.value} onChange={e => handleChange(question.id, e.target.value, question.type)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"/>
                        <span className="ml-3 text-gray-700">{opt.value}</span>
                    </label>
                ))}</div>
            case QuestionType.DROPDOWN:
                return <select onChange={e => handleChange(question.id, e.target.value, question.type)} className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select an option</option>
                    {question.options.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                </select>
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-4">&larr; Back to list</button>
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl" noValidate>
                <div className="border-b-4 border-indigo-500 pb-4 mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">{form.title}</h1>
                    <p className="text-gray-600 mt-2">{form.description}</p>
                </div>
                
                <div className="space-y-6">
                    {form.questions.map(q => (
                        <div key={q.id} className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${errors[q.id] ? 'border-red-500' : 'border-gray-200'}`}>
                            <label className="block text-lg font-medium text-gray-800">
                                {q.title}
                                {q.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderQuestionInput(q)}
                            {/* FIX: The 'error' variable was not in scope here. Using errors[q.id] to get the correct error message for the question. */}
                            {errors[q.id] && <p className="text-red-500 text-sm mt-1">{errors[q.id]}</p>}
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-right">
                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormFillerPage;