# ANN
DBM Fall 2023 Term Project
  
Purpose:  
Music application that does various things including playlist management and music trivia  
  
Stack:  
Next + Tailwind CSS  
MySQL  
Docker - to host locally

## Current Status
- Registration/login system - implemented
- Profile editor/manager  - implemented
- Create playlist + display playlists - implemented
- Song search - needs implemented - need to decide if use Spotify/MusicBrainz
- Music video search - needs implemented - plan on using YouTube API
- Music Trivia - needs implemented

## Steps to locally run
1. Clone the GitHub repo using the terminal "git clone https://github.com/kengu7272/ANN"
2. Install Docker:  
Windows: https://docs.docker.com/desktop/install/linux-install/  
Linux: https://docs.docker.com/desktop/install/linux-install/  
Mac: https://docs.docker.com/desktop/install/mac-install/
3. Launch Docker to make sure the engine is running
4. Open the cloned project in the ann directory at /ANN/ann
4. Add a .env file with variables: SECRET_KEY, MYSQL_ROOT_PASSWORD  
SECRET_KEY will be the string variable that you hash and verify user passwords with, can technically be anything  
MYSQL_ROOT_PASSWORD will be the password for root of the MySql server
5. Run "docker-compose build" to build the Docker image with the files in the directory  
(If build fails, delete the data directory at /ANN/ann/data and try again, not sure why it does that yet)
6. Run "docker-compose up" to launch the Docker containers  
(Dev environment currently, terminal will say localhost:3000 ready when server is up)
7. Visit http://localhost:3000/ on your browser to view project locally

## Current Functions You Can Explore
1. Registering an account with password check
2. Logging in and being issued a jsonwebtoken for authentication
3. Editing account details or deleting account
4. Creating playlists and displaying playlist (will be implementing adding songs to them very soon)

## Note
1. The data directory is used to persist the MySql server data as containers are not persistent
2. Nodemon integrated for live reloads during development

