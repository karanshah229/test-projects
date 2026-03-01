const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1864147",
  key: "e1236d30963478e70e56",
  secret: "3572b599320ac7699aa1",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  "event_name": "my-event",
  "data": {
    "message": "hello world"
  }
});

