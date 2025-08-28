const fetch = require("node-fetch");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const API_URL = "https://portal.lumex.host/api";
const API_TOKEN = "mCSbTETUoTFAUzpOBa4Cx156dGkVHK5F";
const PAGE_SIZE = 20;

async function fetchPage(page) {
  const url = `${API_URL}/movies?api_token=${API_TOKEN}&page=${page}&perPage=${PAGE_SIZE}`;
  console.log(`📥 Fetching page ${page}: ${url}`);
  
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Ошибка загрузки ${url}: ${res.status}`);
  }

  const response = await res.json();
  
  if (!response.result || !response.data) {
    throw new Error(`Invalid API response format`);
  }
  
  console.log(`📊 Page ${page}: ${response.data.length} items, total: ${response.total}`);
  
  return {
    data: response.data,
    currentPage: response.current_page,
    lastPage: response.last_page,
    hasMore: response.current_page < response.last_page
  };
}

async function sync() {
  try {
    console.log('🚀 Starting synchronization...');
    
    // Очищаем базу полностью для чистой синхронизации
    console.log('🧹 Clearing existing data...');
    await prisma.content.deleteMany({});
    
    let page = 1;
    let totalAdded = 0;
    let hasMore = true;

    while (hasMore) {
      console.log(`\n📄 Processing page ${page}...`);
      
      try {
        const { data, currentPage, lastPage, hasMore: pageHasMore } = await fetchPage(page);
        
        console.log(`📦 Received ${data.length} items (page ${currentPage}/${lastPage})`);

        if (!data || data.length === 0) {
          console.log("✅ No more data.");
          hasMore = false;
          break;
        }

        let addedThisPage = 0;
        let errorsThisPage = 0;

        for (const item of data) {
          try {
            if (item && item.id) {
              await prisma.content.create({
                data: {
                  id: item.id,
                  type: item.type || item.content_type || 'MOVIE',
                  title: item.title || item.orig_title,
                  ru_title: item.ru_title,
                  description: item.description,
                  year: item.year ? new Date(item.year).getFullYear() : 
                       item.released ? new Date(item.released).getFullYear() : null,
                  released: item.released,
                  poster: item.poster,
                  backdrop: item.backdrop,
                  kinopoisk_id: item.kinopoisk_id,
                  imdb_id: item.imdb_id,
                  rating: item.rating,
                  iframe_src: item.iframe_src,
                  raw: JSON.stringify(item),
                },
              });
              totalAdded++;
              addedThisPage++;
              
              if (addedThisPage % 10 === 0) {
                console.log(`   ➕ Added ${addedThisPage} items so far...`);
              }
            }
          } catch (error) {
            errorsThisPage++;
            if (errorsThisPage <= 3) {
              console.error(`   ❌ Error adding item ${item?.id}:`, error.message);
            }
          }
        }

        console.log(`✔️  Page ${page}: Added ${addedThisPage}, Errors: ${errorsThisPage}`);
        console.log(`📊 Progress: ${totalAdded} total records`);

        // Проверяем есть ли еще страницы
        hasMore = pageHasMore;
        page++;
        
        // Пауза между запросами чтобы не нагружать API
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (pageError) {
        console.error(`❌ Error fetching page ${page}:`, pageError.message);
        hasMore = false;
        break;
      }
      
      // Остановимся после 5 страниц для теста
      // if (page > 5) {
      //   console.log('⏹️  Stopping after 5 pages for testing');
      //   break;
      // }
    }

    console.log(`\n🎉 Synchronization completed!`);
    console.log(`📊 Total records added: ${totalAdded}`);
    
  } catch (err) {
    console.error("❌ Synchronization failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑 Received interrupt signal, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

sync();