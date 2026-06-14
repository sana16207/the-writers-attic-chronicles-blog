import type { Story, Comment } from "@/lib/api";

export const SAMPLE_STORIES: Story[] = [
  {
    id: "s1",
    title: "The Lamplighter of Marrow Lane",
    content:
      "Every dusk, when the fog rolled in from the river, old Edwin took his brass key to the lamps of Marrow Lane. He had walked the same crooked path for forty-two years, lighting each wick with the patience of a man who knew that small acts of warmth are how a city remembers itself. The boys on the corner had begun to call him a ghost — but only because they had forgotten what tenderness looks like.\n\nOn the evening the gas company sent their letter, Edwin folded it carefully into quarters and slipped it into the lining of his coat. He climbed the ladder one last time, lit the lamp at the end of the lane, and stood there a while, listening to the bells.",
    authorName: "Hadley Penrose",
    createdAt: "2024-11-14T19:00:00Z",
    likes: 124,
  },
  {
    id: "s2",
    title: "On Keeping a Commonplace Book",
    content:
      "There is a particular pleasure to copying out a sentence by hand. You feel the shape of it. The vowels slow you down. A commonplace book is not a diary — it is a private museum of borrowed light, a record of the sentences that, for whatever reason, you could not bear to let pass unmarked.",
    authorName: "M. Ashcombe",
    createdAt: "2024-12-02T08:30:00Z",
    likes: 88,
  },
  {
    id: "s3",
    title: "A Brief Defense of Marginalia",
    content:
      "I cannot read a book I love without arguing with it in the margins. Some say this is vandalism. I say it is the only honest way to read — to leave a trail of pencil so that, returning years later, you might meet the person you once were and ask after their health.",
    authorName: "Clarence Bell",
    createdAt: "2025-01-09T11:15:00Z",
    likes: 56,
  },
  {
    id: "s4",
    title: "Coffee, and the Slow Art of Beginning Again",
    content:
      "There is a ritual in the first cup. The kettle's small thunder. The bloom of grounds. The pale steam that rises like a question. To begin a day this way is to remind oneself that some pleasures cannot be hurried, and that those are the pleasures most worth keeping.",
    authorName: "Iris Wexley",
    createdAt: "2025-02-21T06:45:00Z",
    likes: 211,
  },
  {
    id: "s5",
    title: "Letters Never Sent",
    content:
      "In the top drawer of my grandmother's desk we found a stack of letters, bound in twine, each addressed but unsent. They were not love letters, exactly. They were arguments she had finished too late, apologies she had practiced and discarded, ordinary kindnesses she had been too proud to risk.",
    authorName: "Thaddeus Reed",
    createdAt: "2025-03-03T14:20:00Z",
    likes: 173,
  },
  {
    id: "s6",
    title: "The Bookbinder's Apprentice",
    content:
      "Mira had been at the bench for six weeks before Master Aldridge let her touch the gold leaf. 'Spines first,' he said. 'A book that won't open is no book at all.' She learned to listen to paper the way some people learn to listen to weather.",
    authorName: "Genevieve Halsey",
    createdAt: "2025-04-18T17:00:00Z",
    likes: 99,
  },
];

export const SAMPLE_COMMENTS: Record<string, Comment[]> = {
  s1: [
    { id: "c1", authorName: "Ada Wren", content: "I read this twice. The bells got me.", createdAt: "2024-11-15T09:00:00Z" },
    { id: "c2", authorName: "Jonas Ellery", content: "Lovely, restrained, exact. More please.", createdAt: "2024-11-16T22:00:00Z" },
  ],
  s2: [{ id: "c3", authorName: "P. Holloway", content: "Just started one. Already in love.", createdAt: "2024-12-04T10:00:00Z" }],
};
