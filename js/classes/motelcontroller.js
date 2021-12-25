/**
 * The MotelController class makes building a MMotel client
 * trivial in JavaScript.
 */
class MotelController {
    /**
     * Create a MotelController object.
     * 
     * The object is designed in a way that a MMotel client doesn't need
     * to care about the exact interactions with a Matrix homeserver.
     * 
     * @param {string} username 
     * @param {string} password 
     * @param {string} homeserver 
     */
    constructor(username, password, homeserver) {
        const self = this;

        self.username     = username;
        self.homeserver   = homeserver;
        self.matrixServer = homeserver;
        self.userID       = '@' + username + ':' + homeserver;
        
        fetch('https://' + homeserver + '/.well-known/matrix/client')
        .then(
            (r)=>(r.json())
        ).then(
            function(response) {
                if (response["m.homeserver"] !== undefined) {
                    let serverRoute = response["m.homeserver"].base_url;

                    if (serverRoute !== undefined) {
                        self.matrixServer = serverRoute;
                    }
                }

                console.log(self.homeserver);
                console.log(self.matrixServer);
            }
        ).then(function() {
            self.client      = window.matrixcs.createClient(self.matrixServer)
            self.login(username, password);

            self.roomManager = new RoomManager(self);
        });
        
    }

    /**
     * Join a room.
     * 
     * This function can also be run in the background,
     * as it does not overwrite which room the avatar is in.
     * 
     * @return {Object}
     */
    joinRoom(roomId) {
        return this.roomManager.getRoom(roomId);
    }

    /**
     * Enter a room. The controller 
     * 
     * @param {string} roomId 
     */
    enterRoom(roomId) {
        let room = this.roomManager.getRoom(roomId);
        room.enter();
    }

    /**
     * Log the user in to their Matrix account.
     * 
     * @param {string} username 
     * @param {string} password 
     */
    login(username, password) {
        const self = this;
        self.client.loginWithPassword(username, password).then(
            function(callback) {
                console.log("Successfully logged in as user " + username);
                self.client.startClient({initialSyncLimit: 10});
            }
        );
    }

    /**
     * Set up listeners that respond to incoming timeline feeds.
     * 
     * This function is run after the client has successfully logged in.
     */
    setUpListeners() {
        client.on("Room.timeline", function(event, room, toStartOfTimeline) {
            // Received message
            if (event.getType() === "m.room.message") {
                console.log(event);
                console.log(event.event.content.body);
            }

        });
    }
}