#What is this?
We here at Another Indie Dev Studio (AIDS for short) have decided to create a social experiment where we ask the community to make a game.

#More Explanation Please!
Here's the deal. If you head over to http://coopgamemaking.com, you will notice a very bland game (as of creation). There is nothing there but a leveling system and some useless information. We want the community to make this game into something that you would want to play. It can head in any direction the community feels it should go in. You can add graphics, some functionality or even just pitch some ideas for developers to work with. Again, it is completely up to you guys to create this game. You guys will vote on the top ideas and each week these will be added to the official game. Of course, if there is anything we feel needs to be added into, we will add it. 

#What Will This Game Run On?
The game will be made entirely with HTML, CSS, Javascript and MySQL (but we'll handle the server side stuff). 

#Who Can Participate?
This project is intended for everyone from the programming scrubs to the graphics designers to the neckbearded tryhards.

#How to Host!
You might want to host this server on your very own computer, so you can test changes you make.  If you'd like to do this, then read here!

First, clone the repository, in the terminal you'd write:

    git clone git@github.com:AnotherIndieDevStudio/Coopgamemaking-01.git

Although, if you fork the repository first, you'd replace that link with your own.

Next, you'll need some software to run the server.  On a Debian-based machine, you would run the following with root priveleges:

    sudo apt-get install nodejs npm

This will install the 'nodejs' package, which allows you to run the app.js file, and the 'npm' package, which allows you to install node modules, such as express.

Ensuring you're in the directory of the project, you can simply run this command to install the project's dependencies:

    npm install

After the dependencies are installed, you can run the server with this command (you'll need sudo to run it on a port under :1024):

    nodejs app.js

And that's it! The console should tell you what port the server is running on, and you should be able to access the game at [http://localhost](http://localhost), or at your local IP address.  If you change the port value in app.js, then the URL will be different, [http://localhost:1234](http://localhost:1234) for example.

When running the server in the terminal, use ctrl+c to stop running it, then use `nodejs app.js` whenever you want to start the server.
