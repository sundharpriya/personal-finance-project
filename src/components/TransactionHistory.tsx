import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div className="space-y-4">
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center">
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="h-6 w-6 text-green-500 mr-3" />
              ) : (
                <ArrowDownCircle className="h-6 w-6 text-red-500 mr-3" />
              )}
              <div>
                <p className="font-semibold">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`font-bold ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}