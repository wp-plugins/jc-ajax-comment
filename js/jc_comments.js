jQuery(document).ready(function($){
//jQuery.noConflict();
var jc_message = ['Loading...',
'Please enter your name.',
'Please enter your email address.',
'Please enter a valid email address.',
'Please enter your comment.',
'Your comment has been added.',
'JC error!'];

var jc_url = $("#jc_url").val();
var jc_url_close = $("#jc_url_close").val();
var form, err, reply;
function jc_scripts() {
	$('#commentform').after('<div class="jc-modal"><img src="'+jc_url_close+'" id="loading" alt="close" /><div id="error" class= "error"></div></div>');
	$('#submit').after('<img src="'+jc_url+'" id="loading" alt="'+jc_message[0]+'" />');
	$('#loading').hide();
	form = $('#commentform');
	err = $('#error');
	reply = false;
}
jc_scripts();
$("#comments,#reviews").on("click",".comment-reply-link",function(){
	reply = $(this).parents('.depth-1').attr('id');
	err.empty();
});
$("#comments,#reviews").on("click","#cancel-comment-reply-link",function(){
	reply = false;
});
$("#comments,#reviews").on("submit","#commentform",function(evt){
	err.empty();
	if(form.find('#author')[0]) {
		if(form.find('#author').val() == '') {
			err.html('<span class="error">'+jc_message[1]+'</span>');
			$(".jc-modal").fadeIn();
			setTimeout(function() {$(".jc-modal").fadeOut();}, 3000);
			return false;
		}
		if(form.find('#email').val() == '') {
			err.html('<span class="error">'+jc_message[2]+'</span>');
			$(".jc-modal").fadeIn();
			setTimeout(function() {$(".jc-modal").fadeOut();}, 3000);
			return false;
		}
		var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!filter.test(form.find('#email').val())) {
			err.html('<span class="error">'+jc_message[3]+'</span>');
			$(".jc-modal").fadeIn();
			setTimeout(function() {$(".jc-modal").fadeOut();}, 3000);
			if (evt.preventDefault) {evt.preventDefault();}
			return false;
		}
	} 
	if(form.find('#comment').val() == '') {
		err.html('<span class="error">'+jc_message[4]+'</span>');
		$(".jc-modal").fadeIn();
		setTimeout(function() {$(".jc-modal").fadeOut();}, 3000);
		return false;
	}
	$(this).ajaxSubmit({
		beforeSubmit: function() {
			$('#loading').show();
			$('#submit').attr('disabled','disabled');
			}, // end beforeSubmit
			error: function(request){
				err.empty();
				var data = request.responseText.match(/<p>(.*)<\/p>/);
				err.html('<span class="error">'+ data[1] +'</span>');
				$(".jc-modal").fadeIn();
				setTimeout(function() {$(".jc-modal").fadeOut();}, 3000);
				$('#loading').hide();
				$('#submit').removeAttr("disabled");
				return false;
			}, // end error()
			success: function(data) {
				try {
				// if the comments is a reply, replace the parent comment's div with it
				// if not, append the new comment at the bottom
				var response = $("<ol>").html(data);
				if(reply != false) {
					$('#'+reply).replaceWith(response.find('#'+reply));
					$('.commentlist').after(response.find('#respond'));
					jc_scripts();
				} else {
					var ctnComment= $("#comments");
					var elBody= $("<div>"+data.replace(/[\n\r]/g, "")+"</div>");
					//$('#comments').load(''+data+'  #comments ol li');
					//elItems = $(''+data+'  #comments ol li');
					elItems = elBody.find("#comments ol li");
					title = elBody.find('#comments > h2').html();
					//alert(elItems);
					ctnComment.find("#comments-title").remove();
					ctnComment.find("ol").remove();

					var ctnListComments= $("<ol />",{"class":"commentlist comment-list"});
					ctnListComments.append(elItems);
					ctnComment.prepend(ctnListComments);
					ctnComment.prepend('<h2 id="comments-title">'+title+'</h2>');
				}
				form.find('#comment').val('');
				err.html('<span class="success">'+jc_message[5]+'</span>');
				$('#submit').removeAttr("disabled");
				$('#loading').hide();
				$(".jc-modal").fadeIn();
				setTimeout(function() {$(".jc-modal").fadeOut();}, 3000);
				$("#recaptcha_reload_btn img").click();
				$("p.stars span a").removeClass('active');
			} catch (e) {
				$('#loading').hide();
				$('#submit').removeAttr("disabled");
				alert(jc_message[6]+'\n\n'+e);
				$("#recaptcha_reload_btn img").click();
			} 
		} 
	}); 
return false; 
});
$("#comments,#reviews").on("click",".jc-modal > img",function(){
	$(".jc-modal").hide();
});
});