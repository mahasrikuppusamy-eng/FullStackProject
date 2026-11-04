import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { FeaturesFilter, useSearch } from '../context/SearchContext.js';
import { COIMBATORE_AREAS, CATEGORIES } from '../utils/coimbatore.js';

interface VoiceMicButtonProps {
  onParsedQuery?: (parsed: {
    features: (keyof FeaturesFilter)[];
    category?: string;
    area?: string;
    searchTerm: string;
    rawText: string;
  }) => void;
}

const featureRules: { key: keyof FeaturesFilter; label: string; aliases: string[] }[] = [
  { key: 'wheelchairRamp', label: 'wheelchair ramps', aliases: ['wheelchair ramp', 'wheelchair ramps', 'ramp', 'ramps', 'wheelchair accessible'] },
  { key: 'lift', label: 'lifts', aliases: ['lift', 'lifts', 'elevator', 'elevators'] },
  { key: 'accessibleToilet', label: 'accessible toilets', aliases: ['accessible toilet', 'accessible toilets', 'toilet', 'toilets', 'washroom', 'washrooms', 'restroom', 'restrooms'] },
  { key: 'parking', label: 'accessible parking', aliases: ['accessible parking', 'parking'] },
  { key: 'braille', label: 'Braille signage', aliases: ['braille', 'tactile signage'] },
  { key: 'audioAssistance', label: 'audio assistance', aliases: ['audio assistance', 'audio', 'hearing assistance'] },
];

const categoryRules: { category: string; aliases: string[] }[] = [
  { category: 'Hospital', aliases: ['hospitals', 'hospital', 'clinics', 'clinic', 'doctors', 'doctor', 'medical center', 'medical centre'] },
  { category: 'College / Education', aliases: ['colleges', 'college', 'universities', 'university', 'schools', 'school'] },
  { category: 'Shopping Mall', aliases: ['shopping malls', 'shopping mall', 'malls', 'mall', 'shopping centers', 'shopping center'] },
  { category: 'Restaurant / Cafe', aliases: ['restaurants', 'restaurant', 'cafes', 'cafe', 'coffee shops', 'coffee shop', 'food places', 'hotel'] },
  { category: 'Office / Tech Park', aliases: ['tech parks', 'tech park', 'it parks', 'it park', 'offices', 'office'] },
  { category: 'Government Office', aliases: ['government offices', 'government office', 'collectorate', 'government'] },
];

const commandFillers = [
  'find', 'find me', 'show', 'show me', 'search', 'look for', 'looking for',
  'tell me', 'tell', 'get', 'list', 'please',
  'places', 'place', 'nearby', 'near', 'around', 'in', 'at', 'with', 'that have',
  'that has', 'having', 'has', 'have', 'and', 'for', 'the', 'a', 'an', 'me', 'coimbatore',
  'accessible', 'accessibility', 'where', 'what', 'which', 'is', 'are', 'do',
  'does', 'can', 'could', 'would', 'there', 'i', 'you', 'located', 'available',
];

