/** browser dependent definition are aligned to one and the same standard name **/
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

var socket = io.connect('10.24.0.134');
var localVideo = document.getElementById('localVideo'),
    remoteVideo = document.getElementById('remoteVideo'),
    videoCallButton = document.getElementById('videoCallButton'),
    endCallButton = document.getElementById('endCallButton');

videoCallButton.addEventListener("click", function (ev) {
    startRTC(true)
});
endCallButton.addEventListener("click", function (evt) {
    socket.emit('message', {closeConnection: true});
    endCall();
});

socket.on('message', function (data) {
    handleMessage(data);
});

startLocalVideo();

function startLocalVideo() {

    var constraints = {
        audio: true,
        video: true
    };
    navigator.getUserMedia(constraints, handleLocalStream, handleError);//.then(handleLocalStream).catch(handleError)
}

function handleLocalStream(stream) {
    localVideo.srcObject = stream;
    localStream = stream;
    videoCallButton.removeAttribute("disabled");
}

function handleError(error) {
    console.log(error);
}

var peerConn = null;
var localStream;

function startRTC(isCaller) {
    var peerConnectionConfig = {
        'iceServers': [
            {'urls': 'stun:stun.stunprotocol.org:3478'},
            {'urls': 'stun:stun.l.google.com:19302'}
        ]
    };

    peerConn = new RTCPeerConnection(peerConnectionConfig);
    peerConn.onicecandidate = onIceCandidateHandler;
    peerConn.ontrack = function (evt) {
        remoteVideo.srcObject = evt.streams[0];
        videoCallButton.setAttribute("disabled", 'true');
        endCallButton.removeAttribute("disabled");
    };
    peerConn.addStream(localStream);
    if (isCaller)
        peerConn.createOffer().then(setLocalDescription).catch(handleError)
}

function handleMessage(data) {

    if (!peerConn) startRTC();

    if (data.sdp) {
        console.log("Received SDP from remote peer.");

        peerConn.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(function (value) {
            if (data.sdp.type === 'offer')
                peerConn.createAnswer().then(setLocalDescription).catch(handleError);
        })
    }
    else if (data.candidate) {
        console.log("Received ICECandidate from remote peer.");
        peerConn.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
    else if (data.closeConnection) {
        console.log("Received 'close call' signal from remote peer.");
        endCall();
    }
}

function setLocalDescription(description) {
    peerConn.setLocalDescription(new RTCSessionDescription(description)).then(function (value) {
        // send the offer to a server to be forwarded to the other peer
        socket.emit('message', {sdp: description});
    }).catch(handleError)
}

function onIceCandidateHandler(evt) {
    if (evt && evt.candidate)
        socket.emit('message', {candidate: evt.candidate});
}

function endCall() {
    peerConn.close();
    peerConn = null;
    videoCallButton.removeAttribute("disabled");
    endCallButton.setAttribute("disabled", 'true');
    if (remoteVideo) remoteVideo.src = "";
}