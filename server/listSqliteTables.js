import Database from 'better-sqlite3'
const candidates = ['dev.db', 'prisma/dev.db']
for (const p of candidates) {
	console.log('Checking', p)
	try {
		const db = new Database(p, { readonly: true })
		const rows = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table'").all()
		console.log(`  tables found: ${rows.length}`)
		rows.forEach(r => console.log('   -', r.name))
	} catch (e) {
		console.log('  could not open or no tables')
	}
}
