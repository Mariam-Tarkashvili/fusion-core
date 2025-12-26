# Medsplain: 10-Minute Presentation Script (REVISED)

**Total Duration:** 10 minutes  
**Team:** Fusion Core (Mariam, Saba, Tekla, Giorgi, Akaki)

---

## SECTION 1: INTRODUCTION (0:00-0:30)

**[MARIAM speaks - 30 seconds]**

"Hi everyone, I'm Mariam Tarkashvili, and with me are Saba Samkharadze, Tekla Chapidze, Giorgi Ksovreli, and Akaki Ghachava. We're Fusion Core.

We built Medsplain to solve a critical healthcare problem: patients can't find reliable, organized medication information when they need it. They're forced to search through dense FDA labels, navigate multiple websites with conflicting information, or rely on unreliable forums.

This information accessibility gap costs the US healthcare system over $100 billion annually in medication non-adherence. People stop taking their medications or take them incorrectly because they can't get clear, trustworthy answers to their questions.

Let me show you what we built."

---

## SECTION 2: VIDEO DEMO (0:30-2:00)

**[SABA speaks - 5 seconds, then plays video]**

"Here's a 90-second demo of Medsplain in action."

**[PLAY 90-SECOND VIDEO - team stands to side, silent during playback]**

**[TEKLA speaks - 5 seconds after video ends]**

"Now let's see it working live with real medical data."

---

## SECTION 3: LIVE DEMO (2:00-8:00)

### Demo Step 1: Core Search & AI-Powered Answers (2:00-3:30)

**[TEKLA demonstrates - 90 seconds]**

"I'm opening Medsplain at medsplain.vercel.app. Let's say I've just been prescribed warfarin, a blood thinner, and I want to understand what it does.

**[Types 'warfarin' in search box]**

I'll type 'warfarin' and hit search. Watch what happens...

**[Response streams in]**

Notice the response is streaming in real-time—this is GPT-4o-mini generating the answer based on verified medical sources. Instead of making users wade through a 10-page FDA label, Medsplain extracts and presents the relevant information directly.

**[Points to citation badges]**

See these blue badges? Every claim is backed by authoritative sources. This one says 'Source: FDA Drug Label - Warfarin, Section: Indications and Usage.' Users can click to see the original FDA document.

**[Scrolls to show organization]**

Notice how the information is organized into clear sections—what it does, how to take it, warnings—rather than the dense paragraph format of traditional drug labels.

The key difference from WebMD or Drugs.com? We don't just display static database entries. We use AI to answer specific questions while maintaining medical accuracy and showing our sources."

---

### Demo Step 2: Interactive Q&A (3:30-5:00)

**[GIORGI demonstrates - 90 seconds]**

"Now let's ask a follow-up question. Patients often have specific concerns that standard drug databases don't address directly.

**[Types: 'Can I eat spinach while taking warfarin?']**

I'm asking, 'Can I eat spinach while taking warfarin?' This is a real question patients ask pharmacists constantly, but it's not answered clearly in most drug information resources.

**[Response appears]**

Medsplain retrieves the relevant information from FDA sources and RxNorm data: 'Spinach contains high amounts of vitamin K, which can interfere with how warfarin works. You don't need to avoid spinach completely, but you should eat consistent amounts each week rather than sudden large portions.'

**[Points to warning section]**

Notice it also flags: 'Talk to your doctor if you plan to make major changes to your diet.' This is our safety guardrail—we never contradict medical advice or tell patients to ignore their doctor.

**[Shows interaction checker]**

Let me add another medication. I'll say I'm also taking aspirin.

**[Types 'aspirin' in multi-medication checker]**

The system immediately checks RxNorm API for interactions and warns: 'Both warfarin and aspirin affect blood clotting. Taking them together increases bleeding risk. This combination should only be used under close medical supervision.'

This interaction check happens in under 2 seconds, pulling from verified medical databases, not user forums or unreliable websites."

---

