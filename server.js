//Importing dependencies
const express = require("express")
const socketBackend = require("./socketManager")
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require("cors")





//Importing Routes.
const userRouter = require("./routes/userRoutes/userRoute")
const friendsRouter = require("./routes/userRoutes/friendsRoute")
const messagesRouter = require("./routes/messagesRoute")
const authRouter = require('./routes/authRouter');
const activityRouter = require('./routes/activityRoute')
const storyRouter = require("./routes/storyRoute")



//Static files setup
app.use(express.static("public"))
dotenv.config()

app.get("/", (req, res) => {
    res.send("server is working")
})
app.use(express.urlencoded({ extended: true }))

//cors
app.use(cors())


// parse application/json
app.use(express.json())

//Setting Route Middlewares
//user Router
app.use("/user", userRouter)
app.use("/user/friends", friendsRouter)
app.use("/user/messages", messagesRouter)

//Others
app.use('/auth', authRouter);
app.use('/activities', activityRouter);
app.use('/stories', storyRouter)


//Database Connection Connect to mongoose
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOLAB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true

})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


//Setting-up the port

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log("App is running at port " + PORT))

socketBackend(server)









