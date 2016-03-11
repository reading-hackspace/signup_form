// webcam.js © 2013 b@zi.is GPLv2 */
'use strict'

window.haspic = false;

if(!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
}

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('form').addEventListener("submit", addimg, true);
	if(navigator.getUserMedia) {
	        navigator.getUserMedia(
	            {video: true, audio: false}, 
	            function(localMediaStream) {
	                var but = document.getElementById("snapbut");
	                but.style.display = 'inline';
	                but.addEventListener("mouseover", snap_preview, false);
	                but.addEventListener("focus", snap_preview, false);
	                but.addEventListener("mouseout", snap_nopreview, false);
	                but.addEventListener("blur", snap_nopreview, false);
	                but.addEventListener("click", snap, false);
	                document.getElementById('video').src = window.URL.createObjectURL(localMediaStream);
	                document.getElementById('canvas0p').style.display = 'inline-block';
	            },
	            function(err) {}
	        );
	}
   }, false);

function dataURItoBlob(dataURI) {
    var byteString, mimestring;

    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = decodeURI(dataURI.split(',')[1])
    }
    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimestring});
}

function snap_preview() {
    document.getElementById('video').style.display = 'inline-block';
    document.getElementById('canvas0p').style.display = 'none';
}
function snap_nopreview() {
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvas0p').style.display = 'inline-block';
}

function snap() {
    var can = document.getElementById('canvas0');
    var pre = document.getElementById('canvas0p');
    var vid = document.getElementById('video');
    can.getContext('2d').drawImage(
        vid, 
        0,
        0,
        vid.videoWidth,
        vid.videoHeight,
        0,
        0,
        can.width,
        can.height
    );
    pre.getContext('2d').drawImage(
        vid, 
        0,
        0,
        can.width,
        can.height,
        0,
        0,
        pre.width,
        pre.height
    );
    snap_nopreview();
    window.haspic = true;
    return false;
}

function addimg(e) {
    e.preventDefault();    
    if(!window.haspic) {
        alert("Please include a photo.");
        return false;
    }
    var can = document.getElementById('canvas0');
    var formdata = new FormData(document.forms[0]);
    formdata.append('photo', dataURItoBlob(can.toDataURL('image/jpeg', 0.8)));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", document.forms[0].action, true);
    xhr.onload = function(oEvent) {
        if (xhr.status == 200) {
            alert("Thank you.");
            location.reload(); 
        } else {
            alert("Submit failed, please try again!");
        }
    };
    xhr.send(formdata);
    return false;
}
