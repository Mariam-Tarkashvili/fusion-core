# Medsplain: AI-Powered Medication Information Translator

## Case Study

**Team:** Fusion Core (Mariam Tarkashvili, Saba Samkharadze, Tekla Chapidze, Giorgi Ksovreli, Akaki Ghachava)  
**Project Duration:** October 2025 - December 2025  
**Deployment:** medsplain.vercel.app

---

## Executive Summary

Over 40% of adults in the United States read below an 8th-grade level, yet medication package inserts and drug information sheets are written at college-level complexity. This literacy gap creates a critical patient safety problem: patients misunderstand dosing instructions, miss important warnings, and experience anxiety about their medications. We built Medsplain, an AI-powered medication translator that converts dense medical jargon into clear, patient-friendly explanations while maintaining medical accuracy.

Our solution uses a Retrieval-Augmented Generation approach combining Google's Gemini Flash with verified medical data from OpenFDA. The system retrieves authoritative drug information and rewrites it for 8th-grade readability. The application demonstrates how AI can bridge the health literacy gap by making critical medication information accessible to all reading levels, with every explanation backed by authoritative medical sources.

The application successfully processes medication queries and generates simplified explanations, deployed as a functional web application accessible at medsplain.vercel.app.

---

## Problem Definition

### The Core Problem

Patients prescribed new medications face a critical information accessibility barrier. Standard drug information materials including FDA-approved package inserts, pharmacy leaflets, and online drug databases are written in dense medical terminology at a college reading level. Terms like "contraindication," "hepatotoxicity," and "pharmacokinetic interactions" create confusion rather than clarity for the average patient.

This problem has measurable consequences. According to health literacy research, medication non-adherence costs the US healthcare system over $100 billion annually, with comprehension gaps being a primary driver. Patients who don't understand their medications are more likely to take incorrect doses, miss important warnings about drug interactions, or stop taking prescribed medications entirely due to anxiety about unknown side effects.

### Target Users

Our primary target user is an adult patient with average health literacy who has been prescribed a new medication. This represents millions of adults managing chronic conditions who struggle with medical terminology in standard drug information materials.

Secondary users include family caregivers managing medications for elderly relatives, and anyone seeking to understand medication information in plain language.

### Existing Solutions Fall Short

Current alternatives include:

1. **MedlinePlus (NIH)**: Provides accurate information but often maintains clinical terminology. Articles are comprehensive but overwhelming, and finding specific answers requires navigating lengthy documents.

2. **Drugs.com and WebMD**: Offer searchable drug databases but present information in standardized templates that don't adapt to individual questions. The reading level remains too high for many users.

3. **Pharmacy counseling**: Provides personalized guidance but is time-constrained. Pharmacists have limited time per patient for thorough explanation.

4. **Patient forums (Reddit, health communities)**: Offer relatable language but lack medical accuracy and authority. Users risk encountering dangerous misinformation mixed with helpful anecdotes.

None of these solutions combine authoritative medical information with adaptive, plain-language explanations tailored to specific patient questions.

### Project Goals

Our goal was to create a proof-of-concept application that demonstrates how AI can translate complex medication information into accessible language while maintaining accuracy and showing authoritative sources. This capstone project aimed to explore the technical feasibility and architectural challenges of building such a system.

---

## Architecture & Tech Stack

### System Architecture

```
┌─────────────────────────────────────────┐
│        FRONTEND (React + MobX)          │
│  - User queries via search interface    │
│  - Displays simplified explanations     │
│  - Shows citations and sources          │
│  Deployment: Vercel                     │
└─────────────────┬───────────────────────┘
                  │ HTTPS / REST API
                  ▼
┌─────────────────────────────────────────┐
│         BACKEND (Flask)                 │
│  - Query processing & validation        │
│  - RAG pipeline orchestration           │
│  - Response formatting                  │
└─────────────────┬───────────────────────┘
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
┌─────────┐  ┌─────────┐  ┌──────────────┐
│ OpenFDA │  │ Google  │  │   In-Memory  │
│   API   │  │ Gemini  │  │    Cache     │
│Drug Data│  │  Flash  │  │              │
└─────────┘  └─────────┘  └──────────────┘

RAG Pipeline Flow:
1. User submits medication query
2. Backend fetches drug data from OpenFDA API
3. Context assembled from FDA drug labels
4. Gemini Flash generates simplified explanation
5. Response returned with citations
6. Frontend displays explanation and sources
```

