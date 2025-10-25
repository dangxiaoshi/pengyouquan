"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function MomentsGenerator() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateMoments = async () => {
    if (!input.trim()) {
      setError("请输入内容")
      return
    }

    setIsLoading(true)
    setError("")
    setOutput("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error("生成失败，请重试")
      }

      const data = await response.json()
      setOutput(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      alert("已复制到剪贴板！")
    } catch (err) {
      alert("复制失败，请手动复制")
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">朋友圈生成器</h1>
          <p className="text-muted-foreground">将零散想法快速整理成自然流畅的朋友圈文案</p>
        </div>

        {/* Input Section */}
        <Card className="p-6 space-y-4">
          <Textarea
            placeholder="请输入你想写的主题或语音转文字..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[120px] resize-none text-base"
          />
          <Button onClick={generateMoments} disabled={isLoading} className="w-full h-12 text-base font-medium">
            {isLoading ? "生成中..." : "生成朋友圈"}
          </Button>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </Card>

        {/* Output Section */}
        {output && (
          <Card className="p-6 space-y-4">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap text-base">{output}</div>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full h-12 text-base font-medium bg-transparent"
            >
              复制文案
            </Button>
          </Card>
        )}
      </div>
    </main>
  )
}
