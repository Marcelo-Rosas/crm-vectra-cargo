import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCRM } from '@/context/CRMContext'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function AIPanel() {
  const { isAiPanelOpen, setAiPanelOpen } = useCRM()
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content:
        'Olá! Sou seu assistente operacional. Posso ajudar com cálculo de margem, resumo de documentos ou status de entregas.',
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return

    setMessages([...messages, { role: 'user', content: inputValue }])

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'Entendido. Estou processando sua solicitação sobre "' +
            inputValue +
            '". Por favor, aguarde um momento.',
        },
      ])
    }, 1000)

    setInputValue('')
  }

  return (
    <Sheet open={isAiPanelOpen} onOpenChange={setAiPanelOpen}>
      <SheetContent className="sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Assistente Vectra
          </SheetTitle>
          <SheetDescription>
            Use a IA para agilizar suas operações logísticas.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <span className="text-xs">VC</span>
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              placeholder="Pergunte sobre fretes ou documentos..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
