// drop.js © 2013 b@zi.is GPLv2 */
'use strict'

var reader = new FileReader();
reader.addEventListener("load", function(e, file) {
    var img = new Image();
    img.addEventListener("load", function() {
        var can = document.getElementById('canvas0');
        var pre = document.getElementById('canvas0p');
        console.log(can.getContext('2d'), this, this.width, can.width);
        can.getContext('2d').drawImage(
            this,
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            can.width,
            can.height
        );
        pre.getContext('2d').drawImage(
            this,
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            pre.width,
            pre.height
        );
        window.haspic = true;
    }, false);
    img.src = this.result;
});

if(window.FileReader) {
    document.addEventListener('DOMContentLoaded', function() {
        var canvas = document.getElementById('canvas0p');

        document.getElementById('canvas0p').style.display = 'inline-block';
        document.getElementById('photo').style.display = 'none';
        document.getElementById('photo').name = 'notphoto';
        document.getElementById('photo').addEventListener("change", function() {
            reader.readAsDataURL(this.files[0]);
        }, false);
        document.getElementById('canvas0p').addEventListener("click", function() {
            document.getElementById('photo').click();
        }, false);
        canvas.addEventListener("dragover", function (evt) {
            evt.preventDefault();
        }, false);
        canvas.addEventListener("drop", function (evt) {
            evt.preventDefault();
            reader.readAsDataURL(evt.dataTransfer.files[0]);
        }, false);
    }, false);
}
