const topics = [
  { title: 'The pipeline cast', text: 'A trigger starts a pipeline. The pipeline moves through stages, which contain jobs. Jobs contain tasks. Completed builds produce artifacts, which can be deployed to targets.', tip: 'Memory chain: trigger -> pipeline -> stage -> job -> task -> artifact -> target.' },
  { title: 'Agent choice', text: 'Microsoft-hosted means a fresh Microsoft-managed VM for each run, automatic maintenance, and job time limits. Self-hosted means you manage the machine and software, with more control and no job time limit.', tip: 'Choose self-hosted for custom software, private networks, or persistent dependencies.' },
  { title: 'Four job types', text: 'Agent pool jobs run on a pool agent. Container jobs run inside a container on an agent. Deployment group jobs target registered machines. Agentless (server) jobs run on Azure DevOps itself.', tip: 'Ask: does this job need a machine, a container, target machines, or no agent?' },
  { title: 'What a pool means', text: 'A pool organizes agents and defines their sharing boundary. Organization pools can be shared across projects; project pools are limited to a project unless linked to an organization pool.', tip: 'A pool is the team or organization shelf that agents sit on.' },
  { title: 'The predefined pool', text: 'The Azure Pipelines pool provides Microsoft-hosted agents without you configuring build infrastructure. Images change over time, so check Microsoft documentation for the current operating systems and installed software.', tip: 'YAML pipelines keep CI/CD definitions with the code; either YAML or classic pipelines still need an agent to run work.' },
  { title: 'Which pool scenario?', text: 'Team-specific: one team owns the machines. Organization-wide: infrastructure shares with every project. Selective sharing: only named projects link to the organization pool.', tip: 'The scope is the decision: one team, everyone, or a chosen set.' },
  { title: 'The agent pulls', text: 'The agent initiates HTTPS communication. After registration it gets a listener OAuth token, polls for jobs, receives a job-specific token, runs the job, discards that token, and polls again.', tip: 'Pull model: the agent asks Azure Pipelines for work.' },
  { title: 'Network line of sight', text: 'For deployment, the agent must reach the target server and Azure Pipelines. Microsoft-hosted agents usually reach Azure resources; on-premises targets behind firewalls usually need a self-hosted agent inside that network.', tip: 'Place the agent where it can see both sides: Azure DevOps and the target.' },
  { title: 'Security and operations', text: 'Registration needs an agent-pool administrator and local administrator rights. A PAT is used only during registration. Service mode is normally recommended; interactive mode is for cases such as UI tests and has physical security risks.', tip: 'Pool roles: organization Reader, Service Account, Administrator; project Reader, User, Administrator.' }
];

const cards = [
  ['What does an agent do?', 'An installable program that runs one build or deployment job at a time.'],
  ['What is the biggest Microsoft-hosted trade-off?', 'It is easy and fresh each run, but job time limits apply and the VM is discarded afterward.'],
  ['When is self-hosted a good choice?', 'When you need custom software, private network access, persistent dependencies, or no job time limit.'],
  ['What is an agent pool?', 'A group that organizes agents and defines the boundary over which they can be shared.'],
  ['Name all four job types.', 'Agent pool, container, deployment group, and agentless/server jobs.'],
  ['What does an agentless job need?', 'No build agent. It runs on Azure DevOps for work such as approvals, REST calls, or Azure Functions.'],
  ['Who can register an agent?', 'Someone who is an agent-pool administrator and a local administrator on the server.'],
  ['When is a self-hosted agent needed for deployment?', 'When it must reach an on-premises target that a Microsoft-hosted agent cannot reach through the firewall.'],
  ['What is the communication model?', 'Pull: the agent initiates HTTPS communication and polls Azure Pipelines for work.'],
  ['What is a PAT used for?', 'Agent registration only; it is not retained for ongoing communication.'],
  ['Service or interactive mode?', 'Service mode is recommended for most production cases; interactive mode suits UI tests but creates security risks.'],
  ['What changes between organization and project pool roles?', 'Organization roles include Reader, Service Account, Administrator; project roles include Reader, User, Administrator.']
];

const questions = [
  { q:'Your build needs a private tool installed and must access an on-premises server behind a firewall. Which agent?', options:['Microsoft-hosted','Self-hosted','Agentless'], answer:1, why:'Self-hosted gives you control of software and network placement.' },
  { q:'Which job type is best for an approval or REST API call that needs no build environment?', options:['Container job','Deployment group job','Agentless/server job'], answer:2, why:'Agentless jobs run directly on Azure DevOps.' },
  { q:'What happens after an agent finishes a job?', options:['It keeps the job token forever','It discards the job token and polls again','The server logs into the agent'], answer:1, why:'The job-specific OAuth token is discarded; the listener token is used to keep monitoring.' },
  { q:'You need a pool shared by three projects but not the rest of the organization. What is the right pattern?', options:['A project pool in each project with separate agents','An organization pool linked only to those projects','The predefined Azure Pipelines pool'], answer:1, why:'Selective sharing links chosen project pools to one organization pool.' },
  { q:'Which statement about agent versions is correct?', options:['Major and minor upgrades are always automatic','Minor updates can be automatic; major updates need manual updates','Interactive agents always auto-upgrade'], answer:1, why:'Major versions require manual upgrades, and interactive agents require manual upgrades regardless.' }
];

