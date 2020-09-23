var src_icon_mic = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif";
var src_icon_mic_animate = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif";
var src_icon_mic_slash = "https://www.google.com/intl/en/chrome/assets/common/images/content/mic-slash.gif";


// When page is loaded
window.addEventListener("load", function () {

	let timeDelay = 5000;

	const interval = setTimeout(function () {
		var allText = document.location.href;
		var partTextYoutubeWatch = "www.youtube.com/watch?v=";


		if (!IsFoundedPartOfText(allText, partTextYoutubeWatch)) {
			return;
		}
		// console.log("youtube page: Watch");


		// PUT HTML CODE

		var webSpeechHtmlContent = '<div class="right"><button id="start_button"><img id="start_img" src="https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif" alt="Start"></button></div><div id="results"><span id="final_span" class="final"></span><span id="interim_span" class="interim"></span><p></div><div class="center"><div id="div_language"><select id="select_language"></select>&nbsp;&nbsp;<select id="select_dialect"></select></div></div>'

		var tagP = document.createElement("p");
		tagP.innerHTML = webSpeechHtmlContent;
		var element = document.getElementsByClassName("style-scope ytd-watch-flexy")[24];
		element.appendChild(tagP);
		//



		// PUT STYLE CODE
		// Add html content on the beggining to html of page
		var tagStyle = document.createElement("style");
		tagStyle.innerHTML = "a:link {color:#000;text-decoration: none;}a:visited {color:#000;}a:hover {color:#33F;}.button {background: -webkit-linear-gradient(top,#008dfd 0,#0370ea 100%);             border: 1px solid #076bd2;border-radius: 3px;color: #fff;display: none;font-size: 13px;font-weight: bold;line-height: 1.3;padding: 8px 25px;text-align: center;text-shadow: 1px 1px 1px #076bd2;letter-spacing: normal;}.center {padding: 10px;text-align: center;}.final {color: black;padding-right: 3px;}.interim {color: gray;}.info {font-size: 14px;text-align: center;color: #777;display: none;}.right {float: right;}    .sidebyside {display: inline-block;width: 45%;min-height: 40px;text-align: left;vertical-align: top;}#headline {font-size: 40px;font-weight: 300;}            #results {font-size: 14px;font-weight: bold;border: 1px solid #ddd;padding: 15px;text-align: left;min-height: 150px;}#start_button {border: 0;background-color:transparent;padding: 0;}";
		var bodyElem = document.body.parentNode;
		bodyElem.appendChild(tagStyle);
		//

		// inizialise start button
		var start_button = document.getElementById('start_button');
		// inizialise dropbox languages
		var select_language = document.getElementById('select_language');

		// Button click  start_button
		start_button.addEventListener('click', function () {
			startButton(event);
		}, false);
		// .END (Button click)	

		select_language.onchange = function () {
			updateCountry();
		};

		var langs =
			[
				['English', ['en-US', 'United States'],
					['en-AU', 'Australia'],
					['en-CA', 'Canada'],
					['en-IN', 'India'],
					['en-NZ', 'New Zealand'],
					['en-ZA', 'South Africa'],
					['en-GB', 'United Kingdom']
				],
				['Italiano', ['it-IT', 'Italia'],
					['it-CH', 'Svizzera']],
				['Pусский', ['ru-RU']],
				['Español', ['es-AR', 'Argentina'],
					['es-BO', 'Bolivia'],
					['es-CL', 'Chile'],
					['es-CO', 'Colombia'],
					['es-CR', 'Costa Rica'],
					['es-EC', 'Ecuador'],
					['es-SV', 'El Salvador'],
					['es-ES', 'España'],
					['es-US', 'Estados Unidos'],
					['es-GT', 'Guatemala'],
					['es-HN', 'Honduras'],
					['es-MX', 'México'],
					['es-NI', 'Nicaragua'],
					['es-PA', 'Panamá'],
					['es-PY', 'Paraguay'],
					['es-PE', 'Perú'],
					['es-PR', 'Puerto Rico'],
					['es-DO', 'República Dominicana'],
					['es-UY', 'Uruguay'],
					['es-VE', 'Venezuela']],

			];

		const colors_ru = {
			белый: 'white',
			черный: 'black',
			красный: 'red',
			оранжевый: 'orange',
			желтый: 'yellow',
			зеленый: 'green',
			голубой: 'blue',
			синий: 'darkblue',
			фиолетовый: 'violet'
		};

		// colors in rus language
		const colors_keyList_ru = Object.keys(colors_ru);
		const colors_list_en = ['white', 'black', 'red', 'orange', 'yellow', 'green', 'blue', 'darkblue', 'violet'];

		let is_continuous_speech_on = false;

		for (var i = 0; i < langs.length; i++) {
			select_language.options[i] = new Option(langs[i][0], i);
		}

		updateCountry();
		showInfo('info_start');

		function updateCountry() {
			for (var i = select_dialect.options.length - 1; i >= 0; i--) {
				select_dialect.remove(i);
			}
			var list = langs[select_language.selectedIndex];
			for (var i = 1; i < list.length; i++) {
				select_dialect.options.add(new Option(list[i][1], list[i][0]));
			}
			select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
		}


		const originalSiteHtml = document.body.innerHTML;

		var create_email = false;
		var final_transcript = '';
		var recognizing = false;
		var ignore_onend;
		var start_timestamp;
		if (!('webkitSpeechRecognition' in window)) {
			upgrade();
		} else {
			start_button.style.display = 'inline-block';
			var recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;

			recognition.onstart = function () {
				recognizing = true;
				showInfo('info_speak_now');
				start_img.src = src_icon_mic_animate;
			};

			recognition.onerror = function (event) {
				if (event.error == 'no-speech') {
					start_img.src = src_icon_mic;
					showInfo('info_no_speech');
					ignore_onend = true;
				}
				if (event.error == 'audio-capture') {
					start_img.src = src_icon_mic;
					showInfo('info_no_microphone');
					ignore_onend = true;
				}
				if (event.error == 'not-allowed') {
					if (event.timeStamp - start_timestamp < 100) {
						showInfo('info_blocked');
					} else {
						showInfo('info_denied');
					}
					ignore_onend = true;
				}
			};

			recognition.onend = function () {
				recognizing = false;
				if (ignore_onend) {
					return;
				}
				start_img.src = src_icon_mic;
				if (!final_transcript) {
					showInfo('info_start');
					return;
				}
				showInfo('');
				if (window.getSelection) {
					window.getSelection().removeAllRanges();
					var range = document.createRange();
					range.selectNode(document.getElementById('final_span'));
					window.getSelection().addRange(range);
				}
				if (create_email) {
					create_email = false;
					createEmail();
				}
			};

			recognition.onresult = function (event) {
				var interim_transcript = '';
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						// final_transcript += event.results[i][0].transcript;
						final_transcript = event.results[i][0].transcript;
						doWithSpeechResult(final_transcript);
					} else {
						interim_transcript += event.results[i][0].transcript;
						doWithSpeechContinousResult(interim_transcript);
					}
				}
				final_transcript = capitalize(final_transcript);
				//console.log("final_transcript: " + final_transcript);

				final_span.innerHTML = linebreak(final_transcript);
				interim_span.innerHTML = linebreak(interim_transcript);
				if (final_transcript || interim_transcript) {
					// showButtons('inline-block');
				}
			};
		}

		// Android works just with this result. PC works with this (final result) and continuos speech result
		function doWithSpeechResult(speech_text) {
			if (is_continuous_speech_on === false) {
				doWithSpeechMainFunc(speech_text);
				// document.body.innerHTML += "final";
			}
		}

		function doWithSpeechContinousResult(speech_text) {
			// document.body.innerHTML += "continous";
			is_continuous_speech_on = true;

			doWithSpeechMainFunc(speech_text);
		}

		function doWithSpeechMainFunc(speech_text) {
			if (is_continuous_speech_on == true) {
				//is_continuous_speech_on = false;
				//return null;
			}

			console.log(speech_text);
			//document.body.innerHTML += "finish";
			let selected_language_user = select_language.options[select_language.selectedIndex].text;
			//console.log("selected_language_user: " + selected_language_user);

			speech_text = speech_text.toLowerCase();

			if (speech_text.includes("stop")) {
				if (recognizing) {
					recognition.stop();
					return;
				}
			}
			

			// ITALIAN
			if (selected_language_user === "Italiano") {
				if (speech_text.includes("pausa")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					//var pauseButton = document.querySelector(".style-scope ytd-item-section-renderer");
					mainPlayer.pause();
				}
				else if (speech_text.includes("riproduci")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					mainPlayer.play();
				}
				else if (speech_text.includes("avanti")) {
					var buttonNextVideo = document.getElementsByClassName("ytp-next-button ytp-button")[0];
					if (buttonNextVideo != undefined) {
						buttonNextVideo.click();
					}
				}
				else if (speech_text.includes("rivedi")) {
					var buttonPreviousVideo = document.getElementsByClassName("ytp-prev-button ytp-button")[0];
					if (buttonPreviousVideo != undefined) {
						buttonPreviousVideo.click();
					}
				}
				else if (speech_text.includes("più silenzioso")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					if(mainPlayer.volume >= 0.25){
						mainPlayer.volume -= 0.25;
					}
				}
				else if (speech_text.includes("più forte") || speech_text.includes("riattiva audio")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					
					if(mainPlayer.volume <= 0.75){
						mainPlayer.volume += 0.25;
					}
					var buttonSound = document.getElementsByClassName("ytp-mute-button ytp-button")[0];
					console.log(buttonSound.ariaLabel);
					if (buttonSound.ariaLabel === "Включить звук (m)" || buttonSound.ariaLabel === "Riattiva audio (m)") {
						buttonSound.click();
					}
				}
				else if (speech_text.includes("disattiva audio")) {
					var buttonSound = document.getElementsByClassName("ytp-mute-button ytp-button")[0];
					if (buttonSound.ariaLabel === "Отключение звука (m)" || buttonSound.ariaLabel === "Disattiva audio (m)") {
						buttonSound.click();
					}
				}
				else if (speech_text.includes("schermo intero")) {
					var fullScreenElem = document.getElementsByClassName("ytp-fullscreen-button ytp-button")[0];
					if (fullScreenElem.title === "Во весь экран (f)" || fullScreenElem.title === "Schermo intero (f)") {
						fullScreenElem.click();
					}
				}
				else if (speech_text.includes("esci")) {
					var fullScreenElem = document.getElementsByClassName("ytp-fullscreen-button ytp-button")[0];
					if (fullScreenElem.title === "Выход из полноэкранного режима (f)" || fullScreenElem.title === "Esci dalla modalità a schermo intero (f)") {
						fullScreenElem.click();
					}
				}
				else {
					return;
				}
				console.log("COMMAND: " + speech_text);

			}

			// ENGLISH
			if (selected_language_user === "English") {

				if (speech_text.includes("pause")) {

					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					//var pauseButton = document.querySelector(".style-scope ytd-item-section-renderer");
					mainPlayer.pause();
				}
				else if (speech_text.includes("play")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					mainPlayer.play();
				}
				else if (speech_text.includes("next video")) {
					var buttonNextVideo = document.getElementsByClassName("ytp-next-button ytp-button")[0];
					if (buttonNextVideo != undefined) {
						buttonNextVideo.click();
					}
				}
				else if (speech_text.includes("previous video")) {
					var buttonPreviousVideo = document.getElementsByClassName("ytp-prev-button ytp-button")[0];
					if (buttonPreviousVideo != undefined) {
						buttonPreviousVideo.click();
					}
				}
				else if (speech_text.includes("quieter")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					mainPlayer.volume -= 0.25;
				}
				else if (speech_text.includes("louder")) {
					var mainPlayer = document.querySelector(".video-stream.html5-main-video");
					mainPlayer.volume += 0.25;

					var buttonSound = document.getElementsByClassName("ytp-mute-button ytp-button")[0];
					if (buttonSound.ariaLabel === "Включить звук (m)") {
						buttonSound.click();
					}
				}
				else if (speech_text.includes("mute")) {
					var buttonSound = document.getElementsByClassName("ytp-mute-button ytp-button")[0];
					if (buttonSound.ariaLabel === "Отключение звука (m)") {
						buttonSound.click();
					}
				}
				else if (speech_text.includes("full screen")) {
					var fullScreenElem = document.getElementsByClassName("ytp-fullscreen-button ytp-button");
					if (fullScreenElem.title === "Во весь экран (f)") {
						fullScreenElem.click();
					}
				}
				else if (speech_text.includes("cancel") || speech_text.includes("small screen")) {
					var fullScreenElem = document.getElementsByClassName("ytp-fullscreen-button ytp-button");
					if (fullScreenElem.title === "Выход из полноэкранного режима (f)") {
						fullScreenElem.click();
					}
				}
				else {
					return;
				}
				console.log("COMMAND: " + speech_text);

			}

			// RUSSIAN
			else if (selected_language_user === "Pусский") {


			}
		}

		function upgrade() {
			start_button.style.visibility = 'hidden';
			showInfo('info_upgrade');
		}

		var two_line = /\n\n/g;
		var one_line = /\n/g;
		function linebreak(s) {
			return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
		}

		var first_char = /\S/;
		function capitalize(s) {
			return s.replace(first_char, function (m) { return m.toUpperCase(); });
		}

		function createEmail() {
			var n = final_transcript.indexOf('\n');
			if (n < 0 || n >= 80) {
				n = 40 + final_transcript.substring(40).indexOf(' ');
			}
			var subject = encodeURI(final_transcript.substring(0, n));
			var body = encodeURI(final_transcript.substring(n + 1));
			window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
		}

		function startButton(event) {
			if (recognizing) {
				recognition.stop();
				return;
			}
			final_transcript = '';
			recognition.lang = select_dialect.value;
			recognition.start();
			ignore_onend = false;
			final_span.innerHTML = '';
			interim_span.innerHTML = '';
			start_img.src = src_icon_mic_slash;
			showInfo('info_allow');
			// showButtons('none');
			start_timestamp = event.timeStamp;
		}

		function showInfo(s) {
			/*
			if (s) {
			  for (var child = info.firstChild; child; child = child.nextSibling) {
				if (child.style) {
				  child.style.display = child.id == s ? 'inline' : 'none';
				}
			  }
			  if(info.style == undefined){ alert("undef");}
			  info.style.visibility = 'visible';
			} else {
			  info.style.visibility = 'hidden';
			}
			*/
		}

		var current_style;
		function showButtons(style) {
			if (style == current_style) {
				return;
			}
			current_style = style;
			copy_button.style.display = style;
			email_button.style.display = style;
			copy_info.style.display = 'none';
			email_info.style.display = 'none';
		}

		//
	}, timeDelay);
});

function IsFoundedPartOfText(allText, partText) {
	var index_exist_text = allText.indexOf(partText);
	if (index_exist_text > -1) {
		return true;
	}

	return false;
}
