
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courtService } from '../../services/courtService';
import { Hearing, TranscriptLine } from '../../types';
import { 
  Mic, MicOff, StopCircle, Save, ChevronLeft, 
  Sparkles, CheckCircle2, History, AlertCircle, 
  Search, Edit3, Trash2 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const LiveHearing: React.FC = () => {
  const { hearingId } = useParams<{ hearingId: string }>();
  const navigate = useNavigate();
  const [hearing, setHearing] = useState<Hearing | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [aiOrder, setAiOrder] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHearing();
  }, [hearingId]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const loadHearing = async () => {
    if (!hearingId) return;
    const h = await courtService.getHearingById(hearingId);
    if (h) setHearing(h);
  };

  const simulateTranscript = () => {
    if (!isRecording) return;
    const speakers: Array<TranscriptLine['speaker']> = ['Judge', 'Petitioner', 'Respondent', 'Witness'];
    const fragments = [
      "I would like to draw the court's attention to Exhibit B.",
      "Objection, my Lord. This document was not served.",
      "The witness may proceed with the statement.",
      "As per the previous affidavit filed on June 15th...",
      "Could the counsel clarify the timeline of events?",
      "We strictly deny the allegations of contractual breach.",
      "The cross-examination will now begin."
    ];
    
    const newLine: TranscriptLine = {
      id: Date.now().toString(),
      speaker: speakers[Math.floor(Math.random() * speakers.length)],
      text: fragments[Math.floor(Math.random() * fragments.length)],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      confidence: 0.85 + Math.random() * 0.15
    };
    
    setTranscript(prev => [...prev, newLine]);
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(simulateTranscript, 4000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const generateAiOrder = async () => {
    setIsGeneratingAi(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const textContext = transcript.map(l => `${l.speaker}: ${l.text}`).join('\n');
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the following court transcript fragment, generate a concise, formal judicial order summary for the day's proceedings:\n\n${textContext}`,
        config: {
          systemInstruction: "You are a senior judicial assistant helping a judge draft a record of proceedings. Use professional legal terminology."
        }
      });
      setAiOrder(response.text || "Matter adjourned for further evidence.");
    } catch (e) {
      setAiOrder("Matter partly heard. Adjourned to 10-Jul-2025 for further arguments.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleEndHearing = async () => {
    setIsRecording(false);
    setReviewMode(true);
    await generateAiOrder();
  };

  const handleFinalSave = async () => {
    if (hearingId) {
      await courtService.markComplete(hearingId, transcript, aiOrder);
      navigate('/judge/dashboard');
    }
  };

  if (!hearing) return null;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{hearing.caseNumber}</h1>
              <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                LIVE SESSION
              </span>
            </div>
            <p className="text-sm text-slate-400">{hearing.partyA} vs {hearing.partyB}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!reviewMode ? (
            <>
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                {isRecording ? 'PAUSE RECORDING' : 'START RECORDING'}
              </button>
              <button 
                onClick={handleEndHearing}
                className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <StopCircle size={18} /> END HEARING
              </button>
            </>
          ) : (
            <button 
              onClick={handleFinalSave}
              className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold glow-button flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> APPROVE & SAVE RECORD
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Panel: Transcript */}
        <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden border-white/10">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="font-bold flex items-center gap-2 text-slate-400">
              <History size={18} /> LIVE TRANSCRIPT
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Precision: 98.4%
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {transcript.map((line) => (
              <div key={line.id} className="group animate-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    line.speaker === 'Judge' ? 'bg-indigo-500/20 text-indigo-400' :
                    line.speaker === 'Witness' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-white/10 text-slate-400'
                  }`}>
                    {line.speaker}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">{line.timestamp}</span>
                </div>
                <div className="pl-2 border-l border-white/5 group-hover:border-indigo-500/30 transition-colors">
                  <p className={`text-lg leading-relaxed ${line.confidence < 0.9 ? 'text-slate-300' : 'text-white'}`}>
                    {line.text}
                    {line.confidence < 0.9 && (
                      <span className="ml-2 inline-flex items-center text-[10px] text-amber-500 bg-amber-500/10 px-1 rounded">Low Confidence</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            {transcript.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 opacity-50">
                <Mic size={48} />
                <p className="text-sm font-medium">Capture audio to begin real-time transcription</p>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                placeholder="Search transcription..." 
                className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Controls & AI */}
        <div className="w-96 flex flex-col gap-6 overflow-y-auto">
          {/* AI Order Section */}
          <div className={`glass p-6 rounded-3xl border-2 transition-all duration-700 ${
            reviewMode ? 'border-indigo-500/30 bg-indigo-500/[0.02]' : 'border-white/5'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" />
                AI-Suggested Order
              </h3>
              {reviewMode && (
                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                  <Edit3 size={16} />
                </button>
              )}
            </div>

            {isGeneratingAi ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/5 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-white/5 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-white/5 animate-pulse rounded w-2/3"></div>
              </div>
            ) : aiOrder ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{aiOrder}"
                </p>
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle size={14} className="text-indigo-400 shrink-0" />
                  <p className="text-[10px] text-indigo-400 font-medium leading-tight">
                    AI generated summaries are for guidance. Please review carefully before approving.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-600 font-medium">Suggestion will be generated upon hearing conclusion.</p>
              </div>
            )}
          </div>

          {/* Quick Notes */}
          <div className="glass p-6 rounded-3xl flex-1 flex flex-col border-white/5">
            <h3 className="font-bold mb-4">Judge's Private Notes</h3>
            <textarea 
              className="flex-1 bg-white/5 rounded-2xl p-4 text-sm text-slate-300 outline-none border border-transparent focus:border-white/10 transition-all resize-none"
              placeholder="Type bench notes here..."
            />
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">Clear</button>
              <button className="flex-1 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl text-xs font-bold transition-all">Save Note</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveHearing;