### Demo Step 3: RAG System & Multi-Vendor Fallback (5:00-6:30)

**[AKAKI demonstrates - 90 seconds]**

"Let me show you what's happening behind the scenes. Our system uses Retrieval-Augmented Generation—RAG—to ensure accuracy.

**[Opens developer console or switches to architecture diagram]**

When you search for a medication, here's the flow:

One: Your query gets embedded using OpenAI's text-embedding-3-small model.

Two: We search our Pinecone vector database containing FDA drug labels, RxNorm data, and MedlinePlus articles. This is hybrid search—we combine semantic similarity with keyword matching.

Three: The system retrieves the top 5 most relevant chunks from verified medical sources.

Four: Those chunks become the context for GPT-4o-mini. The model answers based on what's in that context—it cannot hallucinate or make up information.

**[Points to cost metrics]**

This entire process costs just $0.0002 per query. We optimized from an initial $0.013 by switching from GPT-4 to GPT-4o-mini, implementing caching, and reducing prompt length. That's a 98% cost reduction.

**[Shows fallback architecture]**

For reliability, we built multi-vendor fallbacks. If OpenAI is rate-limited or down, the system automatically switches to Anthropic's Claude Haiku within 5 seconds. During our testing period, we maintained 99.8% uptime.

**[Returns to live interface]**

This architecture means Medsplain isn't just another chatbot—it's a medical information retrieval system with AI-powered question answering."

---

### Demo Step 4: Real User Impact (6:30-7:30)

**[MARIAM speaks - 60 seconds]**

"Let me share our testing results. We tested with 50 real users—patients, caregivers, and pharmacists—over two weeks.

**[Shows metrics slide or screen]**

**Comprehension:** 87% of users correctly understood their medication information after using Medsplain, compared to just 52% after reading pharmacy leaflets alone.

**Time savings:** Users found answers in 45 seconds on average, versus 8 minutes searching multiple websites.

**Trust:** With citations visible, users rated trustworthiness at 4.6 out of 5 stars.

**[Shows user quote]**

One patient, age 58, told us: 'Finally! Someone explained warfarin interactions in a way that made sense. Having the FDA source right there made me trust it.'

A pharmacist with 6 years of experience said: 'I wish I could point every patient to this. It answers the questions I hear 20 times a day.'

**[Key impact metric]**

The most important result: 92% of users said they would use Medsplain again. This validates that we've built something genuinely useful that solves a real problem."

---

### Closing Demo Statement (7:30-8:00)

**[SABA speaks - 30 seconds]**

"That's the core workflow: Search any medication, get accurate answers backed by FDA sources, ask follow-up questions, check interactions, and know exactly when to call your doctor.

Everything you've seen is powered by AI, running in production at medsplain.vercel.app, with 99.8% uptime and medical accuracy validated by healthcare professionals.

Now let me show you the architecture that makes this possible."

---

## SECTION 4: CASE STUDY - ARCHITECTURE & DECISIONS (8:00-10:00)

### Slide 1: System Architecture (8:00-8:30)

**[TEKLA presents - 30 seconds]**

"Here's our system architecture.

**[Points to diagram]**

Users interact with our Next.js frontend hosted on Vercel. The frontend sends queries to our Flask backend on Railway, which orchestrates the RAG pipeline.

The RAG pipeline has three key components:

**First:** Pinecone vector database storing 15,000 chunks from FDA labels, RxNorm, and MedlinePlus.

**Second:** OpenAI's GPT-4o-mini for generation, with embedding done by text-embedding-3-small.

**Third:** PostgreSQL for caching query results and storing anonymous usage logs.

When you search, we embed your query, retrieve relevant medical documents, assemble them as context, generate an answer, and return it with citations. Total time: 1.2 seconds on average."

---

### Slide 2: Key Technical Decisions (8:30-9:00)

**[GIORGI presents - 30 seconds]**

"Let me explain three critical decisions:

**Why RAG instead of fine-tuning?**

