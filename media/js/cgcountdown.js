/**
 * CG CountDown Plugin
 * Version 2.0.1 
 * License http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * Copyright (c) 2022 ConseilGouz. All Rights Reserved.
 * Author ConseilGouz 
 * Compatible Joomla 4.x
 *
 * From http://lexxus.github.io/jq-timeTo/
 *
 * {cgcount count=<timer in seconds>|color=<theme color: black/white>|text=<button text>|msg=<a stop message>|auto=<true/false>|alert=<time left before end>|sound=<mp3 sound file>}
 * {cgcount list=<nb occurences>|interv=<list interval (default 900 = 15mn)>|color=<theme color: black/white>|text=<button text>|msg=<a stop message>|auto=<true/false>|alert=<time left before end>|sound=<mp3 sound file>}
 *
 */
var dropboxOpen = []; // from https://stackoverflow.com/questions/13856807/select-onchange-same-value

 function go_select(event,$myid,$color,$stopmsg,$auto,$fontsize,$alert,$down,$lang) {
    if (dropboxOpen[$myid]) {
		$timer = parseInt(event.target.value);
		if ($timer) go_countdown($myid,$timer,$color,$stopmsg,$auto,$fontsize,$alert,$down,$lang);
    }        
    dropboxOpen[$myid] = !dropboxOpen[$myid];

 }
 function go_countdown($myid,$timer,$color,$stopmsg,$auto,$fontsize,$alert,$down,$lang) {
	jQuery('#cgcount_btn_'+$myid).attr('title','Reset');
	jQuery('#countdown_'+$myid).show();
	jQuery('#cgstop_btn_'+$myid).show();
	jQuery('#cgpause_btn_'+$myid).val("Pause");
	jQuery('#cgpause_btn_'+$myid).show();
	jQuery('#cgpause_btn_'+$myid).removeClass('cg_hide_btn');
	jQuery('#cgstop_btn_'+$myid).removeClass('cg_hide_btn'); 
	jQuery('#cgpause_btn_'+$myid).addClass('cg_inline_btn');
	jQuery('#cgstop_btn_'+$myid).addClass('cg_inline_btn'); 
	close_dwn_popup($myid); // close popup if opened
	if ($auto == "false") {
		jQuery('#cgstop_btn_'+$myid).val('Go').addClass('cg_btn_large'); 
		jQuery('#cgpause_btn_'+$myid).removeClass('cg_inline_btn');
		jQuery('#cgpause_btn_'+$myid).addClass('cg_hide_btn');
	}
	$height = $fontsize * 1.1; // bug 
	jQuery('#countdown_'+$myid).height($height);
	$bool = false;
	if ($auto == "true") $bool = true;
	if ($down == 0) {
		$down = false;
	} else {
		$down = true;
	}
	jQuery('#countdown_'+$myid).timeTo($timer,{theme: $color,start:$bool,fontSize:$fontsize,countdownAlertLimit:$alert,countdown:$down,lang:$lang}, 
		function(){ // callback 
			if (jQuery('#cgcount_audio_'+$myid).length) {jQuery('#cgcount_audio_'+$myid)[0].play();}
			if ($stopmsg != "") {
				$text = jQuery('#cg_dwn_popuptext_'+$myid).data('init'); // don't display time one normal stop
				$text = $text.replace("/time","");
				jQuery('#cg_dwn_popuptext_'+$myid).text($text);
				jQuery('#cg_dwn_popuptext_'+$myid).addClass('cg_dwn_popup_show');
			}
			jQuery('#cgcount_btn_'+$myid).prop('disabled', false);
			jQuery('#countdown_'+$myid).hide();
			jQuery('#cgstop_btn_'+$myid).addClass('cg_hide_btn');
			jQuery('#cgpause_btn_'+$myid).addClass('cg_hide_btn');
			jQuery('#cgpause_btn_'+$myid).removeClass('cg_inline_btn');
			jQuery('#cgstop_btn_'+$myid).removeClass('cg_inline_btn'); 
		});
 }
 function close_dwn_popup($myid) {
	 jQuery('#cg_dwn_popuptext_'+$myid).removeClass('cg_dwn_popup_show')
 }
  function go_stopcountdown($myid) {
	if (jQuery('#cgstop_btn_'+$myid).val() == "Go") {
		jQuery('#cgstop_btn_'+$myid).removeClass('cg_btn_large').val("Stop");
		jQuery('#countdown_'+$myid).timeTo("resume");
		jQuery('#cgpause_btn_'+$myid).removeClass('cg_hide_btn');
		jQuery('#cgpause_btn_'+$myid).addClass('cg_inline_btn');
	} else {
		jQuery('#cgcount_btn_'+$myid).attr('title','');		
		jQuery('#countdown_'+$myid).timeTo("stop");
		$text = jQuery('#countdown_'+$myid)[0].textContent;		
		$sec = $text.substring($text.length-3,$text.length-2) + $text.substring($text.length-1,$text.length);
		$min = $text.substring($text.length-8,$text.length-7) + $text.substring($text.length-6,$text.length-5);
		$heure = $text.substring($text.length-13,$text.length-12) + $text.substring($text.length-11,$text.length-10);
		if (jQuery('#cg_dwn_popuptext_'+$myid).length) { // popup : replace /time by time
			$text = jQuery('#cg_dwn_popuptext_'+$myid).data('init');
			$text = $text.replace("/time",$heure + ":"+$min+":"+$sec);
			jQuery('#cg_dwn_popuptext_'+$myid).text($text);
			jQuery('#cg_dwn_popuptext_'+$myid).addClass('cg_dwn_popup_show');
		}
		jQuery('#cgcount_btn_'+$myid).prop('disabled', false);
		jQuery('#countdown_'+$myid).hide();
		jQuery('#cgstop_btn_'+$myid).addClass('cg_hide_btn');
		jQuery('#cgpause_btn_'+$myid).val("Pause");
		jQuery('#cgpause_btn_'+$myid).addClass('cg_hide_btn');
		jQuery('#cgpause_btn_'+$myid).removeClass('cg_inline_btn');
		jQuery('#cgstop_btn_'+$myid).removeClass('cg_inline_btn'); 
	}
  }
  function go_pausecountdown($myid) {
	if (jQuery('#cgpause_btn_'+$myid).val() == "Restart") { 
		jQuery('#countdown_'+$myid).timeTo("resume");
		jQuery('#cgpause_btn_'+$myid).val("Pause");
	} else {
		jQuery('#countdown_'+$myid).timeTo("pause");
		jQuery('#cgpause_btn_'+$myid).val("Restart");
	}
  }