### Frontend

**Technology:** React 18 with MobX for state management

**Key Libraries:**

- React Router for navigation
- MobX for reactive state management
- Axios for API calls
- CSS modules for styling

**Deployment:** Vercel

**Why React + MobX:**
React provides a robust component architecture for building interactive UIs, while MobX offers simpler, more intuitive state management compared to Redux for our use case. The team had prior experience with React, making it a natural choice for rapid development within the capstone timeline.

### Backend

**Technology:** Flask (Python 3.11)

**Key Dependencies:**

- Flask-CORS for cross-origin requests
- Requests library for OpenFDA API calls
- Google Generative AI SDK for Gemini integration

**Why Flask:**
Flask's simplicity and the team's familiarity with Python made it ideal for this proof-of-concept. The lightweight framework allowed us to focus on the core RAG pipeline logic rather than framework complexity. Flask's synchronous model was sufficient for our use case since the primary bottleneck is the AI API call latency.

### AI Layer: RAG System

**AI Provider:** Google Gemini Flash (gemini-1.5-flash)

- Cost: Free tier with generous quotas
- Average latency: ~2 seconds
- Context window: 1M tokens
- Temperature: 0.3 for consistency

**Why Gemini Flash:**
After initial experiments, we chose Gemini Flash for several reasons:

1. **Cost**: Free tier allows unlimited development and testing
2. **Performance**: Fast response times suitable for real-time queries
3. **Context window**: Large enough to handle complete FDA drug labels
4. **Quality**: Produces coherent, readable explanations at 8th-grade level

**RAG Architecture:**

The system uses a simple but effective RAG approach:

1. **Query Processing**: User enters medication name and specific question
2. **Retrieval**: Backend fetches relevant FDA drug label data via OpenFDA API
3. **Context Assembly**: Extract relevant sections (indications, dosing, warnings, side effects)
4. **Generation**: Gemini Flash rewrites information in plain language
5. **Response**: Return simplified explanation with source citations

**Prompt Engineering:**

System prompt guides the model to:

- Use 8th-grade reading level
- Explain medical terms when necessary
- Organize information clearly
- Always cite specific source sections
- Never make claims beyond provided context

### Knowledge Source

**Primary Source:** OpenFDA API

- FDA-approved drug labels (Structured Product Labels)
- Official, authoritative medication information
- Includes indications, dosing, warnings, contraindications, side effects
- Updated regularly by FDA
- Public API, no authentication required

**Data Flow:**

1. User queries medication (e.g., "What is lisinopril used for?")
2. Backend queries OpenFDA for drug label: `/drug/label.json?search=openfda.brand_name:{drug_name}`
3. Extract relevant sections from returned JSON
4. Pass context to Gemini Flash for simplification
5. Return plain-language explanation with FDA label citation

### Infrastructure

**Frontend Hosting:** Vercel

- Automatic deployments from Git
- Global CDN for fast load times
- Environment variable management
- HTTPS by default

**Backend Hosting:** Vercel Serverless Functions (initially) / Cloud provider (production)

- Serverless deployment model
- Automatic scaling
- Environment variable management

**No Database:**
For this proof-of-concept, we opted not to implement persistent storage. All queries are processed in real-time without logging user data. This simplified development and avoided privacy concerns during the capstone project.

### Security

- HTTPS enforced across all endpoints
- Input sanitization to prevent injection attacks
- API rate limiting (when implemented)
- No storage of user queries or personal information
- Environment variables for API keys

---

## AI Implementation

### Prompt Engineering

We developed a focused prompting strategy optimized for medical accuracy and readability:

**System Prompt (Context Setting):**

```
You are Medsplain, a medical information assistant that translates complex
medication information into clear, simple language for patients.

Guidelines:
- Write at an 8th-grade reading level
- Use everyday language and avoid medical jargon
- When medical terms must be used, explain them simply
- Organize information in short paragraphs (2-3 sentences each)
- Always cite the specific FDA source section
- Only use information from the provided FDA drug label
- If information is not in the provided context, say so explicitly
- Never make medical recommendations or diagnose conditions

Tone: Clear, helpful, informative, trustworthy
```

### Model Selection

**Single Model Approach:**

