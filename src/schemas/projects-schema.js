import mongoose from 'mongoose';

const projectsSchema = new mongoose.Schema({
    name: String,
    description: String,
    siteLink: String,
    githubLink: String,
    imageLink: String,
})

export const projects = mongoose.model('projects', projectsSchema);