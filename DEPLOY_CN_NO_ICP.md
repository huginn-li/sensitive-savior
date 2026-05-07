# 不备案分享部署说明

目标：不做 ICP 备案，让国内朋友尽量可以直接访问。

推荐路径：腾讯 EdgeOne Pages 免费版。

## 部署前确认

- 项目目录：`my-app`
- 构建命令：`npm run build`
- 安装命令：`npm install`
- 输出目录：保持平台默认，不要改成静态导出
- 需要服务端 API：是，`/api/analyze`

## 环境变量

在 EdgeOne Pages 项目设置里添加：

```bash
AI_API_KEY=你的中转站 API Key
AI_API_URL=你的中转站 chat/completions 地址
AI_MODEL=gpt-5.5
```

不要把 `.env.local` 上传到 GitHub 或发给别人。

如果你的中转站给的是 OpenAI 兼容地址，通常看起来像：

```bash
AI_API_URL=https://你的中转站域名/v1/chat/completions
```

## EdgeOne Pages 建议配置

1. 新建 Pages 项目
2. 连接 Git 仓库，或者上传项目
3. 根目录选择 `my-app`
4. 框架选择 Next.js
5. 构建命令填写 `npm run build`
6. 安装命令填写 `npm install`
7. 添加上面的环境变量
8. 部署

## 不备案的域名选择

如果不备案，部署区域不要选择中国大陆可用区。

建议选择：

```text
Global availability zone excluding Chinese mainland
```

也就是“不含中国大陆的全球可用区”。

这样不需要 ICP 备案，但国内访问速度和稳定性会弱于备案后的大陆节点。

## 上线后测试

打开网站后测试：

1. 首页能正常加载
2. 填写表单后点击“获取 AI 建议”
3. 能返回分析结果
4. 访问 `/api/test-kimi` 应该是 404

如果 AI 返回失败，优先检查 EdgeOne Pages 里的 `AI_API_KEY`、`AI_API_URL`、`AI_MODEL` 是否填对。
