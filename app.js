const key='yuejuantai-v4',demo=[{id:'d1',studentName:'陈雨桐',studentPhone:'138****7621',name:'408 计算机考试试卷',uploadedAt:'刚刚提交',type:'image',status:'pending'},{id:'d2',studentName:'周子航',studentPhone:'139****4138',name:'408 计算机考试试卷',uploadedAt:'今天 10:24',type:'image',status:'pending'}];
let state=JSON.parse(localStorage.getItem(key)||'null')||{papers:demo,trash:[]},selectedId,drawing=false,tool='pen',strokes=[],redo=[];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],save=()=>localStorage.setItem(key,JSON.stringify(state)),pending=()=>state.papers.filter(p=>p.status==='pending'),graded=()=>state.papers.filter(p=>p.status==='graded');
const esc=t=>String(t).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function toast(t){$('#toast').textContent=t;
$('#toast').classList.add('show');
setTimeout(()=>$('#toast').classList.remove('show'),2400)}function route(n){$$('.page').forEach(p=>p.classList.toggle('active',p.id===n));
$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.route===n));
$('#pageTitle').textContent=n==='home'?'你好，老师':'';
if(n==='home')$('#pageTitle').textContent='你好，老师';
queue()}function row(p){return `<div class="paper-row"><span class="doc-icon">408</span><div><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></div><span class="tag pending">待批改</span></div>`}function render(){if(!state.trash)state.trash=[];
$('.sidebar-bottom strong').textContent='夏老师';
$('#pageTitle').textContent='你好，老师';
let ps=pending();
$('#pendingCount').textContent=ps.length;
$('#pendingBadge').textContent=ps.length;
$('#gradedCount').textContent=graded().length;
$('#studentCount').textContent=new Set(state.papers.map(p=>p.studentName)).size;
$('#recentPapers').innerHTML=ps.length?ps.map(row).join(''):'<div class="paper-row">暂无待批改试卷</div>';
queue();
results();
trash()}function queue(){let ps=pending();
$('#queueCount').textContent=ps.length+' 份';
$('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-id="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">🗑</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';
$$('.queue-item').forEach(b=>b.onclick=()=>select(b.dataset.id));
$$('[data-delete]').forEach(b=>b.onclick=()=>remove(b.dataset.delete))}function remove(id){let p=state.papers.find(x=>x.id===id);
if(!p||!confirm(`确定将“${p.studentName}”的 408 试卷移入回收站吗？`))return;
state.papers=state.papers.filter(x=>x.id!==id);
state.trash.unshift({...p,deletedAt:'刚刚删除'});
save();
// 教师端增强：待批改试卷删除、已批改查看、回收站可恢复。
const baseQueue=queue,baseResults=results,baseRender=render;
queue=function(){
  const ps=pending();
  $('#queueCount').textContent=ps.length+' 份';
  $('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-open="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">×</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';
  $$('[data-open]').forEach(b=>b.onclick=()=>select(b.dataset.open));
  $$('[data-delete]').forEach(b=>b.onclick=()=>remove(b.dataset.delete));
};
results=function(){
  $('#resultList').innerHTML=graded().map(p=>`<article class="result-card"><span class="tag done">已批改</span><div class="result-score"><small>最终总分</small><strong>${p.score}<em>/ 150</em></strong></div><h3>${esc(p.studentName)} · 408 试卷</h3><p>${esc(p.studentPhone)}</p><p>${esc(p.comment||'教师未留下文字评语')}</p><footer><button class="small-button view" data-id="${p.id}">查看</button><button class="small-button edit" data-id="${p.id}">重新编辑</button><button class="small-button danger" data-id="${p.id}">删除</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>暂无批改记录</h3></div>';
  $$('.view').forEach(b=>b.onclick=()=>{select(b.dataset.id);route('grading');});
  $$('.edit').forEach(b=>b.onclick=()=>{select(b.dataset.id);route('grading');});
  $$('.danger').forEach(b=>b.onclick=()=>remove(b.dataset.id));
};
render=function(){baseRender();$('.user-avatar').textContent='夏';$('.sidebar-bottom strong').textContent='夏老师';};
render();

// 初始化时立即启用学生试卷删除按钮与醒目总分展示。
queue=function(){const ps=pending();$('#queueCount').textContent=ps.length+' 份';$('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-open="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">🗑</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';$$('[data-open]').forEach(b=>b.onclick=()=>select(b.dataset.open));$$('[data-delete]').forEach(b=>b.onclick=()=>remove(b.dataset.delete));};
results=function(){$('#resultList').innerHTML=graded().map(p=>`<article class="result-card"><span class="tag done">已批改</span><div class="result-score"><small>最终总分</small><strong>${p.score}<em>/ 150</em></strong></div><h3>${esc(p.studentName)} · 408 试卷</h3><p>${esc(p.studentPhone)}</p><p>${esc(p.comment||'教师未留下文字评语')}</p><footer><button class="small-button view" data-id="${p.id}">查看</button><button class="small-button edit" data-id="${p.id}">重新编辑</button><button class="small-button danger" data-id="${p.id}">删除</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>暂无批改记录</h3></div>';$$('.view').forEach(b=>b.onclick=()=>{select(b.dataset.id);route('grading')});$$('.edit').forEach(b=>b.onclick=()=>{select(b.dataset.id);route('grading')});$$('.danger').forEach(b=>b.onclick=()=>remove(b.dataset.id));};
$('.user-avatar').textContent='夏';$('.sidebar-bottom strong').textContent='夏老师';render();

// Supabase 云端同步（Publishable key 仅用于浏览器端公开访问，严禁替换为 service_role key）。
const cloudUrl='https://lmrfbmclyebmyezqphrv.supabase.co';
const cloudKey='sb_publishable_ZCuA-E7cQkV6M09wQWtlQA_T1sNzpJ5';
const cloudHeaders={apikey:cloudKey,Authorization:`Bearer ${cloudKey}`};
const cloudFileUrl=path=>`${cloudUrl}/storage/v1/object/public/paper-files/${path.split('/').map(encodeURIComponent).join('/')}`;
async function cloudRequest(path,options={}){const r=await fetch(`${cloudUrl}${path}`,{...options,headers:{...cloudHeaders,...(options.headers||{})}});const body=await r.text();if(!r.ok)throw new Error(body);return body?JSON.parse(body):null}
function cloudPaper(r){return{id:r.id,studentName:r.student_name,studentPhone:r.student_phone,name:'408 计算机考试试卷',uploadedAt:new Date(r.created_at).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}),type:r.mime_type==='application/pdf'?'pdf':'image',mimeType:r.mime_type,status:r.status,choice:r.choice_scores||[],big:r.big_scores||[],score:+r.score||0,comment:r.comment||'',strokes:r.strokes||[],preview:cloudFileUrl(r.file_path),filePath:r.file_path,deletedAt:r.deleted_at}}
async function loadCloud(){try{const rows=await cloudRequest('/rest/v1/papers?select=*&order=created_at.desc');state={papers:rows.map(cloudPaper),trash:[]};render()}catch(e){console.error(e);toast('云端尚未初始化：请先在 Supabase 执行 supabase.sql')}}
async function cloudPatch(id,body){const rows=await cloudRequest(`/rest/v1/papers?id=eq.${id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(body)});const p=cloudPaper(rows[0]);state.papers=state.papers.map(x=>x.id===id?p:x);return p}
remove=async id=>{const p=state.papers.find(x=>x.id===id);if(!p||!confirm(`确定将“${p.studentName}”的 408 试卷移入回收站吗？`))return;try{await cloudPatch(id,{deleted_at:new Date().toISOString()});render();toast('已移入回收站')}catch(e){toast('删除失败，请重试')}};
trash=()=>{let sec=$('#trash');if(!sec){sec=document.createElement('section');sec.id='trash';sec.className='page';sec.innerHTML='<div class="page-intro"><h2>回收站</h2><p>删除的试卷与批改记录可在此恢复。</p></div><div id="trashList" class="result-grid"></div>';$('.main-content').append(sec);let b=document.createElement('button');b.className='nav-item';b.dataset.route='trash';b.innerHTML='<span>♲</span>回收站';$('.nav').append(b);b.onclick=()=>route('trash')}let gone=state.papers.filter(p=>p.deletedAt);$('#trashList').innerHTML=gone.map(p=>`<article class="result-card"><span class="tag pending">已删除</span><h3>${esc(p.studentName)} · 408 试卷</h3><p>原状态：${p.status==='graded'?'已批改':'待批改'}</p><footer><button class="small-button restore" data-id="${p.id}">恢复</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>回收站为空</h3></div>';$$('.restore').forEach(b=>b.onclick=async()=>{try{await cloudPatch(b.dataset.id,{deleted_at:null});render();toast('已恢复到原状态')}catch(e){toast('恢复失败，请重试')}})};
const localPending=pending,localGraded=graded;pending=()=>state.papers.filter(p=>p.status==='pending'&&!p.deletedAt);graded=()=>state.papers.filter(p=>p.status==='graded'&&!p.deletedAt);
$('#submitGrading').onclick=async()=>{let p=state.papers.find(x=>x.id===selectedId),g=total();if(g.bigTotal>70)return toast('综合应用题总分不能超过 70 分');try{await cloudPatch(p.id,{choice_scores:g.choice,big_scores:g.big,score:g.score,comment:$('#commentInput').value.trim(),status:'graded',strokes:strokes,graded_at:new Date().toISOString()});selectedId=null;$('#graderWorkspace').classList.add('hidden');$('#workspacePlaceholder').classList.remove('hidden');render();toast('批改已提交到云端')}catch(e){console.error(e);toast('提交失败，请重试')}};
$('#studentUploadForm').onsubmit=async e=>{e.preventDefault();const f=$('#fileInput').files[0];if(!f)return toast('请选择试卷文件');if(f.size>20*1024*1024)return toast('单个文件不能超过 20MB');const id=crypto.randomUUID(),name=$('#studentName').value.trim(),phone=$('#studentPhone').value.trim(),path=`${id}/${f.name.replace(/[^\\w.\\-\u4e00-\u9fa5]/g,'_')}`,btn=e.submitter;btn.disabled=true;btn.textContent='正在上传…';try{let up=await fetch(`${cloudUrl}/storage/v1/object/paper-files/${path.split('/').map(encodeURIComponent).join('/')}`,{method:'POST',headers:{...cloudHeaders,'Content-Type':f.type,'x-upsert':'false'},body:f});if(!up.ok)throw new Error(await up.text());await cloudRequest('/rest/v1/papers',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({id,student_name:name,student_phone:phone,file_path:path,file_name:f.name,mime_type:f.type})});$('#studentFormView').classList.add('hidden');$('#studentSuccess').classList.remove('hidden');$('#submittedDetails').textContent=`${name} · 计算机 408 考试`;await loadCloud()}catch(err){console.error(err);toast('上传失败，请检查云端脚本是否已执行')}finally{btn.disabled=false;btn.textContent='确认提交试卷 →'}};
loadCloud();

// 多图试卷：同一次提交的图片归入同一份试卷，教师可逐页查看。
$('#fileInput').multiple=true;
$('#dropZone').querySelector('strong').textContent='点击或拖放多张试卷照片至此处';
$('#dropZone').querySelector('small').textContent='支持多张 JPG、PNG、PDF；每个文件不超过 20MB';
$('#fileInput').onchange=e=>{const files=[...e.target.files];$('#fileName').textContent=files.length?`已选择 ${files.length} 个文件`:'尚未选择文件';let list=$('#filePreviewList');if(!list){list=document.createElement('div');list.id='filePreviewList';list.className='file-preview-list';$('#dropZone').append(list)}list.innerHTML='';files.forEach((file,index)=>{const card=document.createElement('figure');card.className='file-preview-card';if(file.type.startsWith('image/')){const image=document.createElement('img');image.src=URL.createObjectURL(file);image.onload=()=>URL.revokeObjectURL(image.src);card.append(image)}else{card.innerHTML='<span class="file-preview-pdf">PDF</span>'}const caption=document.createElement('figcaption');caption.textContent=`第 ${index+1} 页 · ${file.name}`;card.append(caption);list.append(card)})};
const cloudPaperBase=cloudPaper;
cloudPaper=r=>{const p=cloudPaperBase(r);p.filePaths=(r.file_paths&&r.file_paths.length?r.file_paths:[r.file_path]);p.preview=cloudFileUrl(p.filePaths[0]);return p};
const selectOnePaper=select;
select=async id=>{await selectOnePaper(id);const p=state.papers.find(x=>x.id===id);if(!p||p.filePaths.length<2)return;let page=0;const title=$('#selectedPaperName');title.innerHTML=`408 计算机考试试卷 · 共 ${p.filePaths.length} 页 <button class="small-button" id="prevPage">上一页</button><span id="pageIndicator">1 / ${p.filePaths.length}</span><button class="small-button" id="nextPage">下一页</button>`;const showPage=i=>{page=(i+p.filePaths.length)%p.filePaths.length;const image=$('#paperPreview');image.src=cloudFileUrl(p.filePaths[page]);image.onload=()=>size(image.clientWidth||620,image.clientHeight||800);$('#pageIndicator').textContent=`${page+1} / ${p.filePaths.length}`};$('#prevPage').onclick=()=>showPage(page-1);$('#nextPage').onclick=()=>showPage(page+1)};
$('#studentUploadForm').onsubmit=async e=>{e.preventDefault();const files=[...$('#fileInput').files],name=$('#studentName').value.trim(),phone=$('#studentPhone').value.trim();if(!files.length)return toast('请选择试卷文件');if(files.some(f=>f.size>20*1024*1024))return toast('每个文件不能超过 20MB');const id=crypto.randomUUID(),btn=e.submitter;btn.disabled=true;btn.textContent='正在上传…';try{const paths=files.map(f=>`${id}/${crypto.randomUUID()}-${f.name.replace(/[^\\w.\\-\u4e00-\u9fa5]/g,'_')}`);await Promise.all(files.map(async(f,i)=>{const r=await fetch(`${cloudUrl}/storage/v1/object/paper-files/${paths[i].split('/').map(encodeURIComponent).join('/')}`,{method:'POST',headers:{...cloudHeaders,'Content-Type':f.type,'x-upsert':'false'},body:f});if(!r.ok)throw new Error(await r.text())}));await cloudRequest('/rest/v1/papers',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({id,student_name:name,student_phone:phone,file_path:paths[0],file_paths:paths,file_name:files.map(f=>f.name).join('、'),mime_type:files[0].type})});$('#studentFormView').classList.add('hidden');$('#studentSuccess').classList.remove('hidden');$('#submittedDetails').textContent=`${name} · 计算机 408 考试 · 共 ${files.length} 页`;await loadCloud()}catch(err){console.error(err);toast('上传失败，请检查云端脚本是否已更新')}finally{btn.disabled=false;btn.textContent='确认提交试卷 →'}};
toast('已移入回收站')}function results(){$('#resultList').innerHTML=graded().map(p=>`<article class="result-card"><span class="tag done">已批改</span><h3>${esc(p.studentName)} · 408 试卷</h3><p>${esc(p.studentPhone)} · 总分 ${p.score}/150</p><p>${esc(p.comment||'教师未留下文字评语')}</p><footer><button class="small-button edit" data-id="${p.id}">重新编辑</button><button class="small-button danger" data-id="${p.id}">删除</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>暂无批改记录</h3></div>';
$$('.edit').forEach(b=>b.onclick=()=>{select(b.dataset.id);
route('grading')});
$$('.danger').forEach(b=>b.onclick=()=>remove(b.dataset.id))}function trash(){let sec=$('#trash');
if(!sec){sec=document.createElement('section');
sec.id='trash';
sec.className='page';
sec.innerHTML='<div class="page-intro"><h2>回收站</h2><p>删除的试卷与批改记录可在此恢复。</p></div><div id="trashList" class="result-grid"></div>';
$('.main-content').append(sec);
let b=document.createElement('button');
b.className='nav-item';
b.dataset.route='trash';
b.innerHTML='<span>♲</span>回收站';
$('.nav').append(b);
b.onclick=()=>route('trash')}$('#trashList').innerHTML=state.trash.map(p=>`<article class="result-card"><span class="tag pending">已删除</span><h3>${esc(p.studentName)} · 408 试卷</h3><p>${esc(p.deletedAt)} · 原状态：${p.status==='graded'?'已批改':'待批改'}</p><footer><button class="small-button restore" data-id="${p.id}">恢复</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>回收站为空</h3></div>';
$$('.restore').forEach(b=>b.onclick=()=>{let p=state.trash.find(x=>x.id===b.dataset.id);
state.trash=state.trash.filter(x=>x.id!==p.id);
delete p.deletedAt;
state.papers.unshift(p);
save();
render();
toast('已恢复到原状态')})}
$$('[data-route]').forEach(b=>b.onclick=()=>route(b.dataset.route));
$('#teacherEntry').onclick=()=>show('login');
$('#backToStudent').onclick=()=>show('student');
$('#logout').onclick=()=>show('student');
function show(v){$('#studentPortal').classList.toggle('hidden',v!=='student');
$('#loginView').classList.toggle('hidden',v!=='login');
$('#teacherApp').classList.toggle('hidden',v!=='teacher')}$('#loginForm').onsubmit=e=>{e.preventDefault();
if($('#teacherAccount').value==='teacher'&&$('#teacherPassword').value==='123456'){show('teacher');
render()}else toast('账号或密码错误，请重试')};
$('#fileInput').onchange=e=>$('#fileName').textContent=e.target.files[0]?.name||'尚未选择文件';
// 放在旧版绑定之后，确保页面使用多图上传提示与缩略图预览。
(()=>{const input=$('#fileInput'),zone=$('#dropZone');input.multiple=true;zone.querySelector('strong').textContent='点击或拖放多张试卷照片至此处';zone.querySelector('small').textContent='支持多张 JPG、PNG、PDF；每个文件不超过 20MB';input.onchange=e=>{const files=[...e.target.files];$('#fileName').textContent=files.length?`已选择 ${files.length} 个文件`:'尚未选择文件';let list=$('#filePreviewList');if(!list){list=document.createElement('div');list.id='filePreviewList';list.className='file-preview-list';zone.append(list)}list.innerHTML='';files.forEach((file,index)=>{const card=document.createElement('figure');card.className='file-preview-card';if(file.type.startsWith('image/')){const image=document.createElement('img');image.src=URL.createObjectURL(file);image.onload=()=>URL.revokeObjectURL(image.src);card.append(image)}else card.innerHTML='<span class="file-preview-pdf">PDF</span>';const caption=document.createElement('figcaption');caption.textContent=`第 ${index+1} 页 · ${file.name}`;card.append(caption);list.append(card)})}})();
$('#studentUploadForm').onsubmit=e=>{e.preventDefault();
let f=$('#fileInput').files[0];
if(!f)return toast('请选择试卷文件');
let p={id:crypto.randomUUID(),studentName:$('#studentName').value.trim(),studentPhone:$('#studentPhone').value.trim(),name:'408 计算机考试试卷',uploadedAt:'刚刚提交',type:f.type==='application/pdf'?'pdf':'image',status:'pending'};
let done=()=>{state.papers.unshift(p);
save();
$('#studentFormView').classList.add('hidden');
$('#studentSuccess').classList.remove('hidden')};
if(p.type==='image'){let r=new FileReader();
r.onload=()=>{p.preview=r.result;
done()};
r.readAsDataURL(f)}else done()};
// 最终以云端多文件提交逻辑为准。
$('#studentUploadForm').onsubmit=async e=>{e.preventDefault();const files=[...$('#fileInput').files],name=$('#studentName').value.trim(),phone=$('#studentPhone').value.trim();if(!files.length)return toast('请选择试卷文件');if(files.some(f=>f.size>20*1024*1024))return toast('每个文件不能超过 20MB');const id=crypto.randomUUID(),btn=e.submitter;btn.disabled=true;btn.textContent='正在上传…';try{const paths=files.map(f=>`${id}/${crypto.randomUUID()}-${f.name.replace(/[^\\w.\\-\u4e00-\u9fa5]/g,'_')}`);await Promise.all(files.map(async(f,i)=>{const r=await fetch(`${cloudUrl}/storage/v1/object/paper-files/${paths[i].split('/').map(encodeURIComponent).join('/')}`,{method:'POST',headers:{...cloudHeaders,'Content-Type':f.type,'x-upsert':'false'},body:f});if(!r.ok)throw new Error(await r.text())}));await cloudRequest('/rest/v1/papers',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({id,student_name:name,student_phone:phone,file_path:paths[0],file_paths:paths,file_name:files.map(f=>f.name).join('、'),mime_type:files[0].type})});$('#studentFormView').classList.add('hidden');$('#studentSuccess').classList.remove('hidden');$('#submittedDetails').textContent=`${name} · 计算机 408 考试 · 共 ${files.length} 页`;await loadCloud()}catch(err){console.error(err);toast('上传失败，请检查云端脚本是否已更新')}finally{btn.disabled=false;btn.textContent='确认提交试卷 →'}};

function scores(p){let c=p.choice||Array(40).fill(false),b=p.big||Array(7).fill('');
return `<section><h4>一、选择题 <span>40 题 × 2 分</span></h4><div class="choice-grid">${c.map((v,i)=>`<button class="choice ${v?'correct':''}" data-choice="${i}">${i+1}</button>`).join('')}</div></section><section><h4>二、综合应用题 <span>7 题 · 共 70 分</span></h4>${b.map((v,i)=>`<label class="big-score">第 ${i+1} 题 <input data-big="${i}" type="number" value="${v}" min="0" placeholder="分数"></label>`).join('')}</section>`}function total(){let c=$$('[data-choice].correct').length*2,b=$$('[data-big]').reduce((s,x)=>s+(+x.value||0),0);
$('#totalScore').textContent=c+b;
return{choice:$$('[data-choice]').map(x=>x.classList.contains('correct')),big:$$('[data-big]').map(x=>+x.value||0),score:c+b,bigTotal:b}}function select(id){selectedId=id;
let p=state.papers.find(x=>x.id===id);
// 每份试卷独立保存笔迹；切换试卷时不再复用上一份的画笔轨迹。
strokes=structuredClone(p.strokes||[]);
redo=[];
const annotation=$('#annotationCanvas');
annotation.getContext('2d').clearRect(0,0,annotation.width,annotation.height);
$('#workspacePlaceholder').classList.add('hidden');
$('#graderWorkspace').classList.remove('hidden');
$('#selectedPaperName').textContent='408 计算机考试试卷';
$('#selectedStudentInfo').innerHTML=`<strong>${esc(p.studentName)}</strong><span>${esc(p.studentPhone)} · 计算机 408 考试</span>`;
$('#commentInput').value=p.comment||'';
$('#questionScoring').innerHTML=scores(p);
$$('[data-choice]').forEach(b=>b.onclick=()=>{b.classList.toggle('correct');
total()});
$$('[data-big]').forEach(x=>x.oninput=total);
total();
queue();
let im=$('#paperPreview');
im.src=p.preview||sheet();
im.onload=()=>size(im.clientWidth||620,im.clientHeight||800)}function sheet(){let c=document.createElement('canvas'),x=c.getContext('2d');
c.width=760;
c.height=1050;
x.fillStyle='#fff';
x.fillRect(0,0,760,1050);
x.fillStyle='#182348';
x.font='bold 26px sans-serif';
x.fillText('408 计算机学科专业基础综合',50,70);
return c.toDataURL()}function size(w,h){let c=$('#annotationCanvas'),q=$('#canvasWrap');
c.width=w;
c.height=h;
c.style.width=w+'px';
c.style.height=h+'px';
c.style.left=(q.clientWidth-w)/2+'px';
c.style.top='22px';
redraw()}function draw(s){let x=$('#annotationCanvas').getContext('2d');
x.save();
x.strokeStyle=s.color;
x.lineWidth=s.size;
x.lineCap='round';
x.globalCompositeOperation=s.tool==='eraser'?'destination-out':'source-over';
x.beginPath();
s.pts.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));
x.stroke();
x.restore()}function redraw(){let c=$('#annotationCanvas'),x=c.getContext('2d');
x.clearRect(0,0,c.width,c.height);
strokes.forEach(draw)}function pt(e){let r=$('#annotationCanvas').getBoundingClientRect();
return{x:(e.clientX-r.left)*$('#annotationCanvas').width/r.width,y:(e.clientY-r.top)*$('#annotationCanvas').height/r.height}}let c=$('#annotationCanvas'),cur=[];
c.onpointerdown=e=>{drawing=true;
cur=[pt(e)]};
c.onpointermove=e=>{if(drawing){cur.push(pt(e));
redraw();
draw({pts:cur,color:$('#penColor').value,size:+$('#penSize').value,tool})}};
c.onpointerup=()=>{if(drawing){drawing=false;
strokes.push({pts:cur,color:$('#penColor').value,size:+$('#penSize').value,tool});
redo=[]}};
$$('[data-tool]').forEach(b=>b.onclick=()=>{tool=b.dataset.tool;
$$('[data-tool]').forEach(x=>x.classList.toggle('active',x===b))});
$('#undoBtn').onclick=()=>{if(strokes.length){redo.push(strokes.pop());
redraw()}};
$('#redoBtn').onclick=()=>{if(redo.length){strokes.push(redo.pop());
redraw()}};
$('#penSize').oninput=e=>$('#sizeValue').textContent=e.target.value+'px';
$('#submitGrading').onclick=()=>{let p=state.papers.find(x=>x.id===selectedId),g=total();
if(g.bigTotal>70)return toast('综合应用题总分不能超过 70 分');
Object.assign(p,g,{comment:$('#commentInput').value.trim(),status:'graded',strokes:structuredClone(strokes),annotation:c.toDataURL()});
save();
selectedId=null;
$('#graderWorkspace').classList.add('hidden');
$('#workspacePlaceholder').classList.remove('hidden');
render();
toast('批改已提交')};
render();

