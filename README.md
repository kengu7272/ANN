# ANN
DBM Fall 2023 Term Project

Collaborators:<br>
Kevin Nguyen<br>
David Namenyi<br>
Kevin Asamoah<br>
<br>
Purpose:<br>
Music application that does various things including playlist management and music trivia<br>
<br>
Stack:<br>
React + Tailwind CSS<br>
Next<br>
MySQL<br>
Docker

## Current Status
- Registration/login system - implemented
- Profile editor/manager  - implemented
- Create playlist + display playlists - implemented
<br>
- Song search - needs implemented - need to decide if use Spotify/MusicBrainz
- Music video search - needs implemented - plan on using YouTube API
- Music Trivia - needs implemented

## Steps to locally run
1. Clone the GitHub repo using in the terminal "git clone https://github.com/kengu7272/ANN"
2. Install Docker:
<br>
Windows: https://docs.docker.com/desktop/install/linux-install/
Linux: https://docs.docker.com/desktop/install/linux-install/
https://docs.docker.com/desktop/install/mac-install/
3. Launch Docker to make sure the engine is running
4. Open the cloned project in the ann directory at /ANN/ann
4. Add a .env file with variables: SECRET_KEY, MYSQL_ROOT_PASSWORD
<br>
SECRET_KEY will be the variable that you hash and verify user passwords with
MYSQL_ROOT_PASSWORD will be the password for root of the MySql server
5. Run "docker-compose build" to build the Docker image with the files in the directory
<br>
(If build fails, delete the data directory at /ANN/ann/data and try again, not sure why it does that yet)
6. Run "docker-compose up" to launch the Docker containers
<br>
(Dev environment currently, terminal will say localhost:3000 ready when server is up)
7. Visit http://localhost:3000/ on your browser to view project locally

## Note
1. The data directory is used to persist the MySql server data as containers are not persistent
2. Nodemon integrated for live reloads during development

