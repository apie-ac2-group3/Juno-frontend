
interface MoodSelectorProps {
  selectedMood: string;
  onMoodChange: (mood: string) => void;
}

const MoodSelector = ({ selectedMood, onMoodChange }: MoodSelectorProps) => {
  const moods = [
    { emoji: "😄", value: "happy", label: "Happy" },
    { emoji: "😊", value: "content", label: "Content" },
    { emoji: "😐", value: "neutral", label: "Neutral" },
    { emoji: "😔", value: "sad", label: "Sad" },
    { emoji: "😰", value: "anxious", label: "Anxious" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">what I feel today</label>
      <div className="flex gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onMoodChange(mood.value)}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
              selectedMood === mood.value
                ? "border-[#8766B4] bg-[#8766B4]/10 scale-110"
                : "border-gray-200 hover:border-gray-300"
            }`}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
