import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  expiryDate?: string;
  batchNumber?: string;
  supplier: string;
  costPerUnit: number;
  lastRestocked: string;
}

interface StockAlert {
  id: string;
  itemId: string;
  type: 'low_stock' | 'expired' | 'expiring_soon';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

interface InventoryState {
  items: InventoryItem[];
  alerts: StockAlert[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [
    {
      id: 'MED001',
      name: 'Paracetamol 500mg',
      category: 'Pain Relief',
      currentStock: 5,
      minStock: 20,
      maxStock: 200,
      unit: 'tablets',
      expiryDate: '2024-12-31',
      batchNumber: 'PAR2024001',
      supplier: 'PharmaCorp',
      costPerUnit: 0.15,
      lastRestocked: '2024-01-01'
    },
    {
      id: 'MED002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      currentStock: 15,
      minStock: 25,
      maxStock: 150,
      unit: 'capsules',
      expiryDate: '2024-06-30',
      batchNumber: 'AMX2024002',
      supplier: 'MediSupply',
      costPerUnit: 0.45,
      lastRestocked: '2024-01-05'
    },
    {
      id: 'MED003',
      name: 'Insulin Glargine',
      category: 'Diabetes',
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      unit: 'vials',
      expiryDate: '2024-03-15',
      batchNumber: 'INS2024003',
      supplier: 'DiabetesCare',
      costPerUnit: 25.00,
      lastRestocked: '2024-01-10'
    },
    {
      id: 'MED004',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      currentStock: 150,
      minStock: 30,
      maxStock: 300,
      unit: 'tablets',
      expiryDate: '2025-08-20',
      batchNumber: 'IBU2024004',
      supplier: 'PharmaCorp',
      costPerUnit: 0.20,
      lastRestocked: '2024-01-12'
    },
    {
      id: 'MED005',
      name: 'Atorvastatin 20mg',
      category: 'Cardiovascular',
      currentStock: 80,
      minStock: 40,
      maxStock: 200,
      unit: 'tablets',
      expiryDate: '2025-11-30',
      batchNumber: 'ATO2024005',
      supplier: 'CardioMed',
      costPerUnit: 0.75,
      lastRestocked: '2024-01-08'
    },
    {
      id: 'MED006',
      name: 'Metformin 500mg',
      category: 'Diabetes',
      currentStock: 120,
      minStock: 50,
      maxStock: 250,
      unit: 'tablets',
      expiryDate: '2025-05-15',
      batchNumber: 'MET2024006',
      supplier: 'DiabetesCare',
      costPerUnit: 0.30,
      lastRestocked: '2024-01-11'
    },
    {
      id: 'MED007',
      name: 'Omeprazole 20mg',
      category: 'Gastrointestinal',
      currentStock: 18,
      minStock: 25,
      maxStock: 150,
      unit: 'capsules',
      expiryDate: '2024-09-30',
      batchNumber: 'OME2024007',
      supplier: 'GastroSupply',
      costPerUnit: 0.40,
      lastRestocked: '2024-01-03'
    },
    {
      id: 'MED008',
      name: 'Aspirin 81mg',
      category: 'Cardiovascular',
      currentStock: 200,
      minStock: 60,
      maxStock: 400,
      unit: 'tablets',
      expiryDate: '2026-01-31',
      batchNumber: 'ASP2024008',
      supplier: 'CardioMed',
      costPerUnit: 0.05,
      lastRestocked: '2024-01-14'
    },
    {
      id: 'MED009',
      name: 'Lisinopril 10mg',
      category: 'Cardiovascular',
      currentStock: 90,
      minStock: 35,
      maxStock: 180,
      unit: 'tablets',
      expiryDate: '2025-07-20',
      batchNumber: 'LIS2024009',
      supplier: 'CardioMed',
      costPerUnit: 0.35,
      lastRestocked: '2024-01-09'
    },
    {
      id: 'MED010',
      name: 'Cetirizine 10mg',
      category: 'Antihistamine',
      currentStock: 3,
      minStock: 20,
      maxStock: 100,
      unit: 'tablets',
      expiryDate: '2024-04-30',
      batchNumber: 'CET2024010',
      supplier: 'AllergyMed',
      costPerUnit: 0.25,
      lastRestocked: '2023-12-20'
    },
    {
      id: 'MED011',
      name: 'Morphine 10mg',
      category: 'Pain Relief',
      currentStock: 25,
      minStock: 15,
      maxStock: 60,
      unit: 'vials',
      expiryDate: '2024-10-15',
      batchNumber: 'MOR2024011',
      supplier: 'PainCare',
      costPerUnit: 15.00,
      lastRestocked: '2024-01-13'
    },
    {
      id: 'MED012',
      name: 'Prednisone 10mg',
      category: 'Corticosteroids',
      currentStock: 60,
      minStock: 30,
      maxStock: 150,
      unit: 'tablets',
      expiryDate: '2025-03-31',
      batchNumber: 'PRE2024012',
      supplier: 'SteroidSupply',
      costPerUnit: 0.50,
      lastRestocked: '2024-01-07'
    }
  ],
  alerts: [
    {
      id: 'ALT001',
      itemId: 'MED001',
      type: 'low_stock',
      message: 'Paracetamol 500mg is critically low (5 units remaining)',
      severity: 'critical',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'ALT002',
      itemId: 'MED003',
      type: 'expiring_soon',
      message: 'Insulin Glargine expires in 2 months',
      severity: 'medium',
      createdAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 'ALT003',
      itemId: 'MED010',
      type: 'low_stock',
      message: 'Cetirizine 10mg is critically low (3 units remaining)',
      severity: 'critical',
      createdAt: '2024-01-15T12:00:00Z'
    },
    {
      id: 'ALT004',
      itemId: 'MED010',
      type: 'expiring_soon',
      message: 'Cetirizine 10mg expires in 3 months',
      severity: 'medium',
      createdAt: '2024-01-15T12:05:00Z'
    },
    {
      id: 'ALT005',
      itemId: 'MED002',
      type: 'low_stock',
      message: 'Amoxicillin 250mg is low (15 units remaining)',
      severity: 'high',
      createdAt: '2024-01-15T13:00:00Z'
    },
    {
      id: 'ALT006',
      itemId: 'MED007',
      type: 'low_stock',
      message: 'Omeprazole 20mg is low (18 units remaining)',
      severity: 'high',
      createdAt: '2024-01-15T14:00:00Z'
    }
  ],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    updateStock: (state, action: PayloadAction<{ itemId: string; newStock: number; reason: string }>) => {
      const { itemId, newStock } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.currentStock = newStock;
        
        // Generate alert if stock is low
        if (newStock <= item.minStock) {
          const alertExists = state.alerts.some(a => a.itemId === itemId && a.type === 'low_stock');
          if (!alertExists) {
            state.alerts.unshift({
              id: `ALT${Date.now()}`,
              itemId,
              type: 'low_stock',
              message: `${item.name} is ${newStock <= 5 ? 'critically' : ''} low (${newStock} units remaining)`,
              severity: newStock <= 5 ? 'critical' : 'high',
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    },
    triggerLowStockNotification: (_state, _action: PayloadAction<{ itemName: string; currentStock: number; severity: 'critical' | 'high' }>) => {
      // This will be used by middleware to trigger notifications
    },
    addInventoryItem: (state, action: PayloadAction<Omit<InventoryItem, 'id'>>) => {
      const newItem: InventoryItem = {
        ...action.payload,
        id: `MED${String(state.items.length + 1).padStart(3, '0')}`,
      };
      state.items.push(newItem);
    },
    dismissAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    restockItem: (state, action: PayloadAction<{ itemId: string; quantity: number; batchNumber?: string }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.currentStock += quantity;
        item.lastRestocked = new Date().toISOString();
        
        // Remove low stock alerts for this item
        state.alerts = state.alerts.filter(alert => 
          !(alert.itemId === itemId && alert.type === 'low_stock')
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  updateStock, 
  addInventoryItem, 
  dismissAlert, 
  restockItem,
  triggerLowStockNotification,
  setLoading, 
  setError 
} = inventorySlice.actions;

export default inventorySlice.reducer;