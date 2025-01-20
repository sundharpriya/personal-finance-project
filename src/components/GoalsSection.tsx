import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Users } from 'lucide-react';

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
}

export function GoalsSection({ goals, onAddGoal }: GoalsSectionProps) {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    collaborators: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '1', // In a real app, this would come from the authenticated user
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      collaborators: formData.collaborators.split(',').map(email => email.trim()).filter(Boolean)
    };
    onAddGoal(newGoal);
    setFormData({ title: '', targetAmount: '', deadline: '', collaborators: '' });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Add Financial Goal</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Goal Title
            </label>
            <input
              type="text"
              className="w-full border rounded-md py-2 px-3"
              placeholder="e.g., Buy a house"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Target Amount
            </label>
            <input
              type="number"
              className="w-full border rounded-md py-2 px-3"
              placeholder="Enter amount"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Deadline
            </label>
            <input
              type="date"
              className="w-full border rounded-md py-2 px-3"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Collaborators (comma-separated emails)
            </label>
            <input
              type="text"
              className="w-full border rounded-md py-2 px-3"
              placeholder="friend@example.com, family@example.com"
              value={formData.collaborators}
              onChange={(e) => setFormData({ ...formData, collaborators: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Goal
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Financial Goals</h2>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={goal.id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    <p className="text-sm text-gray-500">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </p>
                  </div>
                  {goal.collaborators.length > 0 && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {goal.collaborators.length} collaborators
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress: ${goal.currentAmount}</span>
                    <span>Target: ${goal.targetAmount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-green-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{Math.round(progress)}% completed</p>
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No financial goals yet. Set your first goal to start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}