- Model: Gemini Flash (gemini-1.5-flash)
- Max tokens: 1000 (sufficient for focused explanations)
- Temperature: 0.3 (balanced between consistency and natural language)
- Cost: Free tier (no cost during development)

**Why Single Model:**
Unlike production systems that might use multiple models for different complexity levels, we used Gemini Flash exclusively. This simplified our architecture and was sufficient for our proof-of-concept goals. The model handled both simple and complex queries adequately without requiring a tiered approach.

### RAG Implementation Details

**Retrieval Pipeline:**

1. Normalize medication name (handle brand vs generic names)
2. Query OpenFDA API: `/drug/label.json?search=openfda.brand_name:{drug} OR openfda.generic_name:{drug}`
3. Parse JSON response to extract relevant sections:
   - Indications and Usage
   - Dosage and Administration
   - Warnings and Precautions
   - Adverse Reactions (Side Effects)
   - Drug Interactions
4. Assemble context with section labels
5. Pass to Gemini Flash with structured prompt

**Response Generation:**

1. Gemini generates simplified explanation
2. Backend validates response format
3. Extract citations and source references
4. Return JSON response to frontend

**Optimization Techniques:**

- **Caching**: In-memory cache for repeated medication queries (reduces API calls)
- **Selective retrieval**: Only fetch relevant FDA label sections based on query type
- **Error handling**: Graceful fallbacks when FDA data unavailable

### Evaluation Approach

**Manual Testing:**

As a student capstone project, we conducted manual testing rather than formal user studies:

- Team members tested with various medication queries
- Verified factual accuracy against FDA source documents
- Assessed readability subjectively
- Tested edge cases (misspellings, rare medications, ambiguous queries)

**Technical Validation:**

- Confirmed responses use only provided FDA context
- Verified citations link to correct source sections
- Tested error handling for drugs not in FDA database
- Measured average response time

**Limitations:**

We acknowledge that without formal user testing, we cannot make validated claims about:

- Actual comprehension rates among target users
- Time savings compared to existing resources
- User satisfaction or trust metrics
- Real-world effectiveness for health literacy improvement

These would require formal user studies with IRB approval and proper methodology, which were beyond the scope of this capstone project.

---

## Cost Optimization

### Cost Analysis

**Development Costs:**

For the development phase of this capstone project:

- **Gemini Flash**: Free tier (unlimited during development)
- **OpenFDA API**: Free (public API, no limits)
- **Vercel Hosting**: Free tier (sufficient for low-traffic demo)
- **Total Development Cost**: $0

**Projected Production Costs:**

If deployed at scale, estimated costs would be:

- **Gemini Flash**: Free tier covers ~1M tokens/month, then $0.075/$0.30 per 1M tokens (input/output)
- **Hosting**: Vercel Pro at $20/month or other cloud provider
- **Estimated cost per query**: ~$0.0001-0.0003 (primarily AI API calls)

**At Scale:**

- 10K queries/month: ~$2-3 + hosting (~$25/month total)
- 100K queries/month: ~$20-30 + hosting (~$50/month total)

The economics are favorable because:

1. Gemini Flash is extremely cost-efficient
2. OpenFDA is free
3. No database costs (stateless design)
4. Serverless hosting scales automatically

### Cost-Conscious Decisions

**Why Gemini Flash over GPT-4:**

We chose Gemini Flash primarily for cost and performance:

- Free during development (crucial for student project)
- Sufficient quality for our use case
- Fast response times
- Large context window for complete FDA labels

**Stateless Architecture:**

By not implementing a database, we:

- Eliminated database hosting costs
- Avoided data privacy concerns
- Simplified architecture
- Reduced maintenance overhead

This was appropriate for a proof-of-concept but would need reconsideration for a production system that wants to learn from user patterns.

---

## Challenges & Solutions

### Challenge 1: OpenFDA API Integration

**The Problem:**
The OpenFDA API returns complex nested JSON structures with inconsistent field availability. Some drugs have complete labels while others have partial data. Drug names have both brand and generic versions, making search challenging.

**Why It Happened:**
We underestimated the variability in FDA drug label data. The API's flexibility means data structure differs significantly between medications.

**Our Solution:**

1. Built robust JSON parsing with null-safe field access
2. Implemented brand/generic name search fallback
3. Added validation to check if required sections exist before processing
4. Created error messages for cases where FDA data is insufficient

