const sequelize = require('./db/db');
const User = require('./models/User');

async function checkSchema() {
    try {
        await sequelize.authenticate();
        const users = await sequelize.query("DESCRIBE users;");
        console.log(users[0].map(c => ({ field: c.Field, type: c.Type })));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
