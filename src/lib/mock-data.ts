// Slider task question bank. Freitext questions and trait tags now come
// from src/lib/question-bank.ts and src/lib/trait-bank.ts; real people,
// answers, summaries and stats now come from Supabase
// (see src/hooks/useProfileData.ts and supabase/migrations).

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

// Returns a shuffled selection of slider questions so each task round
// presents them in a different order (and, if `count` is smaller than the
// full set, with a different subset).
export function getRandomSliderQuestions(
  count: number = MOCK_SLIDER_QUESTIONS.length
): MockSliderQuestion[] {
  const shuffled = [...MOCK_SLIDER_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
