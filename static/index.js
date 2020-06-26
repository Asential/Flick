$(document).ready(function() {

	var socket=io.connect(location.protocol+'//'+document.domain+':'+location.port);
	myStorage = window.localStorage;
	socket.on('connect', function() {
		// socket.send(person + ' has connected!');
		// document.querySelectorAll('button').forEach(button => {
            // button.onclick = () => {
        //         const selection = button.dataset.vote;
        //         socket.emit('submit vote', {'selection': selection});
        //     };
        // });
		$('#sendbutton').on('click', function() {
			if ($('#myMessage').val() == "" ){
					return
			}
			socket.emit('message', $('#myMessage').val());
			$('#myMessage').val('');
		});
	});

    socket.on('channel', data => {
		console.log(data)
		// document.querySelector('#messages').innerHTML = data.general;
		let str = "<ul>" 

		for(let i = 0; i < data.general.length; i++){
			str += "<li>" + data.general[i] + "</li>"
		}
		str += "</ul>"
		document.querySelector('#messages').innerHTML = str
    });

});
