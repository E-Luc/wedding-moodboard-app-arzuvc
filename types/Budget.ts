export interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  icon: string;
  color: string;
  description?: string;
  expenses: BudgetExpense[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  vendor?: string;
  createdAt: string;
}

export interface BudgetFormData {
  category: string;
  budgeted: number;
  description?: string;
  icon?: string;
  color?: string;
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  overBudgetCount: number;
}
