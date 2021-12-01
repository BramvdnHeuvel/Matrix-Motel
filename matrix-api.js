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

        self.client     = window.matrixcs.createClient(homeserver)
        this.login(username, password);

        self.username   = username;
        self.homeserver = homeserver;
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
        const self = this;

        return new Room(roomId, self);
    }

    /**
     * Enter a room. The controller 
     * 
     * @param {string} roomId 
     */
    enterRoom(roomId) {}

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

/**
 * The Room class represents a 
 * 
 * @param {string}  roomId      Matrix Room ID
 * @param {Object}  motelObject Backlink to the object that controls this room.
 */
class Room {
    constructor(roomId, motelObject) {
        const self = this;

        self.id      = roomId;
        self.motel   = motelObject;
        self.__state = null;

        self.join();
    }

    /**
     * Have your avatar enter the room.
     * 
     * @param {number} position_x
     * @param {number} position_y
     */
    enter(position_x, position_y) {
        // Make sure that the user has already joined the room.
        // If so,  this should do nothing.
        // If not, this should raise an error.
        this.join();

        this.sendEvent('com.matrixmotel.enter', {
            position: {x: position_x, y: position_y}
        });
    }

    /**
     * Have your avatar exit the room.
     * 
     * You can set a method to exit the room.
     * 
     * @param {string}              leave_method    Can be `disappear` or `walk-out`.
     * @param {Object={x:0, y:0}}   position        Position of where to leave the room.
     */
    exit(leave_method, position = {x: 0, y: 0}) {
        if (leave_method == 'disappear') {
            this.sendEvent('com.matrixmotel.exit', {
                leave_method: 'disappear'
            });
        } else if (leave_method == 'walk-out') {
            this.sendEvent('com.matrixmotel.exit', {
                leave_method: 'walk-out',
                position: position
            });
        }
    }

    /**
     * Get a room's current state.
     * 
     * @param {string}   stateName 
     * @param {function} callback 
     * @param {string}   stateKey
     */
    getState(stateName, callback, stateKey = '') {
        const self = this;

        self.motel.client.getStateEvent(self.id, 
                                        stateName, 
                                        stateKey).then(
            callback
        );
    }


    /**
     * Join a room.
     * 
     * You can join a room without adding your avatar
     * to that room. Joining a room can also mean adding
     * it to your curated list of rooms.
     */
    join() {
        this.motel.client.joinRoom(this.id);
    }

    /**
     * Leave the room.
     * 
     * Leaving the room means that you can only enter the room again
     * if you're invited, if the room's public and you're not banned,
     * or if you knock and you're allowed in.
     */
    leave() {}

    /**
     * Send an event to the room.
     * 
     * @param {string} eventType 
     * @param {Object} content 
     * @returns {Promise}
     */
    sendEvent(eventType, content) {
        return this.motel.client.sendEvent(this.id, eventType, content);
    }

    /**
     * Send a state event to the room.
     * 
     * @param {string}   stateName 
     * @param {Object}   value 
     * @param {function} callback 
     * @param {string}   stateKey
     */
    sendState(stateName, value, callback, stateKey = '') {
        const self = this;

        self.motel.client.sendStateEvent(self.id,
                                         stateName,
                                         value,
                                         stateKey
        ).then(callback);
    }

    /**
     * Get the latest list of who has which permissions in the room.
     * 
     * @return {Object}
     */
    get permissions() {
        const self = this;
        let state  = null;

        self.getState('m.room.power_levels', function(s) {
            state = s;
        }, '');

        if (state !== null) {
            self.__state = state;
            return state;
        }
        return self.__state;
    }
}

/**
 * Initialize a Matrix room to become a Motel room.
 * 
 * @param {string} roomId 
 */
function initMotelRoom(roomId) {
    client.getStateEvent(roomId, 'm.room.power_levels', '').then(
        function(state) {
            
            // Admin permissions
            state.events['com.matrixmotel.welcome']          = 100;
            state.events['com.matrixmotel.room_shape']       = 100;

            // Moderator permissions
            state.events['com.matrixmotel.force_teleport']   =  50;
            state.events['com.matrixmotel.force_move']       =  50;
            state.events['com.matrixmotel.furniture']        =  50;
            state.events['com.matrixmotel.teleport']         =  50;

            // Default permissions
            state.events['com.matrixmotel.enter']            =   0;
            state.events['com.matrixmotel.exit']             =   0;
            state.events['com.matrixmotel.move']             =   0;

            client.sendStateEvent(roomId, 'm.room.power_levels', state, '').then(
                function(callback) {
                    console.log("Successfully initalized room " + roomId);
                }
            );
        }
    ).catch(function(err) {
        console.log("Failed to initialize room " + roomId + " - " + err);
    });
}

function initImageLoader(preloader) {
    preloader.setBaseURL(HOMESERVER);
}

function loadMatrixImage(preloader, name, mxid) {
    preloader.image({ 
        key: name,
        url: '_matrix/media/r0/download/' + mxid.split('mxc://')[1]
    });
}

function switchToRoom(roomId) {
    if (currentRoom !== '') {
        leaveRoom(currentRoom);
    }
    enterRoom(roomId);
    currentRoom = roomId;
}

function enterRoom(roomId, callback) {
    client.joinRoom(roomId).then(function() {
        console.log("Joined the room!");
    }).catch(function(err) {
        console.log("Could not join the room.");
    });
}

function leaveRoom(roomId) {
    client.leaveRoomChain(roomId, false).then(function() {
        console.log("Left the room!");

        currentRoom = '';
    });
}

function walkToPosition(x, y) {
    
}

function login(username, password) {
    client.loginWithPassword(username, password).then(function(callback) {
        console.log("Successfully logged in as user " + username);
        client.startClient({initialSyncLimit: 10});
        
        client.on("Room.timeline", function(event, room, toStartOfTimeline) {
        
            // Received message
            if (event.getType() === "m.room.message") {
                console.log(event);
                console.log(event.event.content.body);
            }
        
        });
    });
}

const user = new MotelController("username", "password", "https://your.homeserver.on.matrix");
