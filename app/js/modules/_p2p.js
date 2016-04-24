import Peer from "simple-peer"
const peer = new Peer({
    initiator: location.hash === "init",
    trickle: false
})

peer.on('signal', data => {
    console.log(JSON.stringify(data));
})
