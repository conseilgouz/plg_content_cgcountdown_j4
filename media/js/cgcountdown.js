/**
 * CG CountDown Plugin
 * Version 2.0.1 
 * License http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * Copyright (c) 2022 ConseilGouz. All Rights Reserved.
 * Author ConseilGouz 
 * Compatible Joomla 4.x
 *
 * From https://github.com/Lexxus/fancy-timer
 *
 * {cgcount count=<timer in seconds>|color=<theme color: black/white>|text=<button text>|msg=<a stop message>|auto=<true/false>|alert=<time left before end>|sound=<mp3 sound file>}
 * {cgcount list=<nb occurences>|interv=<list interval (default 900 = 15mn)>|color=<theme color: black/white>|text=<button text>|msg=<a stop message>|auto=<true/false>|alert=<time left before end>|sound=<mp3 sound file>}
 *
 */
var dropboxOpen = []; // from https://stackoverflow.com/questions/13856807/select-onchange-same-value
var cnt_btn=[], cnt=[], cnt_stop=[], cnt_pause=[],cnt_popup_text=[],cnt_fancy=[],direction=[],cnt_stop_msg=[];
 function go_select(event,$myid,$color,$stopmsg,$auto,$fontsize,$alert,$down,$lang) {
    if (dropboxOpen[$myid]) {
		$timer = parseInt(event.target.value);
		if ($timer) go_countdown($myid,$timer,$color,$stopmsg,$auto,$fontsize,$alert,$down,$lang);
    }        
    dropboxOpen[$myid] = !dropboxOpen[$myid];

 }
 function go_countdown($myid,$timer,$color,$stopmsg,$auto,$fontsize,$alert,$down,$lang) {
	cnt_btn[$myid] = document.getElementById('cgcount_btn_'+$myid),
	cnt[$myid] = document.getElementById('countdown_'+$myid);
	cnt_stop[$myid] = document.getElementById('cgstop_btn_'+$myid);
	cnt_pause[$myid] = document.getElementById('cgpause_btn_'+$myid);
	cnt_popup_text[$myid] = document.getElementById('cg_dwn_popuptext_'+$myid);
	cnt_stop_msg[$myid] = $stopmsg;
	cnt[$myid].style.visibility = "visible";
	if (cnt_btn[$myid])
		cnt_btn[$myid].title = 'Reset';
	if (cnt_pause[$myid]) {
		cnt_pause[$myid].value = "Pause";
		cnt_pause[$myid].style.visibility = "visible";
		cnt_pause[$myid].classList.remove('cg_hide_btn');
		cnt_pause[$myid].classList.add('cg_inline_btn');
	}
	if (cnt_stop[$myid]) {
		cnt_stop[$myid].style.visibility = "visible";
		cnt_stop[$myid].classList.remove('cg_hide_btn'); 
		cnt_stop[$myid].classList.add('cg_inline_btn'); 
	}
	close_dwn_popup($myid); // close popup if opened
	if ($auto == "false") {
		cnt_stop[$myid].value = 'Go',cnt_stop[$myid].classList.add('cg_btn_large'); 
		cnt_pause[$myid].classList.remove('cg_inline_btn');
		cnt_pause[$myid].classList.add('cg_hide_btn');
	}
	$height = $fontsize * 1.1; // bug 
	cnt[$myid].offsetHeight = $height;
	if ($down == 0) {
		direction[$myid] = 1;
	} else {
		direction[$myid] = -1;
	}
	$showdays = ""
	$start = $timer;
	$max = 0;
	if ($timer && typeof $timer === 'object') { // date entered
		$showdays = 3; 
	} else { // time entered
		if (direction[$myid] == 1) {
			$start = 0;
			if ($timer) $max = $timer;
		}
	}
    var fancy_options = {
        value: $start,
		max : $max,
        warn: {
          secondsLeft: $alert
        },
		showDays: $showdays,
		lang : $lang,
        onFinish: function () {
			sound = document.getElementById('cgcount_audio_'+$myid);
			if (sound) {sound.play();}
			if (cnt_stop_msg[$myid] != "" && cnt_popup_text[$myid]) {
				$text = cnt_popup_text[$myid].getAttribute('data-init'); // don't display time on 'normal' stop
				$text = $text.replace("/time","");
				cnt_popup_text[$myid].innerHTML = $text;
				cnt_popup_text[$myid].classList.add('cg_dwn_popup_show');
			}
			if (cnt_btn[$myid]) cnt_btn[$myid].disabled = false;
			cnt[$myid].style.visibility = "hidden";
			if (cnt_pause[$myid]) {
				cnt_pause[$myid].classList.add('cg_hide_btn');
				cnt_pause[$myid].classList.remove('cg_inline_btn');
			}
			if (cnt_stop[$myid]) {	
				cnt_stop[$myid].classList.add('cg_hide_btn');
				cnt_stop[$myid].classList.remove('cg_inline_btn'); 
				cnt_stop[$myid].value = 'Go';
			}
        }
    };
	cnt_fancy[$myid] = new FancyTimer(cnt[$myid],fancy_options);
	cnt[$myid].style.visibility = "visible";
	if ($auto == "true") {
		if (cnt_stop[$myid]) cnt_stop[$myid].value = "Stop";
		cnt_fancy[$myid].start(direction[$myid]);
	}
 }
 function close_dwn_popup($myid) {
	cnt_popup_text[$myid] = document.getElementById('cg_dwn_popuptext_'+$myid);
	 if (cnt_popup_text[$myid])
		cnt_popup_text[$myid].classList.remove('cg_dwn_popup_show')
 }
  function go_stopcountdown($myid) {
	if (cnt_stop[$myid].value == "Go") {
		cnt_stop[$myid].classList.remove('cg_btn_large'), cnt_stop[$myid].value = "Stop";
		cnt_fancy[$myid].start(direction[$myid]);
		cnt_pause[$myid].classList.remove('cg_hide_btn');
		cnt_pause[$myid].classList.add('cg_inline_btn');
	} else {
		if (cnt_btn[$myid]) cnt_btn[$myid].title = '';		
		cnt_fancy[$myid].stop();
		$text = cnt[$myid].textContent;	
		$text = $text.replace(/[^0-9]+/g, ""); // remove alpha char.
		$sec = $text.substring($text.length-3,$text.length-2) + $text.substring($text.length-1,$text.length);
		$min = $text.substring($text.length-8,$text.length-7) + $text.substring($text.length-6,$text.length-5);
		$heure = $text.substring($text.length-13,$text.length-12) + $text.substring($text.length-11,$text.length-10);
		if (cnt_popup_text[$myid] && cnt_popup_text[$myid].textContent) { // popup : replace /time by time
			$text = cnt_popup_text[$myid].textContent;
			$text = $text.replace("/time",$heure + ":"+$min+":"+$sec);
			cnt_popup_text[$myid].innerHTML = $text;
			cnt_popup_text[$myid].classList.add('cg_dwn_popup_show');
		}
		if (cnt_btn[$myid]) cnt_btn[$myid].disabled = false;
		cnt[$myid].style.visibility = "hidden";
		cnt_stop[$myid].classList.add('cg_hide_btn');
		cnt_stop[$myid].classList.remove('cg_inline_btn'); 
		if (cnt_pause[$myid]) {
			cnt_pause[$myid].value = "Pause";
			cnt_pause[$myid].classList.add('cg_hide_btn');
			cnt_pause[$myid].classList.remove('cg_inline_btn');
		}
	}
  }
  function go_pausecountdown($myid) {
	if (cnt_pause[$myid].value == "Restart") { 
		cnt_fancy[$myid].start(direction[$myid]);
		cnt_pause[$myid].value = "Pause";
	} else {
		cnt_fancy[$myid].stop();
		cnt_pause[$myid].value = "Restart";
	}
  }

