# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.7

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** How can online collaboration tools help a small software development team work together?

**Users:** Four students who are developing a web application for booking study rooms at a university.

**Problem:** The students work on different parts of the same project. They need to share code, track changes, and avoid conflicts. Without good communication, they may make mistakes or lose important changes.

**Constraints:** 1.The team has only four weeks to finish the project. 2.The team must use free development tools.

**Risk:**  One student may merge incorrect code into the main branch. This could break the booking system and make conflict between team members.

**Assumptions:** This is a university project. The team has four members: one frontend developer, one backend developer, one tester, and one researcher. They use GitHub to manage their work.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

Online collaboration tools help software development teams share code, communicate, and organize tasks. In this fictional project, four university students are creating a study room booking application. They have only four weeks and must use free tools. GitHub can help them work together, but they also need clear rules and responsibilities.

The first engineering decision is to use separate Git branches and Pull Requests. The frontend developer can work on the booking page while the backend developer builds reservation logic. Each developer should create a branch for a specific task. Before merging, another team member should review the changes. This can reduce mistakes, but it does not guarantee that every problem will be found.

The team should also protect the main branch where possible. GitHub documentation explains that protected branches can require reviews and passing status checks. This feature is available for public repositories on GitHub Free. However, the team must check the actual repository settings before using these rules. This decision is important because an incorrect merge is the main risk in the scenario.

The second engineering decision is to use simple testing before merging. The tester should check booking available rooms, cancelling reservations, and preventing overlapping bookings. For example, two students should not be able to reserve the same room for the same time. The backend developer should test the reservation logic, while the frontend developer checks the interface.

Communication is also important. The developers should discuss API changes before connecting their work. Even when Git does not report a merge conflict, the frontend and backend may use different data formats. The researcher can collect requirements and check whether the application meets user needs. GitHub Issues can help assign tasks and record problems.

The team could divide the project into four stages: requirements, development, integration testing, and final improvements. This schedule should be flexible because unexpected problems may appear.

There are some disadvantages. Students may need time to learn Git and code reviews. Too many rules can also slow development. For this reason, the team should use a simple process with clear tasks, useful tests, and short communication. Collaboration tools support the team, but successful development still depends on responsible work and correct decisions.

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

Prompt B identified nine weaknesses in the original draft. I reviewed each concern and decided whether to accept or qualify it.

I accepted the first concern about branch protection. The original draft discussed Pull Requests but did not explain how to prevent merging without approval. I checked GitHub Docs, Managing protected branches, and found that public repositories on GitHub Free can use branch protection rules. This supports adding review and status-check requirements, where available (verification row 1).

I also accepted the second concern about testing. The original answer only mentioned general testing. The revised analysis now includes booking, cancellation, and overlapping reservations. These examples are important because the system must prevent incorrect room reservations (change-log row 2).

I accepted concerns three, four, five, seven, and eight. Review responsibilities should match team members' knowledge. GitHub Issues need clear owners, and developers must distinguish merge conflicts from integration problems. Communication about API changes and checking free feature availability are also important.

I qualified concern six about efficiency. GitHub can improve coordination, but this does not prove that every team becomes faster. Students may spend additional time learning new tools. Therefore, I removed the idea that GitHub automatically increases efficiency.

I also qualified concern nine. A four-week plan is useful, but a strict schedule may cause problems when unexpected errors appear. A flexible plan is more appropriate for this student project.

My second source was GitHub Docs, Reviewing proposed changes in a pull request. It confirms that reviewers can comment, approve changes, or request improvements. However, it does not prove that reviews find every error (verification row 2).

The first substantive revision added main branch protection and explained its availability. The second added specific tests related to booking risks. Both revisions make the final analysis more practical and better connected to the scenario.

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

For this university project, I recommend using GitHub with separate branches, Pull Requests, GitHub Issues, and simple testing rules. These tools can help the four students share code, divide tasks, and identify problems before changes enter the main branch.

The most important decision is to review and test code before merging because an incorrect merge could break the booking system. The team should also consider branch protection where it is available and suitable for their repository.

The main limitation is that online collaboration tools cannot guarantee software quality. Beginners may make mistakes, and reviews may miss important problems. Therefore, the team should keep its workflow simple, communicate regularly, and focus on the most important booking functions within four weeks.

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

During this assignment, I learned how AI can help with software engineering analysis. At first, I had five simple ideas about GitHub, branches, Pull Requests, communication, and testing. I understood the basic topic, but my explanation did not include enough practical details.

Prompt A helped organize these ideas into a longer answer. However, the first draft had some weaknesses. Prompt B identified nine problems, including missing branch protection, unclear testing, and unsupported claims about efficiency.

