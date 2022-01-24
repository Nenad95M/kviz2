const question=document.getElementById('question');//pristupa se pitanju koje se prikazuje
const choices=Array.from(document.getElementsByClassName('choices-text'));//pristupa se ponudjenim odgovorima da bi znali koji je odgovor izabran
const progressText=document.getElementById('progressText');//pristupa se polju koje oznacava koje je pitanje na radu
const scoreText=document.getElementById('score');//pristupamo poenima
const progressBarFull=document.getElementById('progressBarFull');//pristupamo progres baru koji graficki prikazuje koliko smo prosli pitanja
const game=document.getElementById('game');//id diva citave igre
const loader=document.getElementById('loader');//id loadera

let curentQuestions={}; //deklarisali smo prazan objekat u koji privremeno smestamo trenutno pitanje
let acceptingAnswers=false; //da li je pitanje prihvaceno, ne treba da bude dok se god ne klikne na tacno pitanje kada se menja stanje
let score=0; //pocetan broj poena, u pocetku je naravno nula
let questionCounter=0; //broji koje je pitanje po redu
let availableQuestions=[]; //preostala pitanja, smestice se u ovaj niz
let questions=[]; //niz pitanja koja uzimamo iz apija, json

//uzimamo api, kreiramo pitanja na osnovu objekta iz njega 
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")//link sa apijem, neke informacije se vide i iz linka, poput tezine, kategorije itd
.then(response=>response.json())//iz apija se kupi string i pristupa mu se sa json metodom da se pretvori u objekat
.then(loadedQuestionsObj=>{
    questions=loadedQuestionsObj.results.map(loadedQuestionElement=>{ //pristupa se kljucu results iz JSON objekta, koji je niz, pomocu map metode
    const formattedQuestion= {
    question:loadedQuestionElement.question //pristupa se samom pitanju
}
    const answerChoices=[...loadedQuestionElement.incorrect_answers];//pravi se lista od netacnik odgovora
    formattedQuestion.answer=Math.floor((Math.random()*4)+1); //mesa odgovore
    answerChoices.splice(formattedQuestion.answer-1, 0, loadedQuestionElement.correct_answer);//netacnim odgovorima se dodaje jedan koji je tacan, pomocu splice metode    

    answerChoices.map((choice, index)=>{ //prolazimo kroz odgovore
        formattedQuestion['choice'+(index+1)]=choice; //dodaje se +1 da prvi element ne bi bio nula
});
    return formattedQuestion; //vraca formattedQuestion objekat sa pitanjem i ponudjenim odgovorima
})
  startGame();//startuje kviz
})

//definisu se nepromenjive, 10 poena za tacan odgovor i maksimalno pitanja, u apiju ih ima 10 a ovde pravimo da bude 5
const CORRECT_BONUS=10;
const MAX_QUESTIONS=5;

const startGame=()=>{ //funkcija koja startuje igru
    questionCounter=0; //kada se pokrene igrica postavlja se na nulu 
    score=0; //isti je slucaj i sa poenima
    availableQuestions=[...questions]; //iz niza pretvramo u listu pomocu spred operatora, da bi smo listu ubacili kao dostupna pitanja u objekat availableQeestions
    getNewQuestion();
    game.classList.remove('hidden');//kada se pitanje ucitava, loader je aktivan, postavljeno je inace da bude sakrivena 
    loader.classList.add('hidden');//kada se pitanje ucita, on je sakriven
}
//?????????????
const getNewQuestion=()=>{
    if(availableQuestions===0||questionCounter>=MAX_QUESTIONS){ //ako nema vise pitanja ili su sva pitanja iskoriscena
        localStorage.setItem('mostRecentScore',score); //upisuju se poeni u localstorage //?????
        return window.location.assign('end.html');//prozor redirektuje na end html
    }
        questionCounter++; //brojac pitanja se inkrementira

    progressText.innerHTML=`Question ${questionCounter}/${MAX_QUESTIONS}`;

    progressBarFull.style.width=`${(questionCounter/MAX_QUESTIONS)*100}%` //racuna procenat za progres bar koji se zatim povecava
   
    const questionIndex=Math.floor(Math.random()*availableQuestions.length);//daje nam random indeks pitanja
   
    curentQuestions=availableQuestions[questionIndex]; //daje nam pitanje koje ima taj random indeks
   
    question.innerHTML=curentQuestions.question; //daje pitanje
    
    choices.map(choice=>{ //za svako pitanje se ispisuje broj
        const number=choice.dataset['number'];
        choice.innerHTML=curentQuestions['choice' + number];
    })
    availableQuestions.splice(questionIndex,1);//broj dostupnih pitanja ce biti manji za 1
        acceptingAnswers=true; //
}

choices.map(choice=>{ //event listener za klik na ponudjeni odgovor
    choice.addEventListener('click', e=>{
       if(!acceptingAnswers) return;
       acceptingAnswers=false;
       const selectedChoice=e.target; //prati koji je odgovor kliknut
       const selectedAnswer=selectedChoice.dataset['number']; //uzima vredonst iz kliknutog odgovora

       const classToApply=selectedAnswer==curentQuestions.answer?'correct':'incorrect'; //menja klase koje daju zelenu boju ako je odgovor tacan
       if(classToApply==="correct"){
        incrementScore(CORRECT_BONUS);
        }
    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(()=>{//koliko vremena treba da prodje dok se zelena klasa ne skloni i ucita novo pitanje
   selectedChoice.parentElement.classList.remove(classToApply);
   getNewQuestion();
    },1000)
    })
})

const incrementScore=number=>{ //sabiramo poene
    score+=number;
    scoreText.innerHTML=score;
}