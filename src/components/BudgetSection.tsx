import React, { useState } from 'react';
import { Budget, Transaction } from '../types';
import { DollarSign, PieChart } from 'lucide-react';

interface BudgetSectionProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Budget) => void;
  categories: readonly string[];
}

export function BudgetSection({
  budgets,
  transactions,
  onAddBudget,
  categories
}: BudgetSectionProps) {
  const [formData, setFormData] = useState({
    category: categories[0],
    amount: '',
    period: 'monthly' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget: Budget = {
      id: Math.random().toString(36).substr(2, 9),
      userId: '1', // In a real app, this would come from the authenticated user
      category: formData.category,
      amount: parseFloat(formData.amount),
      spent: 0,
      period: formData.period
    };
    onAddBudget(newBudget);
    setFormData({ category: categories[0], amount: '', period: 'monthly' });
  };

  const calculateSpent = (budget: Budget) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Add Budget</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              className="w-full border rounded-md py-2 px-3"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Budget Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                className="w-full pl-10 border rounded-md py-2 px-3"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Period
            </label>
            <select
              className="w-full border rounded-md py-2 px-3"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Budget
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const spent = calculateSpent(budget);
            const percentage = (spent / budget.amount) * 100;
            return (
              <div key={budget.id} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{budget.category}</h3>
                  <span className="text-sm text-gray-500">{budget.period}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Spent: ${spent}</span>
                    <span>Budget: ${budget.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        percentage > 100 ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {percentage > 100 ? 'Over budget!' : `${Math.round(percentage)}% used`}
                </p>
              </div>
            );
          })}
          {budgets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No budgets set yet. Add your first budget to start tracking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}