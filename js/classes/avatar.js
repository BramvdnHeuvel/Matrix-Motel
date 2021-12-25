/**
 * The avatar represents a character controlled by a Matrix Motel user.
 * 
 * @param {string} userID   Matrix user id
 * @param {Object} room     Matrix Motel room object
 */
class Avatar {
    constructor(userID, room) {
        const self = this;

        self.id = userID;
        self.room = room;
    }

    
}