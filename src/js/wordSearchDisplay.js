

        function btnAddWords_click(){

            wordSearch.Reset();
            context.clearRect(0, 0, canvas.width, canvas.height);
            contextAnswers.clearRect(0, 0, 
                canvasAnswers.width, canvasAnswers.height);


            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = "black";

            contextAnswers.beginPath();
            contextAnswers.lineWidth = 1;
            contextAnswers.strokeStyle = "black";


            // DRAW THE GRID
            for (var i = 25; i < 425; i+=25){
                context.moveTo(i,0);
                context.lineTo(i,325);
                context.stroke();

                contextAnswers.moveTo(i,0);
                contextAnswers.lineTo(i,325);
                contextAnswers.stroke();
            }

            for (var i = 25; i < 325; i+=25){
                context.moveTo(0,i);
                context.lineTo(425,i);
                context.stroke();

                contextAnswers.moveTo(0,i);
                contextAnswers.lineTo(425,i);
                contextAnswers.stroke();
            }
            // END OF DRAWING THE GRID

            context.font = "20px _sans";
            context.textBaseline = "middle";

            contextAnswers.font = "20px _sans";
            contextAnswers.textBaseline = "middle";

            // GENERATE ARRAY OF WORDS TO PUT INTO THE CANVAS
            var rawData = $('#txtWords').val();
            var aValues = rawData.split('\n');

            // GET AND DISPLAY THE CROSSWORD - PRINT LETTER IF IT IS
            // THERE OR PRINT A BLACK SQUARE ON THE CANVAS
            var crossword = wordSearch.Create(13,17,aValues);
            for (var i = 0; i < crossword.length; i++){
                for (var j = 0; j < crossword[i].length; j++){
                    if (crossword[i][j].length == 0){
                        var letter = String.fromCharCode(Math.random() * 26 + 65);
                        var correction = Math.round((25 - context.measureText(letter).width) / 2);
        
                        context.fillText(letter,
                            i * 25 + correction - 0.5,
                            j * 25 + 12.5);

                        contextAnswers.beginPath();
                        contextAnswers.fillStyle = 'rgba(10,10,10,0.4)';
                        contextAnswers.fillText(letter,
                            i * 25 + correction - 0.5,
                            j * 25 + 12.5);
                         contextAnswers.closePath();
                    } else {
                        var x = Math.round((25 - 
                        context.measureText(crossword[i][j].toUpperCase()).width) / 2);
                        context.fillText(crossword[i][j].toUpperCase(),
                          i*25 + x - 0.5, 
                          j*25 + 12.5);

                        contextAnswers.beginPath();
                        contextAnswers.fillStyle = 'black';
                        contextAnswers.fillText(crossword[i][j].toUpperCase(),
                          i*25 + x - 0.5, 
                          j*25 + 12.5);
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
              drawMarker(
                    contextAnswers,
                    posArray[x].x1,
                    posArray[x].y1,
                    posArray[x].x2,
                    posArray[x].y2
              );
            }


            $('#mainContainer').slideDown(500);
        }


function drawMarker(context, x1, y1, x2, y2) {
    context.beginPath();

    context.lineWidth = 3;
    context.strokeStyle = "red";


    if ((x1 == x2) && (y1 < y2)) {
        // VERTICAL
        context.moveTo(x1 * 25, y1 * 25 + 12.5);
        context.lineTo(x2 * 25, y2 * 25 + 12.5);

        context.moveTo((x1 + 1) * 25, y1 * 25 + 12.5);
        context.lineTo((x2 + 1) * 25, y2 * 25 + 12.5);

        context.moveTo(x1 * 25, y1 * 25 + 12.5);

        context.arc(x1 * 25 + 12.5,
        y1 * 25 + 12.5,
        12.5,
        3.14,
        6.28,
        false);

        context.arc(x2 * 25 + 12.5,
        y2 * 25 + 12.5,
        12.5,
        6.28,
        3.14,
        false);

    } else if ((x1 < x2) && (y1 == y2)) {
        // HORIZONTAL
        context.moveTo(x1 * 25 + 12.5, y1 * 25);
        context.lineTo(x2 * 25 + 12.5, y2 * 25);

        context.moveTo(x1 * 25 + 12.5, (y1 + 1) * 25);
        context.lineTo(x2 * 25 + 12.5, (y2 + 1) * 25);

        context.arc(x1 * 25 + 12.5,
        y1 * 25 + 12.5,
        12.5,
        1.57,
        4.71,
        false);
        context.arc(x2 * 25 + 12.5,
        y2 * 25 + 12.5,
        12.5,
        4.71,
        1.57,
        false);
    } else if ((x1 < x2) && (y1 < y2)) {
        // DIAGONAL DOWN

        context.moveTo(x1 * 25 + 12.5, y1 * 25);
        context.lineTo((x2 + 1) * 25, y2 * 25 + 12.5);

        context.moveTo(x1 * 25, y1 * 25 + 12.5);
        context.lineTo(x2 * 25 + 12.5, (y2 + 1) * 25);

        context.arc((x1 * 25) + (12.5 / 2), (y1 * 25) + (12.5 / 2),
        Math.sqrt((12.5 * 12.5) + (12.5 * 12.5)) / 2,
        2.35,
        5.49,
        false);

        context.arc(
        ((x2 + 1) * 25) - (12.5 / 2), ((y2 + 1) * 25) - (12.5 / 2),
        Math.sqrt((12.5 * 12.5) + (12.5 * 12.5)) / 2,
        5.49,
        2.35,
        false);

    } else if ((x1 < x2) && (y1 > y2)) {
        // DIAGONAL UP

        context.moveTo(x1 * 25, y1 * 25 + 12.5);
        context.lineTo(x2 * 25 + 12.5, y2 * 25);

        context.moveTo(x1 * 25 + 12.5, (y1+1) * 25);
        context.lineTo((x2+1) * 25, y2 * 25 + 12.5);


        context.arc((x1 * 25) + (12.5 / 2), (y1 * 25 + 12.5) + (12.5 / 2),
        Math.sqrt((12.5 * 12.5) + (12.5 * 12.5)) / 2,
        0.78,
        3.92,
        false);

        context.moveTo(x2 * 25 + 12.5,y2 * 25);

        context.arc(
        ((x2 + 1) * 25) - (12.5 / 2), (y2 * 25) + (12.5 / 2),
        Math.sqrt((12.5 * 12.5) + (12.5 * 12.5)) / 2,
        3.92,
        7.06,
        false);

    }
    context.stroke();
    context.closePath();
}
