//Pristupamo elementima iz HTML-a i localstoriga
const username=document.getElementById('username');
const saveScoreBtn=document.getElementById('saveScoreBtn');
const finalScore=document.getElementById('finalScore');  //poslednji rezultat, prikazuje se kada zavrsimo igru pa napisemo svoje ime
const mostRecentScore=localStorage.getItem('mostRecentScore');

const highScores=JSON.parse(localStorage.getItem("highScores")) || []; //kupimo poene iz storidza i pretvaramo ih u objekat, ako nema nista bice prazan niz samo
const MAX_HIGH_SCORES=5; //koliko da prikaze najvecih poena na ekranu
finalScore.innerHTML=mostRecentScore; //poslednji rezultat

username.addEventListener('keyup',()=>{ //osluskivac dogadjaja za username input polje
    saveScoreBtn.disabled=!username.value; //dugme je ugaseno sve dok se nesto ne upise u username input polje
})

const saveHighScore= e=>{ //funkcija za cuvanje rezultata i imena igraca
    e.preventDefault();
    const scoreObj={
        name:username.value,
        score:mostRecentScore
    }
highScores.push(scoreObj); //pristupamo nizu highScores, i dodajemo objekat u njega
highScores.sort((a,b)=>b.score-a.score); //rotiraju se vrednosti
highScores.splice(MAX_HIGH_SCORES); //ako se upise sesti rezultat, on se izbacuje i ostaje samo pet elemenata

    localStorage.setItem("highScores", JSON.stringify(highScores)) //upisuje je u local storidz, a pre toga se pretvara u string zbog toga
    window.location.assign("index.html");//kada se sve zavrsi, navigira nas na pocetnu stranicu (index.html)
} 
