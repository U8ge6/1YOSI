import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AppState } from '../types';

export function useSupabase() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase
  const loadData = async (): Promise<AppState | null> => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        buildingsResult,
        tenantsResult,
        paymentsResult,
        expensesResult,
        pettyCashResult,
        employeesResult,
        issuesResult,
        productsResult,
        productUsagesResult,
        productHistoryResult,
        electricityReadingsResult,
        settingsResult
      ] = await Promise.all([
        supabase.from('buildings').select('*'),
        supabase.from('tenants').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('petty_cash').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('issues').select('*'),
        supabase.from('products').select('*'),
        supabase.from('product_usages').select('*'),
        supabase.from('product_history').select('*'),
        supabase.from('electricity_readings').select('*'),
        supabase.from('app_settings').select('*').limit(1).single()
      ]);

      // Check for errors
      if (buildingsResult.error) throw buildingsResult.error;
      if (tenantsResult.error) throw tenantsResult.error;
      if (paymentsResult.error) throw paymentsResult.error;
      if (expensesResult.error) throw expensesResult.error;
      if (pettyCashResult.error) throw pettyCashResult.error;
      if (employeesResult.error) throw employeesResult.error;
      if (issuesResult.error) throw issuesResult.error;
      if (productsResult.error) throw productsResult.error;
      if (productUsagesResult.error) throw productUsagesResult.error;
      if (productHistoryResult.error) throw productHistoryResult.error;
      if (electricityReadingsResult.error) throw electricityReadingsResult.error;

      // Transform data to match AppState structure
      const buildings = buildingsResult.data || [];
      const tenants = tenantsResult.data || [];
      const payments = paymentsResult.data || [];
      const expenses = expensesResult.data || [];
      const pettyCash = pettyCashResult.data || [];
      const employees = employeesResult.data || [];
      const issues = issuesResult.data || [];
      const electricityReadings = electricityReadingsResult.data || [];

      // Group data by building
      const tenantsGrouped: { [key: string]: any[] } = {};
      const paymentsGrouped: { [key: string]: any[] } = {};
      const expensesGrouped: { [key: string]: any[] } = {};
      const pettyCashGrouped: { [key: string]: any[] } = {};
      const issuesGrouped: { [key: string]: any[] } = {};
      const electricityReadingsGrouped: { [key: string]: any[] } = {};

      buildings.forEach(building => {
        tenantsGrouped[building.id] = tenants
          .filter(t => t.building_id === building.id)
          .map(transformTenant);
        
        expensesGrouped[building.id] = expenses
          .filter(e => e.building_id === building.id)
          .map(transformExpense);
        
        pettyCashGrouped[building.id] = pettyCash
          .filter(p => p.building_id === building.id)
          .map(transformPettyCash);
        
        issuesGrouped[building.id] = issues
          .filter(i => i.building_id === building.id)
          .map(transformIssue);

        electricityReadingsGrouped[building.id] = electricityReadings
          .filter(r => r.building_id === building.id)
          .map(transformElectricityReading);
      });

      // Group payments by building (through tenant relationship)
      tenants.forEach(tenant => {
        const buildingPayments = payments
          .filter(p => p.tenant_id === tenant.id)
          .map(transformPayment);
        
        if (!paymentsGrouped[tenant.building_id]) {
          paymentsGrouped[tenant.building_id] = [];
        }
        paymentsGrouped[tenant.building_id].push(...buildingPayments);
      });

      const appState: AppState = {
        currentBuildingId: buildings[0]?.id || '',
        buildings: buildings.map(transformBuilding),
        tenants: tenantsGrouped,
        payments: paymentsGrouped,
        expenses: expensesGrouped,
        pettyCash: pettyCashGrouped,
        employees: employees.map(transformEmployee), // Changed: employees is now a global array
        issues: issuesGrouped,
        products: (productsResult.data || []).map(transformProduct),
        productUsages: (productUsagesResult.data || []).map(transformProductUsage),
        productHistory: (productHistoryResult.data || []).map(transformProductHistory),
        electricityReadings: electricityReadingsGrouped,
        settings: settingsResult.data ? transformSettings(settingsResult.data) : getDefaultSettings()
      };

      return appState;
    } catch (err) {
      console.error('Error loading data from Supabase:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save data to Supabase
  const saveData = async (data: AppState) => {
    try {
      setError(null);
      
      // Save buildings
      for (const building of data.buildings) {
        await supabase
          .from('buildings')
          .upsert(transformBuildingForDB(building));
      }

      // Save tenants
      for (const [buildingId, tenants] of Object.entries(data.tenants)) {
        for (const tenant of tenants) {
          await supabase
            .from('tenants')
            .upsert(transformTenantForDB(tenant, buildingId));
        }
      }

      // Save payments
      for (const [buildingId, payments] of Object.entries(data.payments)) {
        for (const payment of payments) {
          await supabase
            .from('payments')
            .upsert(transformPaymentForDB(payment));
        }
      }

      // Save expenses
      for (const [buildingId, expenses] of Object.entries(data.expenses)) {
        for (const expense of expenses) {
          await supabase
            .from('expenses')
            .upsert(transformExpenseForDB(expense, buildingId));
        }
      }

      // Save petty cash
      for (const [buildingId, transactions] of Object.entries(data.pettyCash)) {
        for (const transaction of transactions) {
          await supabase
            .from('petty_cash')
            .upsert(transformPettyCashForDB(transaction, buildingId));
        }
      }

      // Save employees - Updated to work with global employees array
      for (const employee of data.employees) {
        await supabase
          .from('employees')
          .upsert(transformEmployeeForDB(employee, data.currentBuildingId)); // Use current building as placeholder
      }

      // Save issues
      for (const [buildingId, issues] of Object.entries(data.issues)) {
        for (const issue of issues) {
          await supabase
            .from('issues')
            .upsert(transformIssueForDB(issue, buildingId));
        }
      }

      // Save products
      for (const product of data.products) {
        await supabase
          .from('products')
          .upsert(transformProductForDB(product));
      }

      // Save product usages
      for (const usage of data.productUsages) {
        await supabase
          .from('product_usages')
          .upsert(transformProductUsageForDB(usage));
      }

      // Save product history
      for (const history of data.productHistory) {
        await supabase
          .from('product_history')
          .upsert(transformProductHistoryForDB(history));
      }

      // Save electricity readings
      for (const [buildingId, readings] of Object.entries(data.electricityReadings)) {
        for (const reading of readings) {
          await supabase
            .from('electricity_readings')
            .upsert(transformElectricityReadingForDB(reading, buildingId));
        }
      }

      // Save settings
      await supabase
        .from('app_settings')
        .upsert(transformSettingsForDB(data.settings));

    } catch (err) {
      console.error('Error saving data to Supabase:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { loadData, saveData, loading, error };
}

// Transform functions
function transformBuilding(building: any) {
  return {
    id: building.id,
    name: building.name,
    entrances: building.entrances || [],
    elevatorCompany: building.elevator_company,
    elevatorPhone: building.elevator_phone,
    electricityDetails: building.electricity_details,
    entranceCodes: building.entrance_codes
  };
}

function transformTenant(tenant: any) {
  return {
    id: tenant.id,
    apartment: tenant.apartment,
    floor: tenant.floor,
    name: tenant.name,
    ownershipStatus: tenant.ownership_status,
    ownerName: tenant.owner_name,
    ownerPhone: tenant.owner_phone,
    entrance: tenant.entrance,
    primaryPhone: tenant.primary_phone,
    secondaryPhone: tenant.secondary_phone,
    monthlyAmount: tenant.monthly_amount,
    paymentMethod: tenant.payment_method,
    creditDay: tenant.credit_day,
    customAmount: tenant.custom_amount,
    isDebtor: tenant.is_debtor
  };
}

function transformPayment(payment: any) {
  return {
    tenantId: payment.tenant_id,
    month: payment.month,
    year: payment.year,
    paid: payment.paid,
    date: payment.date
  };
}

function transformExpense(expense: any) {
  return {
    id: expense.id,
    date: expense.date,
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    notes: expense.notes,
    isAutoGenerated: expense.is_auto_generated,
    sourceType: expense.source_type,
    sourceId: expense.source_id
  };
}

function transformPettyCash(transaction: any) {
  return {
    id: transaction.id,
    date: transaction.date,
    description: transaction.description,
    type: transaction.type,
    amount: transaction.amount,
    isAutoGenerated: transaction.is_auto_generated
  };
}

function transformEmployee(employee: any) {
  return {
    id: employee.id,
    name: employee.name,
    phone: employee.phone,
    startDate: employee.start_date,
    baseSalary: employee.base_salary,
    workDaysPerMonth: employee.work_days_per_month,
    absences: employee.absences || []
  };
}

function transformIssue(issue: any) {
  return {
    id: issue.id,
    date: issue.date,
    reporterName: issue.reporter_name,
    description: issue.description,
    repairCost: issue.repair_cost,
    status: issue.status,
    notes: issue.notes
  };
}

function transformProduct(product: any) {
  return {
    id: product.id,
    name: product.name,
    quantity: product.quantity,
    pricePerUnit: product.price_per_unit
  };
}

function transformProductUsage(usage: any) {
  return {
    id: usage.id,
    productId: usage.product_id,
    quantity: usage.quantity,
    location: usage.location,
    date: usage.date,
    notes: usage.notes,
    cost: usage.cost
  };
}

function transformProductHistory(history: any) {
  return {
    id: history.id,
    productId: history.product_id,
    date: history.date,
    action: history.action,
    quantity: history.quantity,
    location: history.location,
    cost: history.cost,
    notes: history.notes
  };
}

function transformElectricityReading(reading: any) {
  return {
    id: reading.id,
    buildingId: reading.building_id,
    entrance: reading.entrance,
    readingDate: reading.reading_date,
    meterReading: reading.meter_reading,
    notes: reading.notes
  };
}

function transformSettings(settings: any) {
  return {
    appTitle: settings.app_title,
    tabOrder: settings.tab_order || [],
    monthlyAmount: settings.monthly_amounts || {},
    pettyCashTransfer: settings.petty_cash_transfers || {},
    whatsappTemplate: settings.whatsapp_template,
    accountantEmail: settings.accountant_email
  };
}

// Transform for DB functions
function transformBuildingForDB(building: any) {
  return {
    id: building.id,
    name: building.name,
    entrances: building.entrances,
    elevator_company: building.elevatorCompany,
    elevator_phone: building.elevatorPhone,
    electricity_details: building.electricityDetails,
    entrance_codes: building.entranceCodes
  };
}

function transformTenantForDB(tenant: any, buildingId: string) {
  return {
    id: tenant.id,
    building_id: buildingId,
    apartment: tenant.apartment,
    floor: tenant.floor,
    name: tenant.name,
    ownership_status: tenant.ownershipStatus,
    owner_name: tenant.ownerName,
    owner_phone: tenant.ownerPhone,
    entrance: tenant.entrance,
    primary_phone: tenant.primaryPhone,
    secondary_phone: tenant.secondaryPhone,
    monthly_amount: tenant.monthlyAmount,
    payment_method: tenant.paymentMethod,
    credit_day: tenant.creditDay,
    custom_amount: tenant.customAmount,
    is_debtor: tenant.isDebtor
  };
}

function transformPaymentForDB(payment: any) {
  return {
    tenant_id: payment.tenantId,
    month: payment.month,
    year: payment.year,
    paid: payment.paid,
    date: payment.date
  };
}

function transformExpenseForDB(expense: any, buildingId: string) {
  return {
    id: expense.id,
    building_id: buildingId,
    date: expense.date,
    description: expense.description,
    category: expense.category,
    amount: expense.amount,
    notes: expense.notes,
    is_auto_generated: expense.isAutoGenerated,
    source_type: expense.sourceType,
    source_id: expense.sourceId
  };
}

function transformPettyCashForDB(transaction: any, buildingId: string) {
  return {
    id: transaction.id,
    building_id: buildingId,
    date: transaction.date,
    description: transaction.description,
    type: transaction.type,
    amount: transaction.amount,
    is_auto_generated: transaction.isAutoGenerated
  };
}

function transformEmployeeForDB(employee: any, buildingId: string) {
  return {
    id: employee.id,
    building_id: buildingId, // Use provided buildingId as placeholder
    name: employee.name,
    phone: employee.phone,
    start_date: employee.startDate,
    base_salary: employee.baseSalary,
    work_days_per_month: employee.workDaysPerMonth,
    absences: employee.absences
  };
}

function transformIssueForDB(issue: any, buildingId: string) {
  return {
    id: issue.id,
    building_id: buildingId,
    date: issue.date,
    reporter_name: issue.reporterName,
    description: issue.description,
    repair_cost: issue.repairCost,
    status: issue.status,
    notes: issue.notes
  };
}

function transformProductForDB(product: any) {
  return {
    id: product.id,
    name: product.name,
    quantity: product.quantity,
    price_per_unit: product.pricePerUnit
  };
}

function transformProductUsageForDB(usage: any) {
  return {
    id: usage.id,
    product_id: usage.productId,
    quantity: usage.quantity,
    location: usage.location,
    date: usage.date,
    notes: usage.notes,
    cost: usage.cost
  };
}

function transformProductHistoryForDB(history: any) {
  return {
    id: history.id,
    product_id: history.productId,
    date: history.date,
    action: history.action,
    quantity: history.quantity,
    location: history.location,
    cost: history.cost,
    notes: history.notes
  };
}

function transformElectricityReadingForDB(reading: any, buildingId: string) {
  return {
    id: reading.id,
    building_id: buildingId,
    entrance: reading.entrance,
    reading_date: reading.readingDate,
    meter_reading: reading.meterReading,
    notes: reading.notes
  };
}

function transformSettingsForDB(settings: any) {
  return {
    id: 'default',
    app_title: settings.appTitle,
    tab_order: settings.tabOrder,
    monthly_amounts: settings.monthlyAmount,
    petty_cash_transfers: settings.pettyCashTransfer,
    whatsapp_template: settings.whatsappTemplate,
    accountant_email: settings.accountantEmail
  };
}

function getDefaultSettings() {
  return {
    appTitle: 'ניהול בניין משותף',
    tabOrder: ['dashboard', 'tenants', 'payments', 'expenses', 'petty-cash', 'employees', 'issues', 'inventory', 'settings'],
    monthlyAmount: {},
    pettyCashTransfer: {},
    whatsappTemplate: 'שלום {שם}, אנא שלם את דמי הבית עבור {חודשים}. סה"כ לתשלום: {סכום_כולל}₪. תודה!',
    accountantEmail: undefined
  };
}