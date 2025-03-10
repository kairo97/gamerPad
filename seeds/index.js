//require all seed files
const seedAccounts = require('./accountSeeds');
const seedGame = require('./gameSeeds');
const seedNote = require('./noteSeeds');
const UserGamePlatform = require('./userGameSeeds');
const seedUser = require('./userSeeds'); 
const seedPlatforms = require('./platformSeeds');


//bring in sequalize
const sequelize = require("../config/connection");

const seedAll = async () => {
    await sequelize.sync({ force: true });
    console.log("\n----- DATABASE SYNCED -----\n");
    
    await seedUser();
    console.log("\n----- USERS SEEDED -----\n");

    await seedAccounts();
    console.log("\n----- ACCOUNTS SEEDED -----\n");

    await seedNote();
    console.log("\n----- NOTES SEEDED -----\n");

    await seedGame();
    console.log("\n----- GAMES SEEDED -----\n");

    await seedPlatforms();
    console.log("\n----- PLATFORMS SEEDED -----\n");
    
    await UserGamePlatform();
    console.log("\n----- USERGAMES SEEDED -----\n");
    
    // await seedPlatform();
    // console.log("\n----- PLATFORMS SEEDED -----\n");

    process.exit(0);
}

seedAll();