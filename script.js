var chordsToDisplay = [];
var ta = document.getElementById("ta");
//ta.value = "None Like You\n\nF          Csus4        Dm\nThere is none like you\nBb        F                C7\nNo one else can touch my heart like you do\nF      C         Dm        Bb\nI can search for all eternity long\n   Dmin        C       Bb    Fmaj\nAnd find there is none like you";
var num = document.getElementById("num");
var arrFlat = ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Hb", "Ax", "Hx", "Ex"];
var arrSharp = ["H", "Cx", "Dx", "E", "Fx", "Gx", "Bb", "Bb", "C", "F"];
var arrFrom = ["Cx", "C", "Dx", "D", "E", "Fx", "F", "Gx", "G", "A", "Bb", "H"];
var arrTo = ["P", "O", "R", "Q", "S", "U", "T", "W", "V", "X", "Y", "Z"];
var arrUp = ["D", "Cx", "E", "Dx", "F", "G", "Fx", "A", "Gx", "Bb", "H", "C"];
var arrDown = ["C", "H", "D", "Cx", "Dx", "F", "E", "G", "Fx", "Gx", "A", "Bb"];
//var hint	=	["1",	"0",	"3",	"2",	"4",	"6",	"5",	"8",	"7",	"9",	"10",	"11"];
function transpose(upY, tr = false) {
	chordsToDisplay = [];
	if(upY) {
		num.innerHTML = (num.innerHTML) - (-1);
		if(num.innerHTML == 12) {
			num.innerHTML = 0;
		}
	} else if(tr) {
		num.innerHTML = num.innerHTML;
	} else {
		num.innerHTML = (num.innerHTML) - 1;
		if(num.innerHTML == -12) {
			num.innerHTML = 0;
		}
	}
	var song = ta.value.split("\n");
	for(var j = 0; j < song.length; j++) {
		if(areChords(song[j])) {
			song[j] = song[j].replace(/#/g, "x");
			var chords = song[j].split(/\b/);
			var pristi = false;
			for(var k = 0; k < chords.length; k++) {
				if(chords[k].replace(/\s+/, "") == "") {
					if(chords[k] == " " && k > 0) {
						chords[k] += " ";
					} else if(pristi) {
						chords[k] = chords[k].slice(1);
						pristi = false;
					}
				} else {
					var min = chords[k];
					chords[k] = chords[k].replace(/([ABCDEFGH])is/g, "$1#").replace(/([ABCDEFGH])es/g, "$1b");
					for(var i = 0; i < arrFlat.length; i++) {
						var regex = new RegExp(arrFlat[i], "g");
						chords[k] = chords[k].replace(regex, arrSharp[i]);
					}
					if(chords[k] == "B") {
						chords[k] = "Bb"
					}
					if(chords[k].replace(/[ABCDEFGH][#b]?mi/, "") == "") {
						chords[k] = chords[k].replace(/([ABCDEFGH][#b]?)mi/, "$1m ");
					}
					if(chords[k].replace(/[ABCDEFGH][#b]?min/, "") == "") {
						chords[k] = chords[k].replace(/([ABCDEFGH][#b]?)min/, "$1m  ");
					}
					chords[k] = chords[k].replace(/([ABCDEFGH][#b]?)mi[^n]/, "$1m");
					chords[k] = chords[k].replace(/([ABCDEFGH][#b]?)-/g, "$1m");

					for(var i = 0; i < arrFrom.length; i++) {
						var regex = new RegExp(arrFrom[i], "g");
						chords[k] = chords[k].replace(regex, arrTo[i]);
					}
					for(var i = 0; i < arrFrom.length; i++) {
						var regex = new RegExp(arrTo[i], "g");
						if(upY) {
							chords[k] = chords[k].replace(regex, arrUp[i]);
						} else if(tr) {
							chords[k] = chords[k].replace(regex, arrFrom[i]);
						} else {
							chords[k] = chords[k].replace(regex, arrDown[i]);
						}
					}
					if(chords[k].length > min.length) {
						pristi = true;
					} else if(chords[k].length < min.length) {
						chords[k] += " ";
					}
					var chordToDisplay = chords[k].replace(/\s/g, "").replace(/x/g, "#");
					if(chordsToDisplay.indexOf(chordToDisplay) == -1) {
						chordsToDisplay.push(chordToDisplay);
					}
				}
			}
			song[j] = chords.join("").replace(/x/g, "#");
		}
	}
	ta.value = song.join("\n");
	displayChords();
}

function enConversion(fromEn) {
	if(!fromEn) {
		transpose(false, true);
	}
	var song = ta.value.split("\n");
	for(var j = 0; j < song.length; j++) {
		if(areChords(song[j])) {
			if(fromEn) {
				song[j] = song[j].replace("B", "H").replace("Hb", "Bb");
			} else {
				song[j] = song[j].replace("H", "B");
			}
		}
	}
	ta.value = song.join("\n");
	if(fromEn) {
		transpose(false, true);
	}
}

function areChords(line) {
	var missing = ".,cefhkopqrvwxyzIJKLNOPQRSTUVWXYZ";
	var sum = 0;
	for(var i = 0; i < missing.length; i++) {
		sum += line.indexOf(missing[i]);
	}
	if(sum + missing.length == 0) {
		return true;
	} else {
		return false;
	}
}

function transposeTo(num) {
	if(num < 0) {
		while(num < 0) {
			transpose(true);
			num++;
		}
	} else if(num > 0) {
		while(num > 0) {
			transpose(false);
			num--;
		}
	}
}

function displayChords() {
	document.getElementById("charts").innerHTML = "";
	if(chordsToDisplay.length > 0) {
		for(var i = 0; i < chordsToDisplay.length; i++) {
			chord(chordsToDisplay[i], true);
		}
		document.getElementById("charts").innerHTML += "<br><small>Pro více variant klikni na akord.</small><br><br>";
	}
}

function variations(chordName, one) {
	// multiple chord variations
	if(one) {
		document.getElementById("charts").innerHTML = "";
		chord(chordName, false);
		document.getElementById("charts").innerHTML += "<br><small onclick=\"variations('Cmajor', false);\">Klikni pro návrat ke všem akordům.</small><br><br>";
	} else {
		displayChords();
	}
}

var num = 0;

function chord(name, one) {
	// creates chord diagram using its name
	name = name.replace("Bb", "A#");
	if(name[1] == "#") {
		var letter = name.slice(0, 2);
		var type = name.slice(2);
	} else {
		var letter = name.slice(0, 1).replace("H", "B");
		var type = name.slice(1);
	}
	if(type == "maj") {
		type = "maj7";
		name = name.replace("maj", "maj7");
	}
	if(type == "") {
		type = "major";
	} else if(type == "m") {
		type = "minor";
	}
	if(chords[document.getElementById("instrument").value].hasOwnProperty(letter) && chords[document.getElementById("instrument").value][letter].hasOwnProperty(type)) {
		for(var i = 0; i < 4; i++) {
			document.getElementById("charts").innerHTML += '<span onclick="variations(\'' + name + '\', ' + one + ');"><svg id="chart' + num + '" class="chordCharts"></svg></span>';

			var pos = chords[document.getElementById("instrument").value][letter][type].positions[i + ""];

			var labelF = pos.fingers;
			var fretF = pos.frets;
			var baseF = pos.baseFret;
			baseF--;
			if(document.getElementById("instrument").value == "guitar") {
				var labels = labelF["0"] + "," + labelF["1"] + "," + labelF["2"] + "," + labelF["3"] + "," + labelF["4"] + "," + labelF["5"];
				var frets = (fretF["0"] + baseF) + "," + (fretF["1"] + baseF) + "," + (fretF["2"] + baseF) + "," + (fretF["3"] + baseF) + "," + (fretF["4"] + baseF) + "," + (fretF["5"] + baseF);
			} else {
				var labels = labelF["0"] + "," + labelF["1"] + "," + labelF["2"] + "," + labelF["3"];
				var frets = (fretF["0"] + baseF) + "," + (fretF["1"] + baseF) + "," + (fretF["2"] + baseF) + "," + (fretF["3"] + baseF);
			}
			name = (i == 0) ? name : "";
			name = name.replace("A#", "Bb");
			create(name, frets, labels, "chart" + num);
			num++;
			if(one) {
				break;
			}
		}
	} else {
		console.log(name);
	}
}

function create(titleI, fretI, labelI, id) {
	var createChart = chartMaker();
	var placeholder = document.getElementById(id);
	var udi = {
		title: titleI,
		fret: fretI,
		label: labelI
	};
	createChart(placeholder, udi);
}