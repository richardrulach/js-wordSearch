/**
 *   Copyright 2014 Richard Rulach 
 *   Licensed under the Apache License, Version 2.0 (the "License"); 
 *   you may not use this file except in compliance with the License. 
 *
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0 
 *
 *   Unless required by applicable law or agreed to in writing, 
 *   software distributed under the License is distributed on 
 *   an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
 *   either express or implied. See the License for the specific 
 *   language governing permissions and limitations under the License
**/

// SET UP GLOBAL DISPLAY PARAMETERS
var GRID_SIZE = 25;
var HORIZONTAL_BOXES = 12;
var VERTICAL_BOXES = 12;
var RUN_PROFILER = false;
var REVEAL_LETTERS = 0;

var GRID_WIDTH = GRID_SIZE * HORIZONTAL_BOXES;
var GRID_HEIGHT = GRID_SIZE * VERTICAL_BOXES;

// UPDATE FUNCTIONS FOR THE GLOBAL DISPLAY SETTINGS
function updateBoxSize(numPixels){
    GRID_SIZE = numPixels;
    GRID_WIDTH = GRID_SIZE * HORIZONTAL_BOXES;
    GRID_HEIGHT = GRID_SIZE * VERTICAL_BOXES;
}

function updateGridSize(horizontal,vertical){
    if (horizontal > 0) HORIZONTAL_BOXES = horizontal;
    if (vertical > 0) VERTICAL_BOXES = vertical;
    
    GRID_WIDTH = GRID_SIZE * HORIZONTAL_BOXES;
    GRID_HEIGHT = GRID_SIZE * VERTICAL_BOXES;
}

function btnAddWords_click(){


    $('.loading').show();
    //  MAKES SURE THE LOADING ANIMATION RUNS 
    //  FOR A SECOND TO SHOW ACTIVITY
    setTimeout(run,1000);
}

function DrawGrid(){
    for (var i = GRID_SIZE; i < GRID_WIDTH; i+=GRID_SIZE){
        context.moveTo(i,0);
        context.lineTo(i,GRID_HEIGHT);
        context.stroke();

        contextAnswers.moveTo(i,0);
        contextAnswers.lineTo(i,GRID_HEIGHT);
        contextAnswers.stroke();
    }

    for (var i = GRID_SIZE; i < GRID_HEIGHT; i+=GRID_SIZE){
        context.moveTo(0,i);
        context.lineTo(GRID_WIDTH,i);
        context.stroke();

        contextAnswers.moveTo(0,i);
        contextAnswers.lineTo(GRID_WIDTH,i);
        contextAnswers.stroke();
    }
}

function run(){


    wordSearch.Reset();

    canvas.width = GRID_WIDTH;
    canvas.height = GRID_HEIGHT;

    canvasAnswers.width = GRID_WIDTH;
    canvasAnswers.height = GRID_HEIGHT;

    context.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);
    contextAnswers.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);



    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "black";

    contextAnswers.beginPath();
    contextAnswers.lineWidth = 1;
    contextAnswers.strokeStyle = "black";


    DrawGrid();

    var fontSize = Math.floor(GRID_SIZE * 0.8);
    
    context.font = fontSize + "px _sans";
    context.textBaseline = "middle";

    contextAnswers.font = fontSize + "px _sans";
    contextAnswers.textBaseline = "middle";

    // GENERATE ARRAY OF WORDS TO PUT INTO THE CANVAS
    var rawData = $('#txtWords').val();
    var aValues = rawData.split('\n');

    // GET AND DISPLAY THE CROSSWORD - PRINT LETTER IF IT IS
    // THERE OR PRINT A BLACK SQUARE ON THE CANVAS

    var directions = {
    	HORIZONTAL: 			$('#chkH').prop('checked'),
    	VERTICAL: 				$('#chkV').prop('checked'),
    	DIAGONAL_UP: 			$('#chkDU').prop('checked'),
    	DIAGONAL_DOWN: 			$('#chkDD').prop('checked'),
    	REVERSE_HORIZONTAL: 	$('#chkRH').prop('checked'),
    	REVERSE_VERTICAL: 		$('#chkRV').prop('checked'),
    	REVERSE_DIAGONAL_UP: 	$('#chkRDU').prop('checked'),
    	REVERSE_DIAGONAL_DOWN: 	$('#chkRDD').prop('checked')
    };

    var crossword = wordSearch.Create(
    	VERTICAL_BOXES,
    	HORIZONTAL_BOXES,
    	aValues,
    	directions);
    

    for (var i = 0; i < crossword.length; i++){
        for (var j = 0; j < crossword[i].length; j++){
            if (crossword[i][j].length == 0){
                var letter = String.fromCharCode(Math.random() * 26 + 65);
                var correction = Math.round((GRID_SIZE - context.measureText(letter).width) / 2);

                context.fillText(letter,
                    i * GRID_SIZE + correction - 0.5,
                    j * GRID_SIZE + (GRID_SIZE/2));

                contextAnswers.beginPath();
                contextAnswers.fillStyle = 'rgba(10,10,10,0.4)';
                contextAnswers.fillText(letter,
                    i * GRID_SIZE + correction - 0.5,
                    j * GRID_SIZE + (GRID_SIZE/2));
                 contextAnswers.closePath();
            } else {
                var x = Math.round((GRID_SIZE - 
                context.measureText(crossword[i][j].toUpperCase()).width) / 2);
                context.fillText(crossword[i][j].toUpperCase(),
                  i*GRID_SIZE + x - 0.5, 
                  j*GRID_SIZE + (GRID_SIZE/2));

                contextAnswers.beginPath();
                contextAnswers.fillStyle = 'black';
                contextAnswers.fillText(crossword[i][j].toUpperCase(),
                  i*GRID_SIZE + x - 0.5, 
                  j*GRID_SIZE + (GRID_SIZE/2));
                contextAnswers.closePath();
            }
        }
    }

    context.stroke();
    context.closePath();

    contextAnswers.stroke();
    contextAnswers.closePath();

    var posArray = wordSearch.GetAnswerPositions();

    for (var x=0; x < posArray.length; x++){
        if (posArray[x] !== undefined){
            drawMarker(
                contextAnswers,
                posArray[x].x1,
                posArray[x].y1,
                posArray[x].x2,
                posArray[x].y2
            );
        }
    }


	$('.loading').hide();
    $('#mainContainer').slideDown(250);

    $('html, body').animate({
        scrollTop: $("#pageTop").offset().top
    }, 400);
  
    if (wordSearch.sErrors.length > 0){
        alert(wordSearch.sErrors);
    } 
}