// 页面首次加载时启用增强后的队列与批改记录展示。
queue=function(){const ps=pending();$('#queueCount').textContent=ps.length+' 份';$('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-open="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">🗑</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';$$('[data-open]').forEach(b=>b.onclick=()=>select(b.dataset.open));$$('[data-delete]').forEach(b=>b.onclick=()=>remove(b.dataset.delete));};
results=function(){$('#resultList').innerHTML=graded().map(p=>`<article class="result-card"><span class="tag done">已批改</span><div class="result-score"><small>最终总分</small><strong>${p.score}<em>/ 150</em></strong></div><h3>${esc(p.studentName)} · 408 试卷</h3><p>${esc(p.studentPhone)}</p><p>${esc(p.comment||'教师未留下文字评语')}</p><footer><button class="small-button view" data-id="${p.id}">查看</button><button class="small-button edit" data-id="${p.id}">重新编辑</button><button class="small-button danger" data-id="${p.id}">删除</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>暂无批改记录</h3></div>';$$('.view').forEach(b=>b.onclick=()=>{select(b.dataset.id);route('grading')});$$('.edit').forEach(b=>b.onclick=()=>{select(b.dataset.id);route('grading')});$$('.danger').forEach(b=>b.onclick=()=>remove(b.dataset.id));};
$('.user-avatar').textContent='夏';$('.sidebar-bottom strong').textContent='夏老师';render();


// 全局云端连接：学生上传与教师工作台都使用此配置。
var cloudUrl='https://lmrfbmclyebmyezqphrv.supabase.co';
var cloudKey='sb_publishable_ZCuA-E7cQkV6M09wQWtlQA_T1sNzpJ5';
var cloudHeaders={apikey:cloudKey,Authorization:`Bearer ${cloudKey}`};
async function cloudRequest(path,options={}){const r=await fetch(`${cloudUrl}${path}`,{...options,headers:{...cloudHeaders,...(options.headers||{})}});const body=await r.text();if(!r.ok)throw new Error(body);return body?JSON.parse(body):null}
function mapCloudPaper(r){return{id:r.id,studentName:r.student_name,studentPhone:r.student_phone,name:'408 计算机考试试卷',uploadedAt:new Date(r.created_at).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}),type:r.mime_type==='application/pdf'?'pdf':'image',mimeType:r.mime_type,status:r.status,choice:r.choice_scores||[],big:r.big_scores||[],score:+r.score||0,comment:r.comment||'',strokes:r.strokes||[],preview:`${cloudUrl}/storage/v1/object/public/paper-files/${r.file_path.split('/').map(encodeURIComponent).join('/')}`,filePath:r.file_path,filePaths:r.file_paths?.length?r.file_paths:[r.file_path],deletedAt:r.deleted_at}}
async function loadCloud(){try{const rows=await cloudRequest('/rest/v1/papers?select=*&order=created_at.desc');state={papers:rows.map(mapCloudPaper),trash:[]};render()}catch(error){console.error(error);toast('云端数据读取失败，请刷新重试')}}
setTimeout(()=>loadCloud(),0);
// 上传失败时显示 Supabase 的原始摘要，避免通用提示掩盖真实原因。
const originalConsoleError=console.error.bind(console);
console.error=(error,...rest)=>{originalConsoleError(error,...rest);const message=String(error?.message||error||'未知错误').replace(/\s+/g,' ').slice(0,150);if(message&&message!=='未知错误')setTimeout(()=>toast(`上传错误：${message}`),0)};

// 云端删除：移入回收站支持连续操作；彻底删除会清除数据库记录及全部附件。
async function moveToTrash(id){const p=state.papers.find(x=>x.id===id);if(!p||!confirm(`确定将“${p.studentName}”的试卷移入回收站吗？`))return;try{await cloudRequest(`/rest/v1/papers?id=eq.${id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({deleted_at:new Date().toISOString()})});if(selectedId===id){selectedId=null;$('#graderWorkspace').classList.add('hidden');$('#workspacePlaceholder').classList.remove('hidden')}await loadCloud();toast('已移入回收站')}catch(error){console.error(error);toast('删除失败，请重试')}}
async function permanentlyDelete(id){const p=state.papers.find(x=>x.id===id);if(!p||!confirm(`确定彻底删除“${p.studentName}”的试卷及所有附件吗？此操作无法恢复。`))return;try{const paths=p.filePaths?.length?p.filePaths:[p.filePath];await cloudRequest('/storage/v1/object/remove',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prefixes:paths})});await cloudRequest(`/rest/v1/papers?id=eq.${id}`,{method:'DELETE'});await loadCloud();toast('试卷及数据已彻底删除')}catch(error){console.error(error);toast('彻底删除失败，请重试')}}
remove=moveToTrash;
queue=()=>{const ps=pending();$('#queueCount').textContent=ps.length+' 份';$('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-open="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">🗑</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';$$('[data-open]').forEach(b=>b.onclick=()=>select(b.dataset.open));$$('[data-delete]').forEach(b=>b.onclick=()=>moveToTrash(b.dataset.delete))};
trash=()=>{let sec=$('#trash');if(!sec){sec=document.createElement('section');sec.id='trash';sec.className='page';sec.innerHTML='<div class="page-intro"><h2>回收站</h2><p>可恢复误删试卷，或彻底删除试卷及附件。</p></div><div id="trashList" class="result-grid"></div>';$('.main-content').append(sec);const nav=document.createElement('button');nav.className='nav-item';nav.dataset.route='trash';nav.innerHTML='<span>♲</span>回收站';$('.nav').append(nav);nav.onclick=()=>route('trash')}const list=state.papers.filter(p=>p.deletedAt);$('#trashList').innerHTML=list.map(p=>`<article class="result-card"><span class="tag pending">已删除</span><h3>${esc(p.studentName)} · 408 试卷</h3><p>原状态：${p.status==='graded'?'已批改':'待批改'}</p><footer><button class="small-button restore" data-id="${p.id}">恢复</button><button class="small-button danger purge" data-id="${p.id}">彻底删除</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>回收站为空</h3></div>';$$('.restore').forEach(b=>b.onclick=async()=>{try{await cloudRequest(`/rest/v1/papers?id=eq.${b.dataset.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({deleted_at:null})});await loadCloud();toast('已恢复到原状态')}catch(error){console.error(error);toast('恢复失败，请重试')}});$$('.purge').forEach(b=>b.onclick=()=>permanentlyDelete(b.dataset.id))};
setTimeout(()=>render(),0);

