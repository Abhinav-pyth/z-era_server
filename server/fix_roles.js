require('dotenv').config();
const sequelize = require('./db/db');

async function fixRoles() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');

        // Show current users
        const [users] = await sequelize.query('SELECT id, name, email, role FROM users ORDER BY id');
        console.log('\n📋 Current users in DB:');
        console.table(users);

        // Fix roles
        await sequelize.query(`UPDATE users SET role = 'admin' WHERE email = 'admin@z-era.com'`);
        await sequelize.query(`UPDATE users SET role = 'manager' WHERE email = 'manager@z-era.com'`);
        console.log('\n✅ Roles updated!');

        // Verify
        const [after] = await sequelize.query('SELECT id, name, email, role FROM users ORDER BY id');
        console.log('\n📋 Updated users:');
        console.table(after);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fixRoles();
