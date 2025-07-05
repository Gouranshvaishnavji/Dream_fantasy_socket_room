
#  Real-Time Cricket Team Selection Room

Hey there! Welcome to our cricket fantasy room app. This project is all about letting folks create a room, invite their friends, and take turns picking cricket players — all in real time. You know, kinda like those IPL auctions... but chill.  

##  What does this do?

- Create a room (you’re the big boss aka host)
- Others can join your room
- Once everyone is ready, start the selection
- Everyone gets 10 seconds per turn to pick a player
- If you’re too slow (maybe making maggi?), system will pick for you automatically
- Everyone's picks show up live to all players
- Repeat till each user has 5 players
- In the end: final teams shown. Boom.

##  Tech used

### Backend

- Node.js
- Express.js
- Socket.IO (for real-time updates)
- Redis (for temporarily storing room and player states)
- MongoDB (optional, but you can keep it minimal if you want)

### Frontend

- React (because why not)
- Socket.IO-client
- Just plain CSS (no fancy UI library, keepin' it simple)

### Why Redis?
We use Redis to store temporary data like:

Who’s in the room

Who already picked players

Current turn info

Available players list

This way, if your backend restarts or crashes, theoretically the room state can be kept alive.

### Why Redis Cloud sometimes says "Nope"?
We all know cloud services love acting moody. In our case:

Redis Cloud sometimes blocks connections if your free tier is exhausted

You might need to whitelist your IP

Your URL or password might be wrong (typos happen to the best of us)

Or maybe it just woke up on the wrong side of the server farm

So yeah… you might see errors like ECONNREFUSED 127.0.0.1:6379. That means it’s trying local Redis (default fallback), and not your cloud URL. Usually, it’s because .env is misconfigured or not read properly.

💬 Final thoughts
This project is super simple, no big brain design patterns, just easy logic and real-time fun. You can easily extend it later with fancy animations, leaderboards, and more.

Remember: If Redis doesn't vibe with you today, maybe tomorrow it will — or just shout at it politely 

**(no hard feeling and please if possible help me with this porblem before i K.O it)**.
