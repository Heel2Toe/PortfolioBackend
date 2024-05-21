import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { projects } from "./schemas/projects-schema.js";

const app = express();

app.use(cors());
app.use(express.json());

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db connected");
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

main();

app.post("/adminLogin", (req, res) => {
  const { username, password } = req.body;

  try {
    if (username != process.env.USERN) {
      return res.status(400).send("Invalid Username");
    } else if (password != process.env.PASS) {
      return res.status(400).send("Invalid Password");
    }
    return res.send("ok");
  } catch (err) {
    console.log("error at /adminLogin", err);
    return res.status(500).send("Internal server error");
  }
});

app.post("/projectUpload", async (req, res) => {
  const { name, description, siteLink, githubLink, imageLink } = req.body;
  if (!name || !description || !siteLink || !githubLink || !imageLink) {
    return res.status(400).send("Missing values found");
  }
  try {
    const newProject = new projects({
      name: name,
      description: description,
      siteLink: siteLink,
      githubLink: githubLink,
      imageLink: imageLink,
    });
    await newProject.save();
    return res.send("saved");
  } catch (err) {
    console.log("error at /projectUpload", err);
    return res.status(500).send("Internal Server Error");
  }
});


app.get('/getProjects/:mode', async (req, res) => {
  const { mode } = req.params;
  try{
    if(mode == 'admin'){
      let result = [];
      let response = await projects.find({}, 'name');
      response.map((single)=>result.push(single.name))
      return res.json({result});
    }
    else if(mode == 'guest'){
      let response = await projects.find({});
      return res.json({response});
    }  
  }
  catch(err){
    console.log('error at /getProjects', err);
    return res.status(500).send('Internal Server Error');
  }
})

app.listen(process.env.PORT, () => {
  console.log("server running");
});
