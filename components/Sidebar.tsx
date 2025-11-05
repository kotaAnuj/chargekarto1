import React, { useState, useEffect, useRef } from 'react';
import { Field, View } from '../types';
import { HomeIcon, PlusIcon, FileIcon, ChevronRightIcon, TrashIcon, FolderIcon } from './icons';

interface SidebarProps {
  fields: Field[];
  currentView: View;
  setView: (view: View) => void;
  addField: (parentId: string | null) => void;
  updateField: (fieldId: string, updatedFieldData: Partial<Field>) => void;
  deleteField: (fieldId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ fields, currentView, setView, addField, updateField, deleteField }) => {
  const rootFields = fields.filter(p => p.parentId === null);

  return (
    <aside className="w-72 bg-gray-800 text-gray-200 flex flex-col h-full shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Site Builder</h1>
      </div>
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        <button
          onClick={() => setView({ type: 'admin' })}
          className={`w-full flex items-center p-2 rounded-md transition-colors ${currentView.type === 'admin' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
        >
          <HomeIcon />
          <span>Dashboard</span>
        </button>

        <div className="pt-4 mt-2 border-t border-gray-700">
            <h2 className="px-2 mb-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Fields</h2>
            {rootFields.map(field => (
                <FieldNode 
                    key={field.id}
                    field={field}
                    allFields={fields}
                    currentView={currentView}
                    setView={setView}
                    addField={addField}
                    updateField={updateField}
                    deleteField={deleteField}
                    level={0}
                />
            ))}
        </div>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => addField(null)}
          className="w-full flex items-center justify-center p-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          <span>New Field</span>
        </button>
      </div>
    </aside>
  );
};

interface FieldNodeProps extends Omit<SidebarProps, 'fields'>{
    field: Field;
    allFields: Field[];
    level: number;
}

const FieldNode: React.FC<FieldNodeProps> = ({ field, allFields, currentView, setView, addField, updateField, deleteField, level }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(field.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const clickTimer = useRef<number | null>(null);

    const children = allFields.filter(p => p.parentId === field.id);
    const isActive = (currentView.type === 'field' && currentView.fieldId === field.id) || (currentView.type === 'form' && currentView.fieldId === field.id);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    useEffect(() => {
        setName(field.name);
    }, [field.name]);
    
    useEffect(() => {
        // Cleanup timer on component unmount
        return () => {
            if (clickTimer.current) {
                clearTimeout(clickTimer.current);
            }
        };
    }, []);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${field.name}" and all its sub-fields and forms?`)) {
            deleteField(field.id);
        }
    }
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    
    const handleNameBlur = () => {
        if (name.trim() === '') {
            setName(field.name);
        } else if (name !== field.name) {
            updateField(field.id, { name });
        }
        setIsEditing(false);
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNameBlur();
        } else if (e.key === 'Escape') {
            setName(field.name);
            setIsEditing(false);
        }
    }
    
    const handleNodeClick = () => {
        if (isEditing) return;

        if (clickTimer.current) {
            // Double click
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
            setIsEditing(true);
        } else {
            // Single click
            clickTimer.current = window.setTimeout(() => {
                clickTimer.current = null;
                setView({ type: 'field', fieldId: field.id });
            }, 250);
        }
    }

    return (
        <div>
            <div 
                onClick={handleNodeClick}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'}`}
                style={{ paddingLeft: `${0.5 + level * 1}rem` }}
            >
                <div className="flex items-center flex-1 truncate">
                    {children.length > 0 ? (
                       <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="mr-1 p-1 rounded-full hover:bg-gray-600">
                           <ChevronRightIcon isRotated={isExpanded} />
                       </button>
                    ) : <span className="w-5 h-5 mr-1 flex-shrink-0"></span>}
                    <FolderIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-600 text-white rounded px-1 -ml-1 w-full"
                        />
                    ) : (
                        <span className="ml-1 truncate" title={field.name}>{field.name}</span>
                    )}
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); addField(field.id); }} className="p-1 rounded-full hover:bg-gray-600" title="Add Sub-field">
                        <PlusIcon className="h-4 w-4" />
                    </button>
                    <button onClick={handleDelete} className="p-1 rounded-full hover:bg-gray-600" title="Delete Field">
                        <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500"/>
                    </button>
                </div>
            </div>
             {isExpanded && children.length > 0 && (
                <div className="mt-1">
                    {children.map(child => (
                        <FieldNode
                            key={child.id}
                            field={child}
                            allFields={allFields}
                            currentView={currentView}
                            setView={setView}
                            addField={addField}
                            updateField={updateField}
                            deleteField={deleteField}
                            level={level + 1}
                        />
                    ))}
                </div>
             )}
        </div>
    )
}

export default Sidebar;