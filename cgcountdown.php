<?php 
/**
 * Package CG CountDown Plugin
 * License http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 * Copyright (c) 2022 ConseilGouz. All Rights Reserved.
 * Author ConseilGouz 
 * Compatible Joomla 3.10 and 4.x
 *
 * From http://lexxus.github.io/jq-timeTo/
 *
 * {cgcount count=<timer in seconds>|color=<theme color: black/white>|text=<button text>|msg=<a stop message>|auto=<true/false>|alert=<time left before end>|sound=<mp3 sound file>}
 * {cgcount list=<nb occurences>|interv=<list interval (default 900 = 15mn)>|color=<theme color: black/white>|text=<button text>|msg=<a stop message>|auto=<true/false>|alert=<time left before end>|sound=<mp3 sound file>}
 *
 */
defined( '_JEXEC' ) or die( 'Restricted access' );
use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
class plgContentCGCountDown extends JPlugin
{	
	protected $autoloadLanguage = true;

	public function onContentPrepare($context, &$article, &$params, $page = 0) {
		$app = JFactory::getApplication();
		if ($app->isClient('administrator')) return false;
		$regex_one		= '/({cgcount\s*)(.*?)(})/si';
		$regex_all		= '/{cgcount\s*.*?}/si';
		$matches 		= array();
		$count_matches	= preg_match_all($regex_all,$article->text,$matches,PREG_OFFSET_CAPTURE | PREG_PATTERN_ORDER);
		if ($count_matches == 0) {
			return true;
		}
		$plg	= 'media/plg_content_cgcountdown/';
		/** @var Joomla\CMS\WebAsset\WebAssetManager $wa */
		$wa = Factory::getApplication()->getDocument()->getWebAssetManager();
		$wa->registerAndUseStyle('cgcountdown', $plg.'css/cgcountdown.css');
		$wa->registerAndUseStyle('timeTo', $plg.'css/timeTo.css');
		$wa->registerAndUseScript('countdown',$plg.'js/cgcountdown.js');
		$wa->registerAndUseScript('timeto',$plg.'js/jquery.time-to.min.js');
		$options = array(
		  'count' => 60, 
		  'down' => 1,    
		  'alert' => 0, 
		  'color' => 'white', 
		  'stopmsg' => '', 
		  'auto' => 'true', 
		  'text' => '', 
		  'style' => '', 
		  'fontsize' => 28,
		  'lang' => 'fr', 
		  'sound' => '',
		  'list' => '', 
		  'interval' => 900
		);
		$uri = Uri::getInstance();
		for($i = 0; $i < $count_matches; $i++) {
            $output = "";
			$cgone	= $matches[0][$i][0];
			preg_match($regex_one,$cgone,$cgcount_parts);
			$parts = explode("|", $cgcount_parts[2]);
			$count = 60;
			$alert=10;
			$color = "white";
			$stopmsg = "";
			$auto = "true";
			$text = "";
			$style= "";
			$fontsize=28;
			$sound = "";
			$list="";
			$lang = substr(Factory::getLanguage()->getTag(),0,2);
			$interval = 900; // 15 minutes
			$down = 1;
			foreach ($parts as $one) {
                $value = explode("=", $one, 2);
                if ($value[0] == 'count') $count = trim($value[1]);
				if ($one == 'up') $down = 0;
                if ($value[0] == 'list') $list = trim($value[1]);
                if ($value[0] == 'interval') $interval = (int)($value[1]);
                if ($value[0] == 'color') $color = trim($value[1]);
                if ($value[0] == 'msg') $stopmsg = trim($value[1]);
				if ($value[0] == 'auto') $auto = trim($value[1]);
				if ($value[0] == 'text') $text = trim($value[1]);
				if ($value[0] == 'style') $style = " style='".trim($value[1])."'";
				if ($value[0] == 'fontsize') $fontsize = (int)trim($value[1]);
				if ($value[0] == 'alert') $alert = (int)trim($value[1]);
				if ($value[0] == 'sound') $sound = trim($value[1]);
				if ($value[0] =="lang") $lang = trim($value[1]);
			}
			if ($alert > $count) {
				$alert =0;
				
			}
			if (($sound != "" ) && (!file_exists($plg.'sound/'.$sound))) {
				echo "<script>console.log('CG CountDown : ".$uri->root().$plg."sound/".$sound." not found');</script>";
				$sound="";
			}
			$isdate = false;
			if (($list == "") && (strpos($count, '/')) ) { // date in countdown
				$isdate = true;
			}
			$output .= '<div id="cgcount_'.$i.'" '.$style.'>';
			if (($stopmsg != "") && (!$isdate)) { // stop message ? not used on date countdown
				$output .= '<div class="cg_dwn_popup" id="cg_dwn_popup_'.$i.'"><span class="cg_dwn_popuptext" id="cg_dwn_popuptext_'.$i.'" onclick="close_dwn_popup('.$i.')" title="Close
				message" data-init="'.$stopmsg.'">'.$stopmsg.'</span></div>';
			}
			if ($list == "") { // one limit
				$time = "";
				if ($isdate) { // date
					if ($text == "") {$text = "Timer ".$count;};
					$count = "new Date('" . $count. "')";
				} else { // durée en seconde
					$heures=intval($count / 3600);
					$minutes=intval(($count % 3600) / 60);
					$secondes=intval((($count % 3600) % 60));
					$time .= $heures > 0 ? $heures.' h' : '';
					$time .= $minutes > 0 ?  ' '.$minutes.' m' : '';
					$time .= $secondes > 0 ? ' '.$secondes.' s' : '';
					if ($text == "") {$text = "Timer ".$time;};
				}
				$output .= '<div><input type="button" id="cgcount_btn_'.$i.'" class="cg_btn_large" value="'.$text.'" onclick="go_countdown('.$i.','.$count.',\''.$color.'\',\''.$stopmsg.'\',\''.$auto.'\','.$fontsize.','.$alert.','.$down.',\''.$lang.'\' )"></div>';
			} else { // select your limit
			    $options = '';
				$oneval = 0; // interval
				for ($ix = 1; $ix <= $list; $ix++) {
					$oneval += $interval; 
					$time = "";
					$heures=intval($oneval / 3600);
					$minutes=intval(($oneval % 3600) / 60);
					$secondes=intval((($oneval % 3600) % 60));
					$time .= $heures > 0 ? $heures.' h' : '';
					$time .= $minutes > 0 ?  ' '.$minutes.' m' : '';
					$time .= $secondes > 0 ? ' '.$secondes.' s' : '';
					if ($text == "") {
						$onetext = "Timer ".$time;
					} else {
						$onetext = $text.' '.$time;
					}
					$options .= '<option value="'.$oneval.'">'.$onetext.'</option>';
				}
				$output .= '<div class="cg_margin_inherit"><select id="cgcount_sel_'.$i.'" class="cg_sel_large"  onclick="go_select(event,'.$i.',\''.$color.'\',\''.$stopmsg.'\',\''.$auto.'\','.$fontsize.','.$alert.','.$down.',\''.$lang.'\')">'.$options.'</select></div>';
			}
			$output .= '<div id="countdown_'.$i.'"></div>'; 
			$output .= '<div><input type="button" id="cgstop_btn_'.$i.'" class="cg_hide_btn cg_btn" value="Stop" onclick="go_stopcountdown('.$i.')">';
			if (!$isdate) { // no stop/pause on date display
				$output .= '<input type="button" id="cgpause_btn_'.$i.'" class="cg_hide_btn cg_btn" value="Pause" onclick="go_pausecountdown('.$i.')"></div>';
			} else { 
				$output .= '</div>';
			}
			if ($sound != "") {

				$output .= '<audio id="cgcount_audio_'.$i.'"><source src="'.$uri->root().$plg.'sound/'.$sound.'" type="audio/mpeg"></audio>';
			}
			$output .= '</div>';
			$article->text = preg_replace($regex_one, $output, $article->text, 1);
		}
		return true;
	}
}
?>