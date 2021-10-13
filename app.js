/* **************************************
** APP STATE
************************************** */

const state = {
    
    player1: 0,
    player2: 0,
    currentQuestion: {},
    which: true
}

let questions = []

/* **************************************
** Main DOM Element
************************************** */

const $question = $('#question')
const $a = $('#a')
const $b = $('#b')
const $c = $('#c')
const $d = $('#d')
const $p1Score = $('#player1 h4').eq(0)
const $p2Score = $('#player2 h4').eq(0)


// console.log($p1Score)
// console.log($p2Score)

/* **************************************
** Functions
************************************** */

const chooseAnswer = (event, question) => {
    // console.log(event)
    if (event.target.innerText === question.answer) {
        console.log('correct')
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
        setBoard(questions)
        state.which = !state.which
    }
}

const setBoard = (q) => {
    // Getting a random question
    const randomIndex = Math.floor(Math.random()*q.length)
    const randomQuestion = q[randomIndex]

    // Update question
    $question.text(randomQuestion.question)
    $a.text(randomQuestion.a)
    $b.text(randomQuestion.b)
    $c.text(randomQuestion.c)
    $d.text(randomQuestion.d)

    // Update players' scores
    $p1Score.text(state.player1)
    $p2Score.text(state.player2)

    
    $('li').off()
    $('li').on('click', (event) => {
        chooseAnswer(event, randomQuestion)
    })

}

/* **************************************
** Main App Logic
************************************** */

const URL = 'https://cdn.contentful.com/spaces/sg4gz6jul2c0/environments/master/entries?access_token=ESWPiLjC9_qDq-qRkwUKOWuL6oQI7klEEmS7XaVIogM&content_type=triviaq'
$.ajax(URL)
.then((data) => {
    questions = data.items.map((q) => q.fields)
    // console.log(data)
    // console.log(questions)
    setBoard(questions)
})