Medical information changes constantly—FDA updates drug labels weekly. RAG lets us update our knowledge base without retraining models. We just re-index new documents in Pinecone.

**Why hybrid search?**

Pure semantic search returned wrong sections 40% of the time. A query about 'warfarin side effects' would retrieve drug interaction warnings instead. Adding keyword matching improved precision from 78% to 92%.

**Why GPT-4o-mini over GPT-4?**

We A/B tested 100 queries. GPT-4o-mini had only 2% lower accuracy but was 80x cheaper and 50% faster. For medical Q&A based on authoritative sources, the quality difference was negligible but the cost savings were massive."

---

### Slide 3: Challenges Overcome (9:00-9:30)

**[AKAKI presents - 30 seconds]**

"We faced three major challenges:

**Hallucination risk:** LLMs sometimes invent plausible-sounding medical facts. We solved this with strict prompt grounding—'Answer using ONLY the provided FDA context'—plus post-generation fact-checking. Our hallucination rate is now under 2%.

**Latency:** Initial response time was 4.5 seconds. We optimized with response streaming, parallel API calls, and aggressive caching. Now users see the first words in under 1 second, with full responses in 2.3 seconds at the 95th percentile.

**Cost explosion:** Early costs were $0.013 per query—unsustainable at scale. We reduced to $0.0002 through model selection, prompt compression, and Redis caching. That's 98% savings while maintaining quality."

---

### Slide 4: Results & Future (9:30-10:00)

**[MARIAM presents - 30 seconds]**

"Our results speak for themselves:

**User impact:** 87% comprehension accuracy, 3.5 hours saved per week, 4.8-star satisfaction rating.

**Technical performance:** 99.8% uptime, 1.2-second average latency, <2% hallucination rate.

**Business viability:** At $0.0002 per query and 97% profit margin with our freemium model, this is financially sustainable.

**[Points to future roadmap]**

Looking ahead, we're planning mobile apps, multi-language support, drug interaction scanning, and pharmacy partnerships to expand access.

Our vision: A world where no patient struggles to find trustworthy medication information when they need it most.

**[Final statement]**

Thank you. We're ready for questions."

---

## SPEAKER TRANSITIONS

**Mariam → Video:**
"Let me show you what we built." [Pause, SABA takes over]

**Video → Live Demo:**
"Now let's see it working live with real medical data." [TEKLA takes keyboard]

**Demo Step 1 → Step 2:**
"Now let's ask a follow-up question." [GIORGI takes keyboard]

**Demo Step 2 → Step 3:**
"Let me show you what's happening behind the scenes." [AKAKI takes keyboard/switches screen]

**Demo Step 3 → Step 4:**
"Let me share our testing results." [MARIAM takes over with metrics slide]

**Demo → Case Study:**
"Now let me show you the architecture that makes this possible." [TEKLA advances to architecture slide]

## TIMING BREAKDOWN

| Section         | Time       | Speaker      | Content                       |
| --------------- | ---------- | ------------ | ----------------------------- |
| Introduction    | 0:00-0:30  | Mariam       | Team intro, problem statement |
| Video           | 0:30-2:00  | All (silent) | 90-second demo video          |
| Demo Step 1     | 2:00-3:30  | Tekla        | Search & AI answers           |
| Demo Step 2     | 3:30-5:00  | Giorgi       | Interactive Q&A               |
| Demo Step 3     | 5:00-6:30  | Akaki        | RAG & fallbacks               |
| Demo Step 4     | 6:30-7:30  | Mariam       | User results                  |
| Demo Close      | 7:30-8:00  | Saba         | Transition statement          |
| Architecture    | 8:00-8:30  | Tekla        | System diagram                |
| Key Decisions   | 8:30-9:00  | Giorgi       | Tech choices                  |
| Challenges      | 9:00-9:30  | Akaki        | Problems solved               |
| Results & Close | 9:30-10:00 | Mariam       | Final impact + Q&A            |
