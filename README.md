# Fake Hacker News
A mock up site of [Y Combinator's Hacker News](https://news.ycombinator.com/)

You can visit my project on Heroku: https://fake-hacker-news.herokuapp.com/  
It may not load very fast because I am using a shared cluster, not a dedicated one.

In this application, I tried to replicate the most basic features of the Hacker News website. Some of them are:
1. Create a new story.
2. List all the stories on the front page.
3. Edit the uploaded story.
4. Remove a story if needed.
Basically, full CRUD.

Some key technologies I used in this project:
1. **NodeJS** to use server-side JavaScript and many of its useful packages, such as `method-override` and `serve-favicon`.
2. Web framework **Express** to make a web server and routings.
3. **EJS** to make dynamic HTML pages.
4. `connect-flash` to display a small alert whenenver the user performs an action.
5. `method-override` to get HTML forms to make a PUT and a DELETE request.

Some possible improvements:
1. Pagination when there are more than 30 stories in one scroll.
2. Allow users to make an account. Regular visitors can only read stories. Only the users with an account can add new stories and only their owners can edit or delete them.
