/**
  * Classes: wordSearch and position
  * File: wordSearch.js 
  *
  * Definition:
  *		Creates and manages a wordsearch puzzle.
  *
 **/
var wordSearch = {
   	/* CLASS CONSTANTS */

   	// IDENTIFY THE TEXT DIRECTION IN THE GRID
   	HORIZONTAL:1,
   	VERTICAL:2,
   	REVERSE_HORIZONTAL:3,
   	REVERSE_VERTICAL:4,

   	DIAGONAL_DOWN:5,
   	DIAGONAL_UP:6,
   	REVERSE_DIAGONAL_DOWN:7,
   	REVERSE_DIAGONAL_UP:8,


    /* CLASS PROPERTIES */
    _self:this,
	Grid:new Array(),
	Words:new Array(),


	/* PUBLIC METHODS */
	// resets the grid and word list
	Reset: function(){
		this.Grid = new Array();
		this.Words = new Array();
	},


	Create: function(height, width, arrayOfWords){

		// RESET AND CREATE THE NEW GRID
		this.Reset();
        var newGrid = new Array(width);
        for (var i = 0; i < newGrid.length; i++){
            newGrid[i] = new Array(height);
        }

        for (var i = 0; i < newGrid.length; i++){
        	for (var j = 0; j < newGrid[0].length; j++){
            	newGrid[i][j] = '';
            }
        }

		this.Grid = newGrid;

		// ORDER WORDS SO THE LONGEST ONES ARE 
		// ADDED TO THE GRID FIRST
		for (var x = 0; x < arrayOfWords.length; x++){
			this.Words.push(new Word(arrayOfWords[x]));
		}
		this.SortByLength(this.Words);


		for (var x=0; x < this.Words.length; x++){
			 this.AddWord(this.Words[x]);
		}

		return this.Grid;
	},

	GetAnswerPositions:function(){
		var answers = new Array();
		for (var x=0; x < this.Words.length; x++){
			if (this.Words.posIndex != -1){
				answers.push(this.Words[x].GridPositions());
			}
		}
		return answers;
	},

	/**********************************************************/
	/* PRIVATE METHODS                                        */
	/**********************************************************/

	// SORT THE ARRAY LONGEST TO SHORTEST
	SortByLength: function(lArray){
		lArray.sort(function(a,b){
           return a.word.length < b.word.length
        });
		return lArray;
	},


	// ADD A WORD TO THE GRID (IF POSSIBLE)
	AddWord: function(newWord){
		newWord.availablePositions = this.GetPositions(newWord.word);

		if (newWord.availablePositions.length > 0){

			newWord.posIndex = Math.floor(
					(Math.random() * 
					newWord.availablePositions.length));

			// WRITE THE WORD INTO THE ARRAY
			// NOTE NO PRIORITY FOR WORDS WITH CROSSING POINTS
			// AS IN WORDSEARCH ALL ARE EQUALLY ACCEPTABLE
			var newPos = newWord.availablePositions[
								newWord.posIndex];

			// LOOP THROUGH THE WORD PLACING IT IN THE GRID
			for (	var count = 0; 
					count < newWord.word.length; 
					count++){
				if (newPos.direction == this.HORIZONTAL){
					this.Grid[newPos.x + count][newPos.y] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == this.VERTICAL){
					this.Grid[newPos.x][newPos.y + count] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == 
					this.REVERSE_HORIZONTAL){
					this.Grid[newPos.x-count][newPos.y] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == 
					this.REVERSE_VERTICAL){
					this.Grid[newPos.x][newPos.y-count] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == this.DIAGONAL_UP){
					this.Grid[newPos.x + count][newPos.y - count] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == this.DIAGONAL_DOWN){
					this.Grid[newPos.x + count][newPos.y + count] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == this.REVERSE_DIAGONAL_UP){
					this.Grid[newPos.x - count][newPos.y + count] = 
						newWord.word.charAt(count);
				} else if (newPos.direction == this.REVERSE_DIAGONAL_DOWN){
					this.Grid[newPos.x - count][newPos.y - count] = 
						newWord.word.charAt(count);
				}
			}
		}
	},

	// RETURNS ALL THE AVAILABLE VALID POSITIONS FOR PLACING THE WORD
	GetPositions: function(newWord){

		var positionArray = new Array();

		for (var x = 0; x < this.Grid.length; x++){
			for (var y = 0; y < this.Grid[0].length; y++){

				var newPos = undefined
				
				newPos = this.TestPosition(
					newWord,x,y,this.HORIZONTAL);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.VERTICAL);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.REVERSE_HORIZONTAL);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.REVERSE_VERTICAL);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.DIAGONAL_UP);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.DIAGONAL_DOWN);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.REVERSE_DIAGONAL_UP);
				if (newPos !== undefined) positionArray.push(newPos);

				newPos = this.TestPosition(
					newWord,x,y,this.REVERSE_DIAGONAL_DOWN);
				if (newPos !== undefined) positionArray.push(newPos);

			}
		}
		return positionArray;
	},

	// TRIES A POSITION TO SEE IF IT IS ACCEPTABLE
	TestPosition: function(newWord,x,y,direction){

		var crossingPoint = 0;

		// DEAL WITH HORIZONTAL AND VERTICAL WORD PLACEMENT
		// SEPARATELY
		if (direction == this.HORIZONTAL){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (x + newWord.length > this.Grid.length)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD AND
				//		IT DOESN'T MATCH THE ONE IN THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x + count][y].length > 0)&&
					(this.Grid[x + count][y] != 
						newWord.charAt(count))){
					return;
				} else if (this.Grid[x + count][y] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.VERTICAL){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (y + newWord.length > this.Grid[0].length)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x][y + count].length > 0)&&
					(this.Grid[x][y + count] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x][y + count] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.REVERSE_HORIZONTAL){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (x - newWord.length + 1 < 0)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x - count][y].length > 0)&&
					(this.Grid[x - count][y] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x - count][y] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.REVERSE_VERTICAL){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (y - newWord.length + 1 < 0)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x][y - count].length > 0)&&
					(this.Grid[x][y - count] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x][y - count] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.DIAGONAL_UP){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (y - newWord.length < 0)
				return;

			if (y + newWord.length > this.Grid[0].length)
				return;

			if (x + newWord.length > this.Grid.length)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x + count][y - count].length > 0)&&
					(this.Grid[x + count][y - count] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x + count][y - count] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.DIAGONAL_DOWN){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (x + newWord.length > this.Grid.length)
				return;

			if (y + newWord.length > this.Grid[0].length)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x + count][y + count].length > 0)&&
					(this.Grid[x + count][y + count] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x + count][y + count] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.REVERSE_DIAGONAL_UP){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (x - newWord.length + 1 < 0)
				return;

			if (y + newWord.length > this.Grid[0].length)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x - count][y + count].length > 0)&&
					(this.Grid[x - count][y + count] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x - count][y + count] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		} else if (direction == this.REVERSE_DIAGONAL_DOWN){

			// UNACCEPTABLE IF THERE IS NO SPACE IN THE GRID
			if (x - newWord.length + 1 < 0)
				return;

			if (y - newWord.length + 1 < 0)
				return;

			for (var count = 0; count < newWord.length; count++){

				// 2 CHECKS:
				// 1 - UNACCEPTABLE IF THERE IS A CHARACTER ON
				//		ON THE PROPOSED PATH OF THIS WORD
				// 2 - ACCEPTABLE IF THE CHARACTER MATCHES THE
				//		THE CHARACTER IN THIS WORD - ADD
				//		A CROSSING POINT
				if ((this.Grid[x - count][y - count].length > 0)&&
					(this.Grid[x - count][y - count] != 
						newWord.charAt(count))) 
					return;
				else if (this.Grid[x - count][y - count] == 
						newWord.charAt(count).toString()){
					crossingPoint++;
				} 
			}

		}

		// IF NO PROBLEMS RETURN THE POSITION DETAILS
		return new Position(x,y,direction);
	}



};
 /**
  * END CLASS DEFINITION
  **/




