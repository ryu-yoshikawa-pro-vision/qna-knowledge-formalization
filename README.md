# QnA Knowledge Formalization

社内知見共有プロダクトの **MVP 仕様・handoff リポジトリ** です。

このプロジェクトの主目的は、質問・回答・直接投稿を入口にして、再利用可能なナレッジを蓄積し、レビューし、正式な組織知として育てられる状態を作ることです。

このリポジトリは現時点では **実装コード本体ではなく、Backend / Web / Mobile を実装開始するための仕様書と運用補助一式** を中心に構成されています。実装の正本は `docs/spec/` にあります。

## 何を解決するプロダクトか

このMVPが解決したい本質課題は、主に次の3つです。

- 他案件の知見を探せない
- 誰に聞けばよいか分からない
- 一度解決した内容が再利用可能な形で残らない

そのため、このプロダクトは単なるQ&Aアプリではなく、**ナレッジ基盤** として設計されています。

## プロダクトの基本方針

- 主役はQ&Aではなく **ナレッジ**
- Q&Aは時点固定、ナレッジは継続的に育てる対象
- 投稿しやすさと、正式化の厳密さは分ける
- **管理者でも他人の本文は編集しない**
- MVPでは外部連携よりも、アプリ単体で成立する知見蓄積フローを優先する

## MVPで扱う主な機能

### 1. ワークスペース / 参加

- Googleログイン
- 1ドメイン1ワークスペース
- 招待
- 招待受諾
- 参加申請
- 参加承認 / 却下
- ロール管理
- メンバー管理

### 2. ナレッジ

- ナレッジ作成
- 下書き保存 / 共有 / レビュー申請
- 差し戻し / 正式化 / 取り下げ
- 正式ナレッジの編集下書き
- 履歴表示
- タグ付け
- 検索
- コメント
- ブックマーク
- コンテンツリンク

### 3. Q&A

- 質問作成
- 回答作成
- ベストアンサー選定
- 質問の凍結 / 再オープン
- Q&Aからナレッジ作成
- 履歴表示
- タグ付け
- コメント
- ブックマーク

### 4. 通知

- アプリ内通知
- 既読管理
- コメント / メンション通知
- 正式化通知
- 差し戻し通知
- 回答通知
- ベストアンサー通知
- レビュー待ちバッジ

### 5. 管理機能

- 招待再送
- ロール変更
- オーナー移譲
- タグ統合 / 管理
- 履歴確認

## MVPでやらないこと

以下はMVP範囲外です。

- 一般的なメール通知
- Slack連携
- Google Drive連携
- Google Calendar連携
- 添付ファイル / 画像アップロード
- いいね / ランキング
- 外部ドメイン参加
- 複数オーナー
- AI自動分類 / 自動要約 / 自動推薦
- 高度なアクセス制御

補足として、**招待 / 再送のための transactional email は別扱いで必要** です。

## ロール

- `owner`: ワークスペース最終責任者
- `admin`: 運営担当
- `reviewer`: ナレッジレビュー担当
- `member`: 一般利用者

重要な業務ルール:

- 他人が作成した本文は編集しない
- 正式ナレッジの本文も、運営側が勝手に書き換えない
- レビュー権限と運営権限は分離する

## 想定アーキテクチャ

`docs/spec` で固定されている実装前提は以下です。

- Web: `Next.js App Router`
- Mobile: `Expo Router + React Native`
- Shared language: `TypeScript`
- Repo shape: `monorepo`
- DB: `PostgreSQL`
- API: `HTTP JSON API`

想定レイアウト:

```text
/apps
  /web
  /mobile
/packages
  /contracts
  /api-client
  /domain
  /tokens
  /ui-web
  /ui-native
  /config
```

共有方針:

- UIは共有しない
- 共有するのは `contracts / api-client / domain / tokens`
- 業務ルールは `domain` に寄せる
- API契約は `contracts` を正とする

追加の固定方針:

- Web は DB 管理の session cookie
- Mobile は bearer token + refresh token
- `content_json` を正本、`content_markdown` を派生保存とする
- 検索は `PostgreSQL Full-Text Search + tag filter`
- knowledge のデフォルト検索対象は `formal`

## このリポジトリの見方

### 実装者が最初に見るべき場所

