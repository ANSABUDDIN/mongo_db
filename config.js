import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://ansab03:fLQI8pz30N0xRVEv@cluster0.czzzbh8.mongodb.net/?retryWrites=true&w=majority", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false, 
}).then(()=>{
    console.log("connection success");
}).catch((e)=>{
    console.log("connection failed "+ e);
})
