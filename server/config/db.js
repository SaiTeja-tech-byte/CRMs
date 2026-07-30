const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      process.env.DB_SSL === "false"
        ? false
        : {
            require: true,
            rejectUnauthorized: false,
          },
    statement_timeout: 10000,
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
    acquire: 30000,
    idle: 10000,
    evict: 1000,
  },
  retry: {
    max: 2,
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
