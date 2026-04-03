# DESIGN.md

## 1. Product Identity

このプロダクトは、単なる Q&A アプリではない。  
目的は、組織内で発生した質問・回答・直接投稿を、再利用可能な正式ナレッジとして蓄積し、検索・参照・レビュー・更新できるようにすることである。

UI 全体は、コミュニティサービスではなく、**組織内ナレッジ基盤**として見える必要がある。

---

## 2. Core Design Principles

### 2.1 Knowledge-first
- 主役は Q&A ではなく Knowledge
- ログイン後の主要導線は Knowledge List
- ユーザーが最初に価値を感じるべき体験は「質問投稿」ではなく「知見発見」

### 2.2 Q&A is an input, not the destination
- 質問と回答は知見化の入口
- Q&A は重要だが、UI 上の重心は Knowledge より下に置く
- 解決済みの議論をナレッジに昇華する導線を明確にする

### 2.3 State-driven UI
- このプロダクトでは、状態が UI の中心である
- 正式 / 未レビュー / 差し戻し / 解決済み / 再オープン中 / アーカイブ済み / Q&A由来 などを一貫して表現する
- 状態の曖昧さは UX の欠陥とみなす

### 2.4 Role-aware but restrained
- 権限に応じて操作を出し分ける
- 権限がない操作は、disabled で並べるより、原則として最初から見せない
- owner / admin であっても、他人本文を編集できるように見える UI は出さない

### 2.5 Readability over decoration
- 装飾より情報構造を優先する
- 長文本文とメタ情報を読みやすく整理する
- 派手さや視覚効果より、可読性・信頼感・判断しやすさを重視する

---

## 3. Overall Visual Direction

### 3.1 Tone
- Enterprise SaaS
- 落ち着いていて信頼できる
- 整理されている
- 情報量は多いが圧迫感は出さない
- モダンだが軽薄ではない
- 業務基盤らしい安定感を持つ

### 3.2 Visual keywords
- calm
- structured
- trustworthy
- readable
- professional
- restrained
- knowledge-centric

### 3.3 What to avoid
- SNS 的な賑やかさ
- コミュニティサービス風の軽さ
- 不必要に派手なグラデーション
- ガラス表現の多用
- 過度な影
- ゲーミフィケーション風の演出
- ランキングや人気可視化の強調

---

## 4. Color System

### 4.1 Brand direction
主色は **blue 系** を採用する。  
blue は、信頼性・業務性・落ち着き・検索性・知識基盤らしさを担う。

### 4.2 Base palette
- Background: neutral / slate 系の明るいトーン
- Surface: white or very light neutral
- Border: light neutral gray
- Text primary: dark slate
- Text secondary: muted slate
- Primary accent: medium-to-deep blue
- Secondary accent: very subtle cool blue-gray

### 4.3 Semantic colors
ブランド色と状態色を混同しない。

- Primary: blue
- Success: green
- Warning / review attention: amber
- Danger / destructive: red
- Info / derived / related state: blue系の補助トーン
- Archived / inactive: muted gray

### 4.4 Badge color rules
- Formal: blue-tinted strong neutral emphasis
- Unreviewed: amber
- Changes Requested: orange or amber-red
- Draft: muted blue-gray
- Under Review: blue
- Q&A-derived: cool blue secondary badge
- Resolved: green
- Reopened: amber
- Archived: gray
- Previous Formal Version Exists: muted info badge

---

## 5. Typography

### 5.1 Principles
- 階層を明確にする
- 見出しは強すぎず、秩序を作るために使う
- 本文は長文可読性を最優先する
- 一覧ではタイトル、状態、メタ情報の順に視線が流れるようにする
- 小さすぎる文字で情報を押し込まない

### 5.2 Hierarchy
- Page Title: 明確で安定感のある大見出し
- Section Title: ページ内の論理区切り
- Card Title / Item Title: 一覧上で最も目立つテキスト
- Metadata: 控えめだが読みやすい
- Body: 読み物としてストレスのないサイズと行間
- Helper / Caption: あくまで補助

### 5.3 Writing tone in UI
- 事務的すぎず、丁寧で明確
- 曖昧な表現を避ける
- 「何ができるか」「何が起きているか」を明示する
- エラーメッセージは vague にしない

---

## 6. Layout System

### 6.1 Signed-in app shell
ログイン後の共通構造は以下で統一する。

- Top header
- Left sidebar navigation
- Page header
- Main content area

### 6.2 Header
共通ヘッダーには以下を含める。

- Product name
- Workspace name
- Global search entry
- Notifications icon with unread badge
- Review queue badge for reviewer / admin / owner
- User menu