// Supabase Auth：页面仍可使用“teacher”作为账号名，实际映射至指定教师邮箱。
const teacherEmail='teacher@xia.college';
async function teacherLogin(account,password){const email=account.trim()==='teacher'?teacherEmail:account.trim();const response=await fetch(`${cloudUrl}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:cloudKey,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const body=await response.text();if(!response.ok)throw new Error(body);const session=JSON.parse(body);if(session.user?.email!==teacherEmail)throw new Error('该账号没有教师权限');sessionStorage.setItem('teacher_access_token',session.access_token);cloudHeaders={apikey:cloudKey,Authorization:`Bearer ${session.access_token}`};return session}
$('#loginForm').onsubmit=async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;button.textContent='正在验证…';try{await teacherLogin($('#teacherAccount').value,$('#teacherPassword').value);show('teacher');await loadCloud();toast('教师登录成功')}catch(error){console.error(error);toast('账号、密码或教师权限不正确')}finally{button.disabled=false;button.textContent='登录工作台'}};
$('#logout').onclick=()=>{sessionStorage.removeItem('teacher_access_token');cloudHeaders={apikey:cloudKey,Authorization:`Bearer ${cloudKey}`};show('student')};
async function signedPaperUrl(path){const data=await cloudRequest(`/storage/v1/object/sign/paper-files/${path.split('/').map(encodeURIComponent).join('/')}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})});return `${cloudUrl}/storage/v1${data.signedURL}`}
const selectSecurePaper=select;
select=async id=>{await selectSecurePaper(id);const p=state.papers.find(x=>x.id===id);if(!p||!sessionStorage.getItem('teacher_access_token'))return;try{const image=$('#paperPreview');image.src=await signedPaperUrl(p.filePath)}catch(error){console.error(error);toast('试卷预览加载失败')}};

