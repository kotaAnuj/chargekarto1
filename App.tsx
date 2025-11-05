import React, { useState, useCallback } from 'react';
import { Field, View, User, Submission, Form, Role } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FieldPage from './components/FieldPage';
import FormEditorPage from './components/FormEditorPage';
import FormListPage from './components/FormListPage';
import FormFillerPage from './components/FormFillerPage';
import UserSwitcher from './components/UserSwitcher';
import { initialFields, sampleUsers, sampleSubmissions } from './initialData';
import { MenuIcon } from './components/icons';

const App: React.FC = () => {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [submissions, setSubmissions] = useState<Submission[]>(sampleSubmissions);
  const [currentUser, setCurrentUser] = useState<User>(users.find(u => u.role === Role.ADMIN)!);
  const [currentView, setCurrentView] = useState<View>({ type: 'admin' });
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const setView = useCallback((view: View) => {
    // When navigating, close the sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    setCurrentView(view);
  }, []);

  const addField = useCallback((parentId: string | null) => {
    const newField: Field = {
      id: Date.now().toString(),
      name: 'Untitled Field',
      parentId,
      forms: [],
      access: 'private',
      assignedAgentIds: [],
    };
    setFields(prev => [...prev, newField]);
    setView({ type: 'field', fieldId: newField.id });
  }, [setView]);
  
  const addForm = useCallback((fieldId: string) => {
      const newForm: Form = {
          id: Date.now().toString(),
          title: 'Untitled Form',
          description: '',
          questions: [],
      };
      setFields(prevFields => prevFields.map(f => {
          if (f.id === fieldId) {
              return { ...f, forms: [...f.forms, newForm] };
          }
          return f;
      }));
      setView({ type: 'form', fieldId, formId: newForm.id});
  }, [setView]);

  const deleteField = useCallback((fieldId: string) => {
    setFields(prevFields => {
        const getDescendantIds = (fid: string): string[] => {
            const children = prevFields.filter(p => p.parentId === fid);
            return children.reduce<string[]>((acc, child) => [
                ...acc,
                child.id,
                ...getDescendantIds(child.id)
            ], []);
        };
        const fieldIdsToDelete = new Set([fieldId, ...getDescendantIds(fieldId)]);
        
        const formIdsToDelete = new Set<string>();
        prevFields.forEach(field => {
            if (fieldIdsToDelete.has(field.id)) {
                field.forms.forEach(form => formIdsToDelete.add(form.id));
            }
        });
        
        setSubmissions(prevSubs => prevSubs.filter(s => !formIdsToDelete.has(s.formId)));
        
        return prevFields.filter(p => !fieldIdsToDelete.has(p.id));
    });
    setView({ type: 'admin' });
  }, [setView]);

  const updateField = useCallback((fieldId: string, updatedFieldData: Partial<Field>) => {
    setFields(prev => prev.map(f => (f.id === fieldId ? { ...f, ...updatedFieldData } : f)));
  }, []);
  
  const updateForm = useCallback((fieldId: string, formId: string, updatedForm: Partial<Form>) => {
    setFields(prev => prev.map(f => {
        if (f.id === fieldId) {
            const newForms = f.forms.map(form => 
                form.id === formId ? { ...form, ...updatedForm } : form
            );
            return { ...f, forms: newForms };
        }
        return f;
    }));
  }, []);

  const addUser = useCallback((name: string, email: string): User => {
      const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: Role.AGENT,
      };
      setUsers(prev => [...prev, newUser]);
      return newUser;
  }, []);
  
  const addSubmission = useCallback((formId: string, data: Record<string, any>) => {
    const newSubmission: Submission = {
      id: Date.now().toString(),
      formId,
      agentId: currentUser.role === Role.AGENT ? currentUser.id : null,
      submittedAt: new Date().toISOString(),
      data,
    };
    setSubmissions(prev => [...prev, newSubmission]);
    alert('Form submitted successfully!');
    if (currentUser.role === Role.ADMIN) {
        const field = fields.find(f => f.forms.some(form => form.id === formId));
        if (field) setView({type: 'form', fieldId: field.id, formId: formId});
    } else {
        setView({ type: 'user_dashboard' });
    }
  }, [currentUser, fields, setView]);

  const renderAdminView = () => {
      switch (currentView.type) {
          case 'admin':
          case 'user_dashboard': // Admin can see their own dashboard
              return <Dashboard fields={fields} users={users} submissions={submissions} setView={setView} />;
          case 'field':
              const field = fields.find(f => f.id === currentView.fieldId);
              if (!field) return <div>Field not found</div>;
              return <FieldPage
                          key={field.id}
                          field={field}
                          allFields={fields}
                          users={users}
                          setView={setView}
                          addForm={addForm}
                          updateField={updateField}
                          addUser={addUser}
                      />;
          case 'form':
              const parentField = fields.find(f => f.id === currentView.fieldId);
              const form = parentField?.forms.find(f => f.id === currentView.formId);
              if (!parentField || !form) return <div>Form not found</div>;
              const formSubmissions = submissions.filter(s => s.formId === form.id);
              return <FormEditorPage
                          key={form.id}
                          field={parentField}
                          form={form}
                          submissions={formSubmissions}
                          updateForm={updateForm}
                          setView={setView}
                      />
          case 'fill':
              const formToFill = fields.flatMap(f => f.forms).find(f => f.id === currentView.formId);
              if (!formToFill) return <div>Form not found</div>;
              return <FormFillerPage form={formToFill} onSubmit={addSubmission} onBack={() => setView({type: 'admin'})} />;
      }
      return <div>Unknown View</div>
  }
  
  const renderUserView = () => {
     switch (currentView.type) {
        case 'fill':
            const formToFill = fields.flatMap(f => f.forms).find(f => f.id === currentView.formId);
            if (!formToFill) return <div>Form not found</div>;
            return <FormFillerPage form={formToFill} onSubmit={addSubmission} onBack={() => setView({type: 'user_dashboard'})} />;
        case 'user_dashboard':
        default:
            return <FormListPage fields={fields} currentUser={currentUser} setView={setView} />;
     }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans flex overflow-hidden">
      {currentUser.role === Role.ADMIN && (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
              ></div>
            <div className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
               <Sidebar
                  fields={fields}
                  currentView={currentView}
                  setView={setView}
                  addField={addField}
                  updateField={updateField}
                  deleteField={deleteField}
                />
            </div>
        </>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/30 backdrop-blur-sm p-2 text-white flex justify-between items-center shadow-md flex-shrink-0 z-20">
            {currentUser.role === Role.ADMIN && (
                <button 
                    onClick={() => setSidebarOpen(!isSidebarOpen)} 
                    className="p-2 rounded-md hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <MenuIcon className="h-6 w-6 text-white"/>
                </button>
            )}
            <div className={`${currentUser.role !== Role.ADMIN ? 'w-full' : ''}`}>
              <UserSwitcher users={users} currentUser={currentUser} setCurrentUser={setCurrentUser} setView={setView} />
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentUser.role === Role.ADMIN ? renderAdminView() : renderUserView()}
        </main>
      </div>
    </div>
  );
};

export default App;