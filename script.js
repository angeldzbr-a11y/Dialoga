// Cenários do protótipo v2 (conteúdo mantido)
const data = {
  "Cidadania": [
    "Na escola, um colega apresenta uma opinião diferente da maioria. Alguns estudantes começam a interrompê-lo. Como você agiria?",
    "Durante um trabalho em grupo, um estudante é deixado de lado porque os colegas não consideram suas ideias. O que você faria?",
    "Em uma conversa, alguém faz uma afirmação preconceituosa sobre outro grupo. Como você reagiria?",
    "Sua turma precisa decidir como melhorar a convivência entre os estudantes. Que atitude você sugeriria?"
  ],
  "Diversidade e Respeito": [
    "Um estudante novo chega à turma com costumes diferentes e alguns colegas fazem comentários sobre isso. Como você agiria?",
    "Durante uma atividade, um colega apresenta uma opinião diferente sobre um tema cultural. Como você responderia?",
    "Você percebe que uma pessoa está sendo excluída de uma atividade por uma característica pessoal. O que faria?",
    "Sua turma precisa criar uma ação para valorizar as diferenças. Qual seria sua sugestão?"
  ],
  "Cultura de Paz": [
    "Dois colegas começam uma discussão durante uma atividade e o clima fica tenso. Como você agiria?",
    "Em um grupo de mensagens da turma, começa uma discussão por causa de uma opinião diferente. O que você faria?",
    "Um colega pede ajuda depois de um conflito com outra pessoa. Como você poderia ajudar?",
    "A turma quer evitar novos conflitos e melhorar o diálogo. Que atitude poderia contribuir para isso?"
  ]
};

const MIN = 5;                 // mínimo de caracteres (igual ao v2)
let topic = "", i = 0, answers = [];
const finished = new Set();    // temas concluídos nesta sessão
const $ = id => document.getElementById(id);

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  scrollTo(0, 0);
}

function home() {
  document.querySelectorAll("#topics button").forEach(b => {
    b.querySelector(".done").hidden = !finished.has(b.dataset.t);
  });
  show("home");
}

function start(t) {
  topic = t;
  $("topic").textContent = t;
  show("intro");
}

function begin() {
  i = 0;
  answers = [];
  render();
  show("scenario");
}

function render() {
  $("topicLabel").textContent = topic;
  $("number").textContent = "Cenário " + (i + 1);
  $("count").textContent = (i + 1) + " de 4";
  document.querySelectorAll("#steps i").forEach((el, k) => el.classList.toggle("on", k <= i));
  $("steps").setAttribute("aria-valuenow", i + 1);
  $("text").textContent = data[topic][i];
  $("answer").value = answers[i] || "";
  $("err").textContent = "";
  $("prev").hidden = i === 0;
  $("nextBtn").textContent = i < 3 ? "Continuar" : "Enviar e ver feedback";
  updateCount();
  scrollTo(0, 0);
}

function updateCount() {
  $("chars").textContent = $("answer").value.length + " caracteres";
}

function next() {
  const value = $("answer").value.trim();
  if (value.length < MIN) {
    $("err").textContent = "Escreva uma resposta antes de continuar.";
    $("answer").focus();
    return;
  }
  answers[i] = value;
  if (i < 3) {
    i++;
    render();
  } else {
    finish();
  }
}

function finish() {
  $("feedbackTitle").textContent = "Sua reflexão sobre " + topic;
  $("recap").innerHTML = "";
  answers.forEach((a, k) => {
    const li = document.createElement("li");
    li.textContent = a;               // textContent evita injeção de HTML
    $("recap").appendChild(li);
  });
  finished.add(topic);
  show("loading");
  setTimeout(() => {
    show("feedback");
    $("feedbackTitle").focus();
  }, 1600);
}

// eventos
document.querySelectorAll("#topics button").forEach(b => b.addEventListener("click", () => start(b.dataset.t)));
$("answer").addEventListener("input", () => { $("err").textContent = ""; updateCount(); });
$("prev").addEventListener("click", () => { answers[i] = $("answer").value.trim(); i--; render(); });
document.querySelectorAll(".chips button").forEach(c => c.addEventListener("click", () => {
  const a = $("answer");
  a.value = (a.value ? a.value.replace(/\s*$/, " ") : "") + c.dataset.s;
  a.focus();
  updateCount();
}));
$("sz").addEventListener("click", e => {
  const on = document.documentElement.classList.toggle("big");
  e.currentTarget.setAttribute("aria-pressed", on);
});
