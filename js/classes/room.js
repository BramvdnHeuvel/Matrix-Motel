/**
 * The Room class represents a Matrix Motel room.
 * 
 * @param {string}  roomId      Matrix Room ID
 * @param {Object}  motelObject Backlink to the object that controls this room.
 */
class Room {
    constructor(roomId, motelObject) {
        const self = this;

        self.id        = roomId;
        self.motel     = motelObject;
        self.__state   = null;
        self.__avatars = {};

        self.join();
        
        self.eventHandlers = {
            "m.room.message": function(e, s) {
                // TODO: Have avatar say something
                console.log(s + "> " + e.event.content.body);
            },
            "m.room.power_levels": function(e) {
                self.__state = e.event.content;
            },
            "com.matrixmotel.welcome": function(e, s, key) {
                if (key !== "") {
                    return;
                }
                if (e.event.content.welcome === true) {
                    return;
                } else if (e.event.content.welcome === false) {
                    // We are no longer welcome. :(
                    // We don't necessarily want to leave,
                    // however, in case our user has
                    // different sessions on this account.
                    // self.leave();
                }
            },
            "com.matrixmotel.room_shape": function(e) {
                // TODO: 
            },
            "com.matrixmotel.sprites": function(e) {
                // TODO: 
            },
            "com.matrixmotel.force_teleport": function(e) {
                // TODO: 
            },
            "com.matrixmotel.force_move": function(e) {
                // TODO: 
            },
            "com.matrixmotel.teleport": function(e) {
                // TODO: 
            },
            "com.matrixmotel.teleport": function(e) {
                // TODO: 
            },
            "com.matrixmotel.position": function(e) {
                // TODO: 
            },
            "com.matrixmotel.enter": function(e) {
                // TODO: 
            },
            "com.matrixmotel.exit": function(e) {
                // TODO: 
            },
            "com.matrixmotel.move": function(e) {
                // TODO: 
            }
        }
    }

    handleEvent(event) {
        let eventType    = event.getType();
        let eventHandler = this.eventHandlers[eventType];

        if (eventHandler !== undefined) {
            eventHandler(event);
        }
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
     * Find a user's avatar in the room. Returns `null` if the
     * avatar is not in this room.
     * 
     * Controlling a user avatar only influences your own view
     * and doesn't send any requests to the Matrix Motel server.
     * 
     * @param {string} userID 
     * 
     * @returns {Object|null}
     */
    getAvatar(userID) {
        const self = this;
        let avatar = self.__avatars[userID];

        if (avatar === undefined) {
            return null;
        }

        return avatar;
    }

    getMyAvatar() {
        const self = this;
        return self.__avatars[self.motel.userID];
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
     * Initialize a Matrix room to become a Matrix Motel room.
     */
    initMotel() {
        const self = this;
        let state  = self.permissions;

        // Admin permissions
        state.events['com.matrixmotel.welcome']          = 100;
        state.events['com.matrixmotel.room_shape']       = 100;
        state.events['com.matrixmotel.sprites']          = 100;
        
        // Moderator permissions
        state.events['com.matrixmotel.force_teleport']   =  50;
        state.events['com.matrixmotel.force_move']       =  50;
        state.events['com.matrixmotel.teleport']         =  50;
        state.events['com.matrixmotel.background']       =  50;
        state.events['com.matrixmotel.foreground']       =  50;

        // Default permissions
        state.events['com.matrixmotel.position']         =   0;
        state.events['com.matrixmotel.enter']            =   0;
        state.events['com.matrixmotel.exit']             =   0;
        state.events['com.matrixmotel.move']             =   0;
            
        self.sendState('m.room.power_levels', state,
            function() {
                console.log(
                    "Successfully built a Matrix Motel!"
                );
            }, ''
        );
        self.welcomeMotelUsers(true, 'Come join my Matrix Motel room!');
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
     * Determine whether Matrix Motel users are welcome in this room.
     * 
     * @param {boolean} welcome 
     * @param {string}  reason 
     */
    welcomeMotelUsers(welcome, reason = '') {
        this.sendState('com.matrixmotel.welcome', {
            welcome: welcome,
            reason : reason
        }, function() {
            if (welcome) {
                console.log("Matrix Motel users are now welcome in this room!");
            } else {
                console.log("Matrix Motel users are no longer welcome in this room.");
            }
        });
    }

    /**
     * Get the latest list of who has which permissions in the room.
     * 
     * @return {Object}
     */
    get permissions() {
        const self = this;
        let state  = null;

        try {
            self.getState('m.room.power_levels', function(s) {
                state = s;
            }, '');
        } catch {
            return self.__state;
        }

        if (state !== null) {
            self.__state = state;
            return state;
        }
        return self.__state;
    }
}
