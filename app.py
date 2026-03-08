import os
import anthropic
import streamlit as st

st.set_page_config(page_title="朋友圈文案生成器", page_icon="✍️")
st.title("✍️ 朋友圈文案生成器")

api_key = os.environ.get("ANTHROPIC_API_KEY")
base_url = os.environ.get("ANTHROPIC_BASE_URL")

if not api_key:
    st.error("未找到 ANTHROPIC_API_KEY 环境变量，请先设置")
    st.stop()

st.caption(f"API 地址：{base_url or 'https://api.anthropic.com（官方默认）'}")

voice_text = st.text_area(
    "粘贴你的语音转文字内容",
    placeholder="把语音转出来的原始文字粘贴进来，不用整理，越原始越好……",
    height=250
)

if st.button("生成文案", type="primary"):
    if not voice_text:
        st.warning("请先粘贴内容")
    else:
        prompt = f"""
你是我的朋友圈文案助手。我会给你一段语音转文字的原始内容，里面有重复、跑题、口语填充词，没关系。

你的任务：从这段话里提炼出所有值得发的观点，按观点的犀利程度筛选，生成2-5条四段式朋友圈文案。观点不够犀利的不要写，宁少勿滥。

朋友圈不是日记，是私域内容。读者是潜在客户，他们在刷朋友圈的时候，你的内容要能让他们停下来、有感触、觉得这个人说的有道理，甚至想找你聊。所以每一条文案都要有用户视角：不是在记录我今天做了什么，而是在输出一个对读者有价值的观点或洞察，让他们觉得关注你是值得的。

【风格要求】
- 口语化，视觉上读起来流畅
- 长短句交替，有节奏感和韵律感。短句用来点题或收尾，长句用来铺陈和解释，不要全是短句也不要全是长句
- 自问自答的句式自然出现：为什么？因为……
- 就是、然后、哎呀、搞 这类词可以用，但不要堆，点到为止
- 结尾可以用反问收尾，有点个人立场，但不说教
- 举真实的生活细节，不举大道理
- 绝对禁止使用双引号
- 绝对禁止使用以下词汇和句式：稳稳接住、扛着、看见自己、疗愈、破防、共鸣、赋能、内耗、松弛感、钝感力、向内探索、与自己和解、任何XX的我句式、任何愿你XX句式

【格式】
- 输出里不要出现【观点】【原因】【案例】【总结】这些标签，也不要出现第1条第2条这类编号
- 每条内部按观点、原因、案例、总结的顺序写，但标签不显示
- 每段之间空一行，每条之间用 --- 分隔
- 整体长短根据语料决定，不要强行拉长也不要强行压缩
- 输出的内容要可以直接复制粘贴发朋友圈，不需要任何修改

原始语音内容：
{voice_text}
"""
        with st.spinner("正在生成中..."):
            try:
                client_kwargs = {"api_key": api_key}
                if base_url:
                    client_kwargs["base_url"] = base_url
                client = anthropic.Anthropic(**client_kwargs)
                response = client.messages.create(
                    model="claude-sonnet-4-6",
                    max_tokens=1024,
                    messages=[{"role": "user", "content": prompt}]
                )
                content = response.content[0].text
                st.success("生成完成！")
                st.markdown(content)
            except Exception as e:
                st.error(f"请求失败：{type(e).__name__}: {e}")
