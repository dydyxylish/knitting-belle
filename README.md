## Knitting Belle 編み図ダウンロードサイト

### 概要

Knitting Belle は編み図のダウンロード販売サイトです。
編み手さん向けに編み図を購入・ダウンロードできるプラットフォームを提供します。

#### 主な機能
- **編み図パターンの販売・購入**: Stripe決済を通じた購入システム
- **ユーザー認証**: OAuth経由でのログイン機能
- **購入履歴管理**: ユーザーの過去の購入履歴とダウンロード機能


### Tech Stack

#### フロントエンド
- **Next.js**
- **TypeScript**
- **Tailwind CSS**

#### バックエンド・インフラ
- **AWS Amplify Backend （Gen 2）**
  - **Amazon Cognito**
  - **Amazon DynamoDB**
  - **Amazon S3**
- **SST （Open Next）**
- **AWS CDK**

#### 決済・外部サービス
- **Stripe** - 決済処理システム

#### 開発・品質管理ツール
- **Jest** - 単体テスト
- **Playwright** - E2Eテスト
- **Biome** - コードフォーマット・リンティング
- **Lefthook** - Gitフック管理
- **Pino** - 構造化ログ出力

#### CI/CD
- **GitHub Actions**

#### パッケージ管理
- **pnpm**

#### AIツール
- **Claude Code**
  - **Super Claude**
- **Cursor**
- **（MCP）**
  - **serena**
  - **context7**
  - **playwright**
  - **sequential-thinking**


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


#### 環境変数設定
- .env.developmentを作成する
  - .env.exampleを参照

#### Secretを設定
```
❯ pnpm sandbox:set_secret GOOGLE_CLIENT_ID
❯ pnpm sandbox:set_secret GOOGLE_CLIENT_SECRET
```

#### Amplify backendをデプロイ
```
❯ pnpm sandbox:create
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
❯ pnpm dotenvx run -- ampx sandbox seed --debug
```

#### Cognito Managed Loginを設定
- AWS Console - Cognito - UserPool から、作成されたユーザープールを選択する
- ブランディング - ドメイン から、Cognitoドメインのブランディングバージョンを「マネージドログイン」に変更する
  - カスタムドメインを追加する場合は不要


#### Next.js開発サーバを起動
```
❯ pnpm run dev
```


### Stripe Webhook
- [ngrok](https://ngrok.com/)をインストールし、以下のコマンドを実行する
```
ngrok http 3000
```
- 生成されたエンドポイントをStripe Dashboardに登録する


### 本番環境デモ
```
❯ docker compose -f docker/local/docker-compose.yml up --build
```


### 本番環境準備

- deploy

- 編み図データ等を投入

- adminユーザを作成
  - Cognitoユーザープールにてユーザを作成
  - 作成したユーザをadminグループに追加

#### 環境変数設定
- Amplify Consoleから環境変数を設定する
  - .env.exampleの環境変数に加えて、以下を設定
```
"CERTIFICATE_ARN"
"CDN_DOMAIN"
"CDN_SUBDOMAIN"
"HOSTZONE_ID"
"HOSTZONE_NAME"
"MANAGED_LOGIN_DOMAIN"
"MANAGED_LOGIN_SUBDOMAIN"
"APP_DOMAIN"
"CDK_DEFAULT_ACCOUNT"
```

- Amplify.ymlにて、.envファイルに追記するよう指定する
    - [指定方法](https://docs.amplify.aws/nextjs/deploy-and-host/fullstack-branching/secrets-and-vars/#branch-environment-2)o

#### Secret設定
- Amplify ConsoleからSecretを設定する
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET


### (参考)Cognito Managed Login Branding Settingの出力
- 以下をcloud shell で実行し、ファイルをダウンロードする
```
~ $ aws cognito-idp describe-managed-login-branding-by-client --user-pool-id ap-northeast-1_XXXXXXXX --client-id XXXXXXXXXXXXXXXXXXXXXXXXX | jq .ManagedLoginBranding.Settings > managedLoginBrandingSettings.json
```

### (参考)GitHub Actionsのデバッグ
- [act](https://nektosact.com/)をインストールする

- .secretをプロジェクトルートに作成する
```
ACTIONS_RUNNER_DEBUG=
ACTIONS_STEP_DEBUG=
AWS_ACCOUNT_ID=
AWS_DEPLOY_ROLE=
AWS_REGION=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=
ACTIONS_RUNTIME_TOKEN=
CI_ENV_FILE=${cat .env.development}
```

- act実行
```
pnpm act:pr
```