/**
  * CLASS: position
  * 
  * Holds the details of a valid position on the grid
  *
  * X and Y - indicate horizonal and vertical positions
  * on the grid.
  *
  * Direction:
  * 	1 indicates horizontal
  * 	-1 indicates vertical
  * CrossingPoint:
  * 	Indicates the number of valid crossing points with 
  *		other words already on the grid.
 **/

function Answer(x1,y1,x2,y2,direction){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.direction = direction;
}

function Position(x,y,direction){
	this.x = x;
	this.y = y;
	this.direction = direction;
}

function Word(txt){
	this.word = txt;
	this.availablePositions = new Array();
	this.orphaned = false;
	this.posIndex = -1;

	this.GridPositions = function(){
		var lPositions = {
			x1:-1,y1:-1,x2:-1,y2:-1,direction:-1
		};

		// DEFAULT ALL TO STARTING POSTION
		lPositions.x1 = this.availablePositions[this.posIndex].x;
		lPositions.y1 = this.availablePositions[this.posIndex].y;
		lPositions.x2 = this.availablePositions[this.posIndex].x;
		lPositions.y2 = this.availablePositions[this.posIndex].y;
		lPositions.direction = this.availablePositions[this.posIndex].direction;
		
		// MAKE ADJUSTMENT BASED ON DIRECTION OF TEXT
		switch (this.availablePositions[this.posIndex].direction){

			case wordSearch.HORIZONTAL:
				lPositions.x2 += this.word.length - 1;
				break;
		   	case wordSearch.VERTICAL:
				lPositions.y2 += this.word.length - 1;
				break;

		   	case wordSearch.REVERSE_HORIZONTAL:
				lPositions.x1 = lPositions.x1 - this.word.length + 1;
				break;
		   	case wordSearch.REVERSE_VERTICAL:
				lPositions.y1 = lPositions.y1 - this.word.length + 1;
				break;

		   	case wordSearch.DIAGONAL_DOWN:
				lPositions.x2 += this.word.length - 1;
				lPositions.y2 += this.word.length - 1;
				break;
		   	case wordSearch.DIAGONAL_UP:
				lPositions.x2 += this.word.length - 1;
				lPositions.y2 = lPositions.y2 - this.word.length + 1;
				break;

		   	case wordSearch.REVERSE_DIAGONAL_DOWN:
				lPositions.x1 = lPositions.x1 - this.word.length + 1;
				lPositions.y1 = lPositions.y1 - this.word.length + 1;
				break;
		   	case wordSearch.REVERSE_DIAGONAL_UP:		
				lPositions.x1 = lPositions.x1 - this.word.length + 1;
				lPositions.y1 += this.word.length - 1;
				break;
   		}
   		return lPositions;
	}

}

function AlternativeGrid(){
	this.Grid = new Array();
	this.Words = new Array();
	this.NumberOfOrphans = 0;
}

 /**
  * END CLASS DEFINITION
  **/
