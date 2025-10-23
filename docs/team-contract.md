**Course:** Building AI-Powered Applications  
**Team Name:** Fusion Core **Project:** Medsplain **Date:** October 23, 2025

---

## Team Members

|Name|Email|GitHub Username|
|---|---|---|
|Mariam Tarkashvili|tarkashvili.mariam@kiu.edu.ge|Mariam-Tarkashvili|
|Giorgi Ksovreli|ksovreli.giorgi@kiu.edu.ge|giorgi-ksovreli|
|Saba Samkharadze|samkharadze.saba@kiu.edu.ge|ssmass909|
|Tekla Chaphidze|chaphidze.tekla@kiu.edu.ge|TeklaChaphidze|

---

## Team Mission & Goals

**Our Mission:**  
To build an AI-powered medication explanation tool that bridges the gap between complex medical information and patient comprehension, improving health literacy and medication adherence through plain-language, personalized explanations.

**Our Goals for This Semester:**

We will explore and iteratively develop features and artifacts that demonstrate understanding of AI-powered application design, while remaining flexible about scope and outcomes. The emphasis will be on learning, experimentation, and incremental progress rather than strict, narrowly-defined deliverables.

1. Continue exploring ideas and refining approaches as the project evolves
2. Build and iterate on components that help demonstrate core AI concepts in the project
3. Share progress and learnings regularly, adjusting plans based on feedback and discoveries
4. Ship a working MVP of Medsplain by Week 15 with core features: medication explanations, Q&A, and safety guardrails
5. Conduct user testing with at least 20 participants to validate comprehension improvement and user confidence metrics

---

## Roles & Responsibilities

### Primary Roles

**Tekla Chaphidze - AI/ML Lead & Safety Engineer**

- Responsibilities:
    - Design and optimize prompts for medication explanations with appropriate reading level and medical accuracy
    - Implement safety guardrails including prompt injection defense and content filtering
    - Build evaluation framework for comprehension testing and quality metrics
    - Conduct red-team testing to identify failure modes
- Accountable for: AI output quality, safety compliance, and evaluation methodology

**Saba Samkharadze - Frontend Lead & UX Researcher**

- Responsibilities:
    - Design and implement responsive web interface (Next.js) optimized for mobile and accessibility
    - Build chat UI with streaming responses and conversation history
    - Conduct user research including interviews, testing sessions, and feedback collection
    - Ensure interface meets accessibility standards for older adults
- Accountable for: User experience, frontend architecture, and user research insights

**Giorgi Ksovreli - Backend Lead & DevOps**

- Responsibilities:
    - Build FastAPI backend with core endpoints (/explain, /ask, /interact)
    - Integrate OpenFDA and RxNorm APIs with error handling and retry logic
    - Implement monitoring, logging, and telemetry systems
    - Manage deployment pipeline and database setup
- Accountable for: Backend reliability, API integration accuracy, and production monitoring

**Mariam Tarkashvili - Data Engineer & Cost Optimizer**

- Responsibilities:
    - Design and implement PostgreSQL database schema and caching layer
    - Build RAG pipeline for structured medical data retrieval and context building
    - Monitor and optimize API costs through caching strategies and token management
    - Implement telemetry for cost tracking and performance metrics
- Accountable for: Data architecture, cost efficiency, and RAG implementation quality

### Shared Responsibilities

All team members are equally responsible for:

- Attending weekly team meetings on Monday/Wednesday at 20:00
- Completing assigned tasks on time and communicating blockers early
- Code reviews and testing (each PR requires at least one approval)
- Documentation updates (README, API docs, inline comments)
- Contributing to team decisions and sprint planning
- User testing participation (helping recruit and facilitate sessions)

---

## Communication Plan

### Primary Communication Channel

**Platform:** Discord (primary) / WhatsApp (backup for urgent) **Expected Response Time:** Up to 30 minutes during work hours (9:00-22:00), within 24 hours otherwise

### Meetings

**Regular Team Meetings:**

- **Frequency:** Twice every week
- **Days/Times:** Monday 20:00 and Wednesday 20:00
- **Duration:** 1 hour (30 min standup + 30 min planning/problem-solving)
- **Location/Platform:** Google Meet: https://meet.google.com/ftu-ppwb-dyi

**Meeting Norms:**

- Everyone comes prepared with updates (what I did, what I'm doing, blockers)
- Tasks are divided relatively evenly during meetings based on capacity and learning goals
- Rotate meeting facilitator each week to share leadership
- First 10 minutes: async updates, last 50 minutes: planning and technical discussion

**If Someone Can't Attend:**

- Notify team at least 24 hours in advance or whenever possible
- They receive short written update from the meeting and are assigned tasks async
- Review meeting notes in shared doc and acknowledge within 12 hours

---

## Work Process & Tools

### Development Workflow

**Version Control:**

- Platform: GitHub (private repo: fusioncore/medsplain)
- Branch Strategy: main (protected) + dev (integration) + feature branches (feature/[name])
- Commit Message Format: "[type]: [description]" where type = feature, bugfix, docs, refactor, test
    - Example: "feature: added medication search autocomplete"
    - Example: "bugfix: fixed streaming response timeout"

**Pull Request Process:**

- All changes go through PRs (no direct commits to main or dev)
- Require at least 1 approval before merging
- Include description of changes and testing done
- Link related Trello card or GitHub issue

**Task Management:**

- Platform: Trello board (with columns: Backlog, To Do, In Progress, Review, Done)
- Task Assignment: Self-assignment during meetings based on capacity
- Status Updates: Updated daily in Trello, discussed in weekly meetings
- Weekly rotating responsibility: One person creates progress report each week

### Contribution Tracking

We will track contributions through:

- GitHub commit history and PR contributions (quantitative measure)
- Task completion in Trello (progress tracking)
- Weekly progress reports with rotating responsibility
- Peer evaluation forms at mid-term (Week 8) and final (Week 15)

**Expected Contribution:**  
Each team member should contribute 25-30 hours per week (~7 hours per person) across development, meetings, and research. Contributions should be relatively balanced but may vary by sprint based on task complexity.

---

## Decision-Making Process

### Routine Decisions

- Method: Assigned owner decides (person doing the work has final say)
- Examples: Code implementation details, UI color choices, variable names
- Timeline: Decided within 24 hours
- Documentation: Brief note in PR or Trello card

### Major Decisions

- Method: Consensus required (all members discuss and agree)
- Examples: Tech stack changes, feature scope cuts, major architecture changes
- Timeline: Discussed in team meeting, decided within 1 week max
- Documentation: Record decision and rationale in decisions.md file in repo

### If We Can't Agree:

1. Take 24-hour break to research both viewpoints
2. Present pros/cons of each option with data/examples
3. If still deadlocked, consult instructor for guidance
4. If urgent and instructor unavailable, majority vote (3/4) decides
5. Document dissenting opinion and revisit after 2 weeks if concerns persist

---

## Conflict Resolution

### Step 1: Direct Communication

- Address issues directly with the person(s) involved within 48 hours
- Use "I feel [emotion] when [specific behavior] because [impact]" statements
- Focus on the problem and impact, not the person's character
- Meet 1-on-1 via call or in person (not async text)
- Timeline: Within 48 hours of issue arising

### Step 2: Team Discussion

- Bring it to the full team in a scheduled meeting
- Everyone gets a chance to speak without interruption
- Focus on finding a solution, not assigning blame
- Document the agreed resolution in team-notes.md
- Set concrete action items and check-in date

### Step 3: Instructor Mediation

- Contact the instructor via email (CC all team members)
- Provide brief summary of the issue and steps already taken
- Instructor will schedule a mediation session within 1 week
- Come prepared with desired outcomes and proposed solutions

### Common Issues & Agreed Solutions

**If someone misses a deadline:**

- To prevent: Team checks in 48 hours before deadline for status updates
- If missed: Discuss what happened without judgment, adjust timeline or reassign work
- Pattern of missed deadlines (3+): Formal check-in and workload redistribution

**If someone isn't responding to communications:**

- Try multiple channels: Discord → WhatsApp → phone call
- If no response within 24 hours, attempt to locate person through friends/classmates
- If unreachable >48 hours, contact instructor and redistribute urgent work

**If workload feels unequal:**

- Communicate directly using factual data: "I've completed 5 tasks totaling 20 hours while the average is 12 hours"
- Review GitHub commits, Trello cards, and meeting notes to verify
- Adjust assignments in next sprint to rebalance

**If technical disagreement arises:**

- Prototype both approaches quickly (time-box to 2 hours each)
- Test with real data or users if possible
- Consult someone more experienced (TA, instructor, or external developer)
- Make decision within 1 week to avoid blocking progress

---

## Quality Standards

### Code Quality

- Follows language style guides: PEP 8 for Python, Airbnb/Standard for JavaScript
- Includes comments only when code intent is non-obvious (prefer self-documenting code)
- Passes linting checks (ESLint, Black/Ruff)
- Line width ≤ 120 characters
- Functions should be < 50 lines (split if longer)
- Meaningful variable names (no single letters except loop indices)

### Testing Requirements

- Unit tests for critical backend logic (target: 70% coverage)
- Integration tests for API endpoints
- Manual testing checklist completed before PR approval
- Edge cases documented and tested

### Documentation Quality

- README is always up-to-date with setup instructions and architecture overview
- API endpoints are documented with request/response examples
- Complex algorithms include explanation comments
- User-facing features have help text or tooltips

### UX/Product Quality

- Error messages are clear, actionable, and non-technical (e.g., "We couldn't find that medication. Please check spelling and try again.")
- Loading states and feedback are implemented (spinners, skeleton screens)
- Accessibility basics covered: keyboard navigation, ARIA labels, color contrast (WCAG AA)
- Mobile-responsive (test on at least 2 screen sizes: 375px and 768px)
- Disclaimer visible on every page

---

## Accountability & Expectations

### What We Expect from Each Other

**Reliability:**

- Complete assigned tasks by agreed deadlines
- If you'll be late, communicate early (at least 24 hours notice)
- Show up to meetings on time and prepared with updates
- Follow through on commitments made to the team

**Quality:**

- Submit work that you're proud of and would put in your portfolio
- Test your code thoroughly before pushing (both happy path and edge cases)
- Proofread documentation and check for broken links
- Ask for code review when uncertain about approach

**Communication:**

- Respond to messages within agreed timeframe (30 min to 24 hours)
- Ask for help when stuck >2 hours (don't wait until it's too late)
- Give constructive feedback respectfully using "I notice... I wonder... What if...?" format
- Share blockers proactively in daily updates

**Collaboration:**

- Be open to feedback and willing to iterate (no ego about code)
- Support teammates when they're struggling (pair programming, debugging help)
- Celebrate wins together (shout-outs in Discord for good work)
- Assume good intent when conflicts arise

### Consequences for Not Meeting Expectations

**First Instance:**

- Team discussion to understand what happened (maybe there's a valid reason)
- Agree on a concrete plan to prevent recurrence
- Offer support if struggling with workload or technical challenges

**Second Instance:**

- Formal check-in meeting with all team members (30 minutes dedicated)
- Possible workload adjustment or role change to better fit capacity
- Documented in peer evaluation with specific examples
- Set clear expectations and check-in schedule (e.g., daily updates for 1 week)

**Third Instance (Pattern):**

- Escalate to instructor with documentation of previous attempts to resolve
- May result in individual grading or removal from project contributions
- Redistribute work to maintain project timeline

---

## Success Metrics

We will consider this project successful if:

**Team Health:**

- All team members feel heard and respected (measured via anonymous mid-term survey)
- Conflicts are resolved constructively without lingering resentment
- Workload is distributed fairly (±20% variance in hours contributed)
- We enjoy working together and would collaborate again

**Project Outcomes:**

- We ship a working MVP by Week 15 with core features: medication explanation, Q&A, safety guardrails
- We meet all major milestone deadlines (Week 3 setup, Week 7 user testing, Week 11 feature complete)
- Our code is maintainable and documented (new developer can set up in <30 minutes)
- Users find our product valuable (70%+ comprehension improvement, 3.8/5 confidence rating)
- We conduct user testing with 20+ participants and incorporate feedback

**Learning Goals:**

- Everyone learns new technical skills aligned with their role (documented in final reflection)
- We all contribute meaningfully (no one feels like a passenger)
- We can articulate our technical decisions and trade-offs (ready for demo day)
- We're proud to show this in our portfolios and GitHub profiles
- We achieve >80% accuracy on medication information with pharmacist validation

---

## Amendments

This contract can be amended with:

- Unanimous agreement of all team members
- Documentation of what changed, why, and when
- Updated version committed to repo with new date in filename

**Amendment History:**

- October 10, 2025: Initial contract created and signed
- October 16, 2025: Tekla signed
- October 23, 2025: Giorgi signed
- October 23, Changed sign date formatting from MM/DD/YY to DD/MM/YY

---

## Intellectual Property & Commercial Distribution

All original work produced for this project (including but not limited to source code, documentation, designs, datasets, models, and other deliverables) is the joint intellectual property of the team members listed in this contract unless otherwise agreed in writing. This project may not be commercially distributed, sold, licensed, or used for commercial purposes in whole or in part without the explicit, written consent of all team members.

Any proposal to commercialize, publish for profit, or transfer ownership of the project or its components must be discussed with the full team and requires unanimous written agreement from all team members. If a third-party opportunity arises (e.g., a company approaches the team with a commercial offer), the contacted team member must notify the team immediately and the team will follow the Decision-Making Process described above to determine next steps.

This clause does not prevent the team from publicly sharing non-commercial work (e.g., academic publications, demos, or portfolio excerpts) provided such sharing does not enable commercial redistribution or violate any third-party licenses used in the project.

## Digital Signatures

By signing below, we agree to the terms outlined in this Team Contract and commit to upholding these standards throughout the semester.

- Mariam Tarkashvili agreed on 10/10/2025
- Saba Samkharadze agreed on 10/10/2025
- Tekla Chaphidze agreed on 16/10/2025
- Giorgi Ksovreli agreed on 23/10/2025

---

**Next Review Date:** Week 8 (Mid-term peer evaluation)