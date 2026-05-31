"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionResultEvent extends Event {
  results: SpeechRecognitionResultList;
}

type Message = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "¡Hola! 👋 Soy Ember, el asistente de diagnóstico web de EmberLab.\n\nEstoy aquí para ayudarte a entender cómo está tu sitio web y qué podemos hacer para mejorarlo. Al final recibirás un reporte personalizado con nuestras recomendaciones. 🔥\n\n¿Cómo te llamas?",
};

function LogoIcon({
  size = 32,
  color = "#E73F40",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 118 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M90.3317 26.15L89.1355 28.2765L90.3828 30.3724C90.5464 30.6485 90.2397 30.9552 89.9636 30.8018L87.8372 29.6056L85.7414 30.8529C85.4653 31.0165 85.1586 30.7098 85.312 30.4338L86.5081 28.3072L85.2608 26.2113C85.0973 25.9353 85.404 25.6286 85.68 25.7819L87.8065 26.9781L89.9023 25.7308C90.1783 25.5672 90.485 25.874 90.3317 26.15Z"
        fill={color}
      />
      <path
        d="M22.8671 19.5455L21.6709 21.6721L22.9182 23.7679C23.0818 24.044 22.7751 24.3507 22.499 24.1973L20.3726 23.0011L18.2767 24.2484C18.0007 24.412 17.694 24.1053 17.8474 23.8293L19.0435 21.7027L17.7962 19.6068C17.6327 19.3308 17.9394 19.0241 18.2154 19.1774L20.3419 20.3736L22.4377 19.1263C22.7137 18.9627 23.0204 19.2695 22.8671 19.5455Z"
        fill={color}
      />
      <path
        d="M117.887 54.8743L0 56.397L0.0866161 63.1032L117.974 61.5805L117.887 54.8743Z"
        fill={color}
      />
      <path
        d="M61.5786 5.09713e-05L54.8726 0.0866699L56.3952 117.978L63.1012 117.891L61.5786 5.09713e-05Z"
        fill={color}
      />
      <path
        d="M27.6311 23.9622L94.8298 89.0161L90.1475 93.8213L22.9487 28.7673L27.6311 23.9622Z"
        fill={color}
      />
      <path
        d="M86.3956 35.0651L36.7198 86.8792L31.9148 82.1967L81.5905 30.3826L86.3956 35.0651Z"
        fill={color}
      />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.4)" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      150
    );
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = { role: "user", content: text.trim() };
      const withUser = [...messages, userMessage];

      setMessages([...withUser, { role: "assistant", content: "" }]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: withUser }),
        });

        if (!response.ok || !response.body) throw new Error("fetch failed");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          const display = full.replace("[DIAGNOSTICO_COMPLETO]", "").trim();
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: display },
          ]);
        }

        if (full.includes("[DIAGNOSTICO_COMPLETO]")) setReportReady(true);
      } catch {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content:
              "Lo siento, hubo un error de conexión. Por favor intenta de nuevo.",
          },
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [messages, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  const toggleVoice = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const Cls = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Cls();
    rec.lang = "es-MX";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: SpeechRecognitionResultEvent) => {
      setInput(
        Array.from(e.results)
          .map((r) => r[0].transcript)
          .join("")
      );
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const downloadReport = async () => {
    setIsGeneratingPDF(true);
    try {
      const res = await fetch("/api/chat/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      if (!res.ok) throw new Error("pdf failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagnostico-emberlab.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Hubo un error generando el reporte. Por favor intenta de nuevo.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl font-dm"
            style={{
              bottom: 84,
              right: 16,
              width: "min(380px, calc(100vw - 32px))",
              height: "min(580px, calc(100svh - 120px))",
              backgroundColor: "var(--purple)",
              transformOrigin: "bottom right",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 34,
                    height: 34,
                    backgroundColor: "var(--red)",
                    flexShrink: 0,
                  }}
                >
                  <LogoIcon size={20} color="#fff" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">
                    EmberLab
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "#4ade80" }}
                    />
                    <p
                      className="text-xs leading-tight"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      Diagnóstico Web · IA
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                aria-label="Cerrar chat"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M11 4L4 11M4 4l7 7" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.1) transparent",
              }}
            >
              {messages.map((msg, i) => {
                const isLastAndLoading =
                  i === messages.length - 1 &&
                  isLoading &&
                  msg.role === "assistant";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0 mb-0.5"
                        style={{
                          width: 26,
                          height: 26,
                          backgroundColor: "var(--red)",
                          minWidth: 26,
                        }}
                      >
                        <LogoIcon size={15} color="#fff" />
                      </div>
                    )}
                    <div
                      className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                      style={
                        msg.role === "user"
                          ? {
                              backgroundColor: "var(--red)",
                              color: "#fff",
                              borderBottomRightRadius: 5,
                            }
                          : {
                              backgroundColor: "rgba(255,255,255,0.07)",
                              color: "rgba(255,255,255,0.9)",
                              borderBottomLeftRadius: 5,
                              border: "1px solid rgba(255,255,255,0.06)",
                            }
                      }
                    >
                      {isLastAndLoading && msg.content === "" ? (
                        <TypingDots />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Report ready CTA */}
            <AnimatePresence>
              {reportReady && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-3 mb-2 rounded-xl overflow-hidden flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--red) 0%, #c62e2f 100%)",
                    boxShadow: "0 4px 20px rgba(231,63,64,0.35)",
                  }}
                >
                  <button
                    onClick={downloadReport}
                    disabled={isGeneratingPDF}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 font-semibold text-sm text-white transition-opacity disabled:opacity-70"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="block w-4 h-4 border-2 rounded-full"
                          style={{
                            borderColor: "rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                          }}
                        />
                        Generando reporte...
                      </>
                    ) : (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Descargar mi diagnóstico PDF
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div
              className="flex items-end gap-2 px-3 pb-3 pt-2 flex-shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                backgroundColor: "rgba(0,0,0,0.18)",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustHeight(e.target);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "#fff",
                  maxHeight: 96,
                  lineHeight: "1.5",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              />

              {speechSupported && (
                <button
                  onClick={toggleVoice}
                  className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: isListening
                      ? "var(--red)"
                      : "rgba(255,255,255,0.07)",
                    color: isListening ? "#fff" : "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                  aria-label={isListening ? "Detener dictado" : "Dictar"}
                >
                  {isListening ? (
                    <motion.svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    >
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path
                        d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="2" width="6" height="12" rx="3" />
                      <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "var(--red)",
                  color: "#fff",
                }}
                aria-label="Enviar"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed z-50 flex items-center justify-center rounded-full cursor-pointer"
        style={{
          bottom: 24,
          right: 16,
          width: 56,
          height: 56,
          backgroundColor: "var(--red)",
          boxShadow: "0 4px 20px rgba(231,63,64,0.45)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={
          isOpen
            ? {}
            : {
                boxShadow: [
                  "0 4px 20px rgba(231,63,64,0.4)",
                  "0 4px 32px rgba(231,63,64,0.7)",
                  "0 4px 20px rgba(231,63,64,0.4)",
                ],
              }
        }
        transition={
          isOpen
            ? { type: "spring", stiffness: 300, damping: 20 }
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
        aria-label={isOpen ? "Cerrar chat" : "Abrir diagnóstico web"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ opacity: 0, rotate: -80, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 80, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ opacity: 0, rotate: 80, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -80, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              <LogoIcon size={27} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
