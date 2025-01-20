import React, { useState } from 'react';
import { Transaction, Budget, Goal } from '../types';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';

interface ReportGeneratorProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

export function ReportGenerator({
  transactions,
  budgets,
  goals
}: ReportGeneratorProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const filterTransactionsByPeriod = (transactions: Transaction[]) => {
    const now = new Date();
    const periodStart = new Date();
    
    switch (period) {
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        periodStart.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= periodStart);
  };

  const filteredTransactions = filterTransactionsByPeriod(transactions);
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const generateReport = () => {
    const report = {
      period,
      summary: {
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
      },
      expensesByCategory,
      budgetStatus: budgets.map(budget => ({
        category: budget.category,
        budgeted: budget.amount,
        spent: expensesByCategory[budget.category] || 0,
        remaining: budget.amount - (expensesByCategory[budget.category] || 0)
      })),
      goals: goals.map(goal => ({
        title: goal.title,
        progress: (goal.currentAmount / goal.targetAmount) * 100,
        remaining: goal.targetAmount - goal.currentAmount,
        daysToDeadline: Math.ceil(
          (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      }))
    };

    // In a real app, this would generate a PDF or Excel file
    console.log('Generated Report:', report);
    alert('Report generated! In a real app, this would download a PDF or Excel file.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Financial Report</h2>
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-md py-2 px-3"
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={generateReport}
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <span>Total Income</span>
              </div>
              <span className="font-semibold text-green-500">${totalIncome}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                <span>Total Expenses</span>
              </div>
              <span className="font-semibold text-red-500">${totalExpenses}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span>Net Savings</span>
                <span className={`font-semibold ${totalIncome - totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalIncome - totalExpenses}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <div className="space-y-3">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span>{category}</span>
                <span className="font-semibold">${amount}</span>
              </div>
            ))}
            {Object.keys(expensesByCategory).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No expenses recorded for this period</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Status</h3>
        <div className="space-y-4">
          {budgets.map(budget => {
            const spent = expensesByCategory[budget.category] || 0;
            const percentage = (spent / budget.amount) * 100;
            return (
              <div key={budget.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{budget.category}</span>
                  <span>${spent} / ${budget.amount}</span>
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
            );
          })}
          {budgets.length === 0 && (
            <p className="text-center text-gray-500">No budgets set</p>
          )}
        </div>
      </div>
    </div>
  );
}