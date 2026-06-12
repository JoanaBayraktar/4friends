// Placeholder data for the UI scaffold.
// Once Supabase is connected, replace these with real queries against
// the tables defined in supabase/migrations/0001_init.sql.

export type MockProfile = {
  id: string;
  name: string;
  pronouns?: string;
  initials: string;
  color: string;
  imageUrl?: string;
  // Static placeholder points for everyone except the signed-in user
  // (whose real points come from usePoints/localStorage).
  mockPoints?: number;
};

export type MockQuestion = {
  id: string;
  text: string;
};

export type SliderStop = {
  value: number;
  text: string;
};

export type MockSliderQuestion = {
  id: string;
  text: string;
  leftLabel: string;
  rightLabel: string;
  stops: SliderStop[];
};

export const MOCK_GROUP = {
  name: "Feuchtgebiete",
  inviteCode: "#Couscous-Salat-2026",
};

export const MOCK_PROFILES: MockProfile[] = [
  { id: "joey", name: "Joey", pronouns: "er/ihm", initials: "JG", color: "bg-rose-300" },
  { id: "mia", name: "Mia", pronouns: "sie/ihr", initials: "M", color: "bg-amber-300", mockPoints: 120 },
  { id: "ben", name: "Ben", initials: "B", color: "bg-emerald-300", mockPoints: 95 },
  { id: "lou", name: "Lou", pronouns: "they/them", initials: "L", color: "bg-sky-300", mockPoints: 60 },
];

export const MOCK_QUESTIONS: MockQuestion[] = [
  { id: "q1", text: "Was macht diese Person besonders?" },
  { id: "q2", text: "Worin ist sie richtig gut?" },
  { id: "q3", text: "Was ist ein typischer Satz von ihr?" },
  { id: "q4", text: "Womit bringt sie andere zum Lachen?" },
  { id: "q5", text: "Welcher Vibe passt zu ihr?" },
];

export const MOCK_SLIDER_QUESTIONS: MockSliderQuestion[] = [
  {
    id: "s1",
    text: "Wie tickt diese Person eher?",
    leftLabel: "introvertiert",
    rightLabel: "extrovertiert",
    stops: [
      { value: 0, text: "Plant den Rückzug, bevor die Party überhaupt angefangen hat" },
      { value: 25, text: "Lieber Kleingruppen-Gespräche als die große Runde" },
      { value: 50, text: "Kommt ganz drauf an, wer da ist" },
      { value: 75, text: "Mittendrin statt nur dabei" },
      { value: 100, text: "Lautstärke-Regler steht permanent auf 11" },
    ],
  },
  {
    id: "s2",
    text: "Wie geht diese Person an neue Situationen ran?",
    leftLabel: "lieber abwarten",
    rightLabel: "einfach machen",
    stops: [
      { value: 0, text: "Man ist nie zu alt, um sich unter der Decke zu verkriechen" },
      { value: 25, text: "Ärgert sich danach noch den ganzen nächsten Tag" },
      { value: 50, text: "Erstmal ausführlich mit den Freund:innen besprechen" },
      { value: 75, text: "Schläft kurz drüber, dann geht's los" },
      { value: 100, text: "Macht einfach – fragen kann man später noch" },
    ],
  },
  {
    id: "s3",
    text: "Wie tiefgründig sind Gespräche mit dieser Person meistens?",
    leftLabel: "schön leicht",
    rightLabel: "richtig tief",
    stops: [
      { value: 0, text: "Lieber über Memes als über Gefühle" },
      { value: 25, text: "Smalltalk mit ein bisschen Würze" },
      { value: 50, text: "Mal so, mal so" },
      { value: 75, text: "Wird schnell mal philosophisch" },
      { value: 100, text: "3-Stunden-Gespräche über den Sinn des Lebens um 2 Uhr nachts" },
    ],
  },
  {
    id: "s4",
    text: "Wie sehr bringt diese Person frischen Wind in die Gruppe?",
    leftLabel: "ruhender Pol",
    rightLabel: "lebende Energie",
    stops: [
      { value: 0, text: "Die Ruhe selbst, wenn alle anderen durchdrehen" },
      { value: 25, text: "Bringt alle erstmal wieder runter" },
      { value: 50, text: "Mal Anker, mal Antrieb" },
      { value: 75, text: "Sorgt für gute Stimmung, sobald sie/er den Raum betritt" },
      { value: 100, text: "Lebende Energydrink-Werbung" },
    ],
  },
  {
    id: "s5",
    text: "Wie verlässlich ist diese Person, wenn's drauf ankommt?",
    leftLabel: "spontan-chaotisch",
    rightLabel: "absolut verlässlich",
    stops: [
      { value: 0, text: "Plant 5 Minuten vorher noch mal alles um" },
      { value: 25, text: "Kommt meistens – mit ein bisschen Verspätung" },
      { value: 50, text: "Kommt ganz drauf an, wie der Tag so läuft" },
      { value: 75, text: "Sagt zu und hält's auch ein" },
      { value: 100, text: "Wäre auch um 3 Uhr nachts für dich da" },
    ],
  },
];

