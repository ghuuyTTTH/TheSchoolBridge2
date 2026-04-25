
import { supabase } from './supabase';
import { Student } from '../types';

/**
 * Service to handle student data interactions with Supabase
 */
export const studentService = {
  /**
   * Fetch all records from the 'students' table
   * Equivalent to: SELECT * FROM students
   */
  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*');

    if (error) {
      console.error('Error fetching students:', error.message);
      throw error;
    }

    return data || [];
  },

  /**
   * Insert a new student record
   * Equivalent to: INSERT INTO students (name, grade, etc) VALUES (...)
   */
  async addStudent(studentData: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting student:', error.message);
      throw error;
    }

    return data;
  },

  /**
   * Fetch a specific student by ID
   */
  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching student ${id}:`, error.message);
      return null;
    }

    return data;
  }
};
