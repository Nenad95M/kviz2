const highScoresList=document.getElementById("highScoresList");//pristupamo html elementu gde upisujemo poene
const highScores=JSON.parse(localStorage.getItem("highScores")) || []; //pristupamo localstorigu gde uzimamo highscores iz JSON-a, i to pretvaramo u objekat

let html='';//kreiramo prazan html gde ce se upisivati rezultati, izvan je jer se prolazi vise puta pa ce svaki put da upise prazan sadrzaj
highScores.map(score=>{
html+=`
<li class="high-score">Igrač ${score.name} - ${score.score} poena</li>
`
highScoresList.innerHTML=html;
})
