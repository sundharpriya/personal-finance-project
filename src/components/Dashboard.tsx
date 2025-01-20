import React, { useState } from 'react';
import { Transaction, Budget, Goal, Notification, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { TransactionForm } from './TransactionForm';
import { TransactionHistory } from './TransactionHistory';
import { BudgetSection } from './BudgetSection';
import { GoalsSection } from './GoalsSection';
import { NotificationList } from './NotificationList';
import { ReportGenerator } from './ReportGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  notifications: Notification[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  onAddBudget: (budget: Budget) => void;
  onAddGoal: (goal: Goal) => void;
  onUpdateNotification: (id: string) => void;
}

export function Dashboard({
  transactions,
  budgets,
  goals,
  notifications,
  onAddTransaction,
  onAddBudget,
  onAddGoal,
  onUpdateNotification
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
          <p className="text-2xl font-bold text-green-500">${totalIncome}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-500">${totalExpenses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Balance</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${balance}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
              <TransactionForm
                onSubmit={onAddTransaction}
                categories={{
                  income: INCOME_CATEGORIES,
                  expense: EXPENSE_CATEGORIES
                }}
              />
            </div>
            <div>
              <NotificationList
                notifications={notifications}
                onUpdateNotification={onUpdateNotification}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionHistory
            transactions={transactions}
            categories={{
              income: INCOME_CATEGORIES,
              expense: EXPENSE_CATEGORIES
            }}
          />
        </TabsContent>

        <TabsContent value="budgets">
          <BudgetSection
            budgets={budgets}
            transactions={transactions}
            onAddBudget={onAddBudget}
            categories={EXPENSE_CATEGORIES}
          />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsSection
            goals={goals}
            onAddGoal={onAddGoal}
          />
        </TabsContent>

        <TabsContent value="reports">
          <ReportGenerator
            transactions={transactions}
            budgets={budgets}
            goals={goals}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}