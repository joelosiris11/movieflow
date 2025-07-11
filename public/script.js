const statuses = [
    'BACKLOG',
    'ASIGNADO',
    'EN_PROGRESO',
    'EN_REVISIÓN_SUP',
    'EN_REVISIÓN_DIR',
    'APROBADO_FINAL'
];

let shots = [
    {id:1, name:'Shot001', status:'BACKLOG', artist:'Juan', elapsed:0, timer:false},
    {id:2, name:'Shot002', status:'BACKLOG', artist:'Ana', elapsed:0, timer:false}
];
let departments = ['Matte', 'Render', '2D'];
let currentRole = 'artist';

const roleSelector = document.getElementById('roleSelector');
const shotsDiv = document.getElementById('shots');
const panelTitle = document.getElementById('panelTitle');
const newShotForm = document.getElementById('newShotForm');
const newDeptForm = document.getElementById('newDeptForm');
const departmentsDiv = document.getElementById('departments');

roleSelector.addEventListener('change', e => {
    currentRole = e.target.value;
    render();
});

newShotForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('shotName').value.trim();
    if(name){
        shots.push({id: Date.now(), name, status:'BACKLOG', artist:'', elapsed:0, timer:false});
        e.target.reset();
        render();
    }
});

newDeptForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('deptName').value.trim();
    if(name){
        departments.push(name);
        e.target.reset();
        renderDepartments();
    }
});

function renderDepartments(){
    departmentsDiv.innerHTML = '<h3>Departamentos</h3>' + departments.map(d => `<div>${d}</div>`).join('');
}

function formatTime(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
}

function visible(shot){
    if(currentRole === 'artist') return ['BACKLOG','ASIGNADO','EN_PROGRESO'].includes(shot.status);
    if(currentRole === 'supervisor') return shot.status === 'EN_REVISIÓN_SUP';
    if(currentRole === 'director') return ['EN_REVISIÓN_DIR','APROBADO_FINAL'].includes(shot.status);
    return true;
}

function render(){
    shotsDiv.innerHTML = '';
    panelTitle.textContent = `Tomas - ${currentRole}`;
    shots.filter(visible).forEach(shot => {
        const row = document.createElement('div');
        row.className = 'shot';
        const timerSpan = `<span class="timer" id="timer-${shot.id}">${formatTime(shot.elapsed)}</span>`;
        const btn = document.createElement('button');
        btn.textContent = 'Avanzar';
        btn.onclick = () => advance(shot.id);
        if(currentRole==='artist' && shot.status==='BACKLOG') btn.disabled = true;
        row.innerHTML = `<span class="shot-name">${shot.name}</span><span>${shot.status}</span>${timerSpan}`;
        row.appendChild(btn);
        shotsDiv.appendChild(row);
    });
}

function advance(id){
    const shot = shots.find(s=>s.id===id);
    const idx = statuses.indexOf(shot.status);
    if(idx < statuses.length-1){
        shot.status = statuses[idx+1];
        if(shot.status==='ASIGNADO') shot.timer = true;
        if(shot.status==='APROBADO_FINAL') shot.timer = false;
        render();
    }
}

setInterval(()=>{
    shots.forEach(shot=>{
        if(shot.timer){
            shot.elapsed += 1;
            const el = document.getElementById(`timer-${shot.id}`);
            if(el) el.textContent = formatTime(shot.elapsed);
        }
    });
},1000);

render();
renderDepartments();
