const env = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": "postgres",
    "sslmode": "require",
  },
  // "uat": {
  //   "username": process.env.DB_USER_uat,
  //   "password": process.env.DB_PASSWORD,
  //   "database": process.env.DB_NAME_uat,
  //   "host": process.env.DB_HOST_uat,
  //   "dialect": "mysql"
  // },
  // "production": {
  //   "username": process.env.DB_USER_prod,
  //   "password": process.env.DB_PASSWORD,
  //   "database": process.env.DB_NAME_prod,
  //   "host": process.env.DB_HOST,
  //   "dialect": "mysql"

  // }
}

  
  module.exports = { env }