### 6.3 Sidebar navigation
基本ナビゲーションは以下とする。

- Knowledge
- Questions
- Bookmarks
- Notifications
- Admin

### 6.4 Main content
- 横幅は広すぎず、情報が散らばらないようにする
- 読む画面では可読性を優先する
- 一覧画面では検索、フィルタ、結果の順で自然に流れる構造にする
- 編集画面では入力エリアを主役にする

### 6.5 Spacing
- 余白で整理する
- 区切り線と余白を基本とし、影は補助に留める
- 詰め込みすぎず、しかし業務画面として密度不足にも見せない

---

## 7. Screen Template Rules

20画面を個別最適しない。以下のテンプレートで揃える。

### 7.1 Gateway screens
対象:
- Login
- Workspace existence / join gateway
- Invitation acceptance
- Join request

原則:
- 判断と次アクションを明確にする
- 軽量で迷わない
- サインイン前のため、装飾は控えめ

### 7.2 List screens
対象:
- Knowledge List
- Question List
- Review Queue
- Notifications
- Bookmarks

原則:
- 検索とフィルタを最上部に集約する
- 一覧比較に必要な情報だけを載せる
- 本文は出しすぎない
- Empty state では次行動を示す

### 7.3 Detail screens
対象:
- Knowledge Detail
- Question Detail

原則:
- 読むことが主目的
- タイトル、状態、概要、本文、補助情報、操作の順に構成する
- 補助情報は整理して畳まずに読めるようにする
- 操作は重要だが、本文を圧迫しない

### 7.4 Editor screens
対象:
- Knowledge Create
- Knowledge Edit
- Formal knowledge edit draft
- Question Create
- Question Edit

原則:
- 書くことに集中させる
- ただし、現在状態やレビュー申請可否を見失わせない
- 差し戻し理由がある場合は明示する
- 保存系と申請系のアクションは明確に分ける

### 7.5 History screens
対象:
- Knowledge History

原則:
- 現在版と履歴を混ぜない
- 履歴は traceability を重視する
- 高度な diff より、誰がいつ何を変えたかを分かりやすくする

### 7.6 Admin screens
対象:
- Member Management
- Tag Management

原則:
- **table 形式を基本**とする
- card より運用効率と一覧性を優先する
- 行ごとのアクションは明示するが、危険操作は慎重に扱う
- 管理画面は静かで信頼できる印象にする

---

## 8. Status and Workflow Expression

### 8.1 Status is always visible
- 一覧でも詳細でも、現在状態を必ず明示する
- 状態ラベル、色、優先順位は全画面で統一する

### 8.2 Core statuses
- Formal
- Unreviewed
- Changes Requested
- Draft
- Under Review
- Q&A-derived
- Resolved
- Reopened
- Archived
- Previous Formal Version Exists

### 8.3 Placement rules
- List: タイトル近くまたはカード上部右側
- Detail: タイトル直下
- Editor: 画面上部に状態エリアを設ける
- Table: item name 近辺または status column

### 8.4 Action priority
- Primary: 今その状態で最も推奨される行動
- Secondary: 補助操作
- Tertiary: 低頻度操作
- Destructive: アーカイブ、削除、取り下げなど

---

## 9. Knowledge-specific Rules

### 9.1 Knowledge is the default landing experience
- 参加後の主画面は Knowledge List
- formal knowledge を最初に見せる
- relevance と updated date を強く意識した一覧にする

### 9.2 Knowledge cards
各カードで重視する情報:
- Title
- Summary
- Tags
- Status
- Updated date
- Creator
- Bookmark action

原則:
- 一覧で比較しやすい
- 情報は多すぎず少なすぎない
- タイトルと状態が一目で分かる

### 9.3 Knowledge detail
Knowledge Detail では以下を整理して表示する。

- Title
- Summary
- Status badges
- Tags
- Creator
- Last updater
- Last updated timestamp
- Last content author
- Result attributes
- Context
- Body
- Related links
- Comments
- Origin information when Q&A-derived
- History entry point
- Archive reason if archived

### 9.4 Formal vs draft separation
- 正式版と編集下書きは絶対に混ぜない
- current formal version は source of truth として見せる
- edit draft は proposal として明確に分離する

---

## 10. Question-specific Rules

### 10.1 Questions are secondary but important
- 質問一覧は存在するが、Knowledge より重心を下げる
- 投稿体験は軽量にする
- ナレッジ化導線を必ず持つ

### 10.2 Question detail structure
- Title
- Status
- Tags
- Creator
- Body
- Related links
- Question comments
- Derived knowledge list
- Bookmark
- History entry points

### 10.3 Resolved state separation
Question Detail では、回答群を以下の 2 セクションに分ける。

