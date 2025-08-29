// scripts/sync.js - ОБНОВЛЕННАЯ ВЕРСИЯ
import { incrementalSync } from '@/lib/sync-optimized'

async function runSync() {
  try {
    console.log('🚀 Starting synchronization...')
    const result = await incrementalSync()
    console.log(`🎉 Sync completed! Processed ${result.processed} records`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    process.exit(1)
  }
}

runSync()