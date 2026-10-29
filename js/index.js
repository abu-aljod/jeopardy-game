// all of the dom elements we will need to reference in the code
const startBtn = document.getElementById("start-game");
const restartBtn = document.getElementById("restart");
const tHead = document.getElementById("t-header");
const tBody = document.getElementById("t-body");
const loading = document.getElementById("loading");

// some constants we will use in the code
// the number of columns and rows in the table, and the possible states of a cell
const COLUMN_COUNT = 6;
const ROW_COUNT = 5;


// we need to first get all of the categories with the following url
// "https://rithm-jeopardy.herokuapp.com/api/categories?count=[**integer**]"
// then we need to get all the game data for each category, with the following url
// "https://rithm-jeopardy.herokuapp.com/api/category?id=[**integer**]"


// we need to build a data structure to feed into the table
let categoryIds= [];
let gameDataList = []; 

function renderCategoryHeaders(titles = Array(COLUMN_COUNT).fill("No Category")) {
    for (let i = 0; i < COLUMN_COUNT; i++) {
        // create a table data cell, and append it to the headers row
        let headRow = document.createElement("td");
        headRow.textContent =(titles[i]);
        tHead.appendChild(headRow);
    }
}

function clearHeaders() {
    let td = tHead.children;
    for (let i = 0; i < COLUMN_COUNT; i++) {
        // clear the text content to replace it with the new header
        td[i].textContent = "";
    }
}

function renderGameCells(rowCount = ROW_COUNT, colCount = COLUMN_COUNT) {
    // get the number of rows that should be created
    for (let i = 0; i < rowCount; i++) {
        // create a new table row
        let newRow = document.createElement("tr");
        // and append it to the table body
        tBody.appendChild(newRow);
        for (let j = 0; j < colCount; j++) {
            // for each row, create its data cells
            // for each row, the number of data cells would be the number of columns
            let td = document.createElement("td");


            td.id = (`${i}-${j}`);
            td.textContent = (`$${(i+1) * 100}`);
            // append each table data to the row that was created
            newRow.appendChild(td);
        }
    }
}

function clearCells() {
    // go through each table row and table data into it and clear their text content
    let trs = tBody.children;
    for (let i = 0; i < trs.length; i++) {
        let tds = trs[i].children;
        for (let j = 0; j < tds.length; j++) {
            tds[j].textContent = "";
        }
    }
}

function generateRandom(ids) {
    if (!Array.isArray(ids) || !ids.length) {
        // if the array passed in is empty or if it's not an array, return an error
        alert("Something went wrong");
        throw new Error("No data to generate based on them");
    }

    let random = Math.floor((Math.random()) * ids.length);

    return random;
}

// check if the number was generated before
function isGenerated (num, generated) {
    // if the value is not a number, return an error
    // the numbers generated would be added into an array that is passed as a parameter
    if (typeof num !== 'number' || !Array.isArray(generated) || !generated.length) {
        throw new Error("Insert a valid parameter");
    }

    for (let genNum of generated) {
        if (num === genNum) {
            // if the number is already generated return true saying "yes this is already generated"
            return true;
        }
    }
    // if the loop finishes without returning, that means the number doesn't exist
    // so return false to say this is not generated and you could use it safely
    return false;
}

// get category ids and return them as an array.
async function fetchCategories() {
    try {
        // try to send a request for this api
        let response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/categories?count=100`);

        // if responses is empty meaning we didn't get something back, retrun an error
        if (!response) {
            alert("Something went wrong");
            throw new Error("Something went wrong");
        }
    
        let arr = response.data;
        // used numbers would be added here
        let used = [];
        // loop over the response and get the id from the data and push it to the array
        for (let i = 0; i < COLUMN_COUNT; i++) {
            let index = generateRandom(arr);

            // we need to check if the numbers were used before so we don't get the same data twice
            // don't run the first time
            if (i !== 0) {
                while(isGenerated(index, used)) {
                    index = generateRandom(arr);
                }
            }
            used.push(index);
            let id = response.data[index].id;
            categoryIds.push(id);
        }
        
        console.log(response);
        console.log(categoryIds);
        // return the array with the ids
        return categoryIds;
    } catch(error) {
        // if something goes wrong, catch it and print it out
        console.error(error);
    }
}

// fetch clue data for a single category id.
async function fetchQuestionsAnswers(categoryId) {
    // make sure the input is a number
    if (typeof categoryId !== 'number' || !categoryId) {
        alert("Category ID should be a number")
        throw new Error("Category ID should be a number");
    }

    try {
        let response = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${categoryId}`);

        if (!response) {
            alert("Something went wrong");
            throw new Error("Something went wrong");
        }

        // create an empty object
        const gameInfo = {};

        // add the title of this id
        gameInfo.title = response.data.title;
        
        // create an empty array to add the clues to it
        const clues = [];
    
        // the ROW_COUNT idicates how many clues we want, so loop through the clues as many times as how many rows we have
        for (let i = 0; i < ROW_COUNT; i++) {
            // get the answer, question and the value from the clues array, each time get the clue with index of i value
            let clueAns = response.data.clues[i].answer;
            let clueQues = response.data.clues[i].question;

            let cluesInfo = {};
 
            // add the info into the object
            cluesInfo.question = clueQues;
            cluesInfo.answer = clueAns;
            clues.push(cluesInfo);
        }

        gameInfo.clues = clues;

        gameDataList.push(gameInfo);
        return gameDataList;
    } catch(error) {
        console.error(error);
    }
}

