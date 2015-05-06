// Setitng Up AJAX
var xmlhttp;
var id_displayed = false;
var userID;

function getObject(){
	
	// Handle all modern browsers 
	if(window.XMLHttpRequest){
		//IE7+, Firefox, Chrome, Opera and Safari
		xmlhttp = new XMLHttpRequest();	
	}else{
		//IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}	
}

/* Save game function will grab all stats in game currently and save them with an Unique ID */
function saveGame(){
	
	//Calling the object depending on browser
	getObject();
	
	// Checks for state change and then transmits data to needed places within HTML document
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
			if(xmlhttp.status == 200){
				var userID = xmlhttp.responseText;
				$("#load_id").val(userID);
				$("#id-text").html("Save ID: " + userID);
				$("#id-display").show(1000);
				id_displaed = true;
			}
		}
	}
	
	// Generates UID in javascript first just for keks if one doesn't already exist. Else, update save.
	var need_save_ID = true
	if(!userID){
		userID = create_UUID();	
	}else{
		var need_save_ID = false;
	}
	
	// Retrieving information from PHP file
	xmlhttp.open("GET", "savegame.php?id=" + userID + "&level=" + level + "&exp=" +  experience + "&exp_tnl=" + experience_tnl + "&health=" + health + "&strength=" + strength + "&dex=" + dexterity + "&intellect=" + intellect + "&statpoints=" + stat_points + "&maxstatpoints=" + max_stat_points + "&need_id=" + need_save_ID, true);
	xmlhttp.send();
}

/* Load Game function will load stats based on UID */
function loadGame(){
	
	//Calling the object depending on browser
	getObject();
	
	// Checks for state change and then transmits data to needed places within HTML document
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4){
			if(xmlhttp.status == 200){
				$("#update_variables").html(xmlhttp.responseText);
				$("#load_id").val(userID);
				$("#id-text").html("Save ID: " + userID);
				$("#id-display").show(1000);
				id_displaed = true;
			}
		}
	}
	
	var load_id = $("#load-input").val();
	
	// Retrieving information from PHP file
	xmlhttp.open("GET", "loadgame.php?id=" + load_id, true);
	xmlhttp.send();
}

/* Creates a Unique User ID. NOT MY CODE - FOUND ON STACKOVERFLOW A LONG TIME AGO */
var create_UUID = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/* Checks if the buttons that control the game were pressed */

// If save game is pressed, hide the button for a period of time to prevent spamming (If it is abused, it will be taken away)
$("#save-button").click(function(){
	$("#save-button").hide(500);
	setTimeout(function(){
		$("#save-button").show(500);
	}, 5000);
	saveGame();
});

$("#load-button").click(function(){
	$('#load-box').show(500);	
});

$("#submit-load").click(function(){
	loadGame();
});

$("#toggle-id").click(function(){
	$("#id-text").toggle();
	
});