```python
def fetch_fda_data(drug_name):
    # Try brand name first
    response = search_fda(f"openfda.brand_name:{drug_name}")

    if not response.get('results'):
        # Fallback to generic name
        response = search_fda(f"openfda.generic_name:{drug_name}")

    if not response.get('results'):
        return None

    # Extract sections with safe defaults
    label = response['results'][0]
    return {
        'indications': label.get('indications_and_usage', ['Not available'])[0],
        'dosage': label.get('dosage_and_administration', ['Not available'])[0],
        'warnings': label.get('warnings_and_cautions', ['Not available'])[0],
        # ... more sections
    }
```

**Results:**

- Successfully handle 90%+ of common medications
- Graceful error messages for unavailable drugs
- Clear user feedback when data is incomplete

---

### Challenge 2: Prompt Engineering for Medical Accuracy

**The Problem:**
Initial prompts produced explanations that were either too technical (still using medical jargon) or too simplified (missing critical safety information). Finding the balance between accessibility and completeness was difficult.

**Why It Happened:**
Medical information has inherent complexity. Some terms (like "contraindication") don't have simple everyday equivalents, yet they're critical for safety. Generic instructions to "simplify" weren't sufficient.

**Our Solution:**

1. Added explicit examples of good simplifications in the system prompt
2. Instructed model to explain technical terms when they must be used
3. Required specific structure (What it does, How to take it, Side effects, Warnings)
4. Added constraint to never omit safety information even when simplifying
5. Iterated on prompt through testing different medications

**Example Improvements:**

Before: "Amlodipine is indicated for the treatment of hypertension."

After: "Amlodipine is a blood pressure medication. Doctors prescribe it to lower high blood pressure (hypertension), which helps prevent strokes, heart attacks, and kidney problems."

**Results:**

- More consistent output quality
- Better balance of simplicity and completeness
- Preserved critical safety information

---

### Challenge 3: Frontend State Management

**The Problem:**
Managing loading states, error states, and medication data across components became complex as features were added. Initial prop-drilling approach became unwieldy.

**Why It Happened:**
Started with simple component-local state, but as the app grew, needed centralized state management for API calls, cached results, and user interactions.

**Our Solution:**

1. Implemented MobX for reactive state management
2. Created stores for:
   - Medication queries and results
   - Loading and error states
   - Query history
3. Simplified component logic by moving state to stores

```javascript
// MobX store structure
class MedicationStore {
  @observable currentMedication = null;
  @observable loading = false;
  @observable error = null;
  @observable queryHistory = [];

  @action
  async fetchExplanation(drugName, question) {
    this.loading = true;
    try {
      const response = await api.explain(drugName, question);
      this.currentMedication = response;
      this.queryHistory.push({ drugName, question, timestamp: Date.now() });
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
```

**Results:**

- Cleaner component code
- Easier to manage async operations
- Better separation of concerns

---

### Challenge 4: Handling Edge Cases

**The Problem:**
Users could enter misspelled drug names, non-existent medications, or questions that couldn't be answered from FDA labels. Initial version crashed or hung on these inputs.

**Why It Happened:**
We focused on the happy path during initial development and didn't anticipate the variety of real-world inputs.

**Our Solution:**

1. Input validation and sanitization on frontend
2. Fuzzy matching for misspellings (simple edit distance)
3. Clear error messages for different failure modes:
   - Drug not found: "We couldn't find information for '{drug}'. Please check the spelling."
   - No FDA data: "This medication doesn't have FDA label information available."
   - API error: "Service temporarily unavailable. Please try again."
4. Graceful degradation instead of crashes

**Results:**

- More robust user experience
- Helpful error messages instead of blank screens
- System remains functional even when individual queries fail

---

### Challenge 5: Response Time Optimization

**The Problem:**
Initial implementation had 5-7 second response times, which felt slow for a web application. Users might assume the system was broken or unresponsive.

**Why It Happened:**
Sequential API calls (OpenFDA → Gemini) without optimization. Also, we were fetching more FDA data than necessary.

**Our Solution:**

1. Implemented loading indicators with progress messages
2. Optimized FDA data retrieval to fetch only needed sections
3. Added simple in-memory caching for repeated medication queries
4. Reduced Gemini max_tokens from 2000 to 1000 (faster generation)

**Results:**

- Response time reduced to 2-3 seconds
- Better perceived performance with loading states
- Cache hits save ~1.5 seconds on repeated queries

