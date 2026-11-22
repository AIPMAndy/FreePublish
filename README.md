# FreePublish

**在线使用：[打开 FreePublish 工作台](https://aipmandy.github.io/FreePublish/)** · [独立上线验收](https://github.com/AIPMAndy/AIPMAndy.github.io/actions/runs/44991290795)


**安全多平台半自动发布工作台｜Local-first · Human-approved**

把一条内容整理成多个平台版本，统一完成风险预检、人工审核、复制发布材料和发布结果登记。**不读取账号密码 / Cookie，不自动点击平台「发布」，不在后台代发。**

> FreePublish 3.0 是从原来的 **free publish** 安全发布手册演化来的可运行工具。历史文档保留在根目录的 `01-规则与边界.md` 至 `05-失败模式库.md` 中。平台具体规则会变，使用前需核对官方最新页面。

## 现在已支持

| 功能 | V3 实现 | 边界 |
|---|---|---|
| 内容库 | 原始标题、主稿、图片/视频规格、权属、AI/商业属性 | 浏览器临时读取媒体，文件本体不上传 |
| 平台版本 | 小红书、抖音、视频号、B 站、Threads、X | 创建规则初稿，人工改稿；不声称 AI 自动生成 |
| 发布前审核 | 标题阈值、权属、AI/商业声明、重复内容、风险词与外链提示 | 关键词只是预检线索，不做法律合规保证 |
| 审批门禁 | 阻断项修复、警告人工确认、显式人工审核 | 修改文案/素材等关键信息后必须重审 |
| 半自动发布 | 原图/视频本地预览、离线 ZIP 发布包、文字复制与官方入口 | 最终上传、设置、定时与发布均由用户完成 |
| 结果回填 | 作品 HTTPS 链接及本地操作记录 | 只校验域名，未实时向平台确认发布状态 |
| 计划与备份 | 本地排期、.ics 日历提醒、JSON 备份、可安装 PWA | 计划时间**不会**触发任何自动发布 |

## 启动（零依赖）

需要现代浏览器。推荐通过 HTTP 本地打开，而不是直接双击 `index.html`。

```bash
git clone https://github.com/AIPMAndy/free-publish.git
cd free-publish
python3 -m http.server 8000
```

浏览器打开 **http://localhost:8000** 即可使用。整个界面无外部 CDN、无后端、无 npm 运行时依赖。

你也可以将静态文件部署到自己的 GitHub Pages/静态托管服务；**仓库是否已开启 GitHub Pages 需要另外检查**，这里不假装已经部署成功。HTTPS 托管时，浏览器复制功能体验更好。

## 新手 6 步

1. 「新建内容」，写主稿，确认原创或授权状态。
2. 点击「生成四大平台初稿」，也可单独增加 Threads / X。
3. 逐个平台修改标题、正文、话题、计划时间，并判断 AI/商业标识是否适用。
4. 去「审核与发布」，修复阻断项、逐条确认提示，再点击「人工审核通过」。
5. 完成登录账号、素材/版权、AI/商业标识及可见范围四项核对；复制文案或下载带素材 ZIP，然后在官方创作页面**亲自**上传、设置和点击发布。
6. 发布成功后粘贴真实作品链接做人工登记；随后导出 JSON 备份。

**安全提示：** 审核后编辑内容，原审批状态必须重新确认。备份导入会清除导入数据中的审批及已发布标记，以避免外部 JSON 伪造状态。

## 运行测试

```bash
node --test tests/*.test.mjs
node --check src/app.mjs
node --check src/media.mjs
node --check src/zip.mjs
node --check src/calendar.mjs
```

无需安装第三方包。GitHub Actions 也会运行核心逻辑测试和 JavaScript 语法检查。

## 我们借鉴了哪些开源产品

- [Postiz](https://github.com/gitroomhq/postiz-app)：内容队列、计划视图和多平台管理思路。**没有**复制其 AGPL-3.0 源代码。
- [social-auto-upload](https://github.com/kuloutoussssss/social-auto-upload)：参考国内创作者平台发布链路，**没有**接入 Cookie 托管、网页模拟点击、非官方 API。
- [yuwen-publish-precheck](https://github.com/yuwen-cool/yuwen-publish-precheck)：参考预检分层：关键词线索 + 人工语境判断，**没有**复制其代码。

完整设计与限制请阅读 [技术架构与后续路线图](./docs/ARCHITECTURE.md)。保留原项目的 [风险与边界](./01-规则与边界.md)、[发布前审核](./02-发布前审核.md)、[发布流程](./03-发布流程.md)、[两种模式](./04-两种模式.md)、[失败模式库](./05-失败模式库.md) 供历史经验参考。部分旧文档中涉及平台时限和风险概率的描述可能过时，不应作为官方政策保证。

## 我们不做的事

- 不以“模拟真人”“随机点击”“批量账号”等方式规避风控。
- 不依赖浏览器插件访问视频号微前端，也不在后台对平台进行写操作。
- 不承诺免限流、100% 过审或法律合规。
- 不从第三方开源项目直接复制代码后忽略原许可证。

## 许可证

Copyright © 2026 Andy · AI 酋长 Andy。

当前仓库继续沿用 [CC BY-NC 4.0](./LICENSE)，授权范围与历史仓库保持一致。**这是公开源代码的非商业许可，并非 OSI 定义的开源软件许可证**；若希望面向企业提供商业可用的开源 SDK，可另行决定代码与内容的许可策略。


## 正式上线与发布方式

正式在线工作台：**https://aipmandy.github.io/FreePublish/**

此地址位于已经启用 GitHub Pages 的 [AIPMAndy.github.io 根站](https://github.com/AIPMAndy/AIPMAndy.github.io/tree/main/FreePublish)，由根站的 Pages 工作流部署。上线以 [独立公网验证工作流](https://github.com/AIPMAndy/AIPMAndy.github.io/actions/runs/44991290795) 的 HTTP 检查为准：逐一读取线上首页、版本文件和应用脚本，并比对源代码提交 SHA。

源仓库的 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) 仅用于以后**可选的独立 GitHub Pages 部署**，不再在每次主分支更新时尝试向一个尚未启用 Pages 的仓库发布。若要把独立源仓库也设置为 Pages 站点，需要管理员在 [Settings → Pages](https://github.com/AIPMAndy/free-publish/settings/pages) 首次启用 GitHub Actions Source。

**版本发布注意：** 当前正式站点是源仓库主分支的一个经过测试的静态快照。更新源码后，要将运行用文件镜像到根站的 `FreePublish/` 并让根站 Pages 部署；直接改源仓库不等于现网自动更新。正式版本号见已部署的 `FreePublish/version.json`。

## 尚未实现的企业级能力

企业多账号 OAuth、官方发布 API 真实提交、服务端身份与角色审核、跨设备同步、不可篡改的审计日志，需要真实平台授权与服务端环境。**当前 V3 只提供安全本地优先的半自动流程，不能把导出的 ZIP 或打开官方平台理解为已自动代发**。

用户稿件和审核数据保存在浏览器 localStorage；媒体文件仅在本次会话中临时读取。清理站点数据、换设备或刷新后需重新选择媒体，请定期导出 JSON 备份。
