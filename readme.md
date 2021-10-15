# Project 1 Documentation - The Weab Test
## by Elikya Bokanga


## Introduction

The Weab Test is a simple, 2-player, 20 questions style quiz that aims to guage the general anime and manga knowledge of the test taker.

## Technologies Used

- HTML
- CSS
- JS
- jQuery
- Contentful as CMS

## Design

The Weab Test was designed from a mobile-first perspective. In order to be responsive, two layouts were planned:

- Header, scoreboard, question and answers in a column as a minimalist mobile interface;
- Score columns on either side of the game board (containing the header, question, and answers).

The following features were successfully incorporated into the game:

- Save/load functions that stores/retrieves the game's state from within localStorage, including the last called question,
- Use of recursion to find new indexes,
- A victory screen that declares the winner,
- And a reset button that clears the state and repopulates the board without refreshing the browser (deliberately avoiding the suggestion from James (Office Hours TA) to use location.reload())

## Challenges

### What I had trouble with
As a disclaimer, I was not liberal enough in my use of git commits, so the following issues are mostly based off of memory. Secondly, a lot of the problems I had were in the obscenely large ```setBoard()``` function, so it would be difficult to summarize the nature of the problem by documenting the whole thing. Take this more as a series of things I learned than a hard history.

#### loadState()
For awhile I had an issue getting ```loadState()``` to run more than one time. In general, it was set up something along these lines:

```js
} else if (state.usedIndexes.indexOf(randomIndex) === -1) {
    if (state.currentIndex !== 'null') {
        randomIndex = state.currentIndex
        state.currentIndex = 'null'
    } else {state.currentIndex = randomIndex}
```

The intent was that if a game was saved, state.currentIndex would not be null, therefore it could dump its value into randomIndex before returning to null. However after one use of loadState(), state.currentIndex started returning NaN instead. My only guess is that it had something to do with how loadState() was pulling strings out of localStorage and generally using parseInt() to change it into an index. 'Null' might register as valid target for parseInt(), or perhaps it was just mucking up the whole thing.

The solution that I came to was to separate  the "loaded" indicator from state.currentIndex into a ```let loaded = false``` up in the App State section, and toggle loaded manually while leaving state.currentIndex to actual numbers.

```js
if (loaded == true) {
    randomIndex = state.currentIndex
    loaded = false
}
```

#### Event listener auto-triggers
Once again I ran into problems trying to do everything in a single line. Under the setBoard function's conditions to determine whether the questions have been used up or if the game has been won, I tried to copy the event listener from the template example in the video for this project to create the reset button.

```js
const reset = (q) => {
    localStorage.clear()
    newState()
    setBoard(q)
}
...

$('body).off()
$('#answer').empty().on('click', reset(q))
```

I went to office hours for this and there was no good reason we could determine that this simple line didn't work. I tried refactoring the event listener using vanilla JS, toggling the parentheses on reset(), including or not including the q, nothing working. As soon as the game ended, the console.log() would immediately show "cleared" from the reset, which wouldn't give the user any time to see the victory page.

Eventually I figured out i could just make a new element inside the emptied div#answer and I could give it an event listener without it going off immediately.

```js
$('#answer').empty()
$('#answer').append($('<img>').attr('id', 'reset'))
$('#reset').on('click', () => {

    // Clear results
    localStorage.clear()
    console.log('cleared')
    newState()
    ...
}
```

My guess is that the emptied div#answer gets triggered by the fact that it previously had event listeners on it, so the click of the last answer bleeds into the new click function. When in doubt, put it on something else.

### What I didn't have time for
There are two features that I'm really sad I didn't have time to attempt to implement.

#### Image Gallery
I intended to have all the trivia questions tied to an image URL that could be pulled from the dataset's fields and parsed into an img obj. Unfortunately, while digging through the console.log to see what the mapped data shows, I discovered that the most you can get out of it is a content ID.

```js
console.log(questions[0].image.sys)
```

There is probably documentation that I could use to figure it out, but I couldn't immediately decipher what I had found so I had to cut the feature from the project. I could have added the images manually by having them in the same file and creating a joint index, but I felt like that would have defeated the purpose of using Contentful.

#### Points Meter

The reason for the rotation of the nimbus clouds in the desktop version of the site was to serve as a points meter. The goal would've been to have the clouds push themselves down .scoreColumn via margin adjustments to indicate how close or far away one player was from another in points. 