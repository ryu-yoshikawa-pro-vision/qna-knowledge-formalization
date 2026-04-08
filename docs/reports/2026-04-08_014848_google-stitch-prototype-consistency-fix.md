# Google Stitch Prototype Consistency Fix

## Summary
- review 指摘の `expired` 招待受諾と invalid fixture fallback を修正した
- generic `div` / `span` ベースの sidebar / header icon も prototype runtime の wiring 対象に広げた
- read-only / blocked 系 state を action button だけでなく editor surface / form input まで反映した

## Changed Files
- `docs/design/prototype/assets/prototype.js`
- `docs/design/prototype/*.html`（asset hash query 再生成）

## Fixes
1. 招待受諾
   - `state=expired` では accept CTA を無効化
   - `state=accepted` では accept / decline を無効化
2. permission denied / invalid fixture
   - denied overlay の reset link は requested fixture を維持
   - privileged route 背景の interactive 要素を disabled 化
   - 管理 nav の generic item も hide 対象に含めた
3. read-only / blocked state
   - `workspace.join_request?state=pending|cancelled`: comment input を disabled
   - `knowledge.edit_draft_create?state=duplicate-blocked`: textarea / checkbox / create CTA を disabled
   - `knowledge.edit_draft_detail?state=applied|discarded`: editor grid を read-only 化
   - `question.edit?state=locked`: form controls を read-only 化

## Validation
- `node --check docs/design/prototype/assets/prototype.js`
- `python docs/design/prototype/tools/build_stitch_prototype.py`
- Playwright-CLI snapshots:
  - `question-edit.html?fixture=member&state=locked`
  - `admin-members.html?fixture=member`
  - `workspace-join-request.html?fixture=join-request-applicant&state=pending`
  - `workspace-join-request.html?fixture=join-request-applicant&state=cancelled`
  - `knowledge-edit-draft-create.html?fixture=member&state=duplicate-blocked`
  - `knowledge-edit-draft-detail.html?fixture=member&state=applied`
  - `workspace-invitation-accept.html?fixture=invitation-target-user&state=accepted`
  - `workspace-invitation-accept.html?fixture=invitation-target-user&state=expired`

## Result
- review 指摘 2 件は解消した
- block/read-only と overlay 表現のズレも追加で是正した
- Playwright snapshot 上で対象 state の CTA / input / nav 表示は想定どおりに揃った
