import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cloud-PE Docs",
  lastUpdated: true,
  lang: "zh-CN",
  base: "/",
  head: [
    // 51La统计
    ['script', { charset: 'UTF-8', id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js?id=Jfyz2AtpDiNlSRpE&ck=Jfyz2AtpDiNlSRpE' }],
    // 改变title的图标
    [
      'link',
      {
        rel: 'icon',
        href: 'https://cloud-pe.cn/cloud-pe.svg',
      },
    ],
    // ArtPlayer CSS
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/artplayer@5.1.7/dist/artplayer.css',
      },
    ],
  ],

  themeConfig: {
    search: {
      provider: 'local'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Cloud-PE/Cloud-PE-One' }],
    logo: "https://cloud-pe.cn/cloud-pe.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "首页",
        link: "https://cloud-pe.cn",
      },
      {
        text: "下载站",
        link: "https://files.cloud-pe.cn",
      },
    ],

    sidebar: [
      {
        text: "开始",
        items: [
          { text: "写在前面", link: "/start/start" },
        ],
      },
      {
        text: "总览",
        items: [
          { text: "日志", link: "/overview/log" },
          { text: "感谢", link: "/overview/thanks" },
          { text: "用户协议", link: "/overview/contract" },
        ],
      },
      {
        text: "常见问题",
        items: [
          { text: "Cloud-PE 是什么？", link: "/faq/what_cp" },
          { text: "Cloud-PE One 是什么？", link: "/faq/what_cpone" },
          { text: "是否有后门，流氓行为？", link: "/faq/safety" },
          { text: "Cloud-PE 支持 WIFI 吗？", link: "/faq/wifi" },
        ],
      },
      {
        text: "教程",
        items: [
          { text: "如何下载 Cloud-PE 及插件？", link: "/course/down" },
          { text: "如何使用 CE-插件 ？", link: "/course/loadce" },
          { text: "如何使用 HotPE模块 ？", link: "/course/loadhpm" },
        ],
      },
      {
        text: "开发者文档",
        items: [
          { text: "制作 CE-插件 ", link: "/devdoc/makece" },
          { text: "插件投稿", link: "/devdoc/ce_con" },
          { text: "PE 集成 CE-插件", link: "/cooperation/addce" },
        ],
      },
      {
        text: "项目授权",
        items: [
          { text: "获取授权", link: "/cooperation/permit" },
          { text: "项目规范", link: "/cooperation/standard" },
          {
            text: "授权项目",
            items: [
              { text: "暂无" },
            ]
          },
        ]
      },
    ],
    darkModeSwitchLabel: '深浅模式',
    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲'
    },


    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    footer: {
      copyright: "© Cloud-PE Dev.",
      message: '<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">鲁ICP备2023028944号-3</a>',
    },
    editLink: {
      text: '在 GitHub 上编辑此页',
      pattern: 'https://github.com/Cloud-PE/Cloud-PE-Docs/edit/main/docs/:path'
    },

    lastUpdatedText: "最近更新于",
  }, outDir: '../dist'
})