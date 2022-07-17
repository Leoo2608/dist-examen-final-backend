import { Pool } from 'pg'


export const pool=new Pool({
    host:'database-1.caht6zftdihk.us-east-1.rds.amazonaws.com',
    user:'postgres',
    password:'12345678',
    database:'dist',
    port:5432,
    ssl:{rejectUnauthorized:false}
});