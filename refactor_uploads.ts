import fs from 'fs';
import path from 'path';

const searchPattern = `import pkg from 'fs';
const { promises: fs } = pkg;
import path from 'path';

async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = \`\${Date.now()}-\${file.name.replace(/\\s+/g, '-')}\`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);
  return \`/uploads/\${fileName}\`;
}`;

const replacePattern = `import { uploadToCloudinary } from '@/lib/cloudinary';

async function saveUploadedFile(file: File): Promise<string> {
  return await uploadToCloudinary(file);
}`;

function walkSync(dir: string, filelist: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (!filepath.includes('node_modules') && !filepath.includes('.next')) {
        filelist = walkSync(filepath, filelist);
      }
    } else if (file === 'actions.ts') {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync(path.join(process.cwd(), 'app', 'admin'));

let modified = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("async function saveUploadedFile")) {
    // We will do a generic replacement because spacing might differ slightly
    content = content.replace(/import pkg from 'fs';[\s\S]*?return `\/uploads\/\$\{fileName\}`;[\n\r]*\}/m, replacePattern);
    fs.writeFileSync(file, content);
    console.log('Modified', file);
    modified++;
  }
}
console.log('Total modified:', modified);