function gotoPrintOptions(){
    $('html, body').animate(
        {scrollTop: $('#printOptions').offset().top}, 
        400);
}

function drawMarker(context, x1, y1, x2, y2) {
    context.beginPath();

    context.lineWidth = 3;
    context.strokeStyle = "red";


    if ((x1 == x2) && (y1 < y2)) {
        // VERTICAL
        context.moveTo(x1 * GRID_SIZE, y1 * GRID_SIZE + (GRID_SIZE/2));
        context.lineTo(x2 * GRID_SIZE, y2 * GRID_SIZE + (GRID_SIZE/2));

        context.moveTo((x1 + 1) * GRID_SIZE, y1 * GRID_SIZE + (GRID_SIZE/2));
        context.lineTo((x2 + 1) * GRID_SIZE, y2 * GRID_SIZE + (GRID_SIZE/2));

        context.moveTo(x1 * GRID_SIZE, y1 * GRID_SIZE + (GRID_SIZE/2));

        context.arc(x1 * GRID_SIZE + (GRID_SIZE/2),
        y1 * GRID_SIZE + (GRID_SIZE/2),
        (GRID_SIZE/2),
        3.14,
        6.28,
        false);

        context.arc(x2 * GRID_SIZE + (GRID_SIZE/2),
        y2 * GRID_SIZE + (GRID_SIZE/2),
        (GRID_SIZE/2),
        6.28,
        3.14,
        false);

    } else if ((x1 < x2) && (y1 == y2)) {
        // HORIZONTAL
        context.moveTo(x1 * GRID_SIZE + (GRID_SIZE/2), y1 * GRID_SIZE);
        context.lineTo(x2 * GRID_SIZE + (GRID_SIZE/2), y2 * GRID_SIZE);

        context.moveTo(x1 * GRID_SIZE + (GRID_SIZE/2), (y1 + 1) * GRID_SIZE);
        context.lineTo(x2 * GRID_SIZE + (GRID_SIZE/2), (y2 + 1) * GRID_SIZE);

        context.arc(x1 * GRID_SIZE + (GRID_SIZE/2),
        y1 * GRID_SIZE + (GRID_SIZE/2),
        (GRID_SIZE/2),
        1.57,
        4.71,
        false);
        context.arc(x2 * GRID_SIZE + (GRID_SIZE/2),
        y2 * GRID_SIZE + (GRID_SIZE/2),
        (GRID_SIZE/2),
        4.71,
        1.57,
        false);
    } else if ((x1 < x2) && (y1 < y2)) {
        // DIAGONAL DOWN

        context.moveTo(x1 * GRID_SIZE + (GRID_SIZE/2), y1 * GRID_SIZE);
        context.lineTo((x2 + 1) * GRID_SIZE, y2 * GRID_SIZE + (GRID_SIZE/2));

        context.moveTo(x1 * GRID_SIZE, y1 * GRID_SIZE + (GRID_SIZE/2));
        context.lineTo(x2 * GRID_SIZE + (GRID_SIZE/2), (y2 + 1) * GRID_SIZE);

        context.arc((x1 * GRID_SIZE) + ((GRID_SIZE/2) / 2), (y1 * GRID_SIZE) + ((GRID_SIZE/2) / 2),
        Math.sqrt(((GRID_SIZE/2) * (GRID_SIZE/2)) + ((GRID_SIZE/2) * (GRID_SIZE/2))) / 2,
        2.35,
        5.49,
        false);

        context.arc(
        ((x2 + 1) * GRID_SIZE) - ((GRID_SIZE/2) / 2), ((y2 + 1) * GRID_SIZE) - ((GRID_SIZE/2) / 2),
        Math.sqrt(((GRID_SIZE/2) * (GRID_SIZE/2)) + ((GRID_SIZE/2) * (GRID_SIZE/2))) / 2,
        5.49,
        2.35,
        false);

    } else if ((x1 < x2) && (y1 > y2)) {
        // DIAGONAL UP

        context.moveTo(x1 * GRID_SIZE, y1 * GRID_SIZE + (GRID_SIZE/2));
        context.lineTo(x2 * GRID_SIZE + (GRID_SIZE/2), y2 * GRID_SIZE);

        context.moveTo(x1 * GRID_SIZE + (GRID_SIZE/2), (y1+1) * GRID_SIZE);
        context.lineTo((x2+1) * GRID_SIZE, y2 * GRID_SIZE + (GRID_SIZE/2));


        context.arc((x1 * GRID_SIZE) + ((GRID_SIZE/2) / 2), (y1 * GRID_SIZE + (GRID_SIZE/2)) + ((GRID_SIZE/2) / 2),
        Math.sqrt(((GRID_SIZE/2) * (GRID_SIZE/2)) + ((GRID_SIZE/2) * (GRID_SIZE/2))) / 2,
        0.78,
        3.92,
        false);

        context.moveTo(x2 * GRID_SIZE + (GRID_SIZE/2),y2 * GRID_SIZE);

        context.arc(
        ((x2 + 1) * GRID_SIZE) - ((GRID_SIZE/2) / 2), (y2 * GRID_SIZE) + ((GRID_SIZE/2) / 2),
        Math.sqrt(((GRID_SIZE/2) * (GRID_SIZE/2)) + ((GRID_SIZE/2) * (GRID_SIZE/2))) / 2,
        3.92,
        7.06,
        false);

    }
    context.stroke();
    context.closePath();
}


