import mongoose from "mongoose"

export const dbconnection = async()=>{
    try {
        mongoose.connect(process.env.db_connection );
        console.log('connection successfull')
    } catch (error) {
        console.error('connection failed' , error.message ,
            process.exit(1)
        )
    }
};

export default dbconnection;