1. `docs/spec/README.md`
2. `docs/spec/実装前提・技術基準.md`
3. `docs/spec/実装技術一覧.md`
4. `docs/spec/用語・正規一覧.md`
5. `docs/spec/MVP要件定義書.md`
6. `docs/spec/業務仕様書.md`
7. `docs/spec/状態遷移仕様.md`
8. `docs/spec/権限マトリクス.md`
9. `docs/spec/API概要設計書.md`
10. `docs/spec/テーブル定義.md`
11. `docs/spec/画面仕様書.md`
12. `docs/spec/バリデーション・業務ルール一覧.md`
13. `docs/spec/画面APIデータ対応表.md`
14. `docs/spec/実装スコープ分解書.md`
15. `docs/spec/受け入れ基準.md`
16. `docs/spec/確認事項.md`

### まず理解すべきこと

- 何を作るか: `MVP要件定義書.md`
- どう振る舞うか: `業務仕様書.md`
- 状態遷移: `状態遷移仕様.md`
- 認可: `権限マトリクス.md`
- API: `API概要設計書.md`
- DB: `テーブル定義.md`
- 画面責務: `画面仕様書.md`
- 実装順: `実装スコープ分解書.md`
- 完了判定: `受け入れ基準.md`

## 推奨実装順

実装は次の7 sliceで進める前提です。

1. 認証 / 参加
2. ナレッジ閲覧 / 検索
3. ナレッジ投稿 / レビュー / 正式化
4. 正式ナレッジ改訂
5. Q&A / ナレッジ化
6. コメント / リンク / 通知 / ブックマーク
7. 管理 / タグ / 履歴

各 slice の詳細な完了条件は `docs/spec/実装スコープ分解書.md` を参照してください。

## 完了判定の基準

このプロジェクトでは、実装完了は単なる画面表示ではなく、`docs/spec/受け入れ基準.md` にあるシナリオで判定します。主な確認対象は以下です。

- 初回ログインから workspace 作成
- 招待、再送、受諾
- 直接投稿 knowledge の review / formalize
- formal knowledge の edit draft 作成から apply
- 質問、回答、ベストアンサー、再オープン
- Q&Aから knowledge 作成
- タグ統合、検索、通知、レビュー待ちバッジ
- login / refresh / logout と共通ヘッダー
- 参加申請コメント、取消、コメント編集 / 非表示
- 履歴導線と二重実行耐性

## 現在のリポジトリ構成

```text
.
├─ docs/
│  ├─ spec/           # 実装の正本となる仕様書群
│  ├─ adr/            # 重要な意思決定記録
│  ├─ guides/         # 補助ガイド
│  ├─ plans/          # 計画書
│  ├─ reports/        # 調査・実行レポート
│  └─ reference/      # 運用補助資料
├─ inputs/            # 仕様化の元資料・入力
├─ scripts/           # Codex 実行補助 / 検証スクリプト
├─ AGENTS.md          # Codex 向け運用入口
├─ PLANS.md           # 計画作成の入口
└─ CODE_REVIEW.md     # レビュー運用の入口
```

## このリポジトリの位置づけ

このリポジトリは、現時点では「完成済みアプリ」ではありません。

正確には、以下の役割を持つ **実装前の整理済み成果物** です。

- プロダクトの目的とMVP範囲を固定する
- Backend / Web / Mobile の仕様を分離せず、一貫した形で handoff する
- 実装者が元の会話ログなしで着手できるようにする
- Codex を含む実装者が、どの順で、何を見て、どこまで作ればよいかを明確にする

## Codex / 実装運用

この repo には Codex 運用補助も含まれています。

- `AGENTS.md`: 実行ルールと読込順
- `docs/PROJECT_CONTEXT.md`: プロジェクトの運用前提
- `scripts/codex-safe.*`: 手動対話用
- `scripts/codex-task.*`: 非対話タスク用
- `scripts/codex-sandbox.*`: sandbox 実験用

検証コマンド:

- bash: `bash scripts/verify`
- PowerShell: `powershell -ExecutionPolicy Bypass -File scripts/verify.ps1`

## Source of Truth

定義が競合した場合は、`docs/spec/README.md` に記載された優先順位に従ってください。

特に以下は重要です。

- スコープ境界: `MVP要件定義書.md`
- 業務ルール: `業務仕様書.md`
- 状態遷移: `状態遷移仕様.md`
- 認可: `権限マトリクス.md`
- API: `API概要設計書.md`
- DB: `テーブル定義.md`
- 画面責務: `画面仕様書.md`

---

詳細な仕様を読む場合は、`docs/spec/README.md` から開始してください。
