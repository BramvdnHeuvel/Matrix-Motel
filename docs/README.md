# Matrix Motel documentation

Since Matrix Motel is open source and its protocol runs on Matrix, the documentation is completely available as well so you may build your own Matrix Motel client if you'd like. This folder hosts all files that explain how the Matrix Motel specs work.

## Custom events

These events are not in the Matrix specification, but will be used by Matrix Motel clients.

## `com.matrixmotel.enter`

The event `com.matrixmotel.enter` indicates when a user visibly enters the room.

| Key | Value | Description |
|---|---|---|
| position | Dictionary containing keys `row` and `column` | Indicate where the avatar joins the room. The dictionary is based on the `starters` key in the `com.matrixmotel.room_shape` state. If no such `starters` are given, any position within bounds is acceptable. |

```json
{
    "manner": "com.matrixmotel.enter.appear",
    "position": {
        "row": 15,
        "column": 10
    }
}
```

## `com.matrixmotel.exit`

The event `com.matrixmotel.exit` indicates when a user exits the room. This event allows the user to "leave" a room whilst remaining able to rejoin a room without an invite or a knock.

There are several methods of exiting a room - and the methods are separately classified. The Matrix Motel offers a few premade ones, but there is room for more ways of leaving a room.

| Key | Value | Description |
|-----|-------|-------------|

```json
{
    "manner": "com.matrixmotel.exit.walk_out",
    "position": {
        "row": 10,
        "column": 5
    }
}
```

## `com.matrixmotel.force_move`

## `com.matrixmotel.force_teleport`

The event type `com.matrixmotel.force_teleport` lets users teleport other users' avatars. This event is usually reserved for moderators of a room and is meant to move other users to a spot that they otherwise cannot reach using the `com.matrixmotel.move` event.

|  Key   |  Value  |         Description          |
|--------|---------|------------------------------|
| target | MXID    | Which user to teleport.      |
|  row   | Integer | Which row to teleport to.    |
| column | Integer | Which column to teleport to. |

```json
{
    "target": "@alice:example.com",
    "row": 10,
    "column": 5
}
```

## `com.matrixmotel.move`

The event type `com.matrixmotel.move` updates the location of an avatar with a specified route. The route must start with the starting position and end with the final position of the user.

To validate a route, two checks must be made:

1. The user's permission level must be at least as high as the permission level of every tile on the path as defined in `com.matrixmotel.room_shape`.
2. The user must be able to reach the starting position from a starting location as defined in `com.matrixmotel.room_shape`. This means that there must either be no defined `starter` key, or the user must've theoretically been allowed to walk to its starting position before this event.

|  Key   |  Value  |         Description          |
|--------|---------|------------------------------|
|  path  |  List   | List of tiles to walk on.    |

```json
{
    "path": [
        {"row":  8, "column": 7},
        {"row":  8, "column": 6},
        {"row":  9, "column": 6},
        {"row": 10, "column": 6},
        {"row": 10, "column": 5}
    ]
}
```

## `com.matrixmotel.position`

## `com.matrixmotel.room_shape`

The event `com.matrixmotel.room_shape` shows the size and shape of the Motel room. The Motel room shape is defined by power levels: this means that you can make certain parts of a room only accessible for moderators, or that you can make an "audience" part of the room in front of a stage with speakers.

Walls are described with power level 100 - this means that administrators will always be able to walk across the room shape through any walls, objects or obstructions if they please. Your client may choose to reject/toggle this behaviour.

Here are the keys implemented in the `com.matrixmotel.room_shape` event:

| Key | Value | Description |
|-----|-------|-------------|
| shape | Dictionary containing keys `rows` and `columns` | Determines the size of the room. `rows` and `columns` both contain a positive integer. |
| plan _(Optional)_ | Array containing arrays with integers | Determines the minimal power level of stepping on any given tile in the room.  If the `plan` key is not given or it is empty, then one may assume that every position may be stepped on by all users. |
| starters _(Optional)_ | Array containing dictionaries of starting positions | Each dictionary describes where the user may set their position when they send the `com.matrixmotel.enter` event. `row` and `column` describe the position. The `power_level` key is optional, but when present describes the minimum power level needed to accept this starting position. If the `starters` key is not given or it is empty, then anyone may enter the room on any position that they have the requirement level for. |

```json
{
    "shape": {
        "rows": 4,
        "columns": 6
    },
    "plan": [
        [  0,  0,  0, 50, 50, 50],
        [  0,  0,  0,100, 50, 50],
        [  0,100,100,100, 50,100],
        [  0,100,  0,100, 50,100]
    ],
    "starters": [
        {"row": 0, "column": 0},
        {"row": 3, "column": 2, "power_level": 10}
        {"row": 3, "column": 4, "power_level": 50}
    ]
}
```

## `com.matrixmotel.sprites`

## `com.matrixmotel.teleport`

The event type `com.matrixmotel.teleport` updates the location of an avatar without specifying a route. This event is usually reserved for moderators of a room.

|  Key   |  Value  |         Description          |
|--------|---------|------------------------------|
|  row   | Integer | Which row to teleport to.    |
| column | Integer | Which column to teleport to. |

```json
{
    "row": 10,
    "column": 5
}
```
