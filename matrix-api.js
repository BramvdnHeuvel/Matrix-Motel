



/**
 * Initialize a Matrix room to become a Motel room.
 * 
 * @param {string} roomId 
 */
function initMotelRoom(roomId) {
    client.getStateEvent(roomId, 'm.room.power_levels', '').then(
        function(state) {
            
            // Admin permissions
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

function leaveRoom(roomId) {
    client.leaveRoomChain(roomId, false).then(function() {
        console.log("Left the room!");

        currentRoom = '';
    });
}