// When the user clicks start game, load the data to the table
startBtn.addEventListener('click', async function() {
    // while info are loading, turn the loading spinner on
    setLoading(true);

    try {
        // empty out the arrays and start fresh
        categoryIds = [];
        gameDataList = [];
        // fetch categories
        await fetchCategories();

        // clear the headers and cells, and get them ready to be refilled
        clearHeaders();
        clearCells();

        // add this class to the table body to indicate starting a game
        tBody.classList.add("filled");
        let headers = tHead.children;
        let rows = tBody.children;

        for (let i = 0; i < COLUMN_COUNT; i++) {
            // get the id from the array
            let id = categoryIds[i];
            await fetchQuestionsAnswers(id);

            // fill the headers with the new headers
            let title = gameDataList[i].title;
            headers[i].textContent = title.toUpperCase();

            // reset the cells content. The number of clues is the number of rows so I'm using ROW_COUNT
            for (let j = 0; j < ROW_COUNT; j++) {
                let cells = rows[j].children;

                // the clues should always be ordered from 100-500 which is the row number * 100
                let row_val = (j + 1) * 100;

                // get the value and fix its format
                let val = `$${row_val}`;

                // I want to fill the cell that is under the category at the specific column I'm working on which is i, j indicates the rows
                cells[i].textContent = val;
            }
        }
    } catch (error){
        alert("Something went wrong, try again");
        console.log(error);
    } finally {
        // after everything loads, turn it off
        setLoading(false);
    }
})

// reveal question first, then answer, based on cell state.
function processCellClick(cell) {
    if (!cell || cell.tagName !== "TD") {
        throw new Error("Unexpected input or wrong target");
    }
    // get the id of the cell
    let cellId = cell.id;

    // I have structured the ids to be this way
    // x-y, where x would the row number which indicates the value, and y is the column number, which are the different categories
    // so I'm going slice the the different pieces
    let levelVal = cellId.slice(0,1);
    let category = cellId.slice(2);

    // accessing the data
    // category index indicates which category to choose from
    if (!gameDataList.length) {
        alert("Something went wrong. Game might not be started yet");
        throw new Error("Something went wrong. Game might not be started yet");
    }

    console.log(gameDataList, category, levelVal);
    let clue = gameDataList[Number(category)].clues[Number(levelVal)];


    if (!clue) {
        alert("Something went wrong");
        throw new Error("Something went wrong")
    }
    let value = (Number(levelVal) + 1) * 100;
    let question = clue.question;
    let answer = clue.answer;

    // convert it to the way it's displayed so we could compare it after
    let userPointVal = `$${value}`;

    // if the clell content is the value that means we should display the question
    if (cell.textContent === userPointVal){
        cell.textContent = question;
        return question;
    }

    // if the question is what's displayed that means we shall now display the answer 
    else if (cell.textContent === question) {
        cell.textContent = answer;
        return answer;
    }

    // if none of above that means the answer is what being displayed so there is nothing to do
    else {
        console.log("This is the answer, you could click 'Start Game' to start again");
        return value;
    }
}



// Hint: toggle spinner visibility and start-button disabled state.
function setLoading(isLoading) {
    try {
        // if isLoading is true it toggles the class on, if false it toggles it off
        loading.classList.toggle("isLoading", isLoading);
        // I want the opposite value of the attribute, so if isLoading true, I want hidden to be false
        loading.setAttribute("aria-hidden", `${!isLoading}`);

        // I want the value to be the state of isLoading
        startBtn.disabled = isLoading;
        restartBtn.disabled = isLoading;
        
    } catch (error) {
        console.error(error);
    }
}


tBody.addEventListener('click', function(e) {
    let cell = e.target;
    processCellClick(cell);
})


// render the default board on page load.
window.addEventListener("load", function() {
    renderCategoryHeaders();
    renderGameCells();
});

// if the use restarts just restart the rendering
restartBtn.addEventListener('click', function() {
    // while there is at least one child, remove it from the table body and head

    while(tHead.firstChild) {
        tHead.removeChild(tHead.firstChild);
    }

    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // and clear out data saved previously
    gameDataList = [];
    categoryIds = [];

    // remove the class
    tBody.classList.remove("filled");
    // then render the new page
    renderCategoryHeaders();
    renderGameCells();
})
