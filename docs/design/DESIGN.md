# DESIGN.md

## 1. Product Identity

This product is not a generic Q&A application.  
Its purpose is to turn internal questions, answers, and direct knowledge posts into reusable formal knowledge that can be searched, reviewed, referenced, and updated over time.

The overall UI must feel like an **internal knowledge infrastructure**, not a community or social platform.

---

## 2. Core Design Principles

### 2.1 Knowledge-first
- Knowledge is the primary object, not Q&A
- The main post-login destination is the Knowledge List
- The first value users should feel is knowledge discovery, not question posting

### 2.2 Q&A is an input, not the destination
- Questions and answers are entry points into knowledge formalization
- Q&A is important, but its visual and structural priority is lower than Knowledge
- The UI should clearly support turning resolved discussions into formal knowledge assets

### 2.3 State-driven UI
- State is a central part of the product experience
- Formal, Unreviewed, Changes Requested, Resolved, Reopened, Archived, Q&A-derived, Draft, and related states must be expressed consistently
- Ambiguity in status expression is a UX defect

### 2.4 Role-aware but restrained
- Actions must be shown based on role and permission
- Instead of showing many disabled controls, actions without permission should generally be hidden
- Even owners and admins must never see UI that suggests they can edit another user's body content

### 2.5 Readability over decoration
- Prioritize information structure over visual flourish
- Long-form readability and clear metadata organization matter more than stylistic expression
- Clarity, trust, and decision support matter more than visual excitement

---

## 3. Overall Visual Direction

### 3.1 Tone
- Enterprise SaaS
- Calm and trustworthy
- Structured and readable
- Information-dense without feeling crowded
- Modern but restrained
- Stable and operational rather than playful

### 3.2 Visual keywords
- calm
- structured
- trustworthy
- readable
- professional
- restrained
- knowledge-centric

### 3.3 What to avoid
- Social-media-like energy
- Community-platform styling
- Overuse of gradients
- Heavy glassmorphism
- Excessive shadows
- Gamification-like UI
- Emphasis on popularity, ranking, or engagement metrics

---

## 4. Color System

### 4.1 Brand direction
Use a **blue-based primary color system**.  
Blue should communicate trust, clarity, stability, and enterprise-grade usability.

### 4.2 Base palette
- Background: light neutral / slate tones
- Surface: white or very light neutral
- Border: light neutral gray
- Text primary: dark slate
- Text secondary: muted slate
- Primary accent: medium-to-deep blue
- Secondary accent: subtle cool blue-gray

### 4.3 Semantic colors
Do not confuse brand colors with state colors.

- Primary: blue
- Success: green
- Warning / review attention: amber
- Danger / destructive: red
- Info / derived / related state: supporting blue tones
- Archived / inactive: muted gray

### 4.4 Badge color rules
- Formal: blue-tinted strong neutral emphasis
- Unreviewed: amber
- Changes Requested: orange or amber-red
- Draft: muted blue-gray
- Under Review: blue
- Q&A-derived: cool blue secondary badge
- Resolved: green
- Reopened: amber
- Archived: gray
- Previous Formal Version Exists: muted informational badge

---

## 5. Typography

### 5.1 Principles
- Prioritize hierarchy clarity
- Use headings to create order, not visual aggression
- Optimize body text for long-form readability
- In list views, the eye should naturally move from title to status to metadata
- Do not compress too much information into tiny text

### 5.2 Hierarchy
- Page Title: clear and stable
- Section Title: logical page divisions
- Card Title / Item Title: strongest text in list items
- Metadata: secondary but easy to read
- Body: comfortable for long-form reading
- Helper / Caption: clearly subordinate

### 5.3 Writing tone in UI
- Clear, direct, and calm
- Avoid vague wording
- Explicitly communicate what is happening and what the user can do
- Error messages should not be generic or evasive

---

## 6. Layout System

### 6.1 Signed-in app shell
All signed-in screens should share the same overall structure:

- Top header
- Left sidebar navigation
- Page header
- Main content area

### 6.2 Header
The global header should include:

- Product name
- Workspace name
- Global search entry
- Notifications icon with unread badge
- Review queue badge for reviewer / admin / owner
- User menu

### 6.3 Sidebar navigation
Primary navigation should include:

- Knowledge
- Questions
- Bookmarks
- Notifications
- Admin

