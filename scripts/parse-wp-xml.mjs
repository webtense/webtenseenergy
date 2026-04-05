import fs from 'fs';
import path from 'path';

const xmlFiles = [
  'webtenseenergy.WordPress.2025-06-03.xml',
  'updateWebWTSenergy.xml'
];

function cleanCdata(text) {
  if (!text) return '';
  return text.trim().replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/i, '$1');
}

function getTagValue(xml, tag) {
  const startTag = `<${tag}>`;
  const endTag = `</${tag}>`;
  const startIndex = xml.indexOf(startTag);
  if (startIndex === -1) return '';
  const endIndex = xml.indexOf(endTag, startIndex + startTag.length);
  if (endIndex === -1) return '';
  return cleanCdata(xml.substring(startIndex + startTag.length, endIndex));
}

// Especial para tags con namespace o atributos
function getComplexTagValue(xml, tagRegex) {
  const match = xml.match(new RegExp(`<${tagRegex}[^>]*>([\\s\\S]*?)<\\/${tagRegex.split(':')[1] || tagRegex}>`, 'i'));
  return match ? cleanCdata(match[1]) : '';
}

function getCategories(itemXml) {
  const categories = [];
  const regex = /<category domain="category" nicename="([^"]+)"><!\[CDATA\[([^\]]+)\]\]><\/category>/gi;
  let match;
  while ((match = regex.exec(itemXml)) !== null) {
    categories.push(match[2]);
  }
  return categories;
}

function getFirstImage(content) {
  const match = content.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
}

const allPosts = [];

xmlFiles.forEach(fileName => {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const items = content.split('<item>');
  items.shift(); // Primero es el header del RSS

  items.forEach(itemContent => {
    const item = itemContent.split('</item>')[0];
    
    const postType = getTagValue(item, 'wp:post_type');
    const status = getTagValue(item, 'wp:status');

    if (postType === 'post' && (status === 'publish' || status === 'pending')) {
      const title = getTagValue(item, 'title');
      const slug = getTagValue(item, 'wp:post_name');
      const encodedContent = getComplexTagValue(item, 'content:encoded');
      const excerpt = getComplexTagValue(item, 'excerpt:encoded');
      const date = getTagValue(item, 'wp:post_date');
      const categories = getCategories(item);

      allPosts.push({
        title,
        slug,
        content: encodedContent,
        excerpt: excerpt || title.substring(0, 150) + '...',
        date: date.split(' ')[0], // Solo la fecha
        category: categories[0] || 'General',
        categories,
        status,
        featuredImage: getFirstImage(encodedContent) || '/images/blog-placeholder.png'
      });
    }
  });
});

const dataDir = path.resolve(process.cwd(), 'src/data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(allPosts, null, 2));
console.log(`Extraídos ${allPosts.length} artículos.`);
