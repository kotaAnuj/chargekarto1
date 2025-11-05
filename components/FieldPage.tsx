import React, { useState, useMemo } from 'react';
import { Field, User, Role, View, Form } from '../types';
import { FolderIcon, UsersIcon, FileTextIcon, CheckCircleIcon, PlusIcon, UserPlusIcon } from './icons';
import CreateAgentModal from './AssignAgentModal';

interface FieldPageProps {
  field: Field;
  allFields: Field[];
  users: User[];
  setView: (view: View) => void;
  addForm: (fieldId: string) => void;
  updateField: (fieldId: string, updatedFieldData: Partial<Field>) => void;
  addUser: (name: string, email: string) => User;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-4xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="text-purple-400">
            {icon}
        </div>
    </div>
);

const FieldPage: React.FC<FieldPageProps> = ({ field, allFields, users, setView, addForm, updateField, addUser }) => {
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

    const { subfields, assignedAgents, fieldSubmissionsCount } = useMemo(() => {
        const subfields = allFields.filter(f => f.parentId === field.id);
        const assignedAgents = users.filter(u => field.assignedAgentIds.includes(u.id));
        
        const allFormsInField = allFields.filter(f => f.id === field.id || f.parentId === field.id).flatMap(f => f.forms);
        const fieldFormIds = new Set(allFormsInField.map(f => f.id));
        
        const submissions = (window as any)._app_submissions || []; // A bit of a hack to get submissions
        const fieldSubmissionsCount = submissions.filter((s: any) => fieldFormIds.has(s.formId)).length;
        
        return { subfields, assignedAgents, fieldSubmissionsCount };
    }, [field, allFields, users]);
    
    const handleCreateAndAssignAgent = (name: string, email: string) => {
        const newUser = addUser(name, email);
        updateField(field.id, { assignedAgentIds: [...field.assignedAgentIds, newUser.id] });
        setIsAgentModalOpen(false);
    };
    
    const handleAccessChange = (access: 'public' | 'private') => {
        updateField(field.id, { access });
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <header className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center">
                    <FolderIcon className="h-8 w-8 text-gray-700 mr-4"/>
                    <h1 className="text-3xl font-bold text-gray-800">{field.name}</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => addForm(field.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform"
                    >
                       <PlusIcon /> Create Form
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<FileTextIcon className="h-10 w-10"/>} label="Forms" value={field.forms.length} />
                <StatCard icon={<UsersIcon className="h-10 w-10"/>} label="Agents" value={assignedAgents.length} />
                <StatCard icon={<CheckCircleIcon className="h-10 w-10"/>} label="Submissions" value={fieldSubmissionsCount} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileTextIcon className="h-6 w-6 mr-3 text-gray-600"/> Forms in this Field</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {field.forms.length > 0 ? field.forms.map(form => (
                            <div key={form.id} onClick={() => setView({ type: 'form', fieldId: field.id, formId: form.id })} className="bg-gray-50 p-3 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors">
                                <p className="font-semibold text-gray-700">{form.title}</p>
                                <p className="text-sm text-gray-500 truncate">{form.description || 'No description'}</p>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No forms created yet</p>
                        )}
                    </div>
                </div>
                 <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg row-span-2 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Access Control</h2>
                     <div className="flex border border-gray-300 rounded-lg p-1 mb-4 bg-gray-200">
                        <button onClick={() => handleAccessChange('public')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${field.access === 'public' ? 'bg-white shadow' : 'text-gray-600'}`}>Public</button>
                        <button onClick={() => handleAccessChange('private')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${field.access === 'private' ? 'bg-white shadow' : 'text-gray-600'}`}>Private</button>
                    </div>
                    <div className="flex-grow">
                        {field.access === 'private' ? (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-gray-700">Assigned Agents</h3>
                                     <button
                                        onClick={() => setIsAgentModalOpen(true)}
                                        className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:scale-105 transition-transform"
                                    >
                                        <UserPlusIcon className="h-4 w-4"/> Create & Assign
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                    {assignedAgents.length > 0 ? assignedAgents.map(agent => (
                                        <div key={agent.id} className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-semibold text-gray-700">{agent.name}</p>
                                            <p className="text-sm text-gray-500">{agent.email}</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-center py-4">No agents assigned yet.</p>
                                    )}
                                </div>
                            </>
                        ) : (
                             <div className="text-center text-gray-600 bg-gray-50 p-6 rounded-lg h-full flex flex-col justify-center">
                                <p className="font-semibold">This field is public.</p>
                                <p className="text-sm">Its forms are accessible to everyone.</p>
                            </div>
                        )}
                    </div>
                </div>
                 <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FolderIcon className="h-6 w-6 mr-3 text-gray-600"/> Subfields</h2>
                    <div className="space-y-2">
                         {subfields.length > 0 ? subfields.map(subfield => (
                            <div key={subfield.id} onClick={() => setView({type: 'field', fieldId: subfield.id})} className="bg-gray-100 p-3 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors flex justify-between items-center">
                                <p className="font-semibold text-gray-700">{subfield.name}</p>
                                 <span className="text-xs font-semibold bg-gray-300 text-gray-700 px-2 py-1 rounded-full">{subfield.forms.length} Forms</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No subfields created yet</p>
                        )}
                    </div>
                </div>
            </div>

            {isAgentModalOpen && (
                <CreateAgentModal
                    isOpen={isAgentModalOpen}
                    onClose={() => setIsAgentModalOpen(false)}
                    onCreate={handleCreateAndAssignAgent}
                />
            )}
        </div>
    );
};

export default FieldPage;