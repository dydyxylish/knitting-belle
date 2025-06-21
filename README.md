## Knitting_belle 編み図ダウンロードサイト
### 開発環境構築
#### 前提
```
❯ node -v
v20.19.2
```

#### パッケージをインストール
```
❯ npm install
```

#### Git hookを追加
```
❯ npx lefthook install
```

#### AWS CLI の設定（Amplifyの実行権限を付与できればよい）

#### Amplify backendをデプロイ
```
❯ npx ampx sandbox
```

#### seed用のpolicyを生成
```
❯ npx ampx sandbox seed generate-policy > seed-policy.json
```

#### seed-policyをもとにseed実行用権限を付与※IAM Identity Centerユーザの場合、ポリシーアタッチ後にプロビジョニングする必要がある

#### seedを投入
```
❯ npx ampx sandbox seed --debug
```

#### Next.js開発サーバを起動
```
❯ npm run dev
```