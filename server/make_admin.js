require('dotenv').config();
const sequelize = require('./db/db');

async function makeAdmin() {
    try {
        await sequelize.authenticate();

        // Show ALL users with their roles
        const [users] = await sequelize.query('SELECT id, name, email, role FROM users ORDER BY id');
        console.log('\n📋 All users in database:');
        console.table(users);

        // Promote ALL non-customer users, or you can specify email
        // Change this email to whatever email you use to login
        const targetEmail = process.argv[2]; // pass email as argument
        if (targetEmail) {
            const [result] = await sequelize.query(
                `UPDATE users SET role = 'admin' WHERE email = ?`,
                { replacements: [targetEmail] }
            );
            console.log(`\n✅ Promoted ${targetEmail} to admin (${result.affectedRows} row affected)`);
        } else {
            console.log('\n⚠️  Run with: node make_admin.js your@email.com');
            console.log('    to promote a specific user to admin');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

makeAdmin();
