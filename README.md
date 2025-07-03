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


#### secret設定
- 以下をsecretに設定
```
pnpm ampx sandbox secret KEY
```
- KEYS
```
SEED_USERNAME
SEED_PASSWORD # Cognito標準のパスワードポリシーに準拠
ADMIN_USERNAME
ADMIN_PASSWORD # Cognito標準のパスワードポリシーに準拠

```

#### 環境変数設定
- .env.localを作成する
```
AMPLIFY_APP_ORIGIN=http://localhost # createAuthRouteHandlersで使用
GOOGLE_CALLBACK_URLS=http://localhost:3000/api/auth/sign-in-callback
GOOGLE_LOGOUT_URLS=http://localhost:3000/api/auth/sign-out-callback
STRIPE_SUCCESS_URL=http://localhost:3000/thanks?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:3000/cancel
COOKIE_DOMAIN=localhost
GOOGLE_CLIENT_ID=XXXXXXXXXXX
GOOGLE_CLIENT_SECRET=XXXXXXXXXXX
STRIPE_API_KEY=XXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=XXXXXXXXXXX
```

#### Amplify backendをデプロイ
```
❯ pnpm dotenvx run --env-file=.env.local -- ampx sandbox
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
❯ pnpm dotenvx run --env-file=.env.local -- ampx sandbox seed --debug
```

#### Next.js開発サーバを起動
```
❯ pnpm run dev
```


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
GOOGLE_CLIENT_ID=XXXXXXXXXXX
GOOGLE_CLIENT_SECRET=XXXXXXXXXXX
STRIPE_API_KEY=XXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=XXXXXXXXXXX
```

- Amplify.ymlにて、.envファイルに追記するよう指定する
    - [指定方法](https://docs.amplify.aws/nextjs/deploy-and-host/fullstack-branching/secrets-and-vars/#branch-environment-2)