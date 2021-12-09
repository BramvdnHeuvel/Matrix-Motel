# Matrix Motel documentation

Since Matrix Motel is open source and its protocol runs on Matrix, the documentation is completely available as well so you may build your own Matrix Motel client if you'd like. This folder hosts all files that explain how the Matrix Motel specs work.

## Custom events

These events are not in the Matrix specification, but will be used by Matrix Motel clients.

## `com.matrixmotel.welcome`

The event type `com.matrixmotel.welcome` indicates whether Matrix Motel clients are allowed to join a certain room. This state is non-binding, but it helps clarify whether Matrix Motel clients are welcome in a room.

Matrix Motel clients send a lot of Matrix Motel-related events that could be spammy for other clients. Your client should respect this state and keep users out of rooms that do not welcome Matrix Motel clients.

The state content has the key `allowed`, which can be set to either `true` or `false`.

```json
{
    "allowed": true
}
```

## `com.matrixmotel.room_shape`

The event `com.matrixmotel.room_shape` shows the size and shape of the Motel room. The Motel room shape is defined by power levels: this means that you can make certain parts of a room only accessible for moderators, or that you can make an "audience" part of the room in front of a stage with speakers.

Walls are described with power level 100 - this means that administrators will always be able to walk across the room shape through any walls, objects or obstructions if they please. Your client may choose to reject/toggle this behaviour.

Here are the keys implemented in the `com.matrixmotel.room_shape` event:

| Key | Value | Description |
|---|---|---|
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
