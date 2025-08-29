// scripts/sync-incremental.js
const { PrismaClient } = require('@prisma/client/edge');
const { withAccelerate } = require('@prisma/extension-accelerate');

const prisma = new PrismaClient().$extends(withAccelerate());
const API_URL = 'https://portal.lumex.host/api';
const API_TOKEN = 'mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F';
const PAGE_SIZE = 100;
const CONCURRENT_PAGES = 3; // Меньше для инкрементальной
const BATCH_SIZE = 15;
const DELAY_BETWEEN_PAGES = 150;

async function fetchPage(page) {
  const url = `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=${PAGE_SIZE}`;
  console.log(`📥 Fetching page ${page}: ${url}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  
  const data = await response.json();
  return {
    page,
    data: data.data || [],
    total: data.total || 0
  };
}

async function processBatch(items) {
  const batchPromises = items.map(item => 
    prisma.content.upsert({
      where: { id: item.id },
      update: {
        type: item.type || 'movie',
        title: item.title || item.orig_title,
        ru_title: item.ru_title,
        year: item.year ? new Date(item.year).getFullYear() : null,
        released: item.released,
        kinopoisk_id: item.kinopoisk_id,
        imdb_id: item.imdb_id,
        rating: item.rating,
        iframe_src: item.iframe_src,
        raw: JSON.stringify(item),
        updatedAt: new Date()
      },
      create: {
        id: item.id,
        type: item.type || 'movie',
        title: item.title || item.orig_title,
        ru_title: item.ru_title,
        year: item.year ? new Date(item.year).getFullYear() : null,
        released: item.released,
        kinopoisk_id: item.kinopoisk_id,
        imdb_id: item.imdb_id,
        rating: item.rating,
        iframe_src: item.iframe_src,
        raw: JSON.stringify(item)
      }
    })
  );

  const results = await Promise.allSettled(batchPromises);
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return { successful, failed };
}

async function incrementalSync() {
  try {
    console.log('🚀 Starting INCREMENTAL synchronization...');
    console.log(`⚡ Configuration: ${CONCURRENT_PAGES} concurrent pages, ${BATCH_SIZE} batch size`);
    
    let page = 1;
    let totalAdded = 0;
    let totalUpdated = 0;
    let totalErrors = 0;
    let hasMore = true;

    while (hasMore) {
      console.log(`\n📄 Processing pages ${page} to ${page + CONCURRENT_PAGES - 1}...`);
      
      const pagePromises = [];
      for (let i = 0; i < CONCURRENT_PAGES; i++) {
        pagePromises.push(fetchPage(page + i));
      }

      const pagesData = await Promise.allSettled(pagePromises);
      
      let allItems = [];
      let pagesProcessed = 0;

      for (const pageResult of pagesData) {
        if (pageResult.status === 'fulfilled') {
          const pageData = pageResult.value;
          if (pageData.data && pageData.data.length > 0) {
            allItems = allItems.concat(pageData.data);
            pagesProcessed++;
            console.log(`📊 Page ${pageData.page}: received ${pageData.data.length} items`);
          } else {
            hasMore = false;
          }
        } else {
          console.error(`❌ Error fetching page:`, pageResult.reason);
          totalErrors++;
        }
      }

      if (allItems.length === 0) {
        console.log("✅ No more pages. Synchronization completed!");
        hasMore = false;
        break;
      }

      console.log(`⚡ Processing ${allItems.length} items in batches of ${BATCH_SIZE}...`);
      
      let batchAdded = 0;
      let batchUpdated = 0;
      let batchErrors = 0;

      for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
        const batch = allItems.slice(i, i + BATCH_SIZE);
        const batchResult = await processBatch(batch);
        batchAdded += batchResult.successful;
        batchErrors += batchResult.failed;
        
        console.log(`🔄 Batch ${Math.floor(i/BATCH_SIZE) + 1}: ${batchResult.successful} processed, ${batchResult.failed} errors`);
      }

      totalAdded += batchAdded;
      totalErrors += batchErrors;
      
      console.log(`✔️ Pages ${page}-${page + pagesProcessed - 1}: Processed ${batchAdded}, Errors: ${batchErrors}`);

      page += CONCURRENT_PAGES;

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_PAGES));
      }
      
      if (page > 1000) {
        console.log("⚠️  Safety limit reached (1000 pages)");
        hasMore = false;
      }
    }

    console.log(`\n🎉 Incremental sync completed!`);
    console.log(`📊 Total records processed: ${totalAdded}`);
    console.log(`❌ Total errors: ${totalErrors}`);
    
    return { 
      success: true, 
      added: totalAdded,
      errors: totalErrors,
      message: `Processed ${totalAdded} records with ${totalErrors} errors`
    };
    
  } catch (error) {
    console.error('❌ Incremental sync failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск
incrementalSync()
  .then((result) => {
    console.log('✅ Sync completed successfully!');
    console.log(`📋 ${result.message}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });