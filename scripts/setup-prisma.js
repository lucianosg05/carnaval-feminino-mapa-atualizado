import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

function setProvider(provider) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace(/datasource db \{[\s\S]*?\}/m, `datasource db {\n  provider = "${provider}"\n  url      = env("DATABASE_URL")\n}`);
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log(`✅ prisma/schema.prisma updated to provider=${provider}`);
}

async function main() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPostgres = dbUrl.startsWith('postgres') || dbUrl.startsWith('postgresql:');

  if (isPostgres) {
    setProvider('postgresql');
  } else {
    setProvider('sqlite');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
