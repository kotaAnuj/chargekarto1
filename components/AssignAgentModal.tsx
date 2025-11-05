import React, { useState } from 'react';
import { XIcon } from './icons';

interface CreateAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, email: string) => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!name.trim() || !email.trim()) {
            setError('Both name and email are required.');
            return;
        }
        // Simple email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        onCreate(name, email);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Create & Assign Agent</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                        <input
                            type="text"
                            id="agent-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Jane Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="agent-email" className="block text-sm font-medium text-gray-700 mb-1">Agent Email</label>
                        <input
                            type="email"
                            id="agent-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., jane.doe@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                <div className="p-4 border-t text-right space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create & Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAgentModal;
