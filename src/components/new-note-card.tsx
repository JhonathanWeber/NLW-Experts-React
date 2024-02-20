import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [contentNote, setContentNote] = useState("");

  function handleStartTextEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContentNote(event.target.value);
    if (event.target.value === "") setShouldShowOnboarding(true);
  }

  function handleSaveNote(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!contentNote) {
      toast.warning("Não é possivel salvar uma nota vazia!");
      return null;
    }
    onNoteCreated(contentNote);
    setContentNote("");
    setShouldShowOnboarding(true);
    toast.success("Nota criada com sucesso!");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.warning("Seu navegador não suporta está função!");
      setIsRecording(false);
    }
    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContentNote(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);
    if (speechRecognition) speechRecognition.stop();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className=" rounded-md text-left flex flex-col  bg-slate-700 p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>

            <form className="flex flex-col flex-1">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>
                {shouldShowOnboarding ? (
                  <p className="text-sm leading-6 text-slate-500">
                    Comece gravando uma{" "}
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="font-medium text-lime-400 hover:underline "
                    >
                      nota em audio
                    </button>{" "}
                    ou se preferir{" "}
                    <button
                      type="button"
                      onClick={handleStartTextEditor}
                      className="font-medium text-lime-400 hover:underline "
                    >
                      utilize somente texto.
                    </button>
                  </p>
                ) : (
                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContentChanged}
                    value={contentNote}
                  />
                )}
              </div>

              {(isRecording && (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="py-4 bg-slate-900 text-slate-400  hover:text-slate-100 "
                >
                  <div className="antialiased uppercase duration-200 font-medium flex items-center justify-center gap-1">
                    <div className="size-4 mb-0.5 rounded-full bg-red-600 animate-pulse" />
                    <span>Gravando! (Click p/ interromper)</span>
                  </div>
                </button>
              )) || (
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="py-4 bg-lime-400 hover:bg-lime-500 "
                >
                  <div className="antialiased text-lime-950 uppercase duration-200 font-medium">
                    <span>salvar</span>
                  </div>
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
