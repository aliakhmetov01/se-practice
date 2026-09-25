# Rocket Prompt

## prompt

Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## Rocket prompt score
60%
## Question 1
Who will use this tool — just you, or does a team need access too?
## My answer
Just me, personal use
## Final Prompt Score
86%
## Rocket Enhanced

A personal, web-based student marks processor where you can input a list of student scores and instantly see computed results — class average, highest mark, lowest mark, and pass rate — all in a clean, single-page interface designed for solo use with no login required.

Building with Next.js and TypeScript.

## What Rocket Added That I Did Not Ask For

tailwind.css

tailwind.config.js

layout.tsx

page.tsx

MarksProcessorClient.tsx

marksUtils.ts

PageHeader.tsx

InputPanel.tsx

StatCards.tsx

GradeChartSection.tsx

GradeBarChart.tsx

ParsedEntriesTable.tsx

EmptyResultsState.tsx

## Test A

Input:
85, 23, 45, 90, 92

Rocket output:
Valid: 1
Average: 92.0
Highest: 92
Lowest: 92
Pass rate: 100.0%
Problem:
Rocket did not correctly parse the comma-separated list. It treated the input as one valid entry instead of five marks.
## Test D

Input:
abc, , xyz

Problem:
The app marked the input as unreadable, but the "Process Marks" button did not work.
## Fix Prompt

Fix the app so that comma-separated student marks are parsed correctly, including invalid values such as text, empty values, numbers below 0, and numbers above 100.

## Result

The fix worked for Test A.

Input:
85, 23, 45, 90, 92

output:
valid: 5
Average: 67.0
Highest: 92
Lowest: 23
Pass rate: 60.0%
## Test B

Input:
88, 47, -5, 101, abc, 73, 50, , 100

output:
Valid: 5
Average: 71.6
Highest: 100
Lowest: 47
Pass rate: 80.0%
