# Dependabot Actions security-only 設定計画

## 0. 依頼概要
- 依頼内容: GitHub Actions依存の脆弱性更新を提案するDependabot設定を追加する。
- 背景: 全リポジトリでsecurity-only方針を採用する。
- 期待成果: 通常のversion update PRを抑止した設定案を、既定ブランチへ直接反映せずPRでレビューできる。

## 1. ゴール / 完了条件
### 1 Goal
- GitHub Actions ecosystemだけを対象にしたsecurity-only設定案を作り、別ブランチのPRで提示する。
- DoD: YAMLとsecurity-only条件のローカル検証が成功し、PR headの必要CIが成功し、PRが未mergeの提案であることを確認する。

## 2. 現状理解と前提
### 2 Current understanding
- 2026-11-15時点でリポジトリはpublic・active、既定ブランチは`main`、HEADは`e59846c839f3afd906e530b37bb6aceb31903820`。
- `.github/workflows/deploy-pages.yml`がActionsを4つ参照する。既定ブランチに`.github/dependabot.yml`はなく、同設定を変更するopen PRはない。
- Dependabot alertsとsecurity updatesの管理設定は、この接続から確認できない。
### 3 Assumptions
- `github-actions` ecosystemのsecurity update提案は通常のversion update PRと区別される。
- GitHubの設定画面でsecurity updatesが有効かは別途確認が必要で、このPRだけでは有効化を証明しない。
### 4 Non-goals
- GitHub管理設定、権限、既定ブランチ、Pages workflow、Python依存、他のPRを変更しない。
- PRをmerge/closeせず、Dependabot実行を手動dispatchしない。

## 3. 影響範囲
### 5 Impacted areas
- GitHub Actions参照の脆弱性更新提案設定と、その計画・実行記録。
### 6 Files to inspect
- `.github/workflows/deploy-pages.yml`
- `.github/dependabot.yml`（現在存在しないことを確認）
- `AGENTS.md`、`PLANS.md`、`docs/PROJECT_CONTEXT.md`、`docs/plans/TEMPLATE.md`、`.codex/templates/*`

## 4. 変更方針
### 7 Change strategy
1. mainの現在SHAとopen PRを再確認する。
2. feature branchに`github-actions`、`/`、weekly interval、`open-pull-requests-limit: 0`のみの設定を追加する。`target-branch`や別の通常更新workflowは追加しない。
3. YAML構文、キーとlimitの条件、差分を検証する。
4. 別ブランチからPRを作成し、exact-head CIを確認する。security updatesの設定状態は管理画面で別途確認待ちと記録する。

## 5. 検証方法
### 8 Validation plan
- PyYAML等でYAMLをparseし、version 2、Actions ecosystem 1件、directory `/`、interval `weekly`、limit `0`、`target-branch`なしをassertする。
- `git diff --check`と`bash scripts/verify`を実行し、影響がないか記録する。
- PR headのCIが完了した後、run URLとcommit SHAを記録する。
- 成功判定: 上記設定とローカル検証が成功し、必要CIがすべて成功。実運用有効化はPR反映と管理設定確認後に別判定する。

## 6. リスクと未解決論点
### 9 Risks
- `open-pull-requests-limit: 0`でもsecurity updatesが有効になるかは、GitHub管理設定とalertsの状態を確認する必要がある。
- PRが未mergeの間はmainで設定は稼働せず、CI成功も更新動作の実運用証明にはならない。
### 10 Open questions
- GitHub管理UIでDependabot alerts/security updatesが有効か、PR反映後に確認する。

## 7. 成果物
- 変更ファイル: `.github/dependabot.yml`とリポジトリ規約に基づく計画・run・report。
- 付随ドキュメント: 本計画書、`.codex/runs/20261115-093618-JST/`、`docs/reports/`。

## 8. 備考
- 通常version-update PRはsecurity-only方針に反するため上限0とする。設定提案のPR自体はmergeしない。
