import Dexie, { Table } from 'dexie'
import { DatabaseClient, DatabaseLoan, DatabasePayment, DatabaseExpense } from './supabase'

// Offline database using IndexedDB
export class OfflineDatabase extends Dexie {
  clients!: Table<DatabaseClient>
  loans!: Table<DatabaseLoan>
  payments!: Table<DatabasePayment>
  expenses!: Table<DatabaseExpense>
  syncQueue!: Table<SyncQueueItem>

  constructor() {
    super('LoanManagementDB')
    
    this.version(1).stores({
      clients: '++id, codigo, nombre, cedula, ruta, cobrador, estado, orden_ruta',
      loans: '++id, client_id, codigo, estado, ruta, cobrador, fecha_desembolso',
      payments: '++id, loan_id, client_id, cobrador, fecha_pago',
      expenses: '++id, ruta, cobrador, fecha, categoria',
      syncQueue: '++id, table, action, timestamp, synced'
    })
  }
}

export interface SyncQueueItem {
  id?: number
  table: 'clients' | 'loans' | 'payments' | 'expenses'
  action: 'create' | 'update' | 'delete'
  data: any
  originalId?: string
  timestamp: number
  synced: number
  error?: string
}

export const offlineDb = new OfflineDatabase()

// Offline sync manager
export class OfflineSyncManager {
  private isOnline = navigator.onLine
  private syncInProgress = false

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncWithServer()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  async addToSyncQueue(table: SyncQueueItem['table'], action: SyncQueueItem['action'], data: any, originalId?: string) {
    await offlineDb.syncQueue.add({
      table,
      action,
      data,
      originalId,
      timestamp: Date.now(),
      synced: 0
    })
  }

  async syncWithServer() {
    if (!this.isOnline || this.syncInProgress) return

    this.syncInProgress = true
    
    try {
      const pendingItems = await offlineDb.syncQueue
        .where('synced')
        .equals(0)
        .sortBy('timestamp')

      for (const item of pendingItems) {
        try {
          await this.syncItem(item)
          
          // Mark as synced
          await offlineDb.syncQueue.update(item.id!, { synced: 1 })
        } catch (error) {
          console.error('Error syncing item:', error)
          await offlineDb.syncQueue.update(item.id!, { 
            error: error instanceof Error ? error.message : 'Unknown error' 
          })
        }
      }
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncItem(item: SyncQueueItem) {
    // Import supabase dynamically to avoid circular dependency
    const { supabase } = await import('./supabase')
    
    switch (item.table) {
      case 'clients':
        if (item.action === 'create') {
          const { data, error } = await supabase
            .from('clients')
            .insert(item.data)
            .select()
            .single()
          
          if (error) throw error
          
          // Update local record with server ID
          if (item.originalId && data) {
            await offlineDb.clients.update(item.originalId, { id: data.id })
          }
        }
        break
        
      case 'loans':
        if (item.action === 'create') {
          const { data, error } = await supabase
            .from('loans')
            .insert(item.data)
            .select()
            .single()
          
          if (error) throw error
          
          if (item.originalId && data) {
            await offlineDb.loans.update(item.originalId, { id: data.id })
          }
        }
        break
        
      case 'payments':
        if (item.action === 'create') {
          const { data, error } = await supabase
            .from('payments')
            .insert(item.data)
            .select()
            .single()
          
          if (error) throw error
          
          if (item.originalId && data) {
            await offlineDb.payments.update(item.originalId, { id: data.id })
          }
        }
        break
        
      case 'expenses':
        if (item.action === 'create') {
          const { data, error } = await supabase
            .from('expenses')
            .insert(item.data)
            .select()
            .single()
          
          if (error) throw error
          
          if (item.originalId && data) {
            await offlineDb.expenses.update(item.originalId, { id: data.id })
          }
        }
        break
    }
  }

  // Methods for offline operations
  async saveClientOffline(client: Omit<DatabaseClient, 'id' | 'created_at' | 'updated_at'>) {
    const id = `temp_${Date.now()}_${Math.random()}`
    const fullClient: DatabaseClient = {
      ...client,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await offlineDb.clients.add(fullClient)
    await this.addToSyncQueue('clients', 'create', fullClient, id)
    
    return fullClient
  }

  async savePaymentOffline(payment: Omit<DatabasePayment, 'id' | 'created_at' | 'updated_at'>) {
    const id = `temp_${Date.now()}_${Math.random()}`
    const fullPayment: DatabasePayment = {
      ...payment,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await offlineDb.payments.add(fullPayment)
    await this.addToSyncQueue('payments', 'create', fullPayment, id)
    
    return fullPayment
  }

  async saveExpenseOffline(expense: Omit<DatabaseExpense, 'id' | 'created_at' | 'updated_at'>) {
    const id = `temp_${Date.now()}_${Math.random()}`
    const fullExpense: DatabaseExpense = {
      ...expense,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await offlineDb.expenses.add(fullExpense)
    await this.addToSyncQueue('expenses', 'create', fullExpense, id)
    
    return fullExpense
  }

  isOffline() {
    return !this.isOnline
  }

  getPendingSyncCount() {
    return offlineDb.syncQueue.where('synced').equals(0).count()
  }

  async saveLoanOffline(loan: Omit<DatabaseLoan, 'id' | 'created_at' | 'updated_at'>) {
    const id = `temp_${Date.now()}_${Math.random()}`
    const fullLoan: DatabaseLoan = {
      ...loan,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await offlineDb.loans.add(fullLoan)
    await this.addToSyncQueue('loans', 'create', fullLoan, id)
    
    return fullLoan
  }
}

export const syncManager = new OfflineSyncManager()