async function purgePaper(p){const paths=p.filePaths?.length?p.filePaths:[p.filePath];await cloudRequest('/storage/v1/object/paper-files',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({prefixes:paths})});await cloudRequest(`/rest/v1/papers?id=eq.${p.id}`,{method:'DELETE'})}
moveToTrash=async id=>{const p=state.papers.find(x=>x.id===id);if(!p||!confirm(`确定将“${p.studentName}”的试卷移入回收站吗？`))return;const previous=p.deletedAt;p.deletedAt=new Date().toISOString();render();try{await cloudRequest(`/rest/v1/papers?id=eq.${id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({deleted_at:p.deletedAt})});if(selectedId===id){selectedId=null;$('#graderWorkspace').classList.add('hidden');$('#workspacePlaceholder').classList.remove('hidden')}toast('已移入回收站')}catch(error){p.deletedAt=previous;render();console.error(error);toast('删除失败，已恢复显示')}};
remove=moveToTrash;
permanentlyDelete=async id=>{const p=state.papers.find(x=>x.id===id);if(!p||!confirm(`确定彻底删除“${p.studentName}”的试卷及全部附件吗？此操作无法恢复。`))return;try{await purgePaper(p);state.papers=state.papers.filter(x=>x.id!==id);render();toast('试卷及附件已彻底删除')}catch(error){console.error(error);toast('彻底删除失败，请重试')}};
trash=()=>{let sec=$('#trash');if(!sec){sec=document.createElement('section');sec.id='trash';sec.className='page';$('.main-content').append(sec);const nav=document.createElement('button');nav.className='nav-item';nav.dataset.route='trash';nav.innerHTML='<span>♲</span>回收站';$('.nav').append(nav);nav.onclick=()=>route('trash')}const list=state.papers.filter(p=>p.deletedAt);sec.innerHTML=`<div class="page-intro"><h2>回收站</h2><p>可恢复误删试卷，或永久删除试卷及附件。</p>${list.length?'<button id="purgeAll" class="small-button danger">清空回收站</button>':''}</div><div id="trashList" class="result-grid">${list.map(p=>`<article class="result-card"><span class="tag pending">已删除</span><h3>${esc(p.studentName)} · 408 试卷</h3><p>原状态：${p.status==='graded'?'已批改':'待批改'}</p><footer><button class="small-button restore" data-id="${p.id}">恢复</button><button class="small-button danger purge" data-id="${p.id}">彻底删除</button></footer></article>`).join('')||'<div class="workspace-empty panel"><h3>回收站为空</h3></div>'}</div>`;$$('.restore').forEach(b=>b.onclick=async()=>{const p=state.papers.find(x=>x.id===b.dataset.id);p.deletedAt=null;render();try{await cloudRequest(`/rest/v1/papers?id=eq.${p.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({deleted_at:null})});toast('已恢复到原状态')}catch(error){p.deletedAt=new Date().toISOString();render();console.error(error);toast('恢复失败')}});$$('.purge').forEach(b=>b.onclick=()=>permanentlyDelete(b.dataset.id));const all=$('#purgeAll');if(all)all.onclick=async()=>{if(!confirm(`确定彻底删除回收站内 ${list.length} 份试卷及全部附件吗？此操作无法恢复。`))return;try{for(const p of list)await purgePaper(p);state.papers=state.papers.filter(p=>!p.deletedAt);render();toast('回收站已清空')}catch(error){console.error(error);toast('清空失败，请重试')}}};
queue=()=>{const ps=pending();$('#queueCount').textContent=ps.length+' 份';$('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-open="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">🗑</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';$$('[data-open]').forEach(b=>b.onclick=()=>select(b.dataset.open));$$('[data-delete]').forEach(b=>b.onclick=()=>moveToTrash(b.dataset.delete))};
render();
// 以 deleted_at 为准筛选批改中心，确保移入回收站后立即从列表消失。
setTimeout(()=>{queue=()=>{const ps=state.papers.filter(p=>p.status==='pending'&&!p.deletedAt);$('#queueCount').textContent=ps.length+' 份';$('#gradingQueue').innerHTML=ps.map(p=>`<div class="queue-entry"><button class="queue-item ${p.id===selectedId?'active':''}" data-open="${p.id}"><strong>${esc(p.studentName)} · 408 试卷</strong><small>${esc(p.studentPhone)} · ${esc(p.uploadedAt)}</small></button><button class="queue-delete" data-delete="${p.id}" title="删除试卷">🗑</button></div>`).join('')||'<p class="empty-note">暂无待批改试卷</p>';$$('[data-open]').forEach(b=>b.onclick=()=>select(b.dataset.open));$$('[data-delete]').forEach(b=>b.onclick=()=>moveToTrash(b.dataset.delete))};render()},0);
// 所有待批改计数均排除回收站试卷，保持批改中心、侧栏与总览同步。
setTimeout(()=>{const baseRender=render;render=()=>{baseRender();const activePending=state.papers.filter(p=>p.status==='pending'&&!p.deletedAt).length;$('#pendingCount').textContent=activePending;$('#pendingBadge').textContent=activePending;$('#queueCount').textContent=activePending+' 份';queue()};render()},10);
// 评分控件：选择题明确为 0/2 分，综合题提供可选分值。
setTimeout(()=>{scores=p=>{const choices=Array.from({length:40},(_,i)=>Boolean((p.choice||[])[i]));const big=Array.from({length:7},(_,i)=>(p.big||[])[i]??0);const options=Array.from({length:71},(_,i)=>`<option value="${i}">${i} 分</option>`).join('');return `<section><h4>一、选择题 <span>40 题 × 2 分</span></h4><p class="score-tip">点击题号切换：未选为 0 分，选中为 2 分。</p><div class="choice-grid">${choices.map((ok,i)=>`<button class="choice ${ok?'correct':''}" data-choice="${i}"><b>${i+1}</b><small>${ok?'2 分':'0 分'}</small></button>`).join('')}</div></section><section><h4>二、综合应用题 <span>7 题 · 共 70 分</span></h4><p class="score-tip">请为每题选择实际得分，七题合计不得超过 70 分。</p>${big.map((value,i)=>`<label class="big-score">第 ${i+1} 题 <select data-big="${i}">${options}</select></label>`).join('')}</section>`};const originalSelect=select;select=async id=>{await originalSelect(id);const p=state.papers.find(x=>x.id===id);$$('[data-big]').forEach((input,i)=>input.value=String((p.big||[])[i]??0));$$('[data-choice]').forEach(button=>button.onclick=()=>{button.classList.toggle('correct');button.querySelector('small').textContent=button.classList.contains('correct')?'2 分':'0 分';total()});$$('[data-big]').forEach(input=>input.onchange=total)}},20);
// 最终评分与多页预览：选择题保持简洁题号，综合题由教师手动填写分数。
setTimeout(()=>{scores=p=>{const choices=Array.from({length:40},(_,i)=>Boolean((p.choice||[])[i]));const big=Array.from({length:7},(_,i)=>(p.big||[])[i]??'');return `<section><h4>一、选择题 <span>40 题 × 2 分</span></h4><p class="score-tip">点击题号：灰色为 0 分，蓝色为 2 分。</p><div class="choice-grid">${choices.map((ok,i)=>`<button class="choice ${ok?'correct':''}" data-choice="${i}">${i+1}</button>`).join('')}</div></section><section><h4>二、综合应用题 <span>7 题 · 共 70 分</span></h4><p class="score-tip">请直接填写每题得分，七题合计不得超过 70 分。</p>${big.map((value,i)=>`<label class="big-score">第 ${i+1} 题 <input data-big="${i}" type="number" value="${value}" min="0" placeholder="填写分数"></label>`).join('')}</section>`};const priorSelect=select;select=async id=>{await priorSelect(id);const p=state.papers.find(x=>x.id===id);if(!p)return;$$('[data-choice]').forEach(button=>button.onclick=()=>{button.classList.toggle('correct');total()});$$('[data-big]').forEach(input=>input.oninput=total);if((p.filePaths||[]).length<2)return;let page=0;const title=$('#selectedPaperName');title.innerHTML=`408 计算机考试试卷 <span class="page-switch"><button class="small-button" id="prevPaperPage">上一页</button><strong id="paperPageNumber">第 1 / ${p.filePaths.length} 页</strong><button class="small-button" id="nextPaperPage">下一页</button></span>`;const showPage=async next=>{page=(next+p.filePaths.length)%p.filePaths.length;const image=$('#paperPreview');image.src=await signedPaperUrl(p.filePaths[page]);$('#paperPageNumber').textContent=`第 ${page+1} / ${p.filePaths.length} 页`};$('#prevPaperPage').onclick=()=>showPage(page-1);$('#nextPaperPage').onclick=()=>showPage(page+1)}},40);
// 多页控制放在试卷图片下方，并恢复有效的教师登录会话。
setTimeout(()=>{const selectWithInlinePages=select;select=async id=>{await selectWithInlinePages(id);const p=state.papers.find(x=>x.id===id);const old=$('#paperPageControls');if(old)old.remove();if(!p||(p.filePaths||[]).length<2)return;$('#selectedPaperName').textContent='408 计算机考试试卷';let page=0;const controls=document.createElement('div');controls.id='paperPageControls';controls.className='paper-page-controls';controls.innerHTML=`<button class="small-button" id="prevPaperPage">← 上一页</button><strong id="paperPageNumber">第 1 / ${p.filePaths.length} 页</strong><button class="small-button" id="nextPaperPage">下一页 →</button>`;$('#canvasWrap').insertAdjacentElement('afterend',controls);const showPage=async next=>{page=(next+p.filePaths.length)%p.filePaths.length;$('#paperPreview').src=await signedPaperUrl(p.filePaths[page]);$('#paperPageNumber').textContent=`第 ${page+1} / ${p.filePaths.length} 页`};$('#prevPaperPage').onclick=()=>showPage(page-1);$('#nextPaperPage').onclick=()=>showPage(page+1)};const token=sessionStorage.getItem('teacher_access_token');if(token){fetch(`${cloudUrl}/auth/v1/user`,{headers:{apikey:cloudKey,Authorization:`Bearer ${token}`}}).then(async response=>{if(!response.ok)throw new Error('登录会话已过期');const user=await response.json();if(user.email!==teacherEmail)throw new Error('账号没有教师权限');cloudHeaders={apikey:cloudKey,Authorization:`Bearer ${token}`};show('teacher');await loadCloud()}).catch(()=>{sessionStorage.removeItem('teacher_access_token');cloudHeaders={apikey:cloudKey,Authorization:`Bearer ${cloudKey}`};show('login')})}},60);
