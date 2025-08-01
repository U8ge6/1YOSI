import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Tenants } from './components/Tenants/Tenants';
import { Payments } from './components/Payments/Payments';
import { Expenses } from './components/Expenses/Expenses';
import { PettyCash } from './components/PettyCash/PettyCash';
import { Employees } from './components/Employees/Employees';
import { Issues } from './components/Issues/Issues';
import { Inventory } from './components/Inventory/Inventory';
import { Settings } from './components/Settings/Settings';
import { mockData } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppState, Tenant, Payment, Expense, PettyCashTransaction, Employee, Issue, Product, ProductUsage, ProductHistory, Building, ElectricityReading } from './types';

function App() {
  // Use localStorage hook for persistent data storage
  const [data, setData] = useLocalStorage<AppState>('building-management-data', mockData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get current date dynamically
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Auto-save indicator
  useEffect(() => {
    setLastSaved(new Date());
  }, [data]);

  // Ensure electricityReadings exists in data
  useEffect(() => {
    if (!data.electricityReadings) {
      setData(prev => ({
        ...prev,
        electricityReadings: {}
      }));
    }
  }, [data, setData]);

  const currentBuilding = data.buildings.find(b => b.id === data.currentBuildingId) || data.buildings[0];
  const currentTenants = data.tenants[data.currentBuildingId] || [];
  const currentPayments = data.payments[data.currentBuildingId] || [];
  const currentExpenses = data.expenses[data.currentBuildingId] || [];
  const currentPettyCash = data.pettyCash[data.currentBuildingId] || [];
  const currentEmployees = data.employees; // Changed: now global employees array
  const currentIssues = data.issues[data.currentBuildingId] || [];
  const currentElectricityReadings = data.electricityReadings[data.currentBuildingId] || [];

  const handleBuildingChange = (buildingId: string) => {
    setData(prev => ({ ...prev, currentBuildingId: buildingId }));
  };

  const handleUpdateBuilding = (updatedBuilding: Building) => {
    setData(prev => ({
      ...prev,
      buildings: prev.buildings.map(b => 
        b.id === updatedBuilding.id ? updatedBuilding : b
      )
    }));
  };

  const handleAddTenant = (tenantData: Omit<Tenant, 'id'>) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      tenants: {
        ...prev.tenants,
        [prev.currentBuildingId]: [
          ...(prev.tenants[prev.currentBuildingId] || []),
          newTenant
        ]
      }
    }));
  };

  const handleUpdateTenant = (updatedTenant: Tenant) => {
    setData(prev => ({
      ...prev,
      tenants: {
        ...prev.tenants,
        [prev.currentBuildingId]: (prev.tenants[prev.currentBuildingId] || []).map(t =>
          t.id === updatedTenant.id ? updatedTenant : t
        )
      }
    }));
  };

  const handleDeleteTenant = (tenantId: string) => {
    setData(prev => ({
      ...prev,
      tenants: {
        ...prev.tenants,
        [prev.currentBuildingId]: (prev.tenants[prev.currentBuildingId] || []).filter(t => t.id !== tenantId)
      }
    }));
  };

  // Helper function to update tenant debtor status based on payments (only up to current month)
  const updateTenantDebtorStatus = (tenantId: string, payments: Payment[], tenants: Tenant[], currentYear: number, currentMonth: number) => {
    const tenantPayments = payments.filter(p => p.tenantId === tenantId && p.year === currentYear);
    
    // Check if tenant has any unpaid months up to the current month
    let hasUnpaidMonths = false;
    for (let month = 1; month <= currentMonth; month++) {
      const monthPayment = tenantPayments.find(p => p.month === month);
      if (!monthPayment || !monthPayment.paid) {
        hasUnpaidMonths = true;
        break;
      }
    }
    
    // Update tenant's debtor status
    return tenants.map(t => 
      t.id === tenantId ? { ...t, isDebtor: hasUnpaidMonths } : t
    );
  };

  // Helper function to generate consistent petty cash transaction ID
  const generatePettyCashId = (tenantId: string, year: number, month: number) => {
    return `pc-auto-${tenantId}-${year}-${month}`;
  };

  // Helper function to find and remove auto-generated petty cash transaction
  const removeAutoGeneratedPettyCashTransaction = (
    pettyCashTransactions: PettyCashTransaction[],
    tenantId: string,
    month: number,
    year: number
  ) => {
    const expectedId = generatePettyCashId(tenantId, year, month);
    
    // Remove the transaction with the specific ID
    return pettyCashTransactions.filter(transaction => transaction.id !== expectedId);
  };

  const handleUpdatePayment = (payment: Payment) => {
    setData(prev => {
      const currentPayments = prev.payments[prev.currentBuildingId] || [];
      const existingIndex = currentPayments.findIndex(
        p => p.tenantId === payment.tenantId && p.month === payment.month && p.year === payment.year
      );

      let updatedPayments;
      let updatedPettyCash = prev.pettyCash[prev.currentBuildingId] || [];

      if (existingIndex >= 0) {
        const existingPayment = currentPayments[existingIndex];
        updatedPayments = [...currentPayments];
        updatedPayments[existingIndex] = payment;

        // Handle petty cash adjustments based on payment status change
        if (existingPayment.paid !== payment.paid) {
          const transferAmount = prev.settings.pettyCashTransfer[prev.currentBuildingId] || 50;
          const tenant = (prev.tenants[prev.currentBuildingId] || []).find(t => t.id === payment.tenantId);
          
          if (payment.paid && !existingPayment.paid) {
            // Payment changed from unpaid to paid - add petty cash transaction
            if (tenant) {
              const newTransaction: PettyCashTransaction = {
                id: generatePettyCashId(payment.tenantId, payment.year, payment.month),
                date: payment.date || new Date().toISOString().split('T')[0],
                description: `תשלום מדייר - ${tenant.name} (דירה ${tenant.apartment})`,
                type: 'income',
                amount: transferAmount,
                entrance: tenant.entrance,
                isAutoGenerated: true
              };
              updatedPettyCash = [...updatedPettyCash, newTransaction];
            }
          } else if (!payment.paid && existingPayment.paid) {
            // Payment changed from paid to unpaid - remove corresponding petty cash transaction
            updatedPettyCash = removeAutoGeneratedPettyCashTransaction(
              updatedPettyCash,
              payment.tenantId,
              payment.month,
              payment.year
            );
          }
        }
      } else {
        // New payment
        updatedPayments = [...currentPayments, payment];

        // Add petty cash transaction if payment is marked as paid
        if (payment.paid) {
          const transferAmount = prev.settings.pettyCashTransfer[prev.currentBuildingId] || 50;
          const tenant = (prev.tenants[prev.currentBuildingId] || []).find(t => t.id === payment.tenantId);
          
          if (tenant) {
            const newTransaction: PettyCashTransaction = {
              id: generatePettyCashId(payment.tenantId, payment.year, payment.month),
              date: payment.date || new Date().toISOString().split('T')[0],
              description: `תשלום מדייר - ${tenant.name} (דירה ${tenant.apartment})`,
              type: 'income',
              amount: transferAmount,
              entrance: tenant.entrance,
              isAutoGenerated: true
            };
            updatedPettyCash = [...updatedPettyCash, newTransaction];
          }
        }
      }

      // Update tenant debtor status based on all their payments (only up to current month)
      const updatedTenants = updateTenantDebtorStatus(
        payment.tenantId, 
        updatedPayments, 
        prev.tenants[prev.currentBuildingId] || [],
        currentYear,
        currentMonth
      );

      return {
        ...prev,
        payments: {
          ...prev.payments,
          [prev.currentBuildingId]: updatedPayments
        },
        pettyCash: {
          ...prev.pettyCash,
          [prev.currentBuildingId]: updatedPettyCash
        },
        tenants: {
          ...prev.tenants,
          [prev.currentBuildingId]: updatedTenants
        }
      };
    });
  };

  const handleMarkAllPaid = () => {
    const transferAmount = data.settings.pettyCashTransfer[data.currentBuildingId] || 50;
    
    setData(prev => {
      const currentPayments = prev.payments[prev.currentBuildingId] || [];
      const currentPettyCash = prev.pettyCash[prev.currentBuildingId] || [];
      const allPayments: Payment[] = [...currentPayments];
      const newPettyCashTransactions: PettyCashTransaction[] = [];
      
      currentTenants.forEach(tenant => {
        // Only mark payments up to the current month
        for (let month = 1; month <= currentMonth; month++) {
          const existingPaymentIndex = allPayments.findIndex(
            p => p.tenantId === tenant.id && p.month === month && p.year === currentYear
          );
          
          if (existingPaymentIndex >= 0) {
            // Update existing payment if not already paid
            if (!allPayments[existingPaymentIndex].paid) {
              allPayments[existingPaymentIndex] = {
                ...allPayments[existingPaymentIndex],
                paid: true,
                date: new Date().toISOString().split('T')[0]
              };
              
              // Add petty cash transaction
              newPettyCashTransactions.push({
                id: generatePettyCashId(tenant.id, currentYear, month),
                date: new Date().toISOString().split('T')[0],
                description: `תשלום מדייר - ${tenant.name} (דירה ${tenant.apartment})`,
                type: 'income',
                amount: transferAmount,
                entrance: tenant.entrance,
                isAutoGenerated: true
              });
            }
          } else {
            // Create new payment
            allPayments.push({
              tenantId: tenant.id,
              month,
              year: currentYear,
              paid: true,
              date: new Date().toISOString().split('T')[0]
            });
            
            // Add petty cash transaction
            newPettyCashTransactions.push({
              id: generatePettyCashId(tenant.id, currentYear, month),
              date: new Date().toISOString().split('T')[0],
              description: `תשלום מדייר - ${tenant.name} (דירה ${tenant.apartment})`,
              type: 'income',
              amount: transferAmount,
              entrance: tenant.entrance,
              isAutoGenerated: true
            });
          }
        }
      });

      // Update all tenants' debtor status by calling updateTenantDebtorStatus for each tenant
      let updatedTenants = prev.tenants[prev.currentBuildingId] || [];
      currentTenants.forEach(tenant => {
        updatedTenants = updateTenantDebtorStatus(
          tenant.id,
          allPayments,
          updatedTenants,
          currentYear,
          currentMonth
        );
      });

      return {
        ...prev,
        payments: {
          ...prev.payments,
          [prev.currentBuildingId]: allPayments
        },
        pettyCash: {
          ...prev.pettyCash,
          [prev.currentBuildingId]: [...currentPettyCash, ...newPettyCashTransactions]
        },
        tenants: {
          ...prev.tenants,
          [prev.currentBuildingId]: updatedTenants
        }
      };
    });
  };

  // Electricity Reading handlers
  const handleAddElectricityReading = (readingData: Omit<ElectricityReading, 'id'>) => {
    const newReading: ElectricityReading = {
      ...readingData,
      id: `reading-${Date.now()}`
    };
    
    setData(prev => {
      let updatedData = {
        ...prev,
        electricityReadings: {
          ...prev.electricityReadings,
          [readingData.buildingId]: [
            ...(prev.electricityReadings[readingData.buildingId] || []),
            newReading
          ]
        }
      };

      // Auto-create expense if electricity cost is provided
      if (readingData.electricityCost && readingData.electricityCost > 0) {
        const newExpense: Expense = {
          id: `expense-${Date.now()}`,
          date: readingData.readingDate,
          description: `חשמל - כניסה ${readingData.entrance}`,
          category: 'חשמל',
          amount: readingData.electricityCost,
          entrance: readingData.entrance,
          notes: `נוצר אוטומטית מקריאת מונה - ${readingData.notes || ''}`.trim(),
          isAutoGenerated: true,
          sourceType: 'electricity',
          sourceId: newReading.id
        };

        updatedData = {
          ...updatedData,
          expenses: {
            ...updatedData.expenses,
            [readingData.buildingId]: [
              ...(updatedData.expenses[readingData.buildingId] || []),
              newExpense
            ]
          }
        };
      }

      return updatedData;
    });
  };

  const handleUpdateElectricityReading = (updatedReading: ElectricityReading) => {
    setData(prev => {
      let updatedData = {
        ...prev,
        electricityReadings: {
          ...prev.electricityReadings,
          [updatedReading.buildingId]: (prev.electricityReadings[updatedReading.buildingId] || []).map(r =>
            r.id === updatedReading.id ? updatedReading : r
          )
        }
      };

      // Update or create related expense
      const currentExpenses = prev.expenses[updatedReading.buildingId] || [];
      const relatedExpenseIndex = currentExpenses.findIndex(e => 
        e.sourceType === 'electricity' && e.sourceId === updatedReading.id
      );

      if (updatedReading.electricityCost && updatedReading.electricityCost > 0) {
        const expenseData = {
          id: relatedExpenseIndex >= 0 ? currentExpenses[relatedExpenseIndex].id : `expense-${Date.now()}`,
          date: updatedReading.readingDate,
          description: `חשמל - כניסה ${updatedReading.entrance}`,
          category: 'חשמל',
          amount: updatedReading.electricityCost,
          entrance: updatedReading.entrance,
          notes: `נוצר אוטומטית מקריאת מונה - ${updatedReading.notes || ''}`.trim(),
          isAutoGenerated: true,
          sourceType: 'electricity' as const,
          sourceId: updatedReading.id
        };

        let updatedExpenses;
        if (relatedExpenseIndex >= 0) {
          // Update existing expense
          updatedExpenses = [...currentExpenses];
          updatedExpenses[relatedExpenseIndex] = expenseData;
        } else {
          // Create new expense
          updatedExpenses = [...currentExpenses, expenseData];
        }

        updatedData = {
          ...updatedData,
          expenses: {
            ...updatedData.expenses,
            [updatedReading.buildingId]: updatedExpenses
          }
        };
      } else if (relatedExpenseIndex >= 0) {
        // Remove expense if cost was removed
        updatedData = {
          ...updatedData,
          expenses: {
            ...updatedData.expenses,
            [updatedReading.buildingId]: currentExpenses.filter(e => 
              !(e.sourceType === 'electricity' && e.sourceId === updatedReading.id)
            )
          }
        };
      }

      return updatedData;
    });
  };

  const handleDeleteElectricityReading = (readingId: string) => {
    // Find which building this reading belongs to
    let targetBuildingId = '';
    for (const [buildingId, readings] of Object.entries(data.electricityReadings)) {
      if (readings.some(r => r.id === readingId)) {
        targetBuildingId = buildingId;
        break;
      }
    }
    
    if (targetBuildingId) {
      setData(prev => ({
        ...prev,
        electricityReadings: {
          ...prev.electricityReadings,
          [targetBuildingId]: (prev.electricityReadings[targetBuildingId] || []).filter(r => r.id !== readingId)
        },
        expenses: {
          ...prev.expenses,
          [targetBuildingId]: (prev.expenses[targetBuildingId] || []).filter(e => 
            !(e.sourceType === 'electricity' && e.sourceId === readingId)
          )
        }
      }));
    }
  };

  // Expense handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [prev.currentBuildingId]: [
          ...(prev.expenses[prev.currentBuildingId] || []),
          newExpense
        ]
      }
    }));
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [prev.currentBuildingId]: (prev.expenses[prev.currentBuildingId] || []).map(e =>
          e.id === updatedExpense.id ? updatedExpense : e
        )
      }
    }));
  };

  const handleDeleteExpense = (expenseId: string) => {
    setData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [prev.currentBuildingId]: (prev.expenses[prev.currentBuildingId] || []).filter(e => e.id !== expenseId)
      }
    }));
  };

  // Petty Cash handlers
  const handleAddPettyCashTransaction = (transactionData: Omit<PettyCashTransaction, 'id'>) => {
    const newTransaction: PettyCashTransaction = {
      ...transactionData,
      id: `petty-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      pettyCash: {
        ...prev.pettyCash,
        [prev.currentBuildingId]: [
          ...(prev.pettyCash[prev.currentBuildingId] || []),
          newTransaction
        ]
      }
    }));
  };

  const handleUpdatePettyCashTransaction = (updatedTransaction: PettyCashTransaction) => {
    setData(prev => ({
      ...prev,
      pettyCash: {
        ...prev.pettyCash,
        [prev.currentBuildingId]: (prev.pettyCash[prev.currentBuildingId] || []).map(t =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      }
    }));
  };

  const handleDeletePettyCashTransaction = (transactionId: string) => {
    setData(prev => ({
      ...prev,
      pettyCash: {
        ...prev.pettyCash,
        [prev.currentBuildingId]: (prev.pettyCash[prev.currentBuildingId] || []).filter(t => t.id !== transactionId)
      }
    }));
  };

  // Employee handlers - Updated to work with global employees array
  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `employee-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      employees: [...prev.employees, newEmployee]
    }));
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setData(prev => ({
      ...prev,
      employees: prev.employees.map(e =>
        e.id === updatedEmployee.id ? updatedEmployee : e
      )
    }));
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setData(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== employeeId)
    }));
  };

  // Issue handlers
  const handleAddIssue = (issueData: Omit<Issue, 'id'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: `issue-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      issues: {
        ...prev.issues,
        [prev.currentBuildingId]: [
          ...(prev.issues[prev.currentBuildingId] || []),
          newIssue
        ]
      }
    }));
  };

  const handleUpdateIssue = (updatedIssue: Issue) => {
    setData(prev => {
      const currentIssue = (prev.issues[prev.currentBuildingId] || []).find(i => i.id === updatedIssue.id);
      let updatedExpenses = prev.expenses[prev.currentBuildingId] || [];
      
      // Check if status is changing FROM 'resolved' TO 'open' or 'in-progress'
      if (currentIssue?.status === 'resolved' && 
          (updatedIssue.status === 'open' || updatedIssue.status === 'in-progress')) {
        // Remove the auto-generated expense for this issue
        updatedExpenses = updatedExpenses.filter(e => 
          !(e.sourceType === 'issue' && e.sourceId === updatedIssue.id && e.isAutoGenerated)
        );
      }
      // Check if status is changing TO 'resolved' and has repair cost
      else if (updatedIssue.status === 'resolved' && 
               updatedIssue.repairCost && 
               currentIssue?.status !== 'resolved') {
        
        const newExpense: Expense = {
          id: `expense-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `תיקון תקלה: ${updatedIssue.description}`,
          category: 'תיקונים',
          amount: updatedIssue.repairCost,
          entrance: updatedIssue.entrance,
          notes: `נוצר אוטומטית מתקלה מספר ${updatedIssue.id}`,
          isAutoGenerated: true,
          sourceType: 'issue',
          sourceId: updatedIssue.id
        };
        
        updatedExpenses = [...updatedExpenses, newExpense];
      }

      return {
        ...prev,
        issues: {
          ...prev.issues,
          [prev.currentBuildingId]: (prev.issues[prev.currentBuildingId] || []).map(i =>
            i.id === updatedIssue.id ? updatedIssue : i
          )
        },
        expenses: {
          ...prev.expenses,
          [prev.currentBuildingId]: updatedExpenses
        }
      };
    });
  };

  const handleDeleteIssue = (issueId: string) => {
    setData(prev => {
      // Find the issue being deleted
      const issueToDelete = (prev.issues[prev.currentBuildingId] || []).find(i => i.id === issueId);
      
      // Remove the issue
      const updatedIssues = (prev.issues[prev.currentBuildingId] || []).filter(i => i.id !== issueId);
      
      // Remove any auto-generated expense related to this issue
      let updatedExpenses = prev.expenses[prev.currentBuildingId] || [];
      if (issueToDelete?.status === 'resolved' && issueToDelete?.repairCost) {
        updatedExpenses = updatedExpenses.filter(e => 
          !(e.sourceType === 'issue' && e.sourceId === issueId && e.isAutoGenerated)
        );
      }

      return {
        ...prev,
        issues: {
          ...prev.issues,
          [prev.currentBuildingId]: updatedIssues
        },
        expenses: {
          ...prev.expenses,
          [prev.currentBuildingId]: updatedExpenses
        }
      };
    });
  };

  // Inventory handlers
  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`
    };
    
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
      productHistory: [
        ...prev.productHistory,
        {
          id: `history-${Date.now()}`,
          productId: newProduct.id,
          date: new Date().toISOString().split('T')[0],
          action: 'create',
          quantity: newProduct.quantity,
          cost: newProduct.quantity * newProduct.pricePerUnit,
          notes: 'יצירת מוצר חדש'
        }
      ]
    }));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId),
      productUsages: prev.productUsages.filter(u => u.productId !== productId),
      productHistory: prev.productHistory.filter(h => h.productId !== productId)
    }));
  };

  const handleUseProduct = (usageData: Omit<ProductUsage, 'id'>) => {
    const newUsage: ProductUsage = {
      ...usageData,
      id: `usage-${Date.now()}`
    };
    
    setData(prev => {
      const product = prev.products.find(p => p.id === usageData.productId);
      
      // Auto-create expense for product usage
      let updatedExpenses = prev.expenses[prev.currentBuildingId] || [];
      if (product) {
        const newExpense: Expense = {
          id: `expense-${Date.now()}`,
          date: usageData.date,
          description: `שימוש במוצר: ${product.name}`,
          category: 'מלאי',
          amount: usageData.cost,
          notes: `נוצר אוטומטית משימוש במלאי - ${usageData.notes || ''}`,
          isAutoGenerated: true,
          sourceType: 'inventory',
          sourceId: newUsage.id
        };
        
        updatedExpenses = [...updatedExpenses, newExpense];
      }

      return {
        ...prev,
        products: prev.products.map(p =>
          p.id === usageData.productId
            ? { ...p, quantity: p.quantity - usageData.quantity }
            : p
        ),
        productUsages: [...prev.productUsages, newUsage],
        productHistory: [
          ...prev.productHistory,
          {
            id: `history-${Date.now()}`,
            productId: usageData.productId,
            date: usageData.date,
            action: 'use',
            quantity: -usageData.quantity,
            location: usageData.location,
            cost: usageData.cost,
            notes: usageData.notes
          }
        ],
        expenses: {
          ...prev.expenses,
          [prev.currentBuildingId]: updatedExpenses
        }
      };
    });
  };

  const handleAddStock = (productId: string, quantity: number, notes?: string) => {
    const product = data.products.find(p => p.id === productId);
    if (!product) return;

    setData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.id === productId
          ? { ...p, quantity: p.quantity + quantity }
          : p
      ),
      productHistory: [
        ...prev.productHistory,
        {
          id: `history-${Date.now()}`,
          productId,
          date: new Date().toISOString().split('T')[0],
          action: 'add',
          quantity,
          cost: quantity * product.pricePerUnit,
          notes
        }
      ]
    }));
  };

  const handleUpdateProductHistory = (updatedHistory: ProductHistory) => {
    setData(prev => {
      const oldHistory = prev.productHistory.find(h => h.id === updatedHistory.id);
      if (!oldHistory) return prev;

      const product = prev.products.find(p => p.id === updatedHistory.productId);
      if (!product) return prev;

      // Calculate quantity difference
      const quantityDiff = updatedHistory.quantity - oldHistory.quantity;
      
      // Update product quantity
      const updatedProducts = prev.products.map(p =>
        p.id === updatedHistory.productId
          ? { ...p, quantity: p.quantity - quantityDiff }
          : p
      );

      // Update product history
      const updatedProductHistory = prev.productHistory.map(h =>
        h.id === updatedHistory.id ? updatedHistory : h
      );

      // Update related expense if it exists
      let updatedExpenses = prev.expenses[prev.currentBuildingId] || [];
      const relatedExpense = updatedExpenses.find(e => 
        e.sourceType === 'inventory' && 
        e.sourceId && 
        prev.productUsages.find(u => u.id === e.sourceId)?.productId === updatedHistory.productId
      );

      if (relatedExpense) {
        updatedExpenses = updatedExpenses.map(e =>
          e.id === relatedExpense.id
            ? { ...e, amount: updatedHistory.cost, description: `שימוש במוצר: ${product.name}` }
            : e
        );
      }

      return {
        ...prev,
        products: updatedProducts,
        productHistory: updatedProductHistory,
        expenses: {
          ...prev.expenses,
          [prev.currentBuildingId]: updatedExpenses
        }
      };
    });
  };

  const handleDeleteProductHistory = (historyId: string) => {
    setData(prev => {
      const historyRecord = prev.productHistory.find(h => h.id === historyId);
      if (!historyRecord || historyRecord.action !== 'use') return prev;

      const product = prev.products.find(p => p.id === historyRecord.productId);
      if (!product) return prev;

      // Restore product quantity (add back the used quantity)
      const updatedProducts = prev.products.map(p =>
        p.id === historyRecord.productId
          ? { ...p, quantity: p.quantity + Math.abs(historyRecord.quantity) }
          : p
      );

      // Remove from product history
      const updatedProductHistory = prev.productHistory.filter(h => h.id !== historyId);

      // Remove related product usage
      const relatedUsage = prev.productUsages.find(u => 
        u.productId === historyRecord.productId &&
        u.date === historyRecord.date &&
        u.quantity === Math.abs(historyRecord.quantity)
      );

      let updatedProductUsages = prev.productUsages;
      if (relatedUsage) {
        updatedProductUsages = prev.productUsages.filter(u => u.id !== relatedUsage.id);
      }

      // Remove related expense
      let updatedExpenses = prev.expenses[prev.currentBuildingId] || [];
      if (relatedUsage) {
        updatedExpenses = updatedExpenses.filter(e => 
          !(e.sourceType === 'inventory' && e.sourceId === relatedUsage.id)
        );
      }

      return {
        ...prev,
        products: updatedProducts,
        productUsages: updatedProductUsages,
        productHistory: updatedProductHistory,
        expenses: {
          ...prev.expenses,
          [prev.currentBuildingId]: updatedExpenses
        }
      };
    });
  };

  const handleSync = () => {
    // Force save to localStorage
    localStorage.setItem('building-management-data', JSON.stringify(data));
    setLastSaved(new Date());
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} onUpdateBuilding={handleUpdateBuilding} />;
      case 'tenants':
        return (
          <Tenants
            tenants={currentTenants}
            building={currentBuilding}
            data={data}
            onAddTenant={handleAddTenant}
            onUpdateTenant={handleUpdateTenant}
            onDeleteTenant={handleDeleteTenant}
          />
        );
      case 'payments':
        return (
          <Payments
            tenants={currentTenants}
            payments={currentPayments}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onUpdatePayment={handleUpdatePayment}
            onMarkAllPaid={handleMarkAllPaid}
          />
        );
      case 'expenses':
        return (
          <Expenses
            expenses={currentExpenses}
            electricityReadings={currentElectricityReadings}
            buildings={data.buildings}
            currentBuildingId={data.currentBuildingId}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddElectricityReading={handleAddElectricityReading}
            onUpdateElectricityReading={handleUpdateElectricityReading}
            onDeleteElectricityReading={handleDeleteElectricityReading}
          />
        );
      case 'petty-cash':
        return (
          <PettyCash
            transactions={currentPettyCash}
            building={currentBuilding}
            onAddTransaction={handleAddPettyCashTransaction}
            onUpdateTransaction={handleUpdatePettyCashTransaction}
            onDeleteTransaction={handleDeletePettyCashTransaction}
          />
        );
      case 'employees':
        return (
          <Employees
            employees={currentEmployees}
            accountantEmail={data.settings.accountantEmail}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onUpdateSettings={setData}
            data={data}
          />
        );
      case 'issues':
        return (
          <Issues
            issues={currentIssues}
            building={currentBuilding}
            onAddIssue={handleAddIssue}
            onUpdateIssue={handleUpdateIssue}
            onDeleteIssue={handleDeleteIssue}
          />
        );
      case 'inventory':
        return (
          <Inventory
            products={data.products}
            productUsages={data.productUsages}
            productHistory={data.productHistory}
            currentLocation={currentBuilding.name}
            building={currentBuilding}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUseProduct={handleUseProduct}
            onAddStock={handleAddStock}
            onUpdateProductHistory={handleUpdateProductHistory}
            onDeleteProductHistory={handleDeleteProductHistory}
          />
        );
      case 'settings':
        return (
          <Settings
            data={data}
            onUpdateSettings={setData}
          />
        );
      default:
        return <div className="p-8 text-center text-gray-500">תכונה זו תהיה זמינה בקרוב</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        currentBuilding={currentBuilding}
        buildings={data.buildings}
        onBuildingChange={handleBuildingChange}
        appTitle={data.settings.appTitle}
        onSync={handleSync}
        isLoading={false}
        error={null}
      />
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabOrder={data.settings.tabOrder}
      />
      <main>
        {renderContent()}
      </main>
      
      {/* Save indicator */}
      {lastSaved && (
        <div className="fixed bottom-4 left-4 bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded-lg text-sm">
          נשמר: {lastSaved.toLocaleTimeString('he-IL')}
        </div>
      )}
    </div>
  );
}

export default App;