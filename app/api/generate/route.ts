import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { input } = await request.json()

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "无效的输入" }, { status: 400 })
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: `请把下面的内容改写成适合发朋友圈的文案。

要求：
1. 用自然、口语化的方式表达，不要用AI清单体或机械化的列表风格
2. 分成四段，每段之间用空行分隔
3. 不要用"观点"、"原因"、"案例"、"总结"这些框架词，不要用表情符号
4. **第一段必须以金句开场**：要有洞察力、有态度、能抓人眼球，不要流水账或单纯描述事件。要提出鲜明的观点或深刻的感悟
5. 第二段：深入分析原因或背景，要有思考深度
6. 第三段：用具体的例子或故事来支撑观点，要生动有画面感
7. 第四段：升华总结，给人启发或共鸣
8. 整体要有深度和洞察力，避免表面化的描述
9. 每段都要自然流畅，像一个有思想的朋友在分享见解
10. 直接返回文案内容，不要有任何其他说明文字

用户输入：${input}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error("API调用失败")
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error("生成内容为空")
    }

    return NextResponse.json({ text: content.trim() })
  } catch (error) {
    console.error("Error generating moments:", error)
    return NextResponse.json({ error: "生成失败，请重试" }, { status: 500 })
  }
}
