const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

// ======================================
// 1. 全局配置 + 自动生成漫画目录
// ======================================
hexo.extend.filter.register('after_generate', async () => {
  const config = hexo.config.chapter_drawer || { enable: true };
  if (!config.enable) return;

  hexo.log.info('[ChapterDrawer] 插件启动，生成漫画目录...');
  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

  const allChapters = new Map();
  const posts = hexo.locals.get('posts') || [];

  posts.forEach(post => {
    // 单页开关：默认开启，可设置为 false 关闭
    if (post.chapter_drawer === false || !post.drawer_chapters?.length) return;
    const root = post.drawer_image_root || config.image_root || '/images/chapters';
    const localRoot = path.join(hexo.source_dir, root.replace(/^\//, ''));

    post.drawer_chapters.forEach(ch => {
      // 支持两种格式：字符串（仅图片）或对象（图片+文字）
      const chapterPath = typeof ch === 'string' ? ch : ch.path;
      const chapterDir = path.join(localRoot, chapterPath);
      allChapters.set(chapterDir, { root, chapter: chapterPath });
    });
  });

  for (const [chapterPath, info] of allChapters) {
    try {
      if (!fs.existsSync(chapterPath)) continue;
      const files = await fsPromises.readdir(chapterPath);
      const images = files
        .filter(file => IMAGE_EXTS.some(ext => file.toLowerCase().endsWith(ext)))
        .sort();

      if (!images.length) continue;
      const outputDir = path.join(hexo.public_dir, info.root.replace(/^\//, ''), info.chapter);
      await fsPromises.mkdir(outputDir, { recursive: true });
      await fsPromises.writeFile(path.join(outputDir, 'list.json'), JSON.stringify(images, null, 2));

      hexo.log.info(`[ChapterDrawer] ✅ 生成成功: ${info.chapter}`);
    } catch (e) {
      hexo.log.error(`[ChapterDrawer] ❌ 生成失败: ${info.chapter}`, e.message);
    }
  }
});

// ======================================
// 2. 注入前端代码（完美适配 Hexo 7.x）
// ======================================
hexo.extend.filter.register('after_render:html', function (htmlContent, data) {
  const config = hexo.config.chapter_drawer || { enable: true };
  if (!config.enable) return htmlContent;

  const page = data.page || {};
  // 单页开关：默认开启
  if (page.chapter_drawer === false || !page.drawer_chapters?.length) {
    return htmlContent;
  }

  hexo.log.info(`[ChapterDrawer] ✅ 为文章注入资源: ${page.title}`);

  // 插件资源路径
  const cssUrl = `/plugins/hexo-chapter-drawer/style.css`;
  const jsUrl = `/plugins/hexo-chapter-drawer/main.js`;

  // 向页面注入配置 + 资源
  const injectCode = `
  <script>
  window.CHAPTER_DRAWER_CONFIG = {
    imageRoot: "${page.drawer_image_root || config.image_root || '/images/chapters'}",
    chapters: ${JSON.stringify(page.drawer_chapters)}
  };
  console.log('✅ 漫画抽屉配置已加载:', window.CHAPTER_DRAWER_CONFIG);
  </script>
  <link rel="stylesheet" href="${cssUrl}">
  <script src="${jsUrl}" defer></script>
  </body>`;

  return htmlContent.replace('</body>', injectCode);
});

// ======================================
// 3. 复制插件 assets 到 public
// ======================================
hexo.extend.generator.register('chapter-drawer-assets', () => {
  const assetsDir = path.join(__dirname, 'assets');
  return [
    {
      path: 'plugins/hexo-chapter-drawer/style.css',
      data: () => fs.createReadStream(path.join(assetsDir, 'style.css'))
    },
    {
      path: 'plugins/hexo-chapter-drawer/main.js',
      data: () => fs.createReadStream(path.join(assetsDir, 'main.js'))
    }
  ];
});