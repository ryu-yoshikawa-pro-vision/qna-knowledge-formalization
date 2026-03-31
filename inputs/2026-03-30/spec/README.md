# Full-Stack Handoff README

この `spec/` は、**元の会話ログや補足資料を読まなくても**、未知の Codex が Backend / Web / Mobile を一から実装開始できるように再編した handoff パックです。

## 1. このディレクトリの使い方

### 目的

* 何を作るか
* どう作るか
* どの順で作るか
* どこを見れば正しい定義か

を `spec/` 単体で完結させる。

### 読み始める順番

1. `README.md`
2. `実装前提・技術基準.md`
3. `実装技術一覧.md`
4. `用語・正規一覧.md`
5. `MVP要件定義書.md`
6. `業務仕様書.md`
7. `状態遷移仕様.md`
8. `権限マトリクス.md`
9. `API概要設計書.md`
10. `テーブル定義.md`
11. `画面仕様書.md`
12. `バリデーション・業務ルール一覧.md`
13. `画面APIデータ対応表.md`
14. `実装スコープ分解書.md`
15. `受け入れ基準.md`
16. `確認事項.md`（open item 確認用。0件なら読み飛ばしてよい）

## 2. 文書責務

| 文書 | この文書が決めること | 読むタイミング |
| --- | --- | --- |
| `実装前提・技術基準.md` | 実装スタック、共通 package 境界、platform 差分方針 | 最初 |
| `実装技術一覧.md` | 実装で使う具体技術、ライブラリ候補、bootstrap 順 | 最初 |
| `用語・正規一覧.md` | entity / role / status / enum / 画面 ID / API resource の正規名 | 最初 |
| `MVP要件定義書.md` | スコープ、対象ユーザー、成功条件、MVP でやらないこと | 最初 |
| `業務仕様書.md` | 振る舞い、業務ルール、主体ごとの責務 | 実装前 |
| `状態遷移仕様.md` | 状態一覧、遷移条件、副作用、不変条件 | API / backend 実装前 |
| `権限マトリクス.md` | role ごとの閲覧・操作可否 | API / UI 実装前 |
| `API概要設計書.md` | endpoint、request/response、auth、side effect、affected tables | backend / client 実装前 |
| `テーブル定義.md` | table / column / constraint / lifecycle / 参照 API | DB 実装前 |
| `画面仕様書.md` | screen ごとの責務、表示要素、platform 差分、呼び出し API | frontend 実装前 |
| `バリデーション・業務ルール一覧.md` | API / 画面 / DB をまたぐ実装チェック項目 | 実装中 |
| `画面APIデータ対応表.md` | screen / API / table / notification の traceability | 実装中 |
| `実装スコープ分解書.md` | 実装順、依存関係、slice 完了条件 | 実装開始時 |
| `受け入れ基準.md` | user story 単位の Done 判定 | 実装完了前 |
| `確認事項.md` | open item の有無と解消状況 | 必要時 |

## 3. 正とする定義の優先順位

定義が競合した場合は、次の優先順位で解釈する。

1. `README.md`
2. `実装前提・技術基準.md`
3. `実装技術一覧.md`
4. `用語・正規一覧.md`
5. `MVP要件定義書.md`
6. `業務仕様書.md`
7. `状態遷移仕様.md`
8. `権限マトリクス.md`
9. `API概要設計書.md`
10. `テーブル定義.md`
11. `画面仕様書.md`
12. `バリデーション・業務ルール一覧.md`
13. `画面APIデータ対応表.md`

補足:

* スコープ境界は `MVP要件定義書.md` を優先する
* 業務ルールは `業務仕様書.md` を優先する
* 状態遷移は `状態遷移仕様.md` を優先する
* 認可は `権限マトリクス.md` を優先する
* endpoint 名、request/response は `API概要設計書.md` を優先する
* カラム名、制約、index は `テーブル定義.md` を優先する
* 表示責務と platform 差分は `画面仕様書.md` を優先する

## 4. 実装開始手順

1. `実装前提・技術基準.md` で stack と package 境界を理解する
2. `実装技術一覧.md` で具体技術と bootstrap 順を決める
3. `用語・正規一覧.md` で正規名を固定する
4. `実装スコープ分解書.md` を開き、今から実装する slice を決める
5. 対応 slice に必要な API / table / screen を `画面APIデータ対応表.md` で辿る
6. 実装前に `受け入れ基準.md` で完了条件を確認する
7. source から断定できない論点が残っている場合だけ `確認事項.md` を見る

## 5. unknown Codex 向けの最低ルール

* 元の `Webとモバイル同時開発.md` を前提にしない
* 用語は `用語・正規一覧.md` の正規名を使う
* Web と Mobile で UI 実装は共有しない
* 共有するのは `contracts / api-client / domain / tokens`
* `content_json` を正本、`content_markdown` を派生保存とする
* `review_requested` 中の編集は審査継続ではなく再申請扱いに戻す
* `formal` knowledge の本文は直接編集しない

## 6. 更新ルール

* enum を追加・変更したら `用語・正規一覧.md` を先に更新する
* endpoint を追加・変更したら `API概要設計書.md` と `画面APIデータ対応表.md` を両方更新する
* table / column を追加・変更したら `テーブル定義.md` と影響する API / validation / screen を更新する
* screen を追加・変更したら `画面仕様書.md`、`画面APIデータ対応表.md`、`受け入れ基準.md` を更新する
* source から決められるものは `確認事項.md` へ逃がさない
* `確認事項.md` に item が残らない場合は `現時点の確認事項なし` に戻す

## 7. handoff 完了判定

次を満たせば、この `spec/` は handoff 完了とみなす。

* `README.md` だけで読む順番と実装順が分かる
* 各画面がどの API と table に依存するか追える
* 各 API に request / response / auth / validation / side effect / affected tables がある
* 各 table に lifecycle と参照 API がある
* 主要 7 シナリオを `受け入れ基準.md` で検証できる