function normalizePhrase(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsPhrase(text: string, phrase: string) {
  return ` ${text} `.includes(` ${normalizePhrase(phrase)} `);
}

function parseVoiceCommand(text: string) {
  const normalized = normalizePhrase(text);
  const categoryRule = categoryRules.find((rule) => rule.aliases.some((alias) => containsPhrase(normalized, alias)));
  const area = [...COIMBATORE_AREAS]
    .sort((first, second) => second.length - first.length)
    .find((candidate) =>
      [candidate, ...(candidate === 'RS Puram' ? ['r s puram'] : [])].some((alias) =>
        containsPhrase(normalized, alias)
      )
    );
  const features = featureRules
    .filter((rule) => rule.aliases.some((alias) => containsPhrase(normalized, alias)))
    .map((rule) => rule.key);

  const removablePhrases = [
    ...categoryRules.flatMap((rule) => rule.aliases),
    ...featureRules.flatMap((rule) => rule.aliases),
    ...COIMBATORE_AREAS,
    ...COIMBATORE_AREAS.flatMap((candidate) =>
      candidate.toLowerCase() === 'rs puram' ? ['r s puram'] : []
    ),
    ...commandFillers,
  ];

  const searchTerm = removablePhrases
    .sort((first, second) => second.length - first.length)
    .reduce((remaining, phrase) => {
      const escapedPhrase = normalizePhrase(phrase)
        .split(' ')
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('\\s+');
      return remaining.replace(new RegExp(`\\b${escapedPhrase}\\b`, 'gi'), ' ');
    }, normalized)
    .replace(/\s+/g, ' ')
    .trim();

  return { category: categoryRule?.category, area, features, searchTerm };
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({ onParsedQuery }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const {
    setSearchTerm,
    setCategory,
    setArea,
    setFeatures,
  } = useSearch();

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English accent tuning

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback('Listening... Speak now (e.g., "Find hospital in Peelamedu with wheelchair ramp")');
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      handleVoiceCommand(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'aborted') {
        return;
      }
      setFeedback('Could not hear clearly. Try clicking one of the sample voice commands.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (text: string) => {
    const parsed = parseVoiceCommand(text);
    setCategory(parsed.category || 'All');
    setArea(parsed.area || 'All');
    setSearchTerm(parsed.searchTerm);
    const selectedFeatures: FeaturesFilter = {
      wheelchairRamp: false,
      lift: false,
      accessibleToilet: false,
      parking: false,
      braille: false,
      audioAssistance: false,
    };
    featureRules.forEach(({ key }) => {
      selectedFeatures[key] = parsed.features.includes(key);
    });
    setFeatures(selectedFeatures);

    const featureLabels = featureRules
      .filter(({ key }) => parsed.features.includes(key))
      .map(({ label }) => label);
    const filters = [
      parsed.area && `in ${parsed.area}`,
      featureLabels.length > 0 && `with ${featureLabels.join(' and ')}`,
    ].filter(Boolean);
    const message =
      !parsed.category && !parsed.area && parsed.features.length === 0 && !parsed.searchTerm
        ? 'I could not identify a place, area, or accessibility feature. Try one of the example searches.'
        : parsed.category
          ? `Searching ${parsed.category}${filters.length ? ` ${filters.join(' ')}` : ''}.`
          : parsed.searchTerm
            ? `Searching for "${parsed.searchTerm}"${filters.length ? ` ${filters.join(' ')}` : ''}.`
            : `Searching places${filters.length ? ` ${filters.join(' ')}` : ''}.`;

    setFeedback(message);
    if (!message.startsWith('I could not')) {
      speakText(message);
    }

    if (onParsedQuery) {
      onParsedQuery({
        features: parsed.features,
        category: parsed.category,
        area: parsed.area,
        searchTerm: parsed.searchTerm,
        rawText: text,
      });
    }
  };

  const toggleListen = () => {
    if (!supported) {
      setFeedback('Speech recognition is not supported in this browser. Try the sample voice buttons below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setFeedback(null);
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    }
  };

  const sampleCommands = [
    'Find PSG Hospitals in Peelamedu with wheelchair ramp and accessible toilet',
    'Show shopping malls with elevator',
    'Where can I find restaurants in RS Puram with an accessible toilet?',
    'Tech parks in Peelamedu with braille',
  ];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleListen}
        aria-label="Voice Search"
        className={`p-3 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
          isListening
            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
        title="Search with Voice (Web Speech API)"
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {/* Voice Status & Modal Popup */}
      {(isListening || feedback) && (
        <div className="absolute right-0 top-14 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Voice Navigation</span>
            </div>
            <button
              onClick={() => {
                setFeedback(null);
                setIsListening(false);
                recognitionRef.current?.stop();
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3">
            {isListening && (
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex space-x-1">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-8 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-xs text-indigo-700 font-semibold">Listening in Coimbatore...</p>
              </div>
            )}

            {transcript && (
              <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{transcript}"
              </p>
            )}

            {feedback && (
              <p className="text-xs text-slate-600 mt-2 flex items-center">
                <Volume2 className="w-3.5 h-3.5 text-indigo-500 mr-1.5 shrink-0" />
                {feedback}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 mb-2">
              Voice search filters the place directory using the words it recognizes.
            </p>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Try saying or click:
            </p>
            <div className="flex flex-col space-y-1">
              {sampleCommands.map((cmd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    recognitionRef.current?.abort();
                    setIsListening(false);
                    setTranscript(cmd);
                    handleVoiceCommand(cmd);
                  }}
                  className="text-left text-xs text-indigo-600 hover:bg-indigo-50 py-1 px-2 rounded-lg transition-colors truncate"
                >
                  🎙️ {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceMicButton;