I checked two official GitHub documentation pages. I learned that branch protection can require reviews and passing checks, but feature availability depends on the repository and plan. I also learned that Pull Request reviews cannot guarantee that every software problem will be found.

Prompt C helped improve the answer using these findings. I think the most useful change was adding specific testing examples for the booking system. This assignment showed me that AI is useful for generating ideas, but I still need to check facts and make my own decisions.

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- GitHub Docs. Managing protected branches. Sections: "Who can use this feature?" and "About protected branches". Accessed 2026-10-10. https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches

- GitHub Docs. Reviewing proposed changes in a pull request. Section: "About reviewing pull requests". Accessed 2026-10-10. https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. GitHub helps developers work together and save their code in one place.
2. Each developer should use a separate branch to avoid changing the main code directly.
3. Pull Requests help team members review changes before merging them.
4. Good communication is important because developers can misunderstand tasks or create conflicts.
5. Every team member is responsible for checking their work and fixing mistakes.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-10
- **Purpose:** Initial draft for topic 1.7

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.7 — Connected development teams: How does online collaboration support software development teams? for a first-year-level university assignment.

My scenario is a fictional university project where four students develop a web application for booking study rooms. One student is a frontend developer, one is a backend developer, one is a tester, and one is a researcher. They need to share code, track changes, communicate, and avoid conflicts. The team has four weeks to complete the project and must use free development tools. The main risk is that incorrect code merged into the main branch could break the booking system and create conflicts between team members. My initial ideas are 1. GitHub helps developers work together and save their code in one place. 2. Each developer should use a separate branch to avoid changing the main code directly. 3. Pull Requests help team members review changes before merging them. 4. Good communication is important because developers can misunderstand tasks or create conflicts. 5. Every team member is responsible for checking their work and fixing mistakes. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
Online collaboration tools help software development teams work together, even when members are in different locations. These tools allow developers to share code, communicate, track changes, and solve problems. For a small university team, online collaboration is important because students have limited time and different responsibilities.
In this scenario, four students are developing a web application for booking university study rooms. The team includes a frontend developer, a backend developer, a tester, and a researcher. They have four weeks to complete the project and must use free development tools.
One useful tool is GitHub. GitHub allows team members to store and manage their code in one shared repository. This makes it easier to see changes and understand who modified different files. For example, the frontend developer can work on the user interface while the backend developer creates the booking logic.
Another important feature is branching. Each developer can create a separate branch for their work instead of changing the main branch directly. This reduces the risk of unfinished code affecting the main project. However, branches do not completely prevent conflicts. If two developers change the same part of a file, they may still need to resolve a merge conflict.
Pull Requests are also helpful. Before adding new code to the main branch, a developer can create a Pull Request. Other team members can review the changes, ask questions, and suggest improvements. For example, the tester may notice that a new booking feature does not correctly check room availability. The team can fix this problem before merging. However, code reviews require time and cannot guarantee that every mistake will be found.
Communication is another important part of teamwork. The students can use GitHub Issues or another free communication tool to discuss tasks and report problems. Regular communication helps everyone understand their responsibilities. Without clear communication, two students may work on the same task or misunderstand project requirements.
Each team member should also take responsibility for their work. Developers should test their code before creating Pull Requests. The tester can check important functions, such as booking and cancelling study rooms. The researcher can collect requirements and check whether the application meets user needs.
There are also trade-offs. Using branches, reviews, and task tracking can take extra time, especially for beginners. However, these activities may reduce mistakes and make teamwork more organized. Since the project lasts only four weeks, the team needs a simple workflow rather than a complicated development process.
In conclusion, online collaboration supports software teams by improving communication, code management, and shared responsibility. GitHub, branches, and Pull Requests can help the four students work more safely and efficiently. However, successful collaboration still depends on clear tasks, careful reviews, and responsible team members.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-10
- **Purpose:** Critical review of Prompt A draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: How can online collaboration tools help a small software development team work together? Scenario: Four students are developing a web application for booking study rooms at a university. The team includes one frontend developer, one backend developer, one tester, and one researcher. They work on different parts of the project and need to share code, track changes, and avoid conflicts. They have only four weeks to finish the project and must use free development tools. The main risk is that one student may merge incorrect code into the main branch, breaking the booking system and creating conflicts between team members. This is a fictional university project, and the team uses GitHub to manage its work. Draft: Online collaboration tools help software development teams work together, even when members are in different locations. These tools allow developers to share code, communicate, track changes, and solve problems. For a small university team, online collaboration is important because students have limited time and different responsibilities.

