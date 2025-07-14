const fs = require('fs');
const path = require('path');

const envFiles = ['.env.local', '.env.development', '.env'];
const envConfig = {};

for (const file of envFiles) {
  try {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)?\s*$/);
        if (match) {
          const key = match[1];
          const value = match[2] || '';
          if (!envConfig.hasOwnProperty(key)) {
            envConfig[key] = value;
          }
        }
      });
    }
  } catch (err) {
    // Ignore errors
  }
}

console.log('--- Firebase Environment Variables ---');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', envConfig.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', envConfig.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', envConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', envConfig.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', envConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', envConfig.NEXT_PUBLIC_FIREBASE_APP_ID);
console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:', envConfig.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
console.log('------------------------------------');