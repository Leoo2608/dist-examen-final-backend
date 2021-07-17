import { Pool } from 'pg'
export const pool=new Pool({
    host:'ec2-54-147-93-73.compute-1.amazonaws.com',
    user:'hiloviqepdzfhw',
    password:'f4be3fbfa5c340b9745721209f16091f6e735ae98127af98a0c6cdbf52df5943',
    database:'ddi4u2ubl2du8t',
    port:5432,
    ssl:{rejectUnauthorized:false}
});