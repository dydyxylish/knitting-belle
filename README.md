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


#### 環境変数設定
- .env.developmentを作成する
```
AMPLIFY_APP_ORIGIN=http://localhost # createAuthRouteHandlersで使用
GOOGLE_CALLBACK_URLS=http://localhost:3000/api/auth/sign-in-callback
GOOGLE_LOGOUT_URLS=http://localhost:3000/api/auth/sign-out-callback
STRIPE_SUCCESS_URL=http://localhost:3000/thanks?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:3000/cancel
COOKIE_DOMAIN=localhost
STRIPE_API_KEY=XXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=XXXXXXXXXXX
```

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
```
AMPLIFY_APP_ORIGIN=http://localhost # createAuthRouteHandlersで使用
GOOGLE_CALLBACK_URLS=http://localhost:3000/api/auth/sign-in-callback
GOOGLE_LOGOUT_URLS=http://localhost:3000/api/auth/sign-out-callback
STRIPE_SUCCESS_URL=http://localhost:3000/thanks?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:3000/cancel
COOKIE_DOMAIN=localhost
STRIPE_API_KEY=XXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=XXXXXXXXXXX
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
CI_ENV_FILE=${cat .env}
```

- act実行
```
pnpm act:pr
```

