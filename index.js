const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

const personneModel = require('./models/personne')
const postSchema = require('./models/post')
const categorieModel = require('./models/categorie')
const commentaireModel = require('./models/commentaire')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "UPDATE"],
    credentials: true
}
))


mongoose
    .connect(
        "mongodb+srv://ELKHALDI-Nada:DH0ST0WMj1VhHKeW@forum-db.ygxqjnk.mongodb.net/?retryWrites=true&w=majority"
)
    
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("Token not available")
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) { return res.json("token is wrong") }
            req.decodedtoken = decoded;
            next();
        })
    }
}
app.post('/register', (req, res) => {
    const { nom, prenom, age, email, password, telephone, pays } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            personneModel.create({ nom, prenom, age, email, telephone, pays, password: hash })
                .then(users => res.json(users))
                .catch(err => res.json(err))
        }).catch(err => console.log(err.message))

})

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    personneModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ email: user.email, id: user.id }, "jwt-secret-key", { expiresIn: "1d" });
                        res.cookie("token", token);
                        res.json("success");
                    }
                    else {
                        res.json("the password is incorrect")
                    }
                })
            }
            else {
                res.json("Not exist")
            }
        })
})

app.post('/Posting', verifyUser, async (req, res) => {
    const { titre, contenu, personne } = req.body;
    const postModel = mongoose.model('posts', postSchema);
    const newPost = await postModel.create({ titre, contenu, personne, date: new Date(), });
})


app.get('/Posts', async (req, res) =>
{ 
    const postModel = mongoose.model('posts', postSchema);
    const posts = await postModel.find();
    res.json(posts);
});

app.get('/Posts/:id', async (req, res) =>
{
    const postModel = mongoose.model('posts', postSchema);
    const postId = req.params.id;
    const post = await postModel.findById(postId);
    res.json(post);
});


app.get("/profile/:id", verifyUser, async (req, res) => {
    try {
        const Post = mongoose.model('Post', postSchema);
        const user = await personneModel.findOne({ _id: req.params.id }).populate('posts').select('prenom nom email').exec();

        if (user) {
            const posts = user.posts ? user.posts.map(post => ({
                titre: post.titre,
            })) : [];

            res.json({ fullname: user.prenom + " " + user.nom, email: user.email, numberofposts: posts.length });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json('Logged out successfully');
});

app.get('/home', verifyUser, (req, res) => {
    return res.json("success")
})

app.get('/categories', (req, res) => {
    categorieModel.find({})
        .then(categories => res.json(categories))
        .catch(err => res.json(err))
})

app.post("/new-category", (req, res) => {
    categorieModel.create(req.body)
        .then(categories => res.json(categories))
        .catch(err => res.json(err))
})

app.delete("/delete/:id", (req, res) => {
    categorieModel.findByIdAndDelete({ _id: req.params.id })
        .then(categories => res.json(categories))
        .catch((err) => res.json(err))

});
app.listen(3001, () => {
    console.log(`runnig`);
});