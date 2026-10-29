# Game overview

On this game, there are different categories each with different levels. When you click the box reveals the question, when you click the second time, it reveals the answer.


# What the user sees

once the user opens the game, they see the home page. The home page welcomes the user and gives them the option to start playing, go to the page that displays some information about the game, or a third button that takes the user to github to view the game source if they'd like to.

The buttons are about button tags nexted into anchor tags. If the user clicks "About Game", they hit the link that would display the a simple page that gives some information about the game and how to paly. If they click "Start Playing" instead, they would go to the game page, and if they prefer to view the page source, the link takes them to a new page which is the game repo on GitHub. (It takes them to a new page because I've indicated that on the tag attribute <a .... target="_blank">)

# rendering the table once loaded
```js 
// render the default board on page load.
window.addEventListener("load", function() {
    renderCategoryHeaders();
    renderGameCells();
});

```

I've set the page to by default render the table once it loads, with empty categories.

  # rendering the table
  
  there are Column Count, and Row Count that I've set to the number of categories I want

  based on them, the functions render the number of headers and cells needed

# Loading data

The page listens for clicking the start button

once the user clicks to start, the page refills the headers with the new categories rendered and gives the cells a new class to show the user that the game was started

```js

startBtn.addEventListener('click', async function() { 
    ..... 
})

```

once the user clicks:

I call "clearHeaders" and "clearCells" which basically delete the old info to refills with the new info(Headers, and levels)

I call the "fetchCatigories" and "fetchQuestionsAnswers", those functions: fethc data from the API, get the ids for each category, save them to the ids array. Then for each id, fetch its data, save the details (Titles, Clues:Questions, Answers, and Value) of each category and pushes those info to details array.

Then access the titles from the array by the column index and fill the header of this column with the title of this category

# Revealing clues and answers

``` js

tBody.addEventListener('click', function(e) {
    let cell = e.target;
    processCellClick(cell);
})
```

Once a user clicks any cell, I first make sure that they are clicking a table data cell, and that there are information rendered and filled in the game details array (meaning a game was started). After that, I check which cell is clicked, what categroy and waht level. Based on those information I get the clue from the array.

Now I check which state they are on: 

if the cell is displaying the level, that means they are trying to access the question so give them the clue question

if the question is being displayed meaning they want the answer, give them answer

if none of above, that means the answer is being displayed so do nothing bacause this is the last step.

# restart

When the user clicks restart, First I remove all children of the table, clear out the data array, then render the default table


