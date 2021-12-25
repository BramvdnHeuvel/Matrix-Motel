class RoomManager {
    constructor(motelController) {
        const self = this;

        self.controller = motelController;
        self.rooms = {
//          "!example:matrix.org" : <Room object for !example:matrix.org>
        };

        self.controller.client.on("Room.timeline", function(event, room,
                                                            toStartOfTimeline)
            {
                const self = this;
                console.log(event);

                if (event.event.room_id === undefined) {
                    return;
                }

                let roomID = event.getRoomId();
                console.log(self);
                if (self.rooms[roomID] === undefined) {
                    return;
                }

                let sender = event.getSender();
                let key    = event.getStateKey();
                self.rooms[roomID].handleEvent(event, sender, key);
            }
        );
    }

    /**
     * Get a room. If it has already been cached,
     * get the existing room. Otherwise, create a new one.
     * 
     * Rooms are cached so that their timeline listeners can keep listening.
     * 
     * @param {string} roomID 
     */
    getRoom(roomID) {
        const self = this;
        let room   = self.rooms[roomID];

        if (room === undefined) {
            self.rooms[roomID] = room = new Room(roomID, self.controller);
        }

        return room;
    }
}