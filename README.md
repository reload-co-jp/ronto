# RonTo

**政治を知らなくても、政治について考えられる場所。**

https://rnt.reload.co.jp ／ 運営：株式会社リロード

政治・社会・経済の素朴な疑問を、立場の異なる複数のAIによるディスカッション形式で整理する読み物メディアです。

## 技術スタック

- Next.js 16（App Router / Static Export）・React 19・TypeScript
- CSS-in-JS：React 19 の `<style href precedence>` を使った自前の軽量実装（`components/ui/Style.tsx`）。ランタイム依存なし、サーバーコンポーネントでも利用可。Tailwind CSS は不使用
- データベースなし。記事は `content/topics/*.json` で管理
- GitHub Pages へ GitHub Actions でデプロイ（独自ドメイン `public/CNAME`）

## スクリプト

| コマンド                       | 説明                                               |
| ------------------------------ | -------------------------------------------------- |
| `pnpm dev`                     | 開発サーバー（下書き記事も表示される）             |
| `pnpm build`                   | 本番ビルド（`out/` に出力。公開記事のみ）          |
| `pnpm preview`                 | 下書きを含めたビルド（確認用。デプロイしないこと） |
| `pnpm test`                    | テスト（全記事データの検証を含む）                 |
| `pnpm lint`                    | ESLint                                             |
| `pnpm typecheck`               | 型チェック                                         |
| `pnpm format` / `format:check` | Prettier                                           |

## ディレクトリ構成

```
app/                     ページ（App Router）
  page.tsx               トップ
  topics/                記事一覧・記事詳細 /topics/{id}/
  categories/            カテゴリ一覧・カテゴリ別一覧
  elections/ about/ sources/ privacy/
  sitemap.ts robots.ts not-found.tsx
components/
  layout/                ヘッダー・フッター・ロゴ
  topic/                 記事カード・ディスカッション・まとめ等
  ui/                    Style（CSS-in-JS）・共通部品・パンくず
content/
  topics/*.json          記事データ（1記事1ファイル）
  templates/topic.template.json  記事テンプレート（全フィールドの記入例）
  categories.json        カテゴリ定義
  article-types.json     記事形式（WHY / DISCUSSION / BENEFIT / COMPARISON / ELECTION）
  personas.json          標準の登場人物（生活者・経済・社会保障・行政・地方・進行役）
  elections.json         選挙特集データ（政策比較）
lib/
  types.ts               コンテンツの型定義
  validate.ts            記事データの検証（ビルド時に実行）
  content.ts             読み込み・公開制御・関連記事・読了時間
  seo.ts site.ts         メタデータ・サイト設定
public/
  images/topics/         アイキャッチ画像（{id}.webp）
  og-default.png         デフォルトOGP画像
```

## 記事の追加・公開

1. `content/templates/topic.template.json` を `content/topics/{id}.json` としてコピーする（`id` とファイル名を一致させる。半角英小文字・数字・ハイフン）
2. 本文（`sections`）、登場人物（`participants`）、議論（`discussion`）、まとめ（`summary`）、出典（`sources`）を記入する
3. 画像を `public/images/topics/{id}.webp` に置く（なくてもカテゴリ色のフォールバック画像が表示される）
4. `pnpm dev` で確認し、編集部のファクトチェック後に `"status": "published"` にする
5. main に push すると自動でデプロイされる

ポイント:

- `status`：`draft`（下書き・本番非表示）／`published`（公開）／`archived`（非公開）。本番には `published` だけが出力され、それ以外の URL は 404 になる
- 公開記事は `publishedAt`・`sources`・`sections`・`discussion`・`summary.points` が必須。満たさない場合はビルドとテストが失敗する
- 登場人物は `{ "id": "consumer", "persona": "consumer" }` のように `personas.json` を参照でき、`name`・`stance` などを記事ごとに上書きできる。テーマに応じて独自の役割も定義可能
- 本文・議論・事実には `sourceIds` で出典を紐付けられ、本文中に [1] 形式の出典番号が表示される
- 統計・制度には `asOf`（基準日）や対象期間を付ける。内容を更新したら `updatedAt` を更新する（記事上部に更新日が表示される）
- `featured: true` でトップの注目トピックに表示。`related` で関連記事を明示指定（未指定時は同カテゴリ・共通タグから自動選択）
- `readingTime` を省略すると本文量から自動算出

## 初期コンテンツの状況

20テーマすべてに、チャット形式のAIディスカッション（メインコンテンツ）を作成済み。

- 公開（16本）：数値・制度は政府等の一次情報で確認できる範囲に限定して記述
- 下書き（4本）：`consumption-tax`・`number-of-diet-members`・`free-education`・`selective-surname`。国会審議や制度改正が進行中のため、最新状況を一次情報で確認してから公開する

## ディスカッション（メインコンテンツ）の書き方

記事ページは「友だちどうしの雑談」形式のチャットを中心に構成される（予備知識は折りたたみ、雑談の後にまとめ・出典が続く）。

- `scene`：場面設定（`emoji`・`place`・`time`・`description`）。居酒屋・カフェ・家飲みなど、話題が自然に出てくる場面を2〜3文で書く
- `participants`：`personas.json` の標準キャラクター（ハル＝聞き役、ユイ＝生活者、ケンジ＝経済、ナツミ＝社会保障、タクヤ＝行政、ゴロウ＝地方）を参照できる。`nickname`・`profile` を上書きしたり、記事独自のキャラクターを追加したりできる
- `discussion`：
  - `{ "speaker": "...", "text": "...", "kind": "question", "sourceIds": ["s1"] }` で発言。口調はくだけたタメ口で、1回2〜4文程度
  - `{ "divider": "話題" }` で話題の区切り（TOPIC 1, 2…と表示）
  - `{ "narration": "店員さんがビールを運んでくる。" }` でト書き（場の様子）
  - `kind`：`question`（質問）／`rebuttal`（反論）／`agree`（共感）／`fact`（事実確認）／`idea`（提案）／`summary`（まとめ）
- 雑談の雰囲気でも、統計・制度に触れる発言には必ず出典（`sourceIds`）を付け、事実と意見を混同しない
- 公開記事は発言6件以上が必須

## 将来の拡張

- **AI 記事生成**：記事は型付き JSON（`lib/types.ts`）で、`lib/validate.ts` による検証を通るものだけが公開される。生成結果をそのまま検証にかけられる
- **複数 LLM のディスカッション**：`participants` と `discussion` は役割単位の構造なので、役割ごとに別のモデルを割り当てられる。`editorial.models` に使用モデルを記録できる
- **ファクトチェック**：出典は `sources[].id` で本文・議論・事実と紐付いている。`editorial.factCheckedAt` で確認日を管理
- **選挙ごとの政策比較**：`content/elections.json` に争点と各政党・候補者の主張（一次情報 URL 付き）を追加すると `/elections/` に表示される
- 更新履歴・管理画面・読者評価などは、記事 JSON へのフィールド追加と開発環境専用ページで対応できる