const state = JSON.parse(localStorage.getItem('pipelineStudy') || '{"done":[],"known":[],"score":null,"lastStudy":null}');
const save = () => localStorage.setItem('pipelineStudy', JSON.stringify(state));
const $ = id => document.getElementById(id);

function renderTopics() {
  $('topicGrid').innerHTML = topics.map((topic, index) => `<article class="topic ${state.done.includes(index) ? 'is-done' : ''}"><span class="topic-number">0${index + 1}</span><h3>${topic.title}</h3><p>${topic.text}</p><span class="topic-tip">${topic.tip}</span><button data-topic="${index}" type="button">${state.done.includes(index) ? 'Mark for review' : 'Mark complete'}</button></article>`).join('');
  document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => { const index = Number(button.dataset.topic); state.done = state.done.includes(index) ? state.done.filter(item => item !== index) : [...state.done, index]; state.lastStudy = new Date().toISOString().slice(0,10); save(); renderTopics(); updateProgress(); }));
}
function updateProgress() { const count = state.done.length; $('progressText').textContent = `${count} / ${topics.length} topics`; $('progressFill').style.width = `${count / topics.length * 100}%`; $('progressMessage').textContent = count === 0 ? 'No pressure. One topic is enough for today.' : count === topics.length ? 'You have the map. Use the cards to make it stick.' : `${topics.length - count} topics left. A tiny session still counts.`; $('quizScore').textContent = state.score === null ? '' : `Last quiz: ${state.score}/${questions.length}`; $('streakLabel').textContent = state.lastStudy === new Date().toISOString().slice(0,10) ? 'Studying today' : '0 days'; }

let cardIndex = 0;
function renderCard() { const [question, answer] = cards[cardIndex]; $('cardQuestion').textContent = question; $('cardAnswer').textContent = answer; $('cardCount').textContent = `Card ${cardIndex + 1} of ${cards.length}`; $('flashcard').classList.remove('is-flipped'); }
function showView(name) { document.querySelectorAll('.view').forEach(view => view.classList.toggle('is-visible', view.id === `${name}View`)); document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('is-active', tab.dataset.view === name)); if (name === 'cards') renderCard(); if (name === 'quiz') renderQuiz(); window.scrollTo({ top: document.querySelector('.tabs').offsetTop - 90, behavior:'smooth' }); }
function renderQuiz() { $('quizArea').innerHTML = `<div class="quiz-result"><h3>Five questions. No peeking.</h3><p>Choose an answer. The explanation matters more than the score.</p></div>` + questions.map((item, index) => `<article class="quiz-card" data-quiz="${index}"><h3>${index + 1}. ${item.q}</h3>${item.options.map((option, optionIndex) => `<button class="option" data-question="${index}" data-option="${optionIndex}" type="button">${option}</button>`).join('')}<p class="explanation" hidden>${item.why}</p></article>`).join(''); document.querySelectorAll('.option').forEach(button => button.addEventListener('click', answerQuiz)); }
function answerQuiz(event) { const button = event.currentTarget; const questionIndex = Number(button.dataset.question); const optionIndex = Number(button.dataset.option); const card = document.querySelector(`[data-quiz="${questionIndex}"]`); if (card.dataset.answered) return; card.dataset.answered = 'true'; const correct = optionIndex === questions[questionIndex].answer; button.classList.add(correct ? 'correct' : 'wrong'); card.querySelectorAll('.option')[questions[questionIndex].answer].classList.add('correct'); card.querySelector('.explanation').hidden = false; card.dataset.correct = correct ? 'true' : 'false'; const answered = [...document.querySelectorAll('.quiz-card[data-answered]')]; if (answered.length === questions.length) { state.score = answered.filter(item => item.dataset.correct === 'true').length; state.lastStudy = new Date().toISOString().slice(0,10); save(); updateProgress(); const result = document.querySelector('.quiz-result'); result.innerHTML = `<h3>You scored ${state.score}/${questions.length}.</h3><p>${state.score >= 4 ? 'Strong retrieval. Revisit the cards you missed.' : 'That is useful information. Read the explanations, then try the cards once.'}</p>`; } }

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => showView(tab.dataset.view)));
$('startButton').addEventListener('click', () => { showView('learn'); document.querySelector('.topic').scrollIntoView({ behavior:'smooth', block:'center' }); });
$('flashcard').addEventListener('click', () => $('flashcard').classList.toggle('is-flipped'));
$('flashcard').addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); $('flashcard').classList.toggle('is-flipped'); } });
$('knownButton').addEventListener('click', () => { if (!state.known.includes(cardIndex)) state.known.push(cardIndex); cardIndex = (cardIndex + 1) % cards.length; save(); renderCard(); });
$('againButton').addEventListener('click', () => { cardIndex = (cardIndex + 1) % cards.length; renderCard(); });
$('shuffleButton').addEventListener('click', () => { cardIndex = Math.floor(Math.random() * cards.length); renderCard(); });
$('resetButton').addEventListener('click', () => { if (window.confirm('Reset all study progress?')) { localStorage.removeItem('pipelineStudy'); window.location.reload(); } });
renderTopics(); updateProgress(); renderCard();
