const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const connectDB = require("./config/db");

/* ADD THIS HERE */
const authRoutes =
require("./routes/authRoutes");


/* CONFIG */

dotenv.config();

connectDB();


/* APP */

const app = express();


/* MIDDLEWARE */

app.use(cors());

app.use(express.json());


/* ADD THIS HERE */
app.use("/api/auth", authRoutes);


/* TEST ROUTE */

app.get("/", (req,res)=>{

    res.send("Algovera Backend Running");
});


/* PORT */

const PORT =
process.env.PORT || 5000;


app.listen(PORT, ()=>{

    console.log(
        `Server running on port ${PORT}`
    );
});