In this scenario, four students are developing a web application for booking university study rooms. The team includes a frontend developer, a backend developer, a tester, and a researcher. They have four weeks to complete the project and must use free development tools.

One useful tool is GitHub. GitHub allows team members to store and manage their code in one shared repository. This makes it easier to see changes and understand who modified different files. For example, the frontend developer can work on the user interface while the backend developer creates the booking logic.

Another important feature is branching. Each developer can create a separate branch for their work instead of changing the main branch directly. This reduces the risk of unfinished code affecting the main project. However, branches do not completely prevent conflicts. If two developers change the same part of a file, they may still need to resolve a merge conflict.

Pull Requests are also helpful. Before adding new code to the main branch, a developer can create a Pull Request. Other team members can review the changes, ask questions, and suggest improvements. For example, the tester may notice that a new booking feature does not correctly check room availability. The team can fix this problem before merging. However, code reviews require time and cannot guarantee that every mistake will be found.

Communication is another important part of teamwork. The students can use GitHub Issues or another free communication tool to discuss tasks and report problems. Regular communication helps everyone understand their responsibilities. Without clear communication, two students may work on the same task or misunderstand project requirements.

Each team member should also take responsibility for their work. Developers should test their code before creating Pull Requests. The tester can check important functions, such as booking and cancelling study rooms. The researcher can collect requirements and check whether the application meets user needs.

There are also trade-offs. Using branches, reviews, and task tracking can take extra time, especially for beginners. However, these activities may reduce mistakes and make teamwork more organized. Since the project lasts only four weeks, the team needs a simple workflow rather than a complicated development process.

