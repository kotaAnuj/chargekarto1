import React, { useMemo } from 'react';
import { Field, User, Role, View } from '../types';
import { FileTextIcon } from './icons';

interface FormListPageProps {
    fields: Field[];
    currentUser: User;
    setView: (view: View) => void;
}

const FormListPage: React.FC<FormListPageProps> = ({ fields, currentUser, setView }) => {

    const accessibleForms = useMemo(() => {
        if (!fields) return [];
        
        return fields.flatMap(field => {
            const isAccessible = 
                (currentUser.role === Role.GUEST && field.access === 'public') ||
                (currentUser.role === Role.AGENT && field.assignedAgentIds.includes(currentUser.id));

            if (isAccessible) {
                return field.forms.map(form => ({ ...form, fieldName: field.name }));
            }
            return [];
        });

    }, [fields, currentUser]);
    
    const title = currentUser.role === Role.AGENT ? "Assigned Forms" : "Public Forms";
    const description = currentUser.role === Role.AGENT ? "These are the forms you have been assigned to." : "These forms are open for public submission.";

    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <header className="mb-6 pb-4 border-b">
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                <p className="text-gray-600 mt-1">{description}</p>
            </header>
            
            <div className="space-y-4">
                {accessibleForms.length > 0 ? (
                    accessibleForms.map(form => (
                        <button
                            key={form.id}
                            onClick={() => setView({type: 'fill', formId: form.id})}
                            className="w-full text-left bg-white p-4 rounded-lg shadow-sm border hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-start gap-4"
                        >
                            <div className="flex-shrink-0 text-indigo-500 mt-1">
                                <FileTextIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-gray-800">{form.title}</h2>
                                <p className="text-sm text-gray-500 mb-1">from: {form.fieldName}</p>
                                <p className="text-sm text-gray-600">{form.description || "No description provided."}</p>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center p-10 border-2 border-dashed rounded-lg text-gray-500">
                        <h3 className="text-xl font-medium">No Forms Found</h3>
                        <p>There are currently no forms available for you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormListPage;
