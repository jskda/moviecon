// scripts/sync-batches.js
import { incrementalSync } from '../lib/sync-optimized.js'

async function runBatchedSync() {
  console.log('🚀 Starting batched synchronization...')
  
  for (let batch = 1; batch <= 5; batch++) {
    console.log(`\n🔄 Processing batch ${batch}/5...`)
    
    try {
      const result = await incrementalSync()
      console.log(`✅ Batch ${batch} completed: ${result.processed} items`)
      
      // Пауза между батчами
      if (batch < 5) {
        console.log('⏳ Waiting 10 seconds before next batch...')
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
      
    } catch (error) {
      console.error(`❌ Batch ${batch} failed:`, error.message)
      break
    }
  }
  
  console.log('🎉 All batches completed!')
}

runBatchedSync()