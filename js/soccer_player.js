var socket = io.connect("localhost:5000");   
$("input#send_team").click(function(){

    var msg = $("#team").val(); 
    socket.emit("team", { team_name:msg }); 

});

$("input#send_national").click(function(){

    var msg = $("#national").val(); 
    socket.emit("national", { national:msg }); 

});

$("input#send_team_national").click(function(){

    var msg = $("#team_national").val(); 
    socket.emit("team_national", { team_national:msg }); 

});

socket.on("result", function(message){
    var table = $("#table");
    var tbody = $('<tbody>');

    var th = $('<tr height=20>')
        .append('<th>picture</th>')
	.append('<th>name</th>')
	.append('<th>position</th>')
	.append('<th>age</th>')
	.append('<th>height</th>')
        .append('<th>flag</th>')
	.append('<th>national</th>')
	.append('<th>area</th>')
	.append('<th>team</th>')
	.append('<th>team_national</th>')
	.append('<th>division</th>')
        .append('<th>minutes<th>');

    tbody.append(th);
    table.append(tbody);

    for(var i=0; i<message.length; i++){
	
	message[i].national = message[i].national.replace(/\s+/g,"_");
	message[i].name = message[i].name.replace(/\s+/g,"_");
	//message[i].name = decodeURI( message[i].name );

	console.log(message[i].name);

	var td = $('<tr height=30>')
	    .append('<td align=center><img src="player/' + message[i].name + '.jpg" height=60></td>')
	    .append('<td align=center>' + message[i].name + '</td>')
	    .append('<td align=center>' + message[i].position + '</td>')
	    .append('<td align=center>' + message[i].age + '</td>')
	    .append('<td align=center>' + message[i].height + '</td>')
	    .append('<td align=center><img src="img/'+message[i].national+'.png" width=35></td>')
	    .append('<td align=center>' + message[i].national + '</td>')
	    .append('<td align=center>' + message[i].area + '</td>')
	    .append('<td align=center>' + message[i].team + '</td>')
	    .append('<td align=center>' + message[i].team_national + '</td>')
	    .append('<td align=center>' + message[i].division + '</td>')
	    .append('<td align=center>' + message[i].minutes + '</td>');

	tbody.append(td);
	
	table.prepend(tbody);
    }
});
