const fs = require('fs');
try {
  fs.cpSync('public', '.next/standalone/public', {recursive:true});
  fs.cpSync('.next/static', '.next/standalone/.next/static', {recursive:true});
  console.log('Static files copied successfully');
} catch(e) {
  console.error('Error copying files:', e.message);
  process.exit(1);
}
