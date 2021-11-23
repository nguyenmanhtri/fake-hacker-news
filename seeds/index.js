const Story = require('../models/stories');
const axios = require('axios').default;
const mongoose = require('mongoose');

// Connect with mongo database
main()
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/hackernews');
}

const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const getTop500Stories = async () => {
    try {
        // Clean the model
        await Story.deleteMany({});

        // Get top stories ID
        const top500StoriesId = await axios.get(topStoriesUrl).then(res => res.data);
        const topStoriesId = top500StoriesId.slice(0, 50);
        for (let id of topStoriesId) {
            const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);

            // Create new document in database
            if (storyRes.data && storyRes.data.title && storyRes.data.url) {
                const story = new Story({
                    title: storyRes.data.title,
                    url: storyRes.data.url,
                })
                await story.save();
                console.log('Saved one document!');
            } else {
                console.log('Missing data!');
            }
        }
    } catch (err) {
        console.log(err);
    }
}

getTop500Stories().then(() => {
    mongoose.connection.close();
    console.log('Database connection closed!');
});