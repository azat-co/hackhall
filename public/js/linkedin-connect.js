function onLinkedInLoad() {
	console.log('load');
     IN.Event.on(IN, "auth", onLinkedInAuth);

}
function onLinkedInAuth() {
	console.log('auth: ');
	console.log(IN);
//	IN.parse(this.$el);
    IN.API.Profile("me").result(processProfiles);

}
function linkedInLogin(){
	
}
function processProfiles(profiles) {
	console.log(profiles);
	var profile = profiles.values[0];
	profile.code = $("input[name=invite]").val();	
	profile.token = IN.ENV.auth.oauth_token;
	profile.atoken = IN.ENV.auth.anonymous_token;
	if (IN.User.isAuthorized()) {
		$('#linkedInLogin').click(function(){	
			console.log('linkedInLogin')	
			$.ajax({
				url: "/api/linkedinLogin",
				type: "POST",
				data: $.param(profile),
				xhrFields: {withCredentials:true},
				dataType: "json",
				success: function(data,status, xhr){
					window.location="/#profile";
				},
				error: function (data, status, xhr){
					console.log('error: ' +xhr);
				}
			});
		});
	}		
	else {

		$.ajax({
			url: "/api/linkedin",
			type: "POST",
			data: $.param(profile),
			dataType: "json",
			success: function(data,status, xhr){
				window.location="/#thankyou";
			},
			error: function (data, status, xhr){
				console.log('error: ' +xhr);
			}
		});		
	}
}
