import React from 'react';
import { Field, User, Role, Submission, View } from '../types';
import { FolderIcon, UsersIcon, FileTextIcon, CheckCircleIcon, HomeIcon } from './icons';

interface DashboardProps {
  fields: Field[];
  users: User[];
  submissions: Submission[];
  setView: (view: View) => void;
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

const FieldCard: React.FC<{field: Field, submissions: Submission[], onClick: () => void}> = ({ field, submissions, onClick }) => {
    const fieldFormIds = new Set(field.forms.map(f => f.id));
    const fieldSubmissions = submissions.filter(s => fieldFormIds.has(s.formId));

    return (
        <button onClick={onClick} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-left w-full hover:ring-2 hover:ring-indigo-400 transition-all transform hover:-translate-y-1">
            <div className="flex items-center mb-2">
                <FolderIcon className="h-5 w-5 text-gray-700 mr-2"/>
                <h3 className="text-xl font-bold text-gray-800">{field.name}</h3>
            </div>
            <p className="text-gray-600 mb-4 h-6 truncate">{field.forms[0]?.description || 'No description'}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center"><FileTextIcon className="h-4 w-4 mr-1"/> {field.forms.length} Forms</span>
                <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1"/> {field.assignedAgentIds.length} Agents</span>
                <span className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-1"/> {fieldSubmissions.length} Submissions</span>
            </div>
        </button>
    )
}

const Dashboard: React.FC<DashboardProps> = ({ fields, users, submissions, setView }) => {
  const totalFields = fields.length;
  const totalAgents = users.filter(u => u.role === Role.AGENT).length;
  const totalForms = fields.reduce((acc, f) => acc + f.forms.length, 0);
  const totalSubmissions = submissions.length;

  return (
    <div className="text-white">
      <header className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8 flex items-center">
        <HomeIcon className="h-8 w-8 text-gray-800 mr-4"/>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FolderIcon className="h-10 w-10"/>} label="Total Fields" value={totalFields} />
        <StatCard icon={<UsersIcon className="h-10 w-10"/>} label="Total Agents" value={totalAgents} />
        <StatCard icon={<FileTextIcon className="h-10 w-10"/>} label="Total Forms" value={totalForms} />
        <StatCard icon={<CheckCircleIcon className="h-10 w-10"/>} label="Total Submissions" value={totalSubmissions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {fields.filter(p => p.parentId === null).map(field => (
            <FieldCard 
              key={field.id} 
              field={field} 
              submissions={submissions}
              onClick={() => setView({ type: 'field', fieldId: field.id })}
            />
        ))}
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Submissions Over Time</h2>
        <div className="text-center text-gray-600 py-10">
            No submission data available
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
