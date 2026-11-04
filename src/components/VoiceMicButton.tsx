import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext.js';
import { COIMBATORE_AREAS, CATEGORIES } from '../utils/coimbatore.js';

interface VoiceMicButtonProps {
  onParsedQuery?: (parsed: { feature?: string; category?: string; area?: string; rawText: string }) => void;
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
    fetchPlaces,
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
    const lower = text.toLowerCase();
    let detectedFeature: string | undefined = undefined;
    let detectedCategory: string | undefined = undefined;
    let detectedArea: string | undefined = undefined;

    // Detect Accessibility Feature
    if (lower.includes('ramp') || lower.includes('wheelchair')) {
      detectedFeature = 'wheelchairRamp';
    } else if (lower.includes('lift') || lower.includes('elevator')) {
      detectedFeature = 'lift';
    } else if (lower.includes('toilet') || lower.includes('washroom') || lower.includes('restroom')) {
      detectedFeature = 'accessibleToilet';
    } else if (lower.includes('parking')) {
      detectedFeature = 'parking';
    } else if (lower.includes('braille')) {
      detectedFeature = 'braille';
    } else if (lower.includes('audio') || lower.includes('sound')) {
      detectedFeature = 'audioAssistance';
    }

    // Detect Category
    if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('doctor')) {
      detectedCategory = 'Hospital';
    } else if (lower.includes('college') || lower.includes('university') || lower.includes('school')) {
      detectedCategory = 'College / Education';
    } else if (lower.includes('mall') || lower.includes('shopping')) {
      detectedCategory = 'Shopping Mall';
    } else if (lower.includes('restaurant') || lower.includes('hotel') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('food')) {
      detectedCategory = 'Restaurant / Cafe';
    } else if (lower.includes('tech park') || lower.includes('tidel') || lower.includes('office') || lower.includes('kgisl')) {
      detectedCategory = 'Office / Tech Park';
    } else if (lower.includes('collectorate') || lower.includes('government') || lower.includes('station')) {
      detectedCategory = 'Government Office';
    }

    // Detect Coimbatore Area
    for (const a of COIMBATORE_AREAS) {
      if (lower.includes(a.toLowerCase())) {
        detectedArea = a;
        break;
      }
    }

    // Apply parsed filters
    if (detectedCategory) {
      setCategory(detectedCategory);
    }
    if (detectedArea) {
      setArea(detectedArea);
    }
    if (detectedFeature) {
      setFeatures((prev) => ({
        ...prev,
        [detectedFeature!]: true,
      }));
    }

    const message = `Searching Coimbatore places: ${detectedCategory || 'all places'} ${
      detectedArea ? 'in ' + detectedArea : ''
    } ${detectedFeature ? 'with ' + detectedFeature : ''}`;

    setFeedback(message);
    speakText(message);

    if (onParsedQuery) {
      onParsedQuery({
        feature: detectedFeature,
        category: detectedCategory,
        area: detectedArea,
        rawText: text,
      });
    }

    // Trigger fresh search
    setTimeout(() => {
      fetchPlaces();
    }, 150);
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
    'Find hospitals in Peelamedu with wheelchair ramp',
    'Show shopping malls with elevator',
    'Restaurants in RS Puram with accessible toilet',
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
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Try saying or click:
            </p>
            <div className="flex flex-col space-y-1">
              {sampleCommands.map((cmd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
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