---

## Results & Outcomes

### Technical Achievements

**Functional Application:**

- Successfully deployed web application at medsplain.vercel.app
- Processes medication queries and returns simplified explanations
- Integrates OpenFDA API and Gemini Flash API
- Responsive frontend with clear user interface

**System Performance:**

- Average response time: 2-3 seconds
- Successfully handles common medications (tested with 50+ drug names)
- Graceful error handling for edge cases
- Stable deployment on Vercel

**Technical Learning:**

- Practical experience building RAG systems
- Understanding of medical data APIs and their limitations
- Prompt engineering for domain-specific applications
- Full-stack development with modern frameworks

### Demonstrated Capabilities

**What Works:**

- Retrieving authoritative FDA drug information
- Generating plain-language explanations
- Providing source citations
- Handling basic error cases
- Responsive web interface

**Example Queries Successfully Handled:**

- "What is lisinopril used for?"
- "What are the side effects of metformin?"
- "How should I take amlodipine?"
- "Can I drink alcohol with ibuprofen?"

### Project Limitations

As an academic capstone project, we acknowledge several limitations:

**No User Testing:**

- We did not conduct formal user studies
- No validated metrics on comprehension improvement
- No data on actual time savings
- Cannot make claims about user satisfaction without testing

**Technical Limitations:**

- No persistent storage or user accounts
- Limited to medications in FDA database
- Cannot handle complex multi-drug interaction queries
- No personalization based on user medical history
- Simplified RAG pipeline without advanced retrieval techniques

**Scope Constraints:**

- Built as proof-of-concept, not production system
- No regulatory compliance review (HIPAA, medical device regulations)
- No validation by medical professionals
- Limited testing across diverse medication types

### Learning Outcomes

**Technical Skills:**

- RAG architecture design and implementation
- Working with medical/healthcare APIs
- AI prompt engineering for specialized domains
- Full-stack web development
- Deployment and DevOps basics

**Domain Knowledge:**

- Healthcare data standards and FDA resources
- Medical information hierarchy and structure
- Health literacy challenges and considerations
- Regulatory considerations for health tech

**Project Management:**

- Scoping a realistic capstone project
- Iterative development and testing
- Team collaboration on technical project
- Balancing ambition with time constraints

---

## Future Directions

### Technical Improvements

**Short-term Enhancements:**

1. **Enhanced Retrieval:**

   - Implement vector embeddings for semantic search
   - Add RxNorm for drug name normalization
   - Include MedlinePlus as supplementary source

2. **Better Caching:**

   - Persistent cache (Redis) for common queries
   - Cache invalidation strategy
   - Pre-computed explanations for top medications

3. **Response Quality:**

   - Readability scoring (Flesch-Kincaid)
   - A/B testing different prompt variations
   - Hallucination detection mechanisms

4. **User Experience:**
   - Query history and bookmarking
   - Print/export functionality
   - Mobile app version

### Potential Features

**If Continued Beyond Capstone:**

1. **Drug Interaction Checker:**

   - Multi-drug query support
   - Interaction warnings and explanations

2. **Personalization:**

   - User profiles with conditions/allergies
   - Tailored explanations based on user context

3. **Multi-language Support:**

   - Spanish, French, Mandarin translations
   - Culturally adapted explanations

4. **Integration Options:**
   - API for other health apps
   - Browser extension
   - EHR system plugins

### Research Questions

**Areas for Further Exploration:**

1. Does simplified AI-generated medication information actually improve patient comprehension compared to standard materials?

2. What reading level and explanation style is most effective for different patient populations?

3. Can AI systems reliably identify when medical information should NOT be simplified (e.g., critical safety warnings)?

4. How do users evaluate trust and credibility of AI-generated medical information vs. traditional sources?

These questions would require formal research methodology, IRB approval, and collaboration with medical professionals.

---

## Lessons Learned

### What Worked Well

**1. Simple Architecture**
Starting with a straightforward RAG pipeline (retrieve → generate → return) allowed us to build a working system quickly. Avoiding over-engineering was key to completing the project on time.

**2. Using Free Tier Services**
Choosing Gemini Flash and OpenFDA (both free) eliminated cost concerns during development and let us experiment freely without budget anxiety.

**3. Iterative Prompt Engineering**
Testing prompts with real medications and refining based on output quality was more valuable than trying to design the perfect prompt upfront.

