import fs from 'node:fs';
const id = process.env.D1_DATABASE_ID || process.argv[2];
if (!id || !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id)) throw new Error('Provide your D1 database ID: node scripts/configure-public.mjs <database-id>');
const config = JSON.parse(fs.readFileSync('wrangler.public.example.json', 'utf8'));
config.d1_databases[0].database_id = id;
fs.writeFileSync('wrangler.public.json', JSON.stringify(config, null, 2) + '\n');
console.log('Cloudflare configuration written. Owner credentials are set separately as Worker secrets.');
