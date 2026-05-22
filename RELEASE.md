# Release Checklist

1. 确认 `package.json` 和 `package-lock.json` 版本号一致。
2. 本地运行：

```powershell
npm install
npm run dist:win
```

3. 提交代码：

```powershell
git add .
git commit -m "Release v1.0.0"
git push
```

4. 创建 tag：

```powershell
git tag v1.0.0
git push origin v1.0.0
```

5. 等待 GitHub Actions 自动构建 Windows / macOS / Linux 产物。