In conclusion, online collaboration supports software teams by improving communication, code management, and shared responsibility. GitHub, branches, and Pull Requests can help the four students work more safely and efficiently. However, successful collaboration still depends on clear tasks, careful reviews, and responsible team members.
```

**Response:**

```text
1. Missing reasoning about protecting the main branch
Concern: The draft explains Pull Requests and code reviews but does not mention GitHub branch protection rules or required checks.
Why it matters: The main risk is that one student may merge incorrect code into the main branch. A review alone does not stop someone from merging code without approval.
How to check: Review GitHub documentation about branch protection and confirm which protection features are available for the team's free repository.
Counterexample: A developer creates a Pull Request but merges it without waiting for the tester. The new code breaks the booking system.
Possible improvement: Explain how the team could require approval or passing tests before merging, depending on the available GitHub features.
2. Vague explanation of testing
Concern: The draft says developers should test their code and the tester should check important functions. However, it does not explain what tests are needed.
Why it matters: The booking system may work in simple situations but fail when two students try to reserve the same room.
How to check: Create test cases for booking, cancelling, unavailable rooms, and overlapping reservations.
Counterexample: A booking feature passes a basic test but allows two students to book the same room at the same time.
Possible improvement: Include specific examples of tests and explain when they should run.
3. Unsupported assumption about code reviews
Concern: The draft suggests that team members can review code and identify problems, but it does not explain whether they have the necessary knowledge.
Why it matters: The tester may not understand all the backend code, while the frontend developer may not understand database operations.
How to check: Identify which team members can review each part of the application and whether they have sufficient technical knowledge.
Alternative interpretation: Instead of reviewing every technical detail, the tester could review test results and expected behavior while the backend developer reviews the implementation.
4. Missing explanation of task management
Concern: GitHub Issues are mentioned, but the draft does not explain how the team will assign responsibilities or track progress.
Why it matters: With only four weeks, unclear tasks may cause duplicated work or unfinished features.
How to check: Create example GitHub Issues with an owner, deadline, description, and completion criteria.
Counterexample: The frontend developer and researcher both work on the booking form requirements, while nobody prepares the cancellation feature.
Possible improvement: Explain how GitHub Issues or GitHub Projects could help the team organize tasks.
5. Incomplete explanation of merge conflicts
Concern: The draft correctly states that branches do not completely prevent conflicts. However, it mainly discusses conflicts caused by editing the same file.
Why it matters: Conflicts can also happen at the functional level, even when developers edit different files.
How to check: Test whether separately developed frontend and backend features work together after merging.
Counterexample: The frontend sends a booking request using a field called roomId, but the backend expects room_id. Git may merge the code successfully, but the application may still fail.
Possible improvement: Distinguish between Git merge conflicts and integration problems.
6. Vague claims about efficiency
Concern: The draft says collaboration tools can make teamwork safer, more efficient, and more organized. These claims are reasonable but not supported by specific evidence.
Why it matters: Using GitHub does not automatically improve productivity. Beginners may spend extra time learning Git and resolving conflicts.
How to check: Compare the number of completed tasks, unresolved Issues, and problems found before merging.
Alternative interpretation: For a four-week student project, a complicated GitHub workflow could slow the team down rather than help it.
7. Missing connection between communication and the main risk
Concern: The communication paragraph focuses on understanding responsibilities but does not explain how communication helps prevent incorrect merges.
Why it matters: A student might merge code without knowing that another team member is still testing a related feature.
How to check: Define a simple team rule for communicating before merging important changes.
Counterexample: The backend developer changes the booking API while the frontend developer is still using the old version. Without communication, the application may stop working.
Possible improvement: Explain that team members should communicate API changes, testing results, and merge decisions.
8. Unsupported assumption about free tools
Concern: The draft correctly identifies GitHub as a useful tool but does not verify whether all proposed features are available for free.
Why it matters: The scenario requires the team to use only free development tools.
How to check: Consult GitHub's current Free plan documentation and check feature availability for public and private repositories.
Alternative interpretation: Some GitHub features may have different limits depending on the repository type or account plan.
Possible improvement: Identify which GitHub features the team can use without payment.
9. Missing practical four-week workflow
Concern: The draft says the team needs a simple workflow but does not describe what that workflow would look like.
Why it matters: The team has limited time, so the answer would be stronger with a practical example.
How to check: Create a basic four-week plan and confirm whether the tasks are realistic for four students.
Alternative interpretation: The team might focus on essential booking functions instead of developing many features.
Possible improvement: Briefly explain how the team could organize requirements, development, testing, and final integration across four weeks.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 2026-10-10
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.
My decisions:
1. Accept: The draft should discuss branch protection because an incorrect merge could break the booking system.
2. Accept: Testing needs specific examples, including booking, cancellation, and overlapping reservations.
3. Accept: Team members may have different technical knowledge. Review responsibilities should match their skills.
4. Accept: GitHub Issues should be used to assign tasks and track progress.
5. Accept: Git merge conflicts and functional integration problems are different and should be explained.
6. Qualify: GitHub can improve coordination, but using it does not automatically improve efficiency. Beginners may need extra time.
7. Accept: Team members should communicate API changes and test results before merging.
8. Accept: The availability of GitHub features on the Free plan needs verification.
9. Qualify: A four-week workflow would be useful, but a strict schedule may not fit unexpected problems. A flexible plan is better.
Verified evidence:
Source 1: GitHub Docs, "Managing protected branches", sections "Who can use this feature?" and "About protected branches". https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches (accessed 2026-10-10). GitHub Free supports protected branches in public repositories. Branch protection rules can require approving reviews and passing status checks before merging. This does not establish the same availability for private repositories on GitHub Free.
Source 2: GitHub Docs, "Reviewing proposed changes in a pull request", section "About reviewing pull requests". https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request (accessed 2026-10-10). GitHub allows reviewers to examine changed files, leave comments, approve changes, or request improvements. The documentation describes these review features but does not prove that every software defect will be detected.
Draft: Online collaboration tools help software development teams work together, even when members are in different locations. These tools allow developers to share code, communicate, track changes, and solve problems. For a small university team, online collaboration is important because students have limited time and different responsibilities.
In this scenario, four students are developing a web application for booking university study rooms. The team includes a frontend developer, a backend developer, a tester, and a researcher. They have four weeks to complete the project and must use free development tools.
One useful tool is GitHub. GitHub allows team members to store and manage their code in one shared repository. This makes it easier to see changes and understand who modified different files. For example, the frontend developer can work on the user interface while the backend developer creates the booking logic.
Another important feature is branching. Each developer can create a separate branch for their work instead of changing the main branch directly. This reduces the risk of unfinished code affecting the main project. However, branches do not completely prevent conflicts. If two developers change the same part of a file, they may still need to resolve a merge conflict.
Pull Requests are also helpful. Before adding new code to the main branch, a developer can create a Pull Request. Other team members can review the changes, ask questions, and suggest improvements. For example, the tester may notice that a new booking feature does not correctly check room availability. The team can fix this problem before merging. However, code reviews require time and cannot guarantee that every mistake will be found.
Communication is another important part of teamwork. The students can use GitHub Issues or another free communication tool to discuss tasks and report problems. Regular communication helps everyone understand their responsibilities. Without clear communication, two students may work on the same task or misunderstand project requirements.
Each team member should also take responsibility for their work. Developers should test their code before creating Pull Requests. The tester can check important functions, such as booking and cancelling study rooms. The researcher can collect requirements and check whether the application meets user needs.
There are also trade-offs. Using branches, reviews, and task tracking can take extra time, especially for beginners. However, these activities may reduce mistakes and make teamwork more organized. Since the project lasts only four weeks, the team needs a simple workflow rather than a complicated development process.
In conclusion, online collaboration supports software teams by improving communication, code management, and shared responsibility. GitHub, branches, and Pull Requests can help the four students work more safely and efficiently. However, successful collaboration still depends on clear tasks, careful reviews, and responsible team members.
Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
How Can Online Collaboration Tools Help a Small Software Development Team Work Together?

