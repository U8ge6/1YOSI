export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: string;
          name: string;
          entrances: string[];
          elevator_company?: string;
          elevator_phone?: string;
          electricity_details?: any;
          entrance_codes?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          entrances: string[];
          elevator_company?: string;
          elevator_phone?: string;
          electricity_details?: any;
          entrance_codes?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          entrances?: string[];
          elevator_company?: string;
          elevator_phone?: string;
          electricity_details?: any;
          entrance_codes?: any;
          updated_at?: string;
        };
      };
      tenants: {
        Row: {
          id: string;
          building_id: string;
          apartment: string;
          floor: number;
          name: string;
          ownership_status: 'owner' | 'renter';
          owner_name?: string;
          owner_phone?: string;
          entrance: string;
          primary_phone: string;
          secondary_phone?: string;
          monthly_amount: number;
          payment_method: 'cash' | 'credit';
          credit_day?: number;
          custom_amount?: number;
          is_debtor: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          apartment: string;
          floor: number;
          name: string;
          ownership_status: 'owner' | 'renter';
          owner_name?: string;
          owner_phone?: string;
          entrance: string;
          primary_phone: string;
          secondary_phone?: string;
          monthly_amount: number;
          payment_method: 'cash' | 'credit';
          credit_day?: number;
          custom_amount?: number;
          is_debtor?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          apartment?: string;
          floor?: number;
          name?: string;
          ownership_status?: 'owner' | 'renter';
          owner_name?: string;
          owner_phone?: string;
          entrance?: string;
          primary_phone?: string;
          secondary_phone?: string;
          monthly_amount?: number;
          payment_method?: 'cash' | 'credit';
          credit_day?: number;
          custom_amount?: number;
          is_debtor?: boolean;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          tenant_id: string;
          month: number;
          year: number;
          paid: boolean;
          date?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          month: number;
          year: number;
          paid?: boolean;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          month?: number;
          year?: number;
          paid?: boolean;
          date?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          building_id: string;
          date: string;
          description: string;
          category: string;
          amount: number;
          notes?: string;
          is_auto_generated?: boolean;
          source_type?: string;
          source_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          date: string;
          description: string;
          category: string;
          amount: number;
          notes?: string;
          is_auto_generated?: boolean;
          source_type?: string;
          source_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          date?: string;
          description?: string;
          category?: string;
          amount?: number;
          notes?: string;
          is_auto_generated?: boolean;
          source_type?: string;
          source_id?: string;
          updated_at?: string;
        };
      };
      petty_cash: {
        Row: {
          id: string;
          building_id: string;
          date: string;
          description: string;
          type: 'income' | 'expense';
          amount: number;
          is_auto_generated?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          date: string;
          description: string;
          type: 'income' | 'expense';
          amount: number;
          is_auto_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          date?: string;
          description?: string;
          type?: 'income' | 'expense';
          amount?: number;
          is_auto_generated?: boolean;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          building_id: string;
          name: string;
          phone: string;
          start_date: string;
          base_salary: number;
          work_days_per_month: number;
          absences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          name: string;
          phone: string;
          start_date: string;
          base_salary: number;
          work_days_per_month: number;
          absences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          name?: string;
          phone?: string;
          start_date?: string;
          base_salary?: number;
          work_days_per_month?: number;
          absences?: any;
          updated_at?: string;
        };
      };
      issues: {
        Row: {
          id: string;
          building_id: string;
          date: string;
          reporter_name: string;
          description: string;
          repair_cost?: number;
          status: 'open' | 'in-progress' | 'resolved';
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          date: string;
          reporter_name: string;
          description: string;
          repair_cost?: number;
          status?: 'open' | 'in-progress' | 'resolved';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          date?: string;
          reporter_name?: string;
          description?: string;
          repair_cost?: number;
          status?: 'open' | 'in-progress' | 'resolved';
          notes?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          quantity: number;
          price_per_unit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          quantity: number;
          price_per_unit: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          quantity?: number;
          price_per_unit?: number;
          updated_at?: string;
        };
      };
      product_usages: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          location: string;
          date: string;
          notes?: string;
          cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity: number;
          location: string;
          date: string;
          notes?: string;
          cost: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          location?: string;
          date?: string;
          notes?: string;
          cost?: number;
          updated_at?: string;
        };
      };
      product_history: {
        Row: {
          id: string;
          product_id: string;
          date: string;
          action: 'add' | 'use' | 'create';
          quantity: number;
          location?: string;
          cost: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          date: string;
          action: 'add' | 'use' | 'create';
          quantity: number;
          location?: string;
          cost: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          date?: string;
          action?: 'add' | 'use' | 'create';
          quantity?: number;
          location?: string;
          cost?: number;
          notes?: string;
          updated_at?: string;
        };
      };
      app_settings: {
        Row: {
          id: string;
          app_title: string;
          tab_order: string[];
          monthly_amounts: any;
          petty_cash_transfers: any;
          whatsapp_template: string;
          accountant_email?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          app_title: string;
          tab_order: string[];
          monthly_amounts: any;
          petty_cash_transfers: any;
          whatsapp_template: string;
          accountant_email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          app_title?: string;
          tab_order?: string[];
          monthly_amounts?: any;
          petty_cash_transfers?: any;
          whatsapp_template?: string;
          accountant_email?: string;
          updated_at?: string;
        };
      };
      electricity_readings: {
        Row: {
          id: string;
          building_id: string;
          entrance: string;
          reading_date: string;
          meter_reading: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          building_id: string;
          entrance: string;
          reading_date: string;
          meter_reading: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          building_id?: string;
          entrance?: string;
          reading_date?: string;
          meter_reading?: number;
          notes?: string;
          updated_at?: string;
        };
      };
    };
  };
}