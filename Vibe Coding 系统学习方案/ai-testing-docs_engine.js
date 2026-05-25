var TAG_CLASS_MAP = {
  '\u524d\u7f6e\u77e5\u8bc6': 'tag-core',
  '\u6838\u5fc3\u6982\u5ff5': 'tag-core',
  '\u6838\u5fc3\u5de5\u5177': 'tag-tools',
  '\u53d1\u5c55\u6f14\u8fdb': 'tag-evolution',
  '\u5b9e\u8df5\u5e94\u7528': 'tag-application',
  '\u98ce\u9669\u4e0e\u6311\u6218': 'tag-risk',
  '\u524d\u6cbf\u63a2\u7d22': 'tag-frontier'
};

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('deep-dive-theme', theme);
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf18';
  if (typeof echarts !== 'undefined') {
    var charts = document.querySelectorAll('.chart-wrapper');
    for (var i = 0; i < charts.length; i++) {
      var c = echarts.getInstanceByDom(charts[i]);
      if (c) {
        var opt = c.getOption();
        var bg = theme === 'dark' ? 'transparent' : '#fff';
        c.setOption({ backgroundColor: bg });
        c.resize();
      }
    }
  }
}

function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}

function getTagClass(tag) {
  return TAG_CLASS_MAP[tag] || 'tag-core';
}

function parseMarkdownContent(text) {
  if (!text) return '';
  var html = text;
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code style="background:var(--bg-tertiary);padding:2px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:13px">$1</code>');
  var lines = html.split('\n');
  var result = [];
  var inList = false;
  var listType = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^- /)) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push('</' + listType + '>');
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push('<li>' + line.substring(2) + '</li>');
    } else if (line.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push('</' + listType + '>');
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      result.push('<li>' + line.replace(/^\d+\. /, '') + '</li>');
    } else {
      if (inList) {
        result.push('</' + listType + '>');
        inList = false;
      }
      if (line.trim() === '') {
        result.push('');
      } else {
        result.push('<p>' + line + '</p>');
      }
    }
  }
  if (inList) result.push('</' + listType + '>');
  return result.join('\n');
}

function buildSidebar(modules) {
  var container = document.getElementById('sidebar-links');
  if (!container) return;
  var html = '';
  for (var i = 0; i < modules.length; i++) {
    var m = modules[i];
    html += '<a class="sidebar-link" href="#' + m.module_id + '" data-id="' + m.module_id + '">' + m.module_title + '</a>';
  }
  container.innerHTML = html;
}

