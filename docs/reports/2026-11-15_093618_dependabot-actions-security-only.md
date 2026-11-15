# Dependabot Actions security-only 設定 実行記録

## 対象と現在状態
- Repository: `ryu-yoshikawa-pro-vision/qna-knowledge-formalization`
- 確認日: 2026-11-15 JST
- default branch: `main`, SHA `e59846c839f3afd906e530b37bb6aceb31903820`
- 可視状態: public, active, admin/push/pull permissionあり
- Actions依存: `deploy-pages.yml`のcheckout/configure-pages/upload-pages-artifact/deploy-pages
- 既存Dependabot設定: `.github/dependabot.yml`は404
- 同設定を変更するopen PR: 0件

## 変更案
`.github/dependabot.yml`にGitHub Actions ecosystemだけを追加し、interval weekly、`open-pull-requests-limit: 0`を設定する。security updateの設定確認を代替せず、PRは未mergeでレビューする。

## 公式根拠
- Security updatesとversion updatesの設定区分: https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-security-updates?learn=dependabot_security_updates
- GitHub Actions ecosystemの設定: https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions

## 証拠（2026-11-15 09:36 JST）
- 作業ブランチ: `codex/security-actions-dependabot-20261115`
- PyYAML parseとversion/ecosystem/directory/interval/limit/no-target-branch assert: PASS（python3）
- `git diff --check`: PASS
- `bash scripts/verify`: PASS=2, FAIL=0, SKIP=2。template contractとexecpolicy baselineがPASS。bash wrapperは不在、PowerShell側はPATHにcodexがなくSKIP。
- PR head CI/commit SHA: PR作成後に確認する
- 管理画面toggle/alerts: 未確認、この接続では読めない

## 残件
- commit、push、PR作成
- PRとhead SHA、CI run URL・結果
- PR反映後のsecurity-update toggleとsecurity PR運用確認
