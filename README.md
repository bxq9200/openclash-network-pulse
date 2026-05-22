# Network Pulse

一个用于 OpenClash / Mihomo 的桌面悬浮网络监控小组件。

它可以实时显示软路由代理状态、线路探测、上下行速度、当前节点，并支持直接切换代理策略组节点。适合 Windows 桌面常驻使用，也可以通过 Releases 获取 macOS / Linux 构建产物。

![Network Pulse Logo](src/assets/logo.png)

## 功能特性

- 读取 OpenClash / Mihomo REST API
- 显示核心版本、实时连接数、上传/下载速度
- 上传/下载速度波形图
- 探测 Google、GitHub、ChatGPT、Baidu、YouTube、Claude
- 代理策略组浏览、搜索、节点切换
- 单个策略组测速，支持按延迟排序
- 液态玻璃 / 深色极简双主题
- 中文 / English 双语切换
- 关闭隐藏到系统托盘
- 记住窗口位置和尺寸
- 支持开机自启动
- 设置页内置 OpenClash 控制面板地址和密钥引导

## 下载

进入 GitHub Releases 下载对应平台版本。

Windows 推荐下载：

- `Network Pulse Setup 1.0.0.exe`：安装版，会出现在 Windows 已安装应用 / 开始菜单
- `Network Pulse 1.0.0.exe`：便携版，双击即用，不写入应用列表

macOS / Linux 版本由 GitHub Actions 在 Release 时自动构建：

- macOS：`.dmg` / `.zip`
- Linux：`.AppImage` / `.deb`

## 快速开始

1. 打开软路由后台。
2. 进入 `Services` → `OpenClash`。
3. 切到 `运行状态`。
4. 在右侧找到 `控制面板` 卡片。
5. 复制绿色地址，例如 `192.168.9.1:9090`。
6. 点击锁形按钮复制密钥。
7. 打开 Network Pulse 设置，把地址拆成：
   - 路由 IP：`192.168.9.1`
   - API 端口：`9090`
   - Secret：复制到的密钥
8. 保存后状态显示 `在线` 即可使用。

Secret 输入框支持自动识别以下格式：

```text
your-secret
Bearer your-secret
Authorization: Bearer your-secret
```

## OpenClash 设置说明

Network Pulse 使用 Clash / Mihomo 的外部控制 API。

如果访问 `http://路由IP:9090/version` 返回：

```json
{"message":"Unauthorized"}
```

说明地址和端口是对的，只是需要 Secret。

如果无法访问，请确认：

- OpenClash 正在运行
- 控制面板地址是局域网可访问地址
- Windows 和软路由在同一局域网
- 没有把控制端口暴露到公网

## 安全提醒

控制面板 API 可以切换节点、读取连接信息，属于管理接口。

请只在可信局域网内使用，不要把 `9090` 等控制端口映射到公网。建议始终设置 Secret。

## 本地开发

```powershell
git clone https://github.com/bxq9200/openclash-network-pulse.git
cd openclash-network-pulse
npm install
npm start
```

## 打包

Windows：

```powershell
npm run dist:win
```

全部平台配置：

```powershell
npm run dist
```

注意：macOS 安装包建议在 macOS runner 上构建，Linux 安装包建议在 Linux runner 上构建。项目已提供 GitHub Actions 工作流。

## Release 流程

1. 修改版本号。
2. 提交代码并推送到 GitHub。
3. 创建 tag：

```powershell
git tag v1.0.0
git push origin v1.0.0
```

4. GitHub Actions 会自动构建并上传 Release 产物。

## 技术栈

- Electron
- OpenClash / Mihomo REST API
- 原生 HTML / CSS / JavaScript
- electron-builder

## 支持作者

如果这个项目帮到了你，可以请作者喝杯咖啡。

<img src="docs/assets/wechat_donate.jpg" alt="微信赞赏码" width="320" />

## License

MIT
