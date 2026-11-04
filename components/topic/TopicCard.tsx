import Link from "next/link"
import { css, mq, Style } from "@/components/ui/Style"
import { formatDate } from "@/lib/format"
import { TopicCardData } from "@/lib/types"
import { CategoryBadge, StatusBadge, TypeBadge } from "./Badges"
import { Avatar, colorsFor } from "./Participants"
import { Thumbnail } from "./Thumbnail"

const styles = css`
  .TopicCard {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 12px 12px 18px;
    border: 2px solid var(--c-ink);
    box-shadow: var(--shadow);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    height: 100%;
  }
  .TopicCard:hover {
    transform: translate(-2px, -2px) rotate(-0.3deg);
    box-shadow: 6px 6px 0 var(--c-ink);
  }
  .TopicCard:focus-within {
    outline: 3px solid var(--c-focus);
    outline-offset: 3px;
  }
  .TopicCard_body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 4px;
    flex: 1;
  }
  .TopicCard_title {
    font-size: 1.1rem;
    line-height: 1.55;
    font-weight: 900;
  }
  .TopicCard_link {
    text-decoration: none;
  }
  .TopicCard_link:focus-visible {
    outline: none;
  }
  .TopicCard_link::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--radius);
  }
  .TopicCard_desc {
    font-size: 0.85rem;
    color: var(--c-text-sub);
    line-height: 1.75;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .TopicCard_meta {
    margin-top: auto;
    display: flex;
    gap: 12px;
    font-size: 0.75rem;
    color: var(--c-text-sub);
  }
  .TopicCard--large .TopicCard_title {
    font-size: 1.35rem;
  }
  .TopicCard_chat {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.75rem;
    color: var(--c-ink);
    font-weight: 700;
  }
  .TopicCard_avatars {
    display: flex;
  }
  .TopicCard_avatars > * {
    margin-left: -6px;
  }
  .TopicCard_avatars > *:first-child {
    margin-left: 0;
  }
  .TopicCard_preview {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px;
    align-items: start;
    font-size: 0.85rem;
    line-height: 1.7;
  }
  .TopicCard_bubble {
    background: var(--c-yellow-soft);
    border: 1.5px solid var(--c-ink);
    border-radius: 4px 16px 16px 16px;
    padding: 8px 12px;
  }
  .TopicCard_bubbleText {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  ${mq.tablet} {
    .TopicCard--large {
      padding: 16px 16px 24px;
    }
    .TopicCard--large .TopicCard_title {
      font-size: 1.6rem;
    }
    .TopicCard--large .TopicCard_desc {
      font-size: 0.95rem;
    }
  }
  .TopicGrid {
    list-style: none;
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;
  }
  ${mq.tablet} {
    .TopicGrid {
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }
  }
  ${mq.desktop} {
    .TopicGrid--3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`

export const TopicCardStyles = () => <Style id="TopicCard">{styles}</Style>

export const TopicCard = ({
  topic,
  size = "default",
  headingLevel = 3,
}: {
  topic: TopicCardData
  size?: "default" | "large"
  headingLevel?: 2 | 3
}) => {
  const H = `h${headingLevel}` as const
  const colors = colorsFor(topic.participants)
  const first = topic.firstMessage
  const firstSpeaker =
    first && topic.participants.find((p) => p.id === first.speaker)
  const preview =
    first && firstSpeaker
      ? { participant: firstSpeaker, text: first.text }
      : null
  return (
    <article className={`TopicCard TopicCard--${size}`}>
      <TopicCardStyles />
      <Thumbnail
        src={topic.thumbnail}
        alt=""
        category={topic.category}
        type={topic.type}
      />
      <div className="TopicCard_body">
        <div className="Badges">
          <CategoryBadge category={topic.category} />
          <TypeBadge type={topic.type} />
          <StatusBadge status={topic.status} />
        </div>
        <H className="TopicCard_title">
          <Link className="TopicCard_link" href={`/topics/${topic.id}/`}>
            {topic.title}
          </Link>
        </H>
        <p className="TopicCard_desc">{topic.description}</p>
        {size === "large" && preview && (
          <div className="TopicCard_preview" aria-hidden="true">
            <Avatar
              participant={preview.participant}
              color={colors.get(preview.participant.id)!}
              size={28}
            />
            <p className="TopicCard_bubble">
              <span className="TopicCard_bubbleText">{preview.text}</span>
            </p>
          </div>
        )}
        {topic.messageCount > 0 && (
          <p className="TopicCard_chat">
            <span className="TopicCard_avatars" aria-hidden="true">
              {topic.participants.map((p) => (
                <Avatar
                  key={p.id}
                  participant={p}
                  color={colors.get(p.id)!}
                  size={24}
                />
              ))}
            </span>
            <span>
              {topic.participants.length}人のAIが議論・{topic.messageCount}
              発言
            </span>
          </p>
        )}
        <p className="TopicCard_meta">
          {topic.publishedAt && (
            <time dateTime={topic.publishedAt}>
              {formatDate(topic.publishedAt)}
            </time>
          )}
          <span>読了目安 {topic.readingTime}分</span>
        </p>
      </div>
    </article>
  )
}

export const TopicGrid = ({
  topics,
  columns = 3,
}: {
  topics: TopicCardData[]
  columns?: 2 | 3
}) => (
  <ul className={`TopicGrid TopicGrid--${columns}`}>
    <TopicCardStyles />
    {topics.map((t) => (
      <li key={t.id}>
        <TopicCard topic={t} />
      </li>
    ))}
  </ul>
)