function buildMetaCard(data) {
  var container = document.getElementById('meta-card-container');
  if (!container) return;
  var html = '<div class="meta-card">';
  html += '<div class="meta-item"><span class="icon">\ud83d\udcd6</span><strong>' + data.topic + '</strong></div>';
  html += '<div class="meta-item"><span class="meta-badge domain-ai">' + data.domain_name + '</span></div>';
  html += '<div class="meta-item"><span class="meta-badge level-intermediate">' + data.level_name + '</span></div>';
  html += '<div class="meta-item"><span class="meta-badge texture-badge">' + data.texture_name + '</span></div>';
  html += '<div class="meta-item"><span class="meta-badge depth-breadth">' + data.depth + '\u00b7' + data.breadth + '</span></div>';
  html += '<div class="meta-item"><span class="icon">\u23f1</span>\u9605\u8bfb\u7ea6 <strong>' + data.reading_time + '</strong> \u5206\u949f</div>';
  html += '<div class="meta-item"><span class="icon">\ud83d\udcc2</span><strong>' + data.module_count + '</strong> \u4e2a\u6a21\u5757</div>';
  if (data.plan_name) {
    html += '<div class="meta-plan-info">\ud83d\udccc \u5f52\u5c5e\u65b9\u6848\uff1a<strong>' + data.plan_name + '</strong> \u00b7 ' + data.phase_name + ' \u00b7 \u7b2c' + data.phase_position + '\u9636\u6bb5</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function buildModuleHTML(m) {
  var tagClass = getTagClass(m.module_tag);
  var html = '<section class="module-section" id="' + m.module_id + '">';
  html += '<div class="module-header">';
  html += '<span class="module-tag ' + tagClass + '">' + m.module_tag + '</span>';
  html += '<h2 class="module-title">' + m.module_title + '</h2>';
  html += '</div>';
  html += '<div class="module-hook">' + m.hook + '</div>';
  html += '<div class="module-content">' + parseMarkdownContent(m.content) + '</div>';
  if (m.formulas && m.formulas.length > 0) {
    for (var fi = 0; fi < m.formulas.length; fi++) {
      var f = m.formulas[fi];
      html += '<div class="formula-block" data-expandable="' + (f.expandable ? '1' : '0') + '" onclick="toggleDerivation(this)">';
      html += '<div class="formula-latex">' + f.latex + '</div>';
      html += '<div class="formula-caption">' + f.caption + '</div>';
      if (f.expandable && f.derivation) {
        html += '<div class="formula-expand-hint">\ud83d\udc48 \u70b9\u51fb\u5c55\u5f00\u63a8\u5bfc</div>';
        html += '<div class="formula-derivation">' + parseMarkdownContent(f.derivation) + '</div>';
      }
      html += '</div>';
    }
  }
  if (m.charts && m.charts.length > 0) {
    for (var ci = 0; ci < m.charts.length; ci++) {
      var ch = m.charts[ci];
      var chartId = m.module_id + '-chart-' + ci;
      html += '<div class="chart-container">';
      html += '<div class="chart-wrapper" id="' + chartId + '"></div>';
      html += '<div class="chart-caption">' + ch.caption + '</div>';
      if (ch.data_source) {
        html += '<div class="chart-source">\u6570\u636e\u6765\u6e90\uff1a' + ch.data_source + '</div>';
      }
      html += '</div>';
    }
  }
  if (m.tables && m.tables.length > 0) {
    for (var ti = 0; ti < m.tables.length; ti++) {
      var tb = m.tables[ti];
      html += '<table class="module-table"><thead><tr>';
      for (var hi = 0; hi < tb.headers.length; hi++) {
        html += '<th>' + tb.headers[hi] + '</th>';
      }
      html += '</tr></thead><tbody>';
      for (var ri = 0; ri < tb.rows.length; ri++) {
        html += '<tr>';
        for (var ci2 = 0; ci2 < tb.rows[ri].length; ci2++) {
          html += '<td>' + tb.rows[ri][ci2] + '</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      if (tb.caption) {
        html += '<div class="table-caption">' + tb.caption + '</div>';
      }
    }
  }
  if (m.references && m.references.length > 0) {
    html += '<div class="module-references"><h4>\ud83d\udcda \u53c2\u8003\u6587\u732e</h4><ol>';
    for (var refi = 0; refi < m.references.length; refi++) {
      var ref = m.references[refi];
      var refText = ref.authors ? ref.authors + ' (' + ref.year + ')' : '';
      refText += refText ? '. ' : '';
      refText += ref.title;
      if (ref.doi) refText += ' DOI:' + ref.doi;
      html += '<li>' + refText + '</li>';
    }
    html += '</ol></div>';
  }
  if (m.key_takeaway) {
    html += '<div class="key-takeaway">\ud83d\udd11 ' + m.key_takeaway + '</div>';
  }
  html += '</section>';
  return html;
}

function renderFormulas() {
  if (typeof renderMathInElement === 'function') {
    var blocks = document.querySelectorAll('.formula-block');
    for (var i = 0; i < blocks.length; i++) {
      renderMathInElement(blocks[i], {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }
}

function createThemedOption(opt) {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var textColor = isDark ? '#94a3b8' : '#475569';
  var bgColor = 'transparent';
  var borderColor = isDark ? '#334155' : '#e2e8f0';
  var cloned = JSON.parse(JSON.stringify(opt));
  if (!cloned.textStyle) cloned.textStyle = {};
  cloned.textStyle.color = textColor;
  if (cloned.tooltip && cloned.tooltip.textStyle) {
    cloned.tooltip.textStyle.color = isDark ? '#f1f5f9' : '#0f172a';
  }
  if (!cloned.tooltip) cloned.tooltip = {};
  if (!cloned.tooltip.textStyle) cloned.tooltip.textStyle = {};
  cloned.tooltip.textStyle.color = isDark ? '#f1f5f9' : '#0f172a';
  if (!cloned.tooltip.backgroundColor) cloned.tooltip.backgroundColor = isDark ? '#1e293b' : '#fff';
  if (!cloned.tooltip.borderColor) cloned.tooltip.borderColor = borderColor;
  if (cloned.legend) {
    if (Array.isArray(cloned.legend)) {
      for (var li = 0; li < cloned.legend.length; li++) {
        if (!cloned.legend[li].textStyle) cloned.legend[li].textStyle = {};
        cloned.legend[li].textStyle.color = textColor;
      }
    } else {
      if (!cloned.legend.textStyle) cloned.legend.textStyle = {};
      cloned.legend.textStyle.color = textColor;
    }
  }
  if (cloned.xAxis) {
    var xAxes = Array.isArray(cloned.xAxis) ? cloned.xAxis : [cloned.xAxis];
    for (var xi = 0; xi < xAxes.length; xi++) {
      if (!xAxes[xi].axisLabel) xAxes[xi].axisLabel = {};
      xAxes[xi].axisLabel.color = textColor;
      if (!xAxes[xi].axisLine) xAxes[xi].axisLine = {};
      if (!xAxes[xi].axisLine.lineStyle) xAxes[xi].axisLine.lineStyle = {};
      xAxes[xi].axisLine.lineStyle.color = borderColor;
    }
    if (!Array.isArray(cloned.xAxis)) cloned.xAxis = xAxes[0];
  }
  if (cloned.yAxis) {
    var yAxes = Array.isArray(cloned.yAxis) ? cloned.yAxis : [cloned.yAxis];
    for (var yi = 0; yi < yAxes.length; yi++) {
      if (!yAxes[yi].axisLabel) yAxes[yi].axisLabel = {};
      yAxes[yi].axisLabel.color = textColor;
      if (!yAxes[yi].axisLine) yAxes[yi].axisLine = {};
      if (!yAxes[yi].axisLine.lineStyle) yAxes[yi].axisLine.lineStyle = {};
      yAxes[yi].axisLine.lineStyle.color = borderColor;
      if (yAxes[yi].nameTextStyle) yAxes[yi].nameTextStyle.color = textColor;
    }
    if (!Array.isArray(cloned.yAxis)) cloned.yAxis = yAxes[0];
  }
  cloned.backgroundColor = bgColor;
  return cloned;
}

var chartInstances = [];

function renderCharts(modules) {
  if (typeof echarts === 'undefined') return;
  for (var mi = 0; mi < modules.length; mi++) {
    var m = modules[mi];
    if (!m.charts || m.charts.length === 0) continue;
    for (var ci = 0; ci < m.charts.length; ci++) {
      var chartId = m.module_id + '-chart-' + ci;
      var dom = document.getElementById(chartId);
      if (!dom) continue;
      var chart = echarts.init(dom);
      var themedOpt = createThemedOption(m.charts[ci].echarts_option);
      chart.setOption(themedOpt);
      chartInstances.push(chart);
    }
  }
}

function toggleDerivation(el) {
  if (el.getAttribute('data-expandable') === '1') {
    el.classList.toggle('expanded');
    var hint = el.querySelector('.formula-expand-hint');
    if (hint) {
      hint.textContent = el.classList.contains('expanded') ? '\ud83d\udc48 \u70b9\u51fb\u6536\u8d77\u63a8\u5bfc' : '\ud83d\udc48 \u70b9\u51fb\u5c55\u5f00\u63a8\u5bfc';
    }
  }
}

function openSearch() {
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  if (overlay) {
    overlay.classList.add('open');
    if (input) {
      input.value = '';
      input.focus();
    }
    document.getElementById('searchResults').innerHTML = '';
  }
}

function closeSearch() {
  var overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('open');
}

function performSearch(query) {
  var results = document.getElementById('searchResults');
  if (!results) return;
  if (!query || query.trim().length < 2) {
    results.innerHTML = '<div class="search-empty">\u8f93\u5165\u81f3\u5c112\u4e2a\u5b57\u7b26\u5f00\u59cb\u641c\u7d22</div>';
    return;
  }
  var q = query.toLowerCase();
  var found = [];
  var modules = PAGE_DATA.modules;
  for (var i = 0; i < modules.length; i++) {
    var m = modules[i];
    var titleMatch = m.module_title.toLowerCase().indexOf(q) >= 0;
    var hookMatch = m.hook.toLowerCase().indexOf(q) >= 0;
    var contentMatch = m.content.toLowerCase().indexOf(q) >= 0;
    if (titleMatch || hookMatch || contentMatch) {
      var snippet = '';
      if (contentMatch) {
        var idx = m.content.toLowerCase().indexOf(q);
        var start = Math.max(0, idx - 40);
        var end = Math.min(m.content.length, idx + q.length + 60);
        snippet = (start > 0 ? '...' : '') + m.content.substring(start, end) + (end < m.content.length ? '...' : '');
      } else {
        snippet = m.hook;
      }
      found.push({ id: m.module_id, title: m.module_title, tag: m.module_tag, snippet: snippet });
    }
  }
  if (found.length === 0) {
    results.innerHTML = '<div class="search-empty">\u672a\u627e\u5230\u76f8\u5173\u5185\u5bb9</div>';
    return;
  }
  var html = '';
  for (var j = 0; j < found.length; j++) {
    var r = found[j];
    var highlighted = r.title.replace(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    html += '<div class="sr-item" onclick="scrollToModule(\'' + r.id + '\')">';
    html += '<div class="sr-title">' + highlighted + ' <span style="font-size:11px;color:var(--text-tertiary);font-weight:400">' + r.tag + '</span></div>';
    html += '<div class="sr-snippet">' + r.snippet + '</div>';
    html += '</div>';
  }
  results.innerHTML = html;
}

function scrollToModule(id) {
  closeSearch();
  var el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function buildMobileNav(modules) {
  var container = document.getElementById('mbnInner');
  if (!container) return;
  var items = [
    { icon: '\ud83d\udcd6', label: '\u6982\u89c8', action: 'window.scrollTo({top:0,behavior:"smooth"})' },
    { icon: '\ud83d\udd0d', label: '\u641c\u7d22', action: 'openSearch()' },
    { icon: '\ud83c\udf19', label: '\u4e3b\u9898', action: 'toggleTheme()' },
    { icon: '\u2190', label: '\u8fd4\u56de', action: 'goBack()' }
  ];
  var html = '';
  for (var i = 0; i < items.length; i++) {
    html += '<button class="mbn-item" onclick="' + items[i].action + '">';
    html += '<span class="mbn-icon">' + items[i].icon + '</span>';
    html += items[i].label;
    html += '</button>';
  }
  container.innerHTML = html;
}

function exportPDF() {
  window.print();
}

function exportNotes() {
  var modules = PAGE_DATA.modules;
  var text = '# ' + PAGE_DATA.topic + '\n\n';
  text += '\u9886\u57df: ' + PAGE_DATA.domain_name + ' | \u5c42\u7ea7: ' + PAGE_DATA.level_name + '\n\n';
  text += '---\n\n';
  for (var i = 0; i < modules.length; i++) {
    var m = modules[i];
    text += '## ' + m.module_title + '\n\n';
    text += '> ' + m.hook + '\n\n';
    text += m.content + '\n\n';
    if (m.key_takeaway) {
      text += '**\u6838\u5fc3\u8981\u70b9**: ' + m.key_takeaway + '\n\n';
    }
    text += '---\n\n';
  }
  var blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = PAGE_DATA.topic + '_\u7b14\u8bb0.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initProgressBar() {
  var bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

function initScrollSpy() {
  var sections = document.querySelectorAll('.module-section');
  var links = document.querySelectorAll('.sidebar-link');
  if (sections.length === 0 || links.length === 0) return;
  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        var id = entries[i].target.id;
        for (var j = 0; j < links.length; j++) {
          if (links[j].getAttribute('data-id') === id) {
            links[j].classList.add('active');
          } else {
            links[j].classList.remove('active');
          }
        }
      }
    }
  }, { rootMargin: '-20% 0px -70% 0px' });
  for (var k = 0; k < sections.length; k++) {
    observer.observe(sections[k]);
  }
}

function initScrollAnimation() {
  var sections = document.querySelectorAll('.module-section');
  if (sections.length === 0) return;
  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('visible');
      }
    }
  }, { threshold: 0.08 });
  for (var j = 0; j < sections.length; j++) {
    observer.observe(sections[j]);
  }
}

