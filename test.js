const bookings=require('./data/getBookings');
const connection = require('./config/mongoConnection');
async function main() {
    try{
        result=await bookings.createBooking();
    }
    catch(e){
        console.log(e);
      }
const db = await connection();
await db.s.client.close();
}

main()