**4. Clear Scope Definition**
Defining this as a proof-of-concept rather than a production system helped us focus on core functionality and avoid feature creep.

### What We'd Change

**1. Start with OpenFDA Documentation**
We spent significant time figuring out the API structure through trial and error. Reading the complete API documentation first would have saved time.

**2. Implement Basic Analytics Earlier**
Adding simple logging (query types, success rates, error patterns) earlier would have helped us prioritize improvements better.

**3. More Structured Testing**
Creating a test set of medications and queries at the beginning would have made iteration more systematic.

**4. Consider Edge Cases Sooner**
Waiting until later to handle misspellings, missing data, and errors meant retrofitting error handling into existing code.

### Key Takeaways

**For AI Applications:**

- Start with the simplest RAG pipeline that could work, then optimize
- Prompt engineering requires iteration; expect to refine many times
- Medical/healthcare domains require extra attention to accuracy and citations
- Free AI APIs are viable for student projects and proof-of-concepts

**For Full-Stack Development:**

- State management becomes important earlier than you think
- Loading states and error handling are as important as happy path
- Deployment constraints (serverless timeouts, etc.) should inform architecture
- Free tiers of cloud services are surprisingly capable for demos

**For Capstone Projects:**

- Scope conservatively; a working simple system beats an ambitious broken one
- Document decisions and challenges as you go
- Be honest about limitations; this shows maturity
- Technical learning is the primary goal, not creating a startup

### Advice for Future Teams

**If Building a Similar Project:**

1. **Choose your AI provider wisely**: Consider both cost and quality. Free tiers are great but understand their limits.

2. **Use real data early**: Test with actual FDA data, not mock data. You'll discover issues faster.

3. **Prioritize the core loop**: Get the basic query → response flow working before adding features.

4. **Plan for errors**: Medical data is messy. Build error handling from the start.

5. **Document as you go**: Write down challenges and solutions when they're fresh.

**For Healthcare/Medical AI Projects:**

1. Be explicit about what your system can and cannot do
2. Always cite sources; transparency builds trust
3. Never make medical recommendations or diagnoses
4. Understand that production medical apps require regulatory compliance
5. Test with diverse medications, not just common ones

---

## Conclusion

Medsplain demonstrates the technical feasibility of using AI to translate complex medication information into accessible language. As a capstone project, we successfully:

- Built a functional web application integrating modern AI and medical data APIs
- Implemented a RAG pipeline that retrieves authoritative sources and generates simplified explanations
- Deployed a working system accessible to anyone at medsplain.vercel.app
- Gained practical experience with full-stack development, AI integration, and healthcare data

While we did not conduct formal user testing and therefore cannot make validated claims about real-world effectiveness, the project demonstrates that AI can process FDA drug labels and produce readable explanations. This proof-of-concept shows promise for the broader goal of improving health literacy.

The technical challenges we encountered—API integration complexity, prompt engineering for medical accuracy, handling edge cases, and optimizing performance—are common to real-world AI applications. Working through these challenges provided valuable learning experiences applicable beyond this specific project.

For this approach to move from proof-of-concept to actual patient use would require:

- Formal user studies with diverse populations
- Validation by medical professionals
- Regulatory compliance review
- Robust testing and quality assurance
- Continuous monitoring and improvement

As a student capstone project, Medsplain achieved its goal of exploring how AI can make medical information more accessible while learning practical skills in AI engineering, full-stack development, and healthcare technology.

---

## Technical Specifications Summary

### System Requirements

**Frontend:**

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Internet connection required

**Backend Infrastructure:**

- Python 3.11+
- Flask 2.3+

### API Dependencies

**Required Services:**

- Google Gemini API (gemini-1.5-flash)
- OpenFDA API (public, no authentication)

### Performance Benchmarks

**Typical Performance:**

- Average response time: 2-3 seconds
- OpenFDA API call: ~500ms
- Gemini generation: ~1500ms
- Network overhead: ~500ms

## Acknowledgments

We thank:

- Professor Zeshan Ahmad for guidance throughout the capstone project
- Google for providing Gemini API access
- FDA for maintaining OpenFDA as a public resource
- Anthropic for Claude assistance during development

---

**Project Completion:** December 26, 2025  
**Total Development Time:** 12 weeks  
**Live Demo:** medsplain.vercel.app
