/**
 * ============================================================
 * 深度研读资料 — 标准化 JS 运行时模板 (P1/P2 _intermediate.html)
 * ============================================================
 * 版本: 1.0.0 | 最后验证: 2026-05-19
 * 
 * 使用方式:
 *   将 PAGE_DATA 对象填入内容后, 将本模板拼接在 </script> 之前即可。
 *   模板中的 {{PHASE_LABEL}} 替换为阶段名称 (如 "统计与数学基础（1/5）")。
 *   模板中的 {{KP_ID}} 替换为知识点ID (如 "p1_1")。
 * 
 * ⚠️ 变量声明顺序至关重要，请勿调整:
 *   ① var activeCharts = {}
 *   ② var sidebarLinks = []
 *   ③ var savedTheme = ...
 *   ④ applyTheme(savedTheme)
 */

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('slm-theme', theme);
  updateThemeIcon();
  Object.values(activeCharts).forEach(function(chart){
    var opt = chart.getOption();
    chart.setOption(createThemedOption(opt), {notMerge: false});
  });
}
function toggleTheme(){
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
function updateThemeIcon(){
  var t = document.getElementById('theme-toggle');
  t.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌓';
}
var activeCharts = {};
var sidebarLinks = [];
var savedTheme = localStorage.getItem('slm-theme') || 'dark';
applyTheme(savedTheme);

window.addEventListener('scroll', function(){
  var scrollTop = window.scrollY;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('progress-bar').style.width = progress + '%';
});

function buildSidebar(){
  var container = document.getElementById('sidebar-links');
  sidebarLinks = [];
  PAGE_DATA.modules.forEach(function(mod){
    var a = document.createElement('a');
    a.href = '#' + mod.module_id;
    a.className = 'sidebar-link';
    a.textContent = mod.module_title || mod.module_id;
    a.addEventListener('click', function(e){
      e.preventDefault();
      document.getElementById(mod.module_id).scrollIntoView({behavior: 'smooth'});
    });
    container.appendChild(a);
    sidebarLinks.push({el: a, id: mod.module_id});
  });
}

var observer = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      sidebarLinks.forEach(function(link){link.el.classList.toggle('active', link.id === entry.target.id);});
    }
  });
}, {rootMargin: '-80px 0px -60% 0px'});

function buildMetaCard(){
  var md = PAGE_DATA;
  document.getElementById('meta-card-container').innerHTML =
    '<div class="meta-card">'+
    '<div style="width:100%"><span class="meta-badge domain-ai" style="margin-right:8px">🔗 📚 机器学习及其统计基础与大模型 系统学习方案 · {{PHASE_LABEL}}</span></div>'+
    '<div class="meta-item"><span class="icon">📖</span><strong>'+md.topic+'</strong></div>'+
    '<div class="meta-item"><span class="meta-badge domain-ai">'+md.domain_name+'</span></div>'+
    '<div class="meta-item"><span class="meta-badge level-intermediate">'+md.level_name+'</span></div>'+
    '<div class="meta-item"><span class="icon">⏱️</span>约'+md.reading_time+'分钟阅读</div>'+
    '<div class="meta-item"><span class="icon">📦</span>'+md.module_count+'个模块</div></div>';
}

function renderFormulas(container){
  if(typeof renderMathInElement !== 'undefined'){
    renderMathInElement(container, {delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError: false});
  }
}
function createThemedOption(existingOpt){
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var color = isDark ? ['#818cf8','#a78bfa','#c4b5fd','#67e8f9','#fbbf24','#34d399','#f87171','#f472b6'] : ['#6366f1','#8b5cf6','#a78bfa','#22d3ee','#f59e0b','#10b981','#ef4444','#ec4899'];
  return {color: color};
}
function renderChart(moduleId, chartConfig, index){
  var chartId = 'chart_' + moduleId + '_' + index;
  var wrapper = document.getElementById(chartId);
  if(!wrapper) return;
  if(typeof echarts === 'undefined'){wrapper.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-tertiary);font-size:13px;">📊 图表(静态模式)<br><small>加载CDN后可交互</small></div>';return;}
  try{
    var chart = echarts.init(wrapper);
    chart.setOption(createThemedOption(chartConfig.echarts_option||{}));
    activeCharts[chartId] = chart;
    new ResizeObserver(function(){chart.resize();}).observe(wrapper);
  }catch(e){wrapper.textContent = '图表渲染失败: ' + e.message;}
}

