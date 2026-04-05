const fs = require('fs');
const path = require('path');

async function importWP() {
  const xmlPath = path.join(__dirname, '../webtenseenergy.WordPress.2025-06-03.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  
  const items = xmlContent.split('<item>');
  items.shift(); // Elimina la cabecera del XML
  
  const posts = [];
  
  function extract(str, tag) {
    const open = `<${tag}>`;
    const openCdata = `<${tag}><![CDATA[`;
    const close = `</${tag}>`;
    const closeCdata = `]]></${tag}>`;

    // Intentar con CDATA
    let cstart = str.indexOf(openCdata);
    if (cstart !== -1) {
      let cend = str.indexOf(closeCdata, cstart);
      if (cend !== -1) {
        return str.substring(cstart + openCdata.length, cend);
      }
    }
    
    // Intentar normal
    let start = str.indexOf(open);
    if (start !== -1) {
      let end = str.indexOf(close, start);
      if (end !== -1) {
        let val = str.substring(start + open.length, end).trim();
        if (val.startsWith('<![CDATA[')) {
          val = val.substring(9, val.length - 3);
        }
        return val;
      }
    }
    
    return null;
  }
  
  function extractNamespaces(str, tag) {
      const regex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'g');
      const match = regex.exec(str);
      if (match) return match[1];
      
      const regex2 = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g');
      const match2 = regex2.exec(str);
      return match2 ? match2[1] : null;
  }

  for (const item of items) {
    const type = extract(item, 'wp:post_type');
    if (type !== 'post') continue;
    
    const status = extract(item, 'wp:status');
    if (status !== 'publish' && status !== 'pending') continue;
    
    const title = extract(item, 'title');
    let slug = extract(item, 'wp:post_name');
    if (!slug) {
        const link = extract(item, 'link');
        if (link) slug = link.split('/').filter(Boolean).pop();
    }
    
    let content = extractNamespaces(item, 'content:encoded');
    if (!content) continue;
    
    let excerpt = extractNamespaces(item, 'excerpt:encoded');
    
    // Fallback for excerpt
    if (!excerpt || excerpt.length < 5) {
      const cleanText = content.replace(/<\/?[^>]+(>|$)/g, "").replace(/<!--[\s\S]*?-->/g, "").trim();
      excerpt = cleanText.substring(0, 160) + "...";
    }

    const dateRaw = extract(item, 'wp:post_date') || extract(item, 'pubDate');
    let dateStr = new Date().toISOString().split('T')[0];
    if (dateRaw) {
        try {
            dateStr = new Date(dateRaw).toISOString().split('T')[0];
        } catch(e){}
    }
    
    const categories = [];
    let catMatch;
    // <category domain="category" nicename="domotica"><![CDATA[Domótica]]></category>
    const catRegex = /<category domain="category" nicename="[^"]+"><!\[CDATA\[(.*?)\]\]><\/category>/g;
    while ((catMatch = catRegex.exec(item)) !== null) {
      if (catMatch[1] !== 'Uncategorized' && catMatch[1] !== 'Blog') {
         categories.push(catMatch[1]);
      }
    }
    if (categories.length === 0) categories.push("Ahorro Energético"); // default

    posts.push({
      title,
      slug: slug || encodeURIComponent(title.toLowerCase().replace(/ /g, '-').substring(0,30)),
      content,
      excerpt,
      date: dateStr,
      category: categories[0],
      categories: ["Todos", ...categories],
      status: 'publish',
      featuredImage: '/images/blog-placeholder.png' // Necesitaremos un fallback genérico si no hay imagen
    });
  }
  
  const outputPath = path.join(__dirname, '../src/data/posts.json');
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`¡Éxito! Extraídos ${posts.length} artículos al archivo posts.json.`);
}

importWP();
