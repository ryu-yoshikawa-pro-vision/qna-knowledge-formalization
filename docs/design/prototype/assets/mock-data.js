(function () {
  window.DESIGN_PROTO_DATA = {
    statePanels: {
      loading: {
        kind: "blocking",
        tone: "info",
        title: "読み込み中",
        body: "この state では skeleton を優先し、mutation は行いません。prototype では Stitch 画面の上に loading surface を重ねて表現します。",
        actionLabel: "標準 state に戻る",
      },
      empty: {
        kind: "blocking",
        tone: "muted",
        title: "0 件です",
        body: "現在の条件では表示対象がありません。empty state の説明と次アクション導線を重ねて表現します。",
        actionLabel: "標準 state に戻る",
      },
      error: {
        kind: "blocking",
        tone: "danger",
        title: "読み込みに失敗しました",
        body: "prototype では retry 可能な error state を固定表示し、元の Stitch レイアウトは背面に保持します。",
        actionLabel: "標準 state に戻る",
      },
      "permission-denied": {
        kind: "blocking",
        tone: "danger",
        title: "権限がありません",
        body: "spec に従い、許可されない fixture では操作を見せず permission denied state を優先します。",
        actionLabel: "標準 state に戻る",
      },
      accepted: {
        kind: "floating",
        tone: "success",
        title: "受諾済み",
        body: "招待受諾後に membership が作成され、次画面では knowledge list に遷移する前提です。",
      },
      expired: {
        kind: "floating",
        tone: "danger",
        title: "期限切れ",
        body: "招待 token は失効しています。再招待依頼導線だけを残し、accept action は擬似的に無効化します。",
      },
      "create-path": {
        kind: "floating",
        tone: "info",
        title: "workspace 作成導線",
        body: "この state では同一ドメイン workspace が未作成で、workspace name 入力と create action が主導線になる前提です。",
      },
      "pending-join": {
        kind: "floating",
        tone: "warning",
        title: "参加申請待ち",
        body: "同一ドメイン workspace が存在し、join request または invitation の待機状態を表します。",
      },
      "active-member": {
        kind: "floating",
        tone: "success",
        title: "既参加メンバー",
        body: "workspace resolution を経由せず、そのまま knowledge list へ入る分岐です。",
      },
      pending: {
        kind: "floating",
        tone: "warning",
        title: "処理待ち",
        body: "送信済み / 申請中 / 招待待ちを表す state です。実 mutation は行わず note で表現します。",
      },
      cancelled: {
        kind: "floating",
        tone: "muted",
        title: "取消済み",
        body: "参加申請取消後の read-only state として扱います。",
      },
      "review-requested": {
        kind: "floating",
        tone: "info",
        title: "レビュー申請中",
        body: "review queue に現れる前提を note で補強します。",
      },
      "changes-requested": {
        kind: "floating",
        tone: "warning",
        title: "差し戻し対応中",
        body: "差し戻し理由を参照しながら本文を更新する前提の state です。",
      },
      archived: {
        kind: "floating",
        tone: "muted",
        title: "アーカイブ済み",
        body: "通常導線からは外れるが、detail では理由確認ができる state として扱います。",
      },
      "qa-derived": {
        kind: "floating",
        tone: "info",
        title: "Q&A 由来",
        body: "Question detail から派生して作成された knowledge draft を表します。",
      },
      "duplicate-blocked": {
        kind: "floating",
        tone: "warning",
        title: "未完了 draft あり",
        body: "formal knowledge に対して未完了の edit draft があるため、新規作成は block されます。",
      },
      applied: {
        kind: "floating",
        tone: "success",
        title: "正式反映済み",
        body: "edit draft の内容は正式版へ apply 済みで、以後は read-only 扱いです。",
      },
      discarded: {
        kind: "floating",
        tone: "muted",
        title: "破棄済み",
        body: "edit draft は discard 済みで、再利用不可の state を表します。",
      },
      open: {
        kind: "floating",
        tone: "info",
        title: "未解決",
        body: "question detail の open state を補足表示します。",
      },
      reopened: {
        kind: "floating",
        tone: "warning",
        title: "再オープン中",
        body: "resolved snapshot 後に follow-up answer が追加可能な state を表します。",
      },
      resolved: {
        kind: "floating",
        tone: "success",
        title: "解決済み",
        body: "当時の回答 snapshot が固定されている state です。",
      },
      locked: {
        kind: "floating",
        tone: "warning",
        title: "編集不可",
        body: "`resolved_locked` 扱いのため、question edit は blocked state として表示します。",
      },
      "read-all": {
        kind: "floating",
        tone: "success",
        title: "既読化済み",
        body: "通知既読化は冪等で、繰り返し実行しても副作用が増えない前提です。",
      },
      merge: {
        kind: "floating",
        tone: "info",
        title: "タグ統合ガバナンス",
        body: "archive / merge などの destructive action は prototype では note のみで表現します。",
      },
    },
    historyPanel: {
      title: "質問と回答の履歴",
      sections: [
        {
          heading: "Question revisions",
          items: [
            "rev.3 2024-05-13 09:18 山田 太郎: タイトル微修正",
            "rev.2 2024-05-11 14:26 山田 太郎: 本文に期待する成果物を追記",
            "rev.1 2024-05-11 14:20 山田 太郎: initial create",
          ],
        },
        {
          heading: "Answer revisions",
          items: [
            "answer#best rev.2 2024-05-11 15:45 佐藤 健一: Slack 手順を補足",
            "answer#follow-up rev.1 2024-05-13 09:12 田中 恵: 再オープン後の追加コメント",
          ],
        },
      ],
    },
  };
})();
