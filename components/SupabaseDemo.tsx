
import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Student, RiskLevel } from '../types';

/**
 * A demonstration component showing how to fetch and insert data using Supabase.
 */
export const SupabaseDemo: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for adding a new student
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      setStudents(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const newStudent: Partial<Student> = {
        name: newName,
        email: newEmail,
        grade: '10', // Default grade
        riskLevel: 'low' as RiskLevel,
        attendance: 100,
        missingTasks: [],
        recentScores: [],
        subjects: [],
        points: 0,
        level: 1,
        badges: [],
        moodHistory: [],
        strengths: [],
        weaknesses: [],
        isPeerMentor: false,
        issueSummary: 'New student enrolled'
      };

      await studentService.addStudent(newStudent);
      
      // Refresh the list
      await loadStudents();
      
      // Reset form
      setNewName('');
      setNewEmail('');
      alert('Student added successfully!');
    } catch (err: any) {
      alert('Error adding student: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Supabase Student Records</h2>
      
      {/* Add Student Form */}
      <form onSubmit={handleAddStudent} className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold">Add New Student</h3>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Student
        </button>
      </form>

      {/* Student List */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Current Students</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500">No students found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  student.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                  student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {student.riskLevel.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
