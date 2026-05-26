# hexo-chapter-drawer

✨ Hexo 漫画/文章章节悬浮抽屉插件 | 零侵入主题 | 支持自定义开关 | 图片+文字混合展示
😍 不仅仅是漫画，这甚至能做一个图片浏览器，放入自己喜欢的游戏截图记录等等
**我用的是kira主题，目前是能够运行，其他主题欢迎尝试喵**

# 一个兼容图片，完美浏览自烤肉漫画的插件，让个人烤肉者能在自己的博客发布内容后让用户更方便的阅读

## 文件结构

```
hexo-chapter-drawer/
├── assets/
│   ├── style.css    # 样式文件（可自定义外观）
│   └── main.js      # 交互逻辑
├── index.js         # 插件核心
└── package.json
```

## 插件特性

- ✅ **悬浮固定按钮**：右侧中间固定，暂不支持上下拖动
- ✅ **丝滑抽屉动画**：从右往左滑入/滑出，支持1/3 ↔ 3/4屏幕宽度缩放
- ✅ **双重开关控制**：全局开关 + 单篇文章独立开关
- ✅ **内容兼容**：支持章节图片（png/jpg/webp/gif）+ HTML文字内容
- ✅ **零依赖**：不修改任何主题代码，全设备自适应
- ✅ **最高层级显示**：不遮挡、不被主题覆盖

## 快速安装

在你的 **Hexo博客根目录** 执行命令：

### github安装

1. 复刻仓库
```
npm install github:你的GitHub用户名/hexo-chapter-drawer --save
```

# 使用说明

## 全局配置

在博客根目录 `_config.yml` 末尾添加：

```
# 漫画章节抽屉插件
chapter_drawer:
  enable: true        # 全局总开关（false=关闭整个插件）
  image_root: /images/chapters  # 图片默认根目录（可自定义）,在单页也可自定义
```

## 单页自定义

---
title: 你的文章标题

# 单页开关（可选，默认=true开启，false=关闭本页插件）

chapter_drawer: true

# 图片根目录（可选，覆盖全局配置）

drawer_image_root: /images/chapters  #这是显示图片的路径，请自行修改

# 章节列表（核心配置）

drawer_chapters:

# 格式1：纯图片章节（自动读取文件夹图片）

- 不知名漫画/第1话
*注意，第一种格式是直接以你的文件夹路径为标题显示*

# 格式2：图片+文字章节（支持HTML格式文字）

- title: 第74话 标题
    path: 不知名漫画/第一话 #这是阅读的路径
    text: |
      <h3>章节介绍</h3>
      <p>支持HTML标签、加粗、链接、段落</p>

---

## 图片显示路径

```
/images/
|——————chapters/
|——————————————不知名漫画/
|——————————————————————第1话/
```

## 自定义样式

1. 按钮样式自定义
修改插件内 assets/style.css 可自定义：
按钮尺寸：width / height
按钮颜色：background
按钮位置：top / right
抽屉宽度：默认 33vw (1/3 屏) / 75vw (3/4 屏)
2. 抽屉动画自定义
滑动速度：transition 时间
缩放比例：修改 drawer-panel.expanded 的宽度

# 注意---

# 云端图片需要每个文件夹新建list.json，推荐使用python脚本自动生成，然后上传到自己的图床使用；这里简单使用一个我的py加脚本

# 生成的list.json会自动放入你图片文件夹

## 喜欢请给我点star喵，谢谢喵

## 如果有bug欢迎issue

## 欢迎各位进行谢谢修改喵

📄 许可证
MIT License
The MIT License (MIT)
Copyright © 2026 <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