export const MOCK_TAGS: string[] = [
  "warmherzig",
  "chaotisch-liebenswert",
  "kreativ",
  "zuverlässig",
  "witzig",
  "tiefgründig",
  "abenteuerlustig",
  "direkt",
  "loyal",
  "einfühlsam",
  "inspirierend",
  "gelassen",
];

export const MOCK_PROFILE_SUMMARY: Record<string, { content: string; approved: boolean; tags: string[] }> = {
  joey: {
    content:
      "Joey wird von Freund:innen als kreativ, direkt und unglaublich loyal beschrieben. Besonders geschätzt wird, dass Joey Dinge anpackt, Menschen zusammenbringt und auch in chaotischen Momenten Humor behält.",
    approved: true,
    tags: ["kreativ", "direkt", "loyal", "witzig"],
  },
};

export const MOCK_PROFILE_STATS: Record<
  string,
  { answeredAboutCount: number; topReplierId: string }
> = {
  joey: { answeredAboutCount: 7, topReplierId: "mia" },
};

export type ProfileAnswer = {
  id: string;
  text: string;
  // Number of likes this answer already received from other friends
  // (the current user's own like is tracked separately via useLikes
  // and added on top of this base count).
  likes?: number;
};

export type ProfileQuestionAnswers = {
  question: string;
  answers: ProfileAnswer[];
};

// Individual freitext answers that friends gave about this person,
// shown directly on the published profile (in addition to the
// generated summary text). When a question was answered by more than
// one friend, all of their answers are listed together under that
// question.
export const MOCK_PROFILE_ANSWERS: Record<string, ProfileQuestionAnswers[]> = {
  joey: [
    {
      question: "Was macht diese Person besonders?",
      answers: [
        {
          id: "joey-a1-1",
          text: "Joey bringt einfach jede Gruppe zusammen – wenn er da ist, passiert garantiert was Schönes.",
          likes: 3,
        },
        {
          id: "joey-a1-2",
          text: "Er hat dieses Talent, aus einem ganz normalen Abend spontan das Highlight der Woche zu machen.",
          likes: 2,
        },
      ],
    },
    {
      question: "Worin ist sie richtig gut?",
      answers: [
        {
          id: "joey-a2-1",
          text: "Pläne schmieden, die am Ende wirklich stattfinden. Und Leute zum Lachen bringen, wenn's mal nicht so läuft.",
          likes: 4,
        },
      ],
    },
    {
      question: "Was ist ein typischer Satz von ihr?",
      answers: [
        {
          id: "joey-a3-1",
          text: "„Lass uns das einfach machen, wird schon!“",
          likes: 1,
        },
        {
          id: "joey-a3-2",
          text: "„Ach komm, das wird bestimmt lustig.“",
          likes: 0,
        },
      ],
    },
    {
      question: "Womit bringt sie andere zum Lachen?",
      answers: [
        {
          id: "joey-a4-1",
          text: "Mit total übertriebenen Reaktionen auf die kleinsten Dinge – und perfektem Timing.",
          likes: 5,
        },
      ],
    },
    {
      question: "Welcher Vibe passt zu ihr?",
      answers: [
        {
          id: "joey-a5-1",
          text: "Golden-Retriever-Energie mit dem Timing eines Stand-up-Comedians.",
          likes: 2,
        },
      ],
    },
  ],
};

export function getProfileById(id: string): MockProfile | undefined {
  return MOCK_PROFILES.find((p) => p.id === id);
}