function LoadSampleData(){
    $('#txtWords').val(
        'jumper\n' + 
        'jeans\n' + 
        'shirt\n' + 
        'trousers\n' + 
        'scarf\n' + 
        'shoes\n' + 
        'gloves\n' + 
        'hat\n' + 
        'socks\n'
        );
}


function btnPrint_click()
{
    var html="<!DOCTYPE html><html>";
    html += '<head>';

    html += '<style>';
    html += ' .sectionContainer { text-align:center;margin-top:20px;}';
    html += ' img { border:2px solid black; }';
    html += ' .cluesLeft { float:left; text-align:left; width:190px; }';
    html += ' .cluesRight { float:right;text-align:left; width:190px; margin:left:30px; }';
    html += ' .outerClues { width:100%; text-align:center; }';
    html += ' .innerClues { background-color:blue;width:400px; margin:0px auto; }';
    html += ' header { text-align:center;  }';
    html += ' header, .innerClues, .outerClues {font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }'
    html += ' br { clear: both; }';
    html += ' @media print{ .noprint { display: none !important;}}';
    html += '</style>';
    html += '</head><body>';
    html += '<input class="noprint" type="button" value="print" onclick="window.print();window.focus();" />';
    html += '<header>';

    if ($('#txtCrosswordTitle').val().trim().length > 0){
        html += '<h1>' + $('#txtCrosswordTitle').val().trim() + '</h1>';
    } else {
        html += '<h1>New wordsearch</h1>';
    }

    html += '</header></div>';


    var addedWords = '';
    for (var y = 0; y < wordSearch.WordsAdded.length; y++){
        addedWords += wordSearch.WordsAdded[y] + '<br />';
    }

    if (($("#rdAll").prop("checked"))||
        ($("#rdQuestion").prop("checked"))){

        html += '<div class="sectionContainer">';
        html += '<img src="' +
            canvas.toDataURL('image/png') + '" />';
        html += '</div>';
        html += '<div class="outerClues">';
        html += '<h2>Find these words!!!</h2>';
        html += addedWords;

        html += '</div>';
        html += '</div>';
    }


    if (($("#rdAll").prop("checked"))||
        ($("#rdAnswers").prop("checked"))){

        html += '<div class="sectionContainer">';
        html += '<img src="' +
            canvasAnswers.toDataURL('image/png') + '" />';
        html += '</div>';
        html+="</body></html>";
    }

    var printWin = window.open('','','scrollbars=1');
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
}

