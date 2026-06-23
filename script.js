// Teacher notes and answers are in comments for easy reference.
// Levels and answers (teacher): L1=23, L2=656, L3=51, L4=MRLEE, L5=BERT, L6=4132, Final=BERT

const state = { level: 0, level3_q: 1, level3_answers: [null,null,null] };

// Sound helpers (WebAudio — bear/forest theme)
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioCtx ? new AudioCtx() : null;

function _tone(freq, startTime, duration, type='sine', vol=0.08){
  if(!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(vol, startTime + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(startTime); o.stop(startTime + duration);
}

// Forest fanfare — ascending honeybee sparkle (C5 E5 G5 C6)
function playCorrect(){
  if(!audioCtx) return;
  if(audioCtx.state==='suspended') audioCtx.resume();
  const t = audioCtx.currentTime;
  [[523,0],[659,0.09],[784,0.18],[1047,0.27]].forEach(([f,dt])=>_tone(f,t+dt,0.32,'triangle',0.09));
  // soft shimmer underneath
  _tone(1319,t+0.27,0.45,'sine',0.04);
}

// Bear growl — descending sawtooth rumble + low drone
function playWrong(){
  if(!audioCtx) return;
  if(audioCtx.state==='suspended') audioCtx.resume();
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(190, t);
  o.frequency.exponentialRampToValueAtTime(62, t+0.5);
  g.gain.setValueAtTime(0.1, t);
  g.gain.linearRampToValueAtTime(0.14, t+0.08);
  g.gain.exponentialRampToValueAtTime(0.001, t+0.5);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t); o.stop(t+0.5);
  _tone(78, t, 0.55, 'sine', 0.07);
}

// Shake an element using the .shake CSS class
function shakeElement(el){
  el.classList.remove('shake');
  // Force reflow so the animation restarts if called twice
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', ()=>el.classList.remove('shake'), {once:true});
}

function updateProgress(){
  const paws = document.getElementById('paws');
  if(!paws) return;
  paws.innerHTML = '';
  for(let i=1;i<=6;i++){
    const el = document.createElement('div');
    el.className = 'paw kbd';
    el.textContent = (i<=state.level) ? '🐾' : '⚪';
    paws.appendChild(el);
  }
}

function showLevel(n){ state.level = Math.max(state.level, n); updateProgress(); const main = document.getElementById('mainContent');
  main.innerHTML = '';
  switch(n){
    case 0: return renderOpening(main);
    case 1: return renderLevel1(main);
    case 2: return renderLevel2(main);
    case 3: return renderLevel3(main);
    case 4: return renderLevel4(main);
    case 5: return renderLevel5(main);
    case 6: return renderLevel6(main);
    case 7: return renderFinal(main);
  }
}

// Utility: big button
function createButton(text, onClick){ const b=document.createElement('button'); b.className='mt-3 w-full py-3 bg-yellow-300 hover:bg-yellow-350 rounded-lg text-lg font-semibold'; b.textContent=text; b.addEventListener('click', onClick); return b; }

function showMessage(container, text, ok=true){ const p=document.createElement('div'); p.className = ok ? 'mt-3 p-3 rounded bg-green-100 text-green-800' : 'mt-3 p-3 rounded bg-red-100 text-red-800'; p.textContent = text; container.appendChild(p); }

// Opening
function renderOpening(main){
  const story = document.createElement('div');
  story.innerHTML = `
    <p class="big">The Year 3 Bear Cubs are trapped inside the forest den. The Year 4 gate is locked. Use your problem solving skills to find secret codes and enter them to move on.</p>
  `;
  main.appendChild(story);
  const btn = createButton('Start the Bear Rescue', ()=>showLevel(1));
  main.appendChild(btn);
}

// Level 1
function renderLevel1(main){
  main.innerHTML = `<h2 class="font-bold huge">Level 1 — Roman Numeral Bear Code</h2>
    <p class="mt-2">A bear has scratched three Roman numerals onto the cave wall:</p>
    <pre class="mt-2 bg-amber-50 p-3 rounded text-xl">IX\nXIV\nVI</pre>
    <p class="mt-2">The code is a 2 digit number. Add together the two numbers that make the biggest total.</p>`;
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent='Enter the code:';
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='Two-digit code';
  label.appendChild(input); main.appendChild(label);
  const submit = createButton('Submit', ()=>{
    const val = input.value.trim();
    if(val === '23'){ playCorrect(); showMessage(main,'The cave door opens! A paw print points deeper into the forest.'); setTimeout(()=>showLevel(2),900); }
    else { playWrong(); showMessage(main,'The cave wall rumbles, but the door stays closed. Check the Roman numerals carefully.',false); }
  }); main.appendChild(submit);
}

// Level 2
function renderLevel2(main){
  main.innerHTML = `<h2 class="font-bold huge">Level 2 — Fraction Honey Pots</h2>
    <p class="mt-2">Solve the three fraction challenges. Then enter the code below.</p>
    <ol class="mt-2 list-decimal ml-6 text-lg">
      <li>There are 18 honey pots. 1/3 were golden. How many were golden?</li>
      <li>There are 20 berries. 1/4 are blueberries. How many are blueberries?</li>
      <li>A bear collected 15 fish. 2/5 were salmon. How many were salmon?</li>
    </ol>`;
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent='Enter the code:';
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='e.g. 123';
  label.appendChild(input); main.appendChild(label);
  const submit = createButton('Submit', ()=>{
    const val = input.value.trim();
    if(val === '656'){ playCorrect(); showMessage(main,'The honey pot opens and reveals a forest clock.'); setTimeout(()=>showLevel(3),900); }
    else { playWrong(); showMessage(main,'The honey pot is still locked. Check each fraction carefully.',false); }
  }); main.appendChild(submit);
}

// Level 3 (time) - multiple choice with reset behaviour
function renderLevel3(main){
  state.level3_q = 1; state.level3_answers = [null,null,null];
  main.innerHTML = `<h2 class="font-bold huge">Level 3 — Time in the Forest</h2>
    <div id="lvl3Area" class="mt-3"></div>`;
  renderLevel3Question(main);
}

function renderLevel3Question(main){
  const area = document.getElementById('lvl3Area'); area.innerHTML = '';
  const q = state.level3_q;
  const container = document.createElement('div');
  if(q===1){
    container.innerHTML = `<p class="big">Question 1: The bear wakes up at 7:25. What time is this?</p>`;
    const opts = ['25 minutes past 7','25 minutes to 7','7 minutes past 25'];
    renderOptions(container, opts, 0, ()=>handleLevel3Answer(1,true));
  } else if(q===2){
    container.innerHTML = `<p class="big">Question 2: The cubs leave the cave at 3:45. What time is this?</p>`;
    const opts = ['Quarter past 3','Quarter to 4','Half past 3'];
    renderOptions(container, opts, 1, ()=>handleLevel3Answer(2,true));
  } else if(q===3){
    container.innerHTML = `<p class="big">Question 3: The picnic starts at 2:10 and lasts 30 minutes. What time does it finish?</p>`;
    const opts = ['2:30','2:40','3:10'];
    renderOptions(container, opts, 1, ()=>handleLevel3Answer(3,true));
  }
  area.appendChild(container);
}

function renderOptions(container, options, correctIndex, onCorrect){
  options.forEach((opt,i)=>{
    const b = document.createElement('button'); b.className='mt-3 block w-full text-left p-3 bg-green-50 rounded-lg'; b.textContent = (String.fromCharCode(65+i)+') ')+opt;
    b.addEventListener('click', ()=>{
      if(i===correctIndex){ playCorrect(); onCorrect(); }
      else { playWrong(); handleLevel3Wrong(); }
    }); container.appendChild(b);
  });
}

function handleLevel3Answer(questionNum, correct){
  state.level3_answers[questionNum-1] = true;
  if(questionNum < 3){ state.level3_q = questionNum+1; renderLevel3Question(); }
  else { // all three answered correctly
    showLevel3Summary();
  }
}

function handleLevel3Wrong(){
  if(state.level3_q === 1){ const area=document.getElementById('lvl3Area'); showMessage(area,'That is not right. Try Question 1 again.',false); }
  else { const area=document.getElementById('lvl3Area'); showMessage(area,'Oh no! The forest clock reset. Start again from Question 1.',false); state.level3_q = 1; state.level3_answers = [null,null,null]; setTimeout(()=>renderLevel3Question(),800); }
}

function showLevel3Summary(){
  const area=document.getElementById('lvl3Area'); area.innerHTML='';
  const summary = document.createElement('div'); summary.innerHTML = `
    <h3 class="font-bold">Correct answers</h3>
    <ol class="mt-2 list-decimal ml-6">
      <li>7:25 = 25 minutes past 7</li>
      <li>3:45 = quarter to 4</li>
      <li>2:10 + 30 minutes = 2:40</li>
    </ol>
    <p class="mt-3">Final clue: Add the hour from answer 1, the hour from answer 2, and the final minutes from answer 3.</p>
  `;
  area.appendChild(summary);
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent='Enter the code:';
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='e.g. 42'; label.appendChild(input); area.appendChild(label);
  const submit = createButton('Submit', ()=>{
    if(input.value.trim() === '51'){ playCorrect(); showMessage(area,'The forest clock spins and reveals a hidden shop sign.'); setTimeout(()=>showLevel(4),900); }
    else { playWrong(); showMessage(area,'The forest clock ticks backwards. Look again at the correct answers.',false); }
  }); area.appendChild(submit);
}

// Level 4
function renderLevel4(main){
  main.innerHTML = `<h2 class="font-bold huge">Level 4 — Bear Shop Secret Code</h2>
    <p class="mt-2">Welcome to the Bear Shop. Price list:</p>
    <ul class="mt-2 ml-6 list-disc">
      <li>Mushroom = 12 baht</li>
      <li>Raspberry = 8 baht</li>
      <li>Lime = 5 baht</li>
      <li>Egg = 3 baht</li>
      <li>Eggplant = 10 baht</li>
    </ul>
    <p class="mt-2">The customer buys: Mushroom, Raspberry, Lime, Egg, Eggplant.</p>
    <p class="mt-2">Look carefully at the numbers or the items. The secret code could be a number or a word.</p>`;
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent='Enter the secret code:';
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='Type the hidden code'; label.appendChild(input); main.appendChild(label);
  const submit = createButton('Submit', ()=>{
    const raw = input.value.trim(); const normalized = raw.replace(/\s+/g,'').toUpperCase();
    if(['MRLEE'].includes(normalized)){ playCorrect(); showMessage(main,'The shopkeeper whispers, "You found the hidden word."'); setTimeout(()=>showLevel(5),900); }
    else { playWrong(); showMessage(main,'The shopkeeper bear shakes his head. The secret code might not be the total cost.',false); }
  }); main.appendChild(submit);
}

// Level 5
const level5Questions = [
  {q:'What is a baby tiger called?',                          opts:['Cub','Kitten','Baby'],            correct:0},
  {q:'Which Roman word means a large area ruled by one power?', opts:['Empire','Villa','Legion'],        correct:0},
  {q:'What do you use to hit a nail?',                        opts:['Hamerr','Hammer','Hammar'],        correct:1},
  {q:'What do we say when we believe someone?',               opts:['Kindness','Trust','Teamwork'],     correct:1}
];
const level5State = { currentQ: 0 };

function renderLevel5(main){
  main.innerHTML = `<h2 class="font-bold huge">Level 5 — Year 3 Bear Memories</h2>
    <p class="mt-2">Answer each memory question. Use the letters of each correct answer to spell a 4-letter bear name. Look carefully.</p>
    <div id="lvl5Area" class="mt-3"></div>`;
  level5State.currentQ = 0;
  renderLevel5Question();
}

function renderLevel5Question(){
  const area = document.getElementById('lvl5Area');
  area.innerHTML = '';
  const idx = level5State.currentQ;
  const qt = level5Questions[idx];
  const total = level5Questions.length;

  const card = document.createElement('div');
  card.id = 'lvl5Card';
  card.className = 'mt-2 p-4 bg-amber-50 rounded-lg';
  card.innerHTML = `
    <div class="text-sm text-gray-500 mb-2">Question ${idx+1} of ${total}</div>
    <div class="font-semibold text-lg">${qt.q}</div>
  `;

  qt.opts.forEach((opt,i)=>{
    const b = document.createElement('button');
    b.className = 'mt-2 block w-full text-left p-3 bg-white rounded-lg';
    b.textContent = String.fromCharCode(65+i)+') '+opt;
    b.addEventListener('click', ()=>{
      if(i===qt.correct){
        playCorrect();
        level5State.currentQ++;
        if(level5State.currentQ >= total){
          renderLevel5WordPuzzle(area);
        } else {
          renderLevel5Question();
        }
      } else {
        playWrong();
        const cardEl = document.getElementById('lvl5Card');
        shakeElement(cardEl);
        if(idx > 0){
          // Wrong on Q2, Q3 or Q4 — reset to Q1
          const msg = document.createElement('div');
          msg.className = 'mt-3 p-3 rounded bg-red-100 text-red-800';
          msg.textContent = 'The bear memories scrambled! Back to Question 1.';
          cardEl.appendChild(msg);
          setTimeout(()=>{
            level5State.currentQ = 0;
            renderLevel5Question();
          }, 1200);
        }
        // Wrong on Q1 — shake only, stay on Q1
      }
    });
    card.appendChild(b);
  });

  area.appendChild(card);
}

function renderLevel5WordPuzzle(area){
  area.innerHTML = '';
  const summary = document.createElement('div');
  summary.className = 'p-4 bg-green-50 rounded-lg';
  summary.innerHTML = `
    <h3 class="font-bold text-green-800">All memory questions answered! 🐾</h3>
    <p class="mt-2">Now use the letters of each correct answer to spell a name, it is 4 letters:</p>
    <ul class="mt-2 ml-4 list-disc text-lg">
      <li>Cub</li>
      <li>Empire</li>
      <li>Hammer</li>
      <li>Trust</li>
    </ul>
  `;
  area.appendChild(summary);
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent="Enter the bear's name:";
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='Type the name'; label.appendChild(input); area.appendChild(label);
  const submit = createButton('Submit', ()=>{
    const val = input.value.trim().toUpperCase();
    if(val === 'BERT'){ playCorrect(); showMessage(area,'Bert the Bear wakes up and points to a set of mixed-up instructions.'); setTimeout(()=>showLevel(6),900); }
    else { playWrong(); showMessage(area,'The bear name is hiding at the end of the answers. Look at the last letters.',false); }
  }); area.appendChild(submit);
}

// Level 6
function renderLevel6(main){
  main.innerHTML = `<h2 class="font-bold huge">Level 6 — Algorithm Mistake</h2>
    <p class="mt-2">Bert wants to make honey toast, but his algorithm has a mistake. Original algorithm:\n1. Put bread on the plate.\n2. Eat the toast.\n3. Spread honey on the bread.\n4. Toast the bread.</p>`;
  const opts = ['The bear should eat the toast first.','The steps are in the wrong order.','The bear forgot the plate.','Honey cannot go on toast.'];
  opts.forEach((o,i)=>{
    const b = document.createElement('button'); b.className='mt-2 block w-full p-3 bg-white rounded'; b.textContent=String.fromCharCode(65+i)+') '+o;
    b.addEventListener('click', ()=>{
      if(i===1){ playCorrect(); showMessage(main,'Put the original step numbers into the correct order.'); showLevel6AnswerInput(main); }
      else { playWrong(); showMessage(main,'Bert\'s toast is still very strange. Think about what should happen first, second, third and last.',false); }
    }); main.appendChild(b);
  });
}

function showLevel6AnswerInput(main){
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent='Enter the code:';
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='e.g. 1234'; label.appendChild(input); main.appendChild(label);
  const submit = createButton('Submit', ()=>{
    if(input.value.trim() === '4132'){ playCorrect(); showMessage(main,'Bert has made the perfect honey toast. One final forest door appears.'); setTimeout(()=>showLevel(7),900); }
    else { playWrong(); showMessage(main,'Bert\'s toast is still very strange. Think about what should happen first, second, third and last.',false); }
  }); main.appendChild(submit);
}

// Final
function renderFinal(main){
  main.innerHTML = `<h2 class="font-bold huge">Final Door — Riddle</h2>
    <p class="mt-2">I am not a number. I was hidden in your memories. I woke up when you looked at the last letters. Who am I?</p>`;
  const label = document.createElement('label'); label.className='block mt-3'; label.textContent='Enter the final password:';
  const input = document.createElement('input'); input.className='mt-2 p-3 w-full rounded text-lg'; input.placeholder='Type the final password'; label.appendChild(input); main.appendChild(label);
  const submit = createButton('Submit', ()=>{
    const val = input.value.trim().toUpperCase();
    if(val === 'BERT'){ playCorrect(); confetti({spread:160, particleCount:200}); showMessage(main,'🎉 You escaped the Year 3 Den! 🎉'); const playAgain = createButton('Play Again', ()=>{ location.reload(); }); main.appendChild(playAgain); }
    else { playWrong(); showMessage(main,'Think back to the memory level. Who did you rescue?',false); }
  }); main.appendChild(submit);
}

// Initialize when DOM ready
window.addEventListener('DOMContentLoaded', ()=>{ updateProgress(); showLevel(0); });
