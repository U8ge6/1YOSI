import { AppState } from '../types';

export const mockData: AppState = {
  currentBuildingId: 'building-1',
  buildings: [
    {
      id: 'building-1',
      name: 'רחוב הרצל 15',
      entrances: ['א', 'ב', 'ג'],
      elevatorCompany: 'מעליות כרמל',
      elevatorPhone: '03-1234567',
      electricityDetails: [
        { entrance: 'א', contractNumber: '123456789', meterNumber: '987654321' },
        { entrance: 'ב', contractNumber: '123456790', meterNumber: '987654322' },
        { entrance: 'ג', contractNumber: '123456791', meterNumber: '987654323' }
      ],
      entranceCodes: [
        { entrance: 'א', code: '1234' },
        { entrance: 'ב', code: '5678' },
        { entrance: 'ג', code: '9012' }
      ]
    },
    {
      id: 'building-2',
      name: 'רחוב בן גוריון 22',
      entrances: ['א', 'ב'],
      elevatorCompany: 'מעליות דן',
      elevatorPhone: '03-7654321'
    }
  ],
  tenants: {
    'building-1': [
      {
        id: 'tenant-1',
        apartment: '1',
        floor: 1,
        name: 'דוד כהן',
        ownershipStatus: 'owner',
        entrance: 'א',
        primaryPhone: '052-1234567',
        monthlyAmount: 450,
        paymentMethod: 'credit',
        creditDay: 5,
        isDebtor: false
      },
      {
        id: 'tenant-2',
        apartment: '2',
        floor: 1,
        name: 'רחל לוי',
        ownershipStatus: 'renter',
        ownerName: 'משה לוי',
        ownerPhone: '054-9876543',
        entrance: 'א',
        primaryPhone: '053-2345678',
        monthlyAmount: 450,
        paymentMethod: 'cash',
        isDebtor: true
      },
      {
        id: 'tenant-3',
        apartment: '3',
        floor: 2,
        name: 'יוסף אברהם',
        ownershipStatus: 'owner',
        entrance: 'ב',
        primaryPhone: '050-3456789',
        monthlyAmount: 450,
        paymentMethod: 'credit',
        creditDay: 15,
        isDebtor: false
      }
    ]
  },
  payments: {
    'building-1': [
      { tenantId: 'tenant-1', month: 1, year: 2024, paid: true, date: '2024-01-05' },
      { tenantId: 'tenant-1', month: 2, year: 2024, paid: true, date: '2024-02-05' },
      { tenantId: 'tenant-1', month: 3, year: 2024, paid: true, date: '2024-03-05' },
      { tenantId: 'tenant-2', month: 1, year: 2024, paid: true, date: '2024-01-10' },
      { tenantId: 'tenant-2', month: 2, year: 2024, paid: false },
      { tenantId: 'tenant-2', month: 3, year: 2024, paid: false },
      { tenantId: 'tenant-3', month: 1, year: 2024, paid: true, date: '2024-01-15' },
      { tenantId: 'tenant-3', month: 2, year: 2024, paid: true, date: '2024-02-15' },
      { tenantId: 'tenant-3', month: 3, year: 2024, paid: true, date: '2024-03-15' }
    ]
  },
  expenses: {
    'building-1': [
      {
        id: 'expense-1',
        date: '2024-01-15',
        description: 'ניקיון חודשי',
        category: 'ניקיון',
        amount: 800,
        notes: 'שירות ניקיון קבוע'
      },
      {
        id: 'expense-2',
        date: '2024-02-20',
        description: 'תיקון מעלית',
        category: 'תיקונים',
        amount: 1200,
        notes: 'החלפת חלק במנוע',
        isAutoGenerated: true,
        sourceType: 'issue',
        sourceId: 'issue-1'
      },
      {
        id: 'expense-3',
        date: '2024-03-10',
        description: 'גינון',
        category: 'גינון',
        amount: 600,
        notes: 'טיפוח הגינה הקדמית'
      },
      {
        id: 'expense-4',
        date: '2024-03-01',
        description: 'חשמל - כניסה א',
        category: 'חשמל',
        amount: 450,
        entrance: 'א',
        notes: 'נוצר אוטומטית מקריאת מונה',
        isAutoGenerated: true,
        sourceType: 'electricity',
        sourceId: 'reading-1'
      }
    ]
  },
  pettyCash: {
    'building-1': [
      {
        id: 'petty-1',
        date: '2024-01-05',
        description: 'תשלום מדייר - דירה 1',
        type: 'income',
        amount: 50,
        entrance: 'א',
        isAutoGenerated: true
      },
      {
        id: 'petty-2',
        date: '2024-01-20',
        description: 'קניית נורות LED',
        type: 'expense',
        amount: 80
      },
      {
        id: 'petty-3',
        date: '2024-02-15',
        description: 'חומרי ניקוי',
        type: 'expense',
        amount: 45
      }
    ]
  },
  employees: [
    {
      id: 'employee-1',
      name: 'אחמד עלי',
      phone: '052-9876543',
      startDate: '2023-06-01',
      baseSalary: 3500,
      workDaysPerMonth: 21.67,
      absences: [
        { id: 'abs-1', date: '2024-03-15', reason: 'חופש' },
        { id: 'abs-2', date: '2024-03-20', reason: 'מחלה' }
      ]
    },
    {
      id: 'employee-2',
      name: 'מוחמד חסן',
      phone: '053-1234567',
      startDate: '2024-01-15',
      baseSalary: 4000,
      workDaysPerMonth: 22,
      absences: []
    }
  ],
  issues: {
    'building-1': [
      {
        id: 'issue-1',
        date: '2024-02-18',
        reporterName: 'דוד כהן',
        description: 'המעלית תקועה בקומה 3',
        repairCost: 1200,
        status: 'resolved',
        notes: 'הוחלף חלק במנוע'
      },
      {
        id: 'issue-2',
        date: '2024-03-22',
        reporterName: 'רחל לוי',
        description: 'נזילה בצנרת במרתף',
        status: 'in-progress',
        entrance: 'א',
        notes: 'הוזמן שרברב'
      }
    ]
  },
  products: [
    {
      id: 'product-1',
      name: 'נורות LED',
      quantity: 25,
      pricePerUnit: 15
    },
    {
      id: 'product-2',
      name: 'חומר ניקוי כללי',
      quantity: 8,
      pricePerUnit: 25
    },
    {
      id: 'product-3',
      name: 'מברשות',
      quantity: 3,
      pricePerUnit: 12
    },
    {
      id: 'product-4',
      name: 'שקיות אשפה',
      quantity: 0,
      pricePerUnit: 35
    }
  ],
  productUsages: [
    {
      id: 'usage-1',
      productId: 'product-1',
      quantity: 3,
      location: 'רחוב הרצל 15',
      date: '2024-03-15',
      notes: 'החלפת נורות בחדר מדרגות',
      cost: 45
    },
    {
      id: 'usage-2',
      productId: 'product-2',
      quantity: 2,
      location: 'רחוב הרצל 15',
      date: '2024-03-10',
      notes: 'ניקיון חודשי',
      cost: 50
    }
  ],
  productHistory: [
    {
      id: 'history-1',
      productId: 'product-1',
      date: '2024-01-01',
      action: 'create',
      quantity: 30,
      cost: 450,
      notes: 'יצירת מוצר חדש'
    },
    {
      id: 'history-2',
      productId: 'product-1',
      date: '2024-02-15',
      action: 'add',
      quantity: 10,
      cost: 150,
      notes: 'הוספת מלאי'
    },
    {
      id: 'history-3',
      productId: 'product-1',
      date: '2024-03-15',
      action: 'use',
      quantity: -3,
      location: 'רחוב הרצל 15',
      cost: 45,
      notes: 'החלפת נורות בחדר מדרגות'
    }
  ],
  electricityReadings: {
    'building-1': [
      {
        id: 'reading-1',
        buildingId: 'building-1',
        entrance: 'א',
        readingDate: '2024-01-01',
        meterReading: 12500,
        notes: 'קריאה ראשונה של השנה'
      },
      {
        id: 'reading-2',
        buildingId: 'building-1',
        entrance: 'א',
        readingDate: '2024-02-01',
        meterReading: 12750,
        notes: 'קריאה חודשית'
      },
      {
        id: 'reading-3',
        buildingId: 'building-1',
        entrance: 'א',
        readingDate: '2024-03-01',
        meterReading: 13000,
        electricityCost: 450,
        notes: 'קריאה חודשית עם חשבון'
      },
      {
        id: 'reading-4',
        buildingId: 'building-1',
        entrance: 'ב',
        readingDate: '2024-01-01',
        meterReading: 8900,
        notes: 'קריאה ראשונה של השנה'
      }
    ],
    'building-2': []
  },
  settings: {
    appTitle: 'ניהול בניין משותף',
    tabOrder: ['dashboard', 'tenants', 'payments', 'expenses', 'petty-cash', 'employees', 'issues', 'inventory', 'settings'],
    monthlyAmount: {
      'building-1': 450,
      'building-2': 380
    },
    pettyCashTransfer: {
      'building-1': 50,
      'building-2': 40
    },
    whatsappTemplate: 'שלום {שם}, אנא שלם את דמי הבית עבור {חודשים}. סה"כ לתשלום: {סכום_כולל}₪. תודה!'
  }
};