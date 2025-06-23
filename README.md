## Knitting_belle 編み図ダウンロードサイト
### 開発環境構築
#### 前提
```
❯ node -v
v20.19.2
```

```
❯ pnpm -v
10.12.1
```

#### パッケージをインストール
```
❯ pnpm install
```

#### Git hookを追加
```
❯ pnpm lefthook install
```

#### AWS CLI の設定（Amplifyの実行権限を付与できればよい）
- [アカウント設定手順](https://docs.amplify.aws/react/start/account-setup/)を参照

#### Amplify backendをデプロイ
```
❯ pnpm ampx sandbox
```

#### seed用のpolicyを生成
```
❯ pnpm ampx sandbox seed generate-policy > seed-policy.json
```

#### seed-policyをもとにseed実行用権限を付与
- IAM Identity Centerを使用している場合は、以下のようなイメージで権限を付与
```
❯ aws sso-admin put-inline-policy-to-permission-set --instance-arn arn:aws:sso:::instance/ssoins-XXXXXXXXXXXXXXXX --permission-set-arn arn:aws:sso:::permissionSet/ssoins-XXXXXXXXXXXXXXXX/ps-XXXXXXXXXXXXXXXX --inline-policy file://seed-policy.json
```
- [Sandbox設定手順](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/seed/)を参照
- ※ IAM Identity Centerユーザの場合、ポリシーアタッチ後にプロビジョニングする必要がある

#### seedを投入
```
❯ pnpm ampx sandbox seed --debug
```

#### Next.js開発サーバを起動
```
❯ pnpm run dev
```


### 本番環境デモ
```
❯ docker compose -f docker/local/docker-compose.yml up --build
```