function initBgCanvas() {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var particles = [];
  var particleCount = 40;
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.3 + 0.05
    });
  }

  function animate() {
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var baseColor = isDark ? '99,102,241' : '99,102,241';
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + baseColor + ',' + p.alpha + ')';
      ctx.fill();
    }
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(' + baseColor + ',' + (0.06 * (1 - dist / 150)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

function initKeyboard() {
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleTheme();
    }
    if (e.key === 'Escape') {
      closeSearch();
      var helpOv = document.getElementById('helpOverlay');
      if (helpOv) helpOv.classList.remove('open');
    }
    if (e.shiftKey && (e.key === '?' || e.key === '\uff1f')) {
      e.preventDefault();
      var helpOv2 = document.getElementById('helpOverlay');
      if (helpOv2) helpOv2.classList.toggle('open');
    }
  });
}

function initSearchInput() {
  var input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', function() {
      performSearch(this.value);
    });
  }
  var overlay = document.getElementById('searchOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSearch();
    });
  }
  var helpOverlay = document.getElementById('helpOverlay');
  if (helpOverlay) {
    helpOverlay.addEventListener('click', function(e) {
      if (e.target === helpOverlay) helpOverlay.classList.remove('open');
    });
  }
}

function initResizeHandler() {
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      for (var i = 0; i < chartInstances.length; i++) {
        if (chartInstances[i] && !chartInstances[i].isDisposed()) {
          chartInstances[i].resize();
        }
      }
    }, 200);
  });
}

function initPage() {
  if (typeof PAGE_DATA === 'undefined' || !PAGE_DATA.modules) return;

  var savedTheme = localStorage.getItem('deep-dive-theme');
  applyTheme(savedTheme || 'light');

  buildSidebar(PAGE_DATA.modules);
  buildMetaCard(PAGE_DATA);

  var container = document.getElementById('modules-container');
  if (container) {
    var modulesHTML = '';
    for (var i = 0; i < PAGE_DATA.modules.length; i++) {
      modulesHTML += buildModuleHTML(PAGE_DATA.modules[i]);
    }
    container.innerHTML = modulesHTML;
  }

  renderFormulas();
  renderCharts(PAGE_DATA.modules);
  buildMobileNav(PAGE_DATA.modules);

  initProgressBar();
  initScrollSpy();
  initScrollAnimation();
  initBgCanvas();
  initKeyboard();
  initSearchInput();
  initResizeHandler();

  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
}

document.addEventListener('DOMContentLoaded', initPage);