#### A. 解決時点で固定された回答群
- Best answer
- その時点で存在していた他回答
- resolved snapshot として視覚的に安定させる

#### B. 再オープン後の追加回答
- 後から追加された回答として明示する
- resolved state と混同させない

### 10.4 No comment UI on answers
- 回答へのコメント UI は出さない
- 質問へのコメントと回答本体は分離する

---

## 11. Admin Table Rules

### 11.1 Management screens use tables
管理画面は table layout を基本とする。  
理由は、運用効率、一括把握、行単位アクション、状態比較のしやすさを優先するため。

### 11.2 Table design principles
- header row は明瞭に
- status column を持つ
- actions column を持つ
- row height は詰めすぎない
- hover / selected / focused state を明確に
- table 内に情報を押し込みすぎない
- 詳細確認が必要なものは row action から遷移またはモーダルで補う

### 11.3 Member Management table
想定列:
- Name
- Email
- Role
- Membership State
- Join Date
- Actions

サブセクション:
- Members
- Invitations
- Join Requests

### 11.4 Tag Management table
想定列:
- Tag Name
- Normalized Name
- Status
- Usage Count
- Creator
- Updated Date
- Actions

### 11.5 Destructive action safety
- role change, remove, archive, merge などは accidental に押せないようにする
- destructive action は色・配置・確認導線で明確に区別する

---

## 12. Component Rules

### 12.1 Must-be-consistent components
- App shell
- Search bar
- Filter bar
- Status badge
- List card
- Detail header
- Metadata row
- Rich text body
- Comment block
- Buttons
- Empty state
- Error state
- Permission denied state
- Loading skeleton
- Admin table

### 12.2 Buttons
- Primary: blue fill
- Secondary: neutral outline or subtle fill
- Tertiary: text style
- Destructive: red-accented and clearly separated

### 12.3 Search and filters
- 検索欄は明確に目立たせる
- フィルタは compact だが分かりやすく
- filter chips や dropdown は整理して使う
- 一覧画面では検索とフィルタの位置を統一する

### 12.4 Cards
- card は軽めの輪郭と十分な余白
- 強い影は避ける
- 情報構造がすぐ分かるようにする

### 12.5 Tables
- 管理画面では card より table を優先
- 表は“詰まった管理画面”ではなく“読みやすい運用画面”にする

---

## 13. Empty, Error, Permission, Loading States

### 13.1 Empty
- 何もない理由を説明する
- 次に取るべき行動を 1 つ示す
- 特に Knowledge List では、formal knowledge がまだ無い場合の意味が伝わるようにする

### 13.2 Error
- 曖昧な失敗メッセージを避ける
- 再試行導線を置く
- 何ができるかを示す

### 13.3 Permission denied
- できない理由を短く明確に説明する
- 誤解を招く操作を見せない
- 権限不足は UI の失敗ではなく、正しい制御として見せる

### 13.4 Loading
- spinner 乱用を避ける
- skeleton を基本とする
- 一覧、詳細、table それぞれに自然な loading pattern を用意する

---

## 14. Prohibited UI

以下は含めない。

- Likes
- Upvotes
- Public ranking
- Attachment upload UI
- AI helper UI
- Comment UI for answers
- Comment history UI
- Advanced diff visualization
- External integration settings UI
- Email notification settings
- Admin / owner can edit another user’s body content, or anything that implies that

---

## 15. Stitch Usage Rules

### 15.1 Do not generate all screens independently
最初から全 20 画面をバラバラに作らない。  
まずデザインルールを前提に、代表画面を生成して方向性を固める。

### 15.2 Recommended first screens
最初に作る画面:
- Login
- Workspace Join Gateway
- Knowledge List
- Knowledge Detail
- Knowledge Create
- Review Queue
- Question Detail
- Member Management

### 15.3 Reuse the same visual language
すべての画面は、同じ design system, spacing, badge rules, page structure, and action hierarchy を共有すること。

### 15.4 Prototype flow priority
優先してつなぐべき flow:
- 初回参加フロー
- 直接投稿 → 共有 / レビュー申請フロー
- Q&A → 解決 → ナレッジ化フロー
- 正式ナレッジ → 編集下書き → 再レビュー → 反映フロー

---

## 16. Final Summary

このデザインの本質は、見た目を整えることではない。  
**Knowledge-first, state-driven, role-aware, enterprise-grade** の秩序を、全画面で一貫して表現することが本質である。

UI は、質問を増やすためではなく、組織知を育てるために存在する。  
そのため、Knowledge を主役に置き、Q&A を入口に留め、状態と権限を明快に表現し、管理画面は table で静かに運用できる形にする。
