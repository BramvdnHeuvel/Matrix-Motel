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

## `com.matrixmotel.move`

The event type `com.matrixmotel.move` updates the location of an avatar with a specified route. The route must start with the starting position and end with the final position of the user.

To validate a route, all tiles described in the path must be adjacent to each other horizontally or vertically, **not** diagonally.

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

## `com.matrixmotel.room_shape`

## `com.matrixmotel.sprites`
