const { Sequelize } = require("sequelize");

// Uses a single connection string (works with Neon, Supabase, ElephantSQL, Render, or local Postgres)
// Example: postgresql://user:password@host:5432/dbname
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    // Most free cloud Postgres providers (Neon/Supabase) require SSL.
    // Set DB_SSL=false in .env if you're running Postgres locally.
    ssl:
      process.env.DB_SSL === "false"
        ? false
        : {
            require: true,
            rejectUnauthorized: false,
          },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected Successfully");
  } catch (error) {
    console.error("PostgreSQL Connection Failed:", error.message);
  }
};

module.exports = { sequelize, connectDB };
