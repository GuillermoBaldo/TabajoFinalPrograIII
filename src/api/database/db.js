import mysql2 from "mysql2/promise";

import enviroment from "../config/enviroment.js";

// extraemos el objeto db

const {database} = enviroment;

// creamos un pull de conexiones a la bs
const conection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});


export default conection;