function buildModuleHTML(mod){
  var tagClass = (function(t){
    var m = {'核心概念':'tag-core','前置知识':'tag-core','核心工具':'tag-tools','发展演进':'tag-evolution','实践应用':'tag-application','风险与挑战':'tag-risk','前沿探索':'tag-frontier'};
    return m[t] || 'tag-core';
  })(mod.module_tag||'');
  var html = '<section class="module-section" id="'+mod.module_id+'"><div class="module-header"><span class="module-tag '+tagClass+'">'+(mod.module_tag||'')+'</span><h2 class="module-title">'+(mod.module_title||mod.module_id)+'</h2></div>';
  if(mod.hook) html += '<div class="module-hook">'+mod.hook+'</div>';
  if(mod.content){
    var c = mod.content;
    c = c.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    c = c.replace(/`([^`]+)`/g,'<code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>');
    c = c.replace(/\n\n/g,'</p><p>');
    c = '<p>' + c + '</p>';
    html += '<div class="module-content">'+c+'</div>';
  }
  if(mod.formulas) mod.formulas.forEach(function(f){
    html += '<div class="formula-block" onclick="if(this.querySelector(\'.formula-derivation\'))this.classList.toggle(\'expanded\')"><div>'+f.latex+'</div>'+
      (f.caption?'<div class="formula-caption">'+f.caption+'</div>':'')+
      (f.expandable&&f.derivation?'<div class="formula-expand-hint">💡 点击展开推导过程</div><div class="formula-derivation">'+f.derivation+'</div>':'')+'</div>';
  });
  if(mod.charts) mod.charts.forEach(function(c,i){html += '<div class="chart-container"><div class="chart-wrapper" id="chart_'+mod.module_id+'_'+i+'"></div>'+(c.caption?'<div class="chart-caption">'+c.caption+'</div>':'')+'</div>';});
  if(mod.tables) mod.tables.forEach(function(t){
    html += '<table class="module-table"><thead><tr>'+t.headers.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr></thead><tbody>'+
      t.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+c+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table>'+
      (t.caption?'<div class="table-caption" style="font-size:12px;color:var(--text-tertiary);text-align:center;margin-top:8px">'+t.caption+'</div>':'');
  });
  if(mod.references) html += '<div class="module-references"><h4>📚 参考文献</h4><ol>'+mod.references.map(function(r){
    return '<li>'+(r.authors||'')+' ('+(r.year||'')+'). <strong>'+(r.title||'')+'</strong>.'+(r.url?' <a href="'+r.url+'" target="_blank" style="color:var(--primary)">链接</a>':'')+'</li>';
  }).join('')+'</ol></div>';
  if(mod.key_takeaway) html += '<div class="key-takeaway">💡 '+mod.key_takeaway+'</div>';
  html += '</section>';
  return html;
}

function initPage(){
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  buildMetaCard();
  buildSidebar();
  var mc = document.getElementById('modules-container');
  PAGE_DATA.modules.forEach(function(mod){mc.innerHTML += buildModuleHTML(mod);});
  var sections = mc.querySelectorAll('.module-section');
  sections.forEach(function(sec){observer.observe(sec);});
  renderFormulas(mc);
  setTimeout(function(){
    PAGE_DATA.modules.forEach(function(mod){
      if(mod.charts) mod.charts.forEach(function(c,i){renderChart(mod.module_id,c,i);});
    });
  },100);
  var fObs = new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.08});
  sections.forEach(function(sec){fObs.observe(sec);});
}
document.addEventListener('DOMContentLoaded', initPage);

function exportNotes(){
  var lines = ['# '+PAGE_DATA.topic+' - 学习笔记','','生成日期: '+new Date().toLocaleDateString('zh-CN'),''];
  PAGE_DATA.modules.forEach(function(m){lines.push('- **'+(m.module_title||m.module_id)+'**: '+(m.key_takeaway||m.hook||''));});
  if(navigator.clipboard){navigator.clipboard.writeText(lines.join('\n')).then(function(){alert('✅ 学习笔记已复制到剪贴板!');});}
  else{alert('复制失败，请手动选择复制');}
}

(function(){
  var cv = document.getElementById('bg-canvas');
  var ctx = cv.getContext('2d');
  var particles=[];
  function rsz(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
  window.addEventListener('resize',rsz);rsz();
  var count = Math.min(60,Math.floor((cv.width*cv.height)/20000));
  for(var i=0;i<count;i++) particles.push({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.3,a:Math.random()*0.3+0.05});
  function animate(){
    ctx.clearRect(0,0,cv.width,cv.height);
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    var c = isDark?'129,140,248':'99,102,241';
    particles.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=cv.width;if(p.x>cv.width)p.x=0;
      if(p.y<0)p.y=cv.height;if(p.y>cv.height)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);
      ctx.fillStyle='rgba('+c+','+p.a+')';ctx.fill();
    });
    for(var j=0;j<particles.length;j++) for(var k=j+1;k<particles.length;k++){
      var dx=particles[j].x-particles[k].x,dy=particles[j].y-particles[k].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ctx.beginPath();ctx.moveTo(particles[j].x,particles[j].y);ctx.lineTo(particles[k].x,particles[k].y);ctx.strokeStyle='rgba('+c+','+(0.06*(1-d/110))+')';ctx.lineWidth=0.5;ctx.stroke();}
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
