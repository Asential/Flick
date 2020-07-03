
document.addEventListener('DOMContentLoaded', () => {
	
	$('body').on('click', '.delete', function(){
		console.log("DELETE FUNCTION")
		socket.emit('message id',$('#currentChannelID').html());
		var $this = $(this);
		var t = $this.text();
		$this.html(t.replace('&lt','<').replace('&gt', '>'));
		socket.emit('delete message', t)
	});

	// Connect to websocket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	window.localStorage
	var currentUser;
	var currentChannel;
	var currentMessage;
	
	// When connected, configure buttons
	
		
	socket.on('connect', () => {
		
		currentUser = $("#user").first().text();
		console.log(currentUser);
		$('#scrolltobottomButton').on('click', function(){
			$('#messages').scrollTop(50000);
		});
		$("#channelButton").on('submit click',function(e){
			e.preventDefault();
			socket.emit('channel', $('#myChannel').val());
			$('#myChannel').val('');
		});
		$("#messageButton").on('submit click',function(e){
			if ($('#myMessage').val() == ''){
				e.preventDefault();
				// alert("Messaege can't be empty!")
			}
				
			else{
				e.preventDefault();
				socket.emit('message id',$('#currentChannelID').html());
				socket.emit('message', $('#myMessage').val());
			}
			$('#myMessage').val('');
		});
		if (localStorage.getItem("channelid")) {
			window.location.replace(`/channels/${localStorage.getItem("channelid")}`);
		}
		
	});

	socket.on('current user', data => {
		currentUser = data
	})

	socket.on('message channel', data => {
		currentMessage = data
	})

	currentChannel = $('#currentChannelID').html();

	// When a new vote is announced, add to the unordered list
	socket.on('change list', data => {
		var str = '';
		console.log(currentChannel)
		for(let i in data){
			if(i == currentChannel){
				str += '<a href="/channels/'+ i + '"class="hvr-bubble-float-right lnk">'+
				'<li class="list-group-item chatspace mrgn activechannel">' + data[i] + '</li>' + 
				'</a>'
			}
			else{
				str += '<a href="/channels/'+ i + '"class="hvr-bubble-float-right lnk">'+
				'<li class="list-group-item chatspace mrgn" style="color: black">' + data[i] + '</li>' + 
				'</a>'
			}
			
		}
		$("#channels").html(str);
		location.reload(true);
	});
		socket.on('message list', data => {
			console.log(currentMessage)
			console.log(currentChannel)
			if(currentChannel == currentMessage){
				var obj = JSON.parse(data);
			var str = ''	
			for(i in obj){
				if(obj[i].user == currentUser){
					str += '<div class="container chatspace">' + 
					'<div class="row">' + 
					'<div class="col-7" style="width: 66.66%;">' + 
					'</div>' +
					'<li class="list-group-item col-5 usermsg" style="width: 33.33%;">' + 
					'<span id="sent" style="float: right;">' + obj[i].user + '</span>' + '<br>' + 
					'<span style="float: left; padding-left: 15px; line-height: 2;">' + obj[i].content  + '</span>' + '<br><br>' + 
					'<div class="col-12 timestampSent">' + obj[i].time + '</div>' + 
					'<div style="float: right;">' + 
					'<button class="delete" style="padding: 5px; background: red">' + 
					'<p style="display: none;">' + obj[i].user + obj[i].content + obj[i].time + 
					'</p>' + 
					'</button>' + 
					'</div>' +
					'</li>' + 
					'</div>' + 
					'</div>'
				}
				else{
					str += '<div class="container chatspace">' + 
					'<div class="row">' + 
					'<li class="list-group-item col-5 sendermsg" style="width: 33.33%;">' + 
					'<span id="recieved">' + obj[i].user + '</span>' + '<br>' + 
					'<span style="line-height: 2;">' + obj[i].content  + '</span>'+ '<br><br>' + 
					'<div class="col-12 timestampRecieved">' + obj[i].time + '</div>' + 
					'</li>' + 
					'<div class="col-7" style="width: 66.66%;">' + 
					'</div>' +
					'</div>' +
					'</div>'
				}
			}
			$("#messages").html(str);
			$('#messages').scrollTop(50000);
			}
		});

		
		socket.on('scroll bottom', data =>{
			$('#messages').scrollTop(50000);
		})
	
		
		// function offset(el) {
		// 	var rect = el.getBoundingClientRect(),
		// 	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		// 	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		// 	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
		// }
	
		
		
		// function scrollChannel{
		// 	var div = document.querySelector('.activechannel');
		// 	var divOffset = offset(div);
		// 	console.log(divOffset.left, divOffset.top);
		// 	$('#channels').scrollTop(divOffset.top);
		// }
	
});
                                         
                                   
                                
                                    
                                       
                                       
                                        
                                            