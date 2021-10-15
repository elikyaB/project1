const URL = 'https://cdn.contentful.com/spaces/sg4gz6jul2c0/environments/master/entries?access_token=ESWPiLjC9_qDq-qRkwUKOWuL6oQI7klEEmS7XaVIogM&content_type=triviaq'

/* **************************************
** APP STATE
************************************** */

const state = {
    player1: 0,
    player2: 0,
    currentIndex: -1,
    which: true,
    win: false,
    usedIndexes: []
}

let questions = []
let loaded = false

/* **************************************
** Main DOM Element
************************************** */

// const $image = $('#gallery')
let $question = $('#question')
let $a = $('#a')
let $b = $('#b')
let $c = $('#c')
let $d = $('#d')
const $p1Score = $('#player1 h4').eq(0)
const $p2Score = $('#player2 h4').eq(0)

// console.log($p1Score)
// console.log($p2Score)

/* **************************************
** Functions
************************************** */

const newState = () => {
    state.player1 = 0
    state.player2 = 0
    state.currentIndex = -1
    state.which = true
    state.win = false
    state.usedIndexes = []
    loaded = false
}

const saveState = () => {
    for (key of Object.keys(state)) {
        localStorage.setItem(key, state[key])
    }
}

const loadState = () => {
    state.player1 = parseInt(localStorage.getItem('player1'))
    state.player2 = parseInt(localStorage.getItem('player2'))
    state.currentIndex = parseInt(localStorage.getItem('currentIndex'))
    state.which = (localStorage.getItem('which') == 'true')
    state.win = (localStorage.getItem('win') == 'true')
    localStorage.getItem('usedIndexes').split(',').forEach((n) => {
        state.usedIndexes.push(parseInt(n))
    })

}

const chooseAnswer = (event, question, usedIndex) => {
    // console.log(event)
    state.usedIndexes.push(usedIndex)
    if (event.target.innerText === question.answer) {
        console.log('correct')
        console.log(state)
        if (state.which) {
            state.player1++
            state.which = !state.which
        } else {
            state.player2++
            state.which = !state.which
        }
        setBoard(questions)
    } else {
        console.log('incorrect')
        console.log(state)
        setBoard(questions)
        state.which = !state.which
    }
    saveState()
    console.log('saved')
}

const setBoard = (q) => {
    // Getting a random question
    const randomUnusedIndex = () => {

        // Update players' scores in DOM
        $p1Score.text(state.player1)
        $p2Score.text(state.player2)

        // Generate a random index
        let randomIndex = Math.floor(Math.random()*q.length)

        // If questions are all asked or the game state is won
        if (state.usedIndexes.length === q.length || state.win === true) {

            // Replace #question with #victory 
            $('#question').empty()
            const $winner = $('#question').append($('<div>').attr('id', 'victory'))
            if ($p1Score > $p2Score) {$winner.text('Player 1 wins!')}
            else if ($p2Score > $p1Score) {$winner.text('Player 2 wins!')}
            else {$winner.text("It's a draw!")}

            // Replace #answer with #reset
            $('#answer').empty()
            $('#answer').append($('<div>').attr('id', 'reset').text('Reset?'))
            $('#reset').on('click', () => {

                // Clear results
                localStorage.clear()
                console.log('cleared')
                newState()

                // Rebuild #answer
                $('#answer').empty().append($('<ul>'))
                $('ul').append($('<li>').attr('id', 'a'))
                $('ul').append($('<li>').attr('id', 'b'))
                $('ul').append($('<li>').attr('id', 'c'))
                $('ul').append($('<li>').attr('id', 'd'))
                $a = $('#a')
                $b = $('#b')
                $c = $('#c')
                $d = $('#d')

                // Restart game loop
                randomUnusedIndex()
            })

            // If index is unused, add to list of used indexes, then generate random unasked question
        } else if (state.usedIndexes.indexOf(randomIndex) === -1) {
            
            // If there have been previous plays, load last seen question
            if (loaded == true) {
                randomIndex = state.currentIndex
                loaded = false
            }
            
            // Update currentIndex and select trivia question
            state.currentIndex = randomIndex
            const randomQuestion = q[randomIndex]

            // Update questions/answers in DOM
            // $image.innerHTML($('<img>'))
            $question.text(randomQuestion.question)
            $a.text(randomQuestion.a)
            $b.text(randomQuestion.b)
            $c.text(randomQuestion.c)
            $d.text(randomQuestion.d)

            // Reset event listeners
            $('li').off()
            $('li').on('click', (event) => {
                chooseAnswer(event, randomQuestion, randomIndex)
                // buttons, logic to determine correct, score update, resets board
            })

        // If index has already been picked, recurse to find next question
        } else {randomUnusedIndex()}
    }

    // Invoke question loop after functions are set
    randomUnusedIndex(q)
}

/* **************************************
** Main App Logic
************************************** */

$.ajax(URL)
.then((data) => {
    questions = data.items.map((q) => q.fields)
    // console.log(data)
    // console.log(questions[0].image)
    if (localStorage.getItem('usedIndexes') !== null) {
        loadState()
        loaded = true
        console.log('loaded')
    }
    setBoard(questions)
})