### 6.4 Main content
- Keep the content width controlled so information does not feel scattered
- Prioritize readability on reading-heavy screens
- On list views, present content in a natural sequence: search, filters, results
- On editor screens, make the writing area the primary focus

### 6.5 Spacing
- Use spacing as a structural tool
- Use borders and spacing as the main separators, with shadow only as a subtle enhancement
- Avoid both overcrowding and unnecessary emptiness

---

## 7. Screen Template Rules

Do not design all 20 screens independently.  
Unify them through shared template logic.

### 7.1 Gateway screens
Applies to:
- Login
- Workspace existence / join gateway
- Invitation acceptance
- Join request

Rules:
- Make the decision and next action obvious
- Keep these screens lightweight and focused
- Since these are pre-entry or access screens, keep decoration minimal

### 7.2 List screens
Applies to:
- Knowledge List
- Question List
- Review Queue
- Notifications
- Bookmarks

Rules:
- Place search and filters at the top
- Show only the information needed for comparison and triage
- Do not show too much body text
- Empty states must suggest the next useful action

### 7.3 Detail screens
Applies to:
- Knowledge Detail
- Question Detail

Rules:
- Reading is the primary purpose
- Structure content in this general order: title, status, summary, body, supporting information, actions
- Supporting information should be well organized and easy to scan
- Actions matter, but must not overpower the reading experience

### 7.4 Editor screens
Applies to:
- Knowledge Create
- Knowledge Edit
- Formal knowledge edit draft
- Question Create
- Question Edit

Rules:
- Keep the writing experience central
- Still make the current state and review readiness visible
- If changes were requested, show the reasons clearly
- Separate save actions from submit / request-review actions

### 7.5 History screens
Applies to:
- Knowledge History

Rules:
- Do not mix the current version with revision history
- Prioritize traceability
- Focus on who changed what and when, rather than advanced diff visualization

### 7.6 Admin screens
Applies to:
- Member Management
- Tag Management

Rules:
- Use **table-based layouts** as the default
- Prioritize operational clarity and scannability over visual softness
- Make row-level actions explicit
- Handle destructive actions carefully
- Admin views should feel quiet, trustworthy, and operational

---

## 8. Status and Workflow Expression

### 8.1 Status is always visible
- Current state must be visible in both list and detail contexts
- Labels, colors, and display priority must stay consistent across the product

### 8.2 Core statuses
- Formal
- Unreviewed
- Changes Requested
- Draft
- Under Review
- Q&A-derived
- Resolved
- Reopened
- Archived
- Previous Formal Version Exists

### 8.3 Placement rules
- List views: near the title or at the upper-right area of each item
- Detail views: directly below the title
- Editor views: a persistent status area near the top
- Tables: as a dedicated status column or adjacent to the item name

### 8.4 Action priority
- Primary: the most recommended action in the current state
- Secondary: supporting actions
- Tertiary: low-frequency actions
- Destructive: archive, remove, withdraw, delete, or similar operations

---

## 9. Knowledge-specific Rules

### 9.1 Knowledge is the default landing experience
- The primary destination after joining is the Knowledge List
- Formal knowledge should be shown by default
- Relevance and updated date should strongly shape the browsing experience

### 9.2 Knowledge cards
Each knowledge card should prioritize:
- Title
- Summary
- Tags
- Status
- Updated date
- Creator
- Bookmark action

Rules:
- Easy to compare in a list
- Dense but not overloaded
- Title and status should be immediately legible

### 9.3 Knowledge detail
The Knowledge Detail screen should clearly organize:

- Title
- Summary
- Status badges
- Tags
- Creator
- Last updater
- Last updated timestamp
- Last content author
- Result attributes
- Context
- Body
- Related links
- Comments
- Origin information when Q&A-derived
- History entry point
- Archive reason if archived

### 9.4 Formal vs draft separation
- Never mix the formal version with the edit draft
- The current formal version is the source of truth
- The edit draft must be visually and structurally presented as a proposal

---

## 10. Question-specific Rules

### 10.1 Questions are secondary but important
- Question screens exist as a separate domain, but with lower visual priority than Knowledge
- The posting experience should feel lightweight
- The path from Q&A to formal knowledge must remain visible

### 10.2 Question detail structure
The Question Detail screen should organize:

- Title
- Status
- Tags
- Creator
- Body
- Related links
- Question comments
- Derived knowledge list
- Bookmark
- History entry points

### 10.3 Resolved state separation
On Question Detail, answers must be divided into two clearly distinct sections:

#### A. Answers fixed at resolution time
- Best answer
- Other answers that existed at that time
- These should feel visually stable and frozen as the resolved snapshot

#### B. Follow-up answers after reopening
- Clearly marked as later additions
- Must not be confused with the original resolved state

### 10.4 No comment UI on answers
- Do not provide comment UI for answers
- Keep question comments separate from answer content

---

## 11. Admin Table Rules

### 11.1 Management screens use tables
Admin and management screens should use table layouts by default.  
The reason is operational efficiency, row-level comparison, and easy bulk comprehension.

### 11.2 Table design principles
- Header rows must be clear and readable
- Include a status column
- Include an actions column
- Do not make rows too compressed
- Clearly express hover, selected, and focused states
- Avoid cramming too much information into a single row
- Use row-level navigation or modal support where deeper inspection is needed

### 11.3 Member Management table
Suggested columns:
- Name
- Email
- Role
- Membership State
- Join Date
- Actions

Subsections:
- Members
- Invitations
- Join Requests

### 11.4 Tag Management table
Suggested columns:
- Tag Name
- Normalized Name
- Status
- Usage Count
- Creator
- Updated Date
- Actions

### 11.5 Destructive action safety
- Role changes, removals, archives, merges, and similar actions must not be easy to trigger accidentally
- Destructive actions must be clearly distinguished by color, position, and confirmation flow

---

## 12. Component Rules

### 12.1 Must-be-consistent components
- App shell
- Search bar
- Filter bar
- Status badge
- List card
- Detail header
- Metadata row
- Rich text body
- Comment block
- Buttons
- Empty state
- Error state
- Permission denied state
- Loading skeleton
- Admin table

### 12.2 Buttons
- Primary: blue filled style
- Secondary: neutral outline or subtle fill
- Tertiary: text-based style
- Destructive: red-accented and visually separated

### 12.3 Search and filters
- Search should be visually obvious
- Filters should be compact but clear
- Use filter chips and dropdowns in a structured way
- Keep search and filter placement consistent across list screens

### 12.4 Cards
- Use light card boundaries and sufficient padding
- Avoid heavy shadow treatment
- Make information hierarchy obvious at a glance

### 12.5 Tables
- On admin screens, prefer tables over cards
- Tables should feel readable and operational, not cramped and mechanical

---

## 13. Empty, Error, Permission, Loading States

### 13.1 Empty
- Explain why nothing is shown
- Suggest one useful next action
- On Knowledge List especially, make it clear whether formal knowledge does not exist yet or filters removed all results

### 13.2 Error
- Avoid vague failure messages
- Provide a retry path
- Clearly communicate what the user can still do

### 13.3 Permission denied
- Explain the reason briefly and clearly
- Do not show misleading actions
- Permission constraints should feel intentional and correct

### 13.4 Loading
- Avoid overusing spinners
- Prefer skeleton loading
- Use natural loading patterns for list, detail, and table views

---

## 14. Prohibited UI

Do not include:

- Likes
- Upvotes
- Public ranking
- Attachment upload UI
- AI helper UI
- Comment UI for answers
- Comment history UI
- Advanced diff visualization
- External integration settings UI
- Email notification settings
- Any UI that implies admins or owners can edit another user's body content

---

## 15. Stitch Usage Rules

### 15.1 Do not generate all screens independently
Do not generate all 20 screens separately from scratch.  
First establish the shared design language through representative screens.

### 15.2 Recommended first screens
Generate these first:
- Login
- Workspace Join Gateway
- Knowledge List
- Knowledge Detail
- Knowledge Create
- Review Queue
- Question Detail
- Member Management

### 15.3 Reuse the same visual language
All screens must share the same design system, spacing rules, badge logic, page structure, and action hierarchy.

### 15.4 Prototype flow priority
Prioritize these flows when building prototypes:
- First-time join flow
- Direct post → share / request review flow
- Q&A → resolution → knowledge formalization flow
- Formal knowledge → edit draft → re-review → apply flow

---

## 16. Final Summary

The purpose of this design is not just to make the product look polished.  
Its core purpose is to express a **knowledge-first, state-driven, role-aware, enterprise-grade** product system consistently across all screens.

The UI exists to help teams build reusable organizational knowledge.  
Therefore, Knowledge must remain primary, Q&A must remain a feeder path, states and permissions must be explicit, and management screens must support quiet, table-based operational work.
