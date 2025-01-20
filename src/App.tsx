import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { Transaction, User, AuthState, Budget, Goal, Notification } from './types';
import { BellRing } from 'lucide-react';

export default function App() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLogin = (data: any) => {
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: data.email,
      gender: 'other'
    };
    setAuth({ user: mockUser, isAuthenticated: true });
  };

  const handleRegister = (data: any) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      gender: data.gender
    };
    setAuth({ user: newUser, isAuthenticated: true });
  };

  const handleAddTransaction = (data: Omit<Transaction, 'id' | 'userId'>) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: auth.user?.id || '',
      ...data
    };

    setTransactions((prev) => [...prev, newTransaction]);

    // Check budget limits
    const categoryBudget = budgets.find(b => b.category === data.category);
    if (categoryBudget && data.type === 'expense') {
      const totalSpent = transactions
        .filter(t => t.category === data.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) + data.amount;

      if (totalSpent > categoryBudget.amount) {
        addNotification({
          title: 'Budget Alert',
          message: `You've exceeded your budget for ${data.category}`,
          type: 'overspending'
        });
      }
    }

    // Check if expenses exceed income
    const totalIncome = [...transactions, newTransaction]
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = [...transactions, newTransaction]
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses > totalIncome) {
      addNotification({
        title: 'Overspending Alert',
        message: 'Your expenses have exceeded your income!',
        type: 'alert'
      });
    }
  };

  const addNotification = (data: Omit<Notification, 'id' | 'userId' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: auth.user?.id || '',
      date: new Date().toISOString(),
      read: false,
      ...data
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <AuthForm
            type={isRegistering ? 'register' : 'login'}
            onSubmit={isRegistering ? handleRegister : handleLogin}
          />
          <p className="text-center mt-4">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 hover:text-blue-700"
            >
              {isRegistering ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Personal Finance Manager</h1>
            </div>
            <div className="flex items-center">
              <div className="relative mr-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <BellRing className="h-6 w-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
              <span className="mr-4">Welcome, {auth.user?.name}</span>
              <button
                onClick={() => setAuth({ user: null, isAuthenticated: false })}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <Dashboard
          transactions={transactions}
          budgets={budgets}
          goals={goals}
          notifications={notifications}
          onAddTransaction={handleAddTransaction}
          onAddBudget={(budget) => setBudgets(prev => [...prev, budget])}
          onAddGoal={(goal) => setGoals(prev => [...prev, goal])}
          onUpdateNotification={(id) => {
            setNotifications(prev =>
              prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
          }}
        />
      </main>
    </div>
  );
}