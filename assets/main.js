// 漫画抽屉完整功能版 - 带内置收起按钮
document.addEventListener('DOMContentLoaded', async () => {
  const config = window.CHAPTER_DRAWER_CONFIG;
  if (!config) {
    console.log('❌ 未找到漫画抽屉配置');
    return;
  }

  console.log('✅ 漫画抽屉加载成功', config);

  // ======================================
  // 动态创建所有HTML结构
  // ======================================
  console.log('🔧 开始创建DOM元素...');

  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-drawer-wrapper';

  // 外部触发按钮（< >）
  const toggleBtn = document.createElement('div');
  toggleBtn.className = 'drawer-toggle-btn';
  toggleBtn.textContent = '<';
  toggleBtn.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    right: 0 !important;
    width: 100px !important;
    height: 200px !important;
    background: #2d8cf0 !important;
    color: #ffffff !important;
    font-size: 48px !important;
    font-weight: bold !important;
    z-index: 999999999999 !important;
    opacity: 1 !important;
    visibility: visible !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  `;

  const panel = document.createElement('div');
  panel.className = 'drawer-panel';

  const header = document.createElement('div');
  header.className = 'drawer-header';

  const title = document.createElement('div');
  title.className = 'drawer-title';
  title.textContent = '章节列表';

  // 🔥 新增：抽屉内的「收起」按钮（>），放在放大按钮左侧
  const closeBtn = document.createElement('div');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '收起';
  closeBtn.style.cssText = `
    padding: 8px 16px !important;
    background: #ff4d4f !important;
    color: #fff !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    margin-right: 10px !important;
    transition: background 0.2s ease !important;
  `;

  const resizeBtn = document.createElement('div');
  resizeBtn.className = 'resize-btn';
  resizeBtn.textContent = '放大';

  const body = document.createElement('div');
  body.className = 'drawer-body';

  const chapterList = document.createElement('div');
  chapterList.className = 'chapter-list';

  const contentContainer = document.createElement('div');
  contentContainer.className = 'chapter-content';

  // 组装DOM：标题 + 收起按钮 + 放大按钮
  header.append(title, closeBtn, resizeBtn);
  body.append(chapterList, contentContainer);
  panel.append(header, body);
  wrapper.append(toggleBtn, panel);
  document.body.appendChild(wrapper);

  console.log('✅ DOM元素创建完成，已添加到页面');

  // ======================================
  // 状态管理
  // ======================================
  let isOpen = false;
  let isExpanded = false;
  let isDragging = false;
  let startY = 0;
  let startTop = 0;
  let clickStartTime = 0;

  // 从本地存储恢复按钮位置
  const savedTop = localStorage.getItem('chapterDrawerBtnTop');
  if (savedTop) {
    toggleBtn.style.top = savedTop;
    toggleBtn.style.transform = 'none';
    console.log('📍 恢复按钮位置:', savedTop);
  }

  // ======================================
  // 核心交互逻辑
  // ======================================
  // 1. 外部按钮：展开/收起抽屉
  toggleBtn.addEventListener('click', (e) => {
    if (Date.now() - clickStartTime > 200) return;
    toggleDrawer();
  });

  // 🔥 2. 抽屉内的「收起」按钮：点击直接关闭
  closeBtn.addEventListener('click', () => {
    if (isOpen) {
      toggleDrawer();
    }
  });

  // 3. 缩放抽屉
  resizeBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    panel.classList.toggle('expanded', isExpanded);
    resizeBtn.textContent = isExpanded ? '缩小' : '放大';
    console.log('🔍 抽屉已', isExpanded ? '放大' : '缩小');
  });

  // 4. 按钮上下拖动
  toggleBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    clickStartTime = Date.now();
    startY = e.clientY;
    startTop = toggleBtn.getBoundingClientRect().top;
    toggleBtn.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const newTop = Math.max(0, Math.min(window.innerHeight - 200, startTop + deltaY));
    toggleBtn.style.top = `${newTop}px`;
    toggleBtn.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      toggleBtn.style.cursor = 'grab';
      localStorage.setItem('chapterDrawerBtnTop', toggleBtn.style.top);
    }
  });

  // 核心：抽屉展开/收起的通用函数
  function toggleDrawer() {
    isOpen = !isOpen;
    if (isOpen) {
      panel.classList.add('open');
      toggleBtn.textContent = '>';
      console.log('📂 抽屉已打开');
    } else {
      panel.classList.remove('open');
      toggleBtn.textContent = '<';
      if (isExpanded) {
        isExpanded = false;
        panel.classList.remove('expanded');
        resizeBtn.textContent = '放大';
      }
      console.log('📁 抽屉已关闭');
    }
  }

  // 渲染章节列表
  config.chapters.forEach((ch, index) => {
    const item = document.createElement('div');
    item.className = 'chapter-item';
    item.textContent = typeof ch === 'string' ? ch : ch.title;
    item.dataset.index = index;
    item.onclick = () => loadChapter(ch, item);
    chapterList.appendChild(item);
  });

  // 加载章节内容
  async function loadChapter(ch, item) {
    document.querySelectorAll('.chapter-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');
    contentContainer.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const chapterPath = typeof ch === 'string' ? ch : ch.path;
      const chapterText = typeof ch === 'string' ? '' : ch.text || '';
      contentContainer.innerHTML = chapterText;

      const url = `${config.imageRoot}/${chapterPath}/list.json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP错误: ' + res.status);
      const imgs = await res.json();
      imgs.forEach(img => {
        const el = document.createElement('img');
        el.className = 'chapter-img';
        el.src = `${config.imageRoot}/${chapterPath}/${img}`;
        el.loading = 'lazy';
        contentContainer.appendChild(el);
      });
    } catch (e) {
      console.error('❌ 加载失败:', e);
      contentContainer.innerHTML += '<div class="loading">图片加载失败</div>';
    }
  }
});