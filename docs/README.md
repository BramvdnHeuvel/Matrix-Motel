# Matrix Motel documentation

Since Matrix Motel is open source and its protocol runs on Matrix, the documentation is completely available as well so you may build your own Matrix Motel client if you'd like. This folder hosts all files that explain how the Matrix Motel specs work.

## Custom events

These events are not in the Matrix specification, but will be used by Matrix Motel clients.

## `com.matrixmotel.welcome`

The event type `com.matrixmotel.welcome` indicates whether Matrix Motel clients are allowed to join a certain room. This state is non-binding, but it helps clarify whether Matrix Motel clients are welcome in a room.

Matrix Motel clients send a lot of Matrix Motel-related events that could be spammy for other clients. Your client should respect this state and keep users out of rooms that do not welcome Matrix Motel clients.

The state content has the key `allowed`, which can be set to either `true` or `false`.

```
{
    "allowed": true
}
```