Online collaboration tools help software development teams share code, communicate, and manage tasks. These tools are useful when team members work on different parts of a project. However, using collaboration tools does not automatically make a team more efficient. Students must learn how to use them correctly.

In this scenario, four students are developing a web application for booking university study rooms. The team includes a frontend developer, a backend developer, a tester, and a researcher. They have four weeks to finish the project and must use free development tools. Their main risk is that incorrect code may be merged into the main branch and break the booking system.

One useful tool is GitHub. The team can use a shared repository to store code and track changes. Each developer can create a separate branch for their work. For example, the frontend developer can build the booking page while the backend developer works on reservation logic. This reduces the risk of unfinished code affecting the main branch.

However, branches cannot prevent every problem. A Git merge conflict can happen when developers change the same lines of code. A functional integration problem is different. For example, the frontend may send booking data in a format that the backend does not accept, even when Git reports no merge conflict. Therefore, developers should communicate API changes and test their work together.

Pull Requests allow team members to review changes before merging. Review responsibilities should match each person's knowledge. The backend developer can review booking logic, while the tester can check whether the application works correctly. The researcher can compare the results with the project requirements. GitHub allows reviewers to leave comments, approve changes, or request improvements (GitHub Docs, "Reviewing proposed changes in a pull request", 2026).

The team should also consider branch protection. According to GitHub documentation, protected branches can require approving reviews and passing status checks before merging. GitHub Free supports this feature for public repositories. However, the available evidence does not confirm the same support for private repositories on the Free plan. The team should check its repository settings before depending on this protection (GitHub Docs, "Managing protected branches", 2026).

Testing is another important activity. The tester should check whether students can book an available room, cancel a reservation, and avoid overlapping bookings. For example, the system should not allow two students to reserve the same room for overlapping times. Developers should also test their changes before requesting a review. Team members should share test results before merging because a code review cannot guarantee that every error will be found.

GitHub Issues can help the team organize tasks. Students can create issues for new features, bugs, and testing activities. Each issue can have an assigned team member and a clear description. This helps students see what needs to be done and what problems remain.

The team can follow a flexible four-week plan. In the first week, they can discuss requirements and divide tasks. In the second week, developers can build the main features. In the third week, the team can connect the frontend and backend and test the application. In the fourth week, they can fix problems and prepare the final project. However, the schedule should change if unexpected technical problems appear.

There are also disadvantages. Beginners may need extra time to understand Git, branches, Pull Requests, and reviews. Too many meetings or complicated rules may slow down the project. Therefore, the team should use a simple workflow and clear responsibilities.

In conclusion, online collaboration tools can help the four students organize their project, share code, and reduce development risks. GitHub branches, Pull Requests, Issues, and suitable branch protection can support safer teamwork. However, successful collaboration still depends on communication, testing, and responsible decisions. These tools can reduce mistakes, but they cannot completely prevent them.

References

GitHub Docs. Managing protected branches. Accessed 10 October 2026. https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches

GitHub Docs. Reviewing proposed changes in a pull request. Accessed 10 October 2026. https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| The draft does not mention GitHub branch protection rules or required checks. | GitHub Docs, Managing protected branches, sections Who can use this feature? and About protected branches, https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches, accessed 2026-10-10 | GitHub Free supports protected branches in public repositories. Rules can require approvals and passing checks. | keep |
| Other team members can review the changes, ask questions, and suggest improvements. | GitHub Docs, Reviewing proposed changes in a pull request, section About reviewing pull requests, https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request, accessed 2026-10-10 | GitHub provides tools to review changed files, comment and submit review decisions, but does not guarantee defect detection. | qualify |
### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| Pull Requests allow team members to review changes before merging. | The team should require a review before merging into main, with branch protection where available. | GitHub documentation confirms that protected branches can enforce review requirements in public repositories on GitHub Free. |
| The tester should check booking and cancellation functions. | The tester should check booking, cancellation, and overlapping reservations, including two students booking the same room. | The main risk concerns broken booking logic, so simple tests are not enough. |
