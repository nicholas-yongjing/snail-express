# AY21/22 Orbital project

**Project Name:** Snail Express

**Team Name:** Team Snail

**Proposed Level of Achievement:** Gemini

**Adviser:** Yap Dian Hao

**Team Members:** Goh Yong Jing, Nicholas Seah

## Project Scope

Snail Express is a gamified platform that encourages learning though discussion and interaction between students and lecturers.

We aim to integrate the functionalities of some existing platforms - like Piazza (forum) and Archipelago (real-time interactive poll) and Coursemology (gamified through XP reward system and leaderboard) - into a single application.

Summary of each platform:
Piazza: Q&A forum designed for students and teachers to answer offline questions; questions are archivable and can be referred to at any time.
Archipelago: Real-time quiz system that allows lecturers to ask students questions for a quick check of understanding.
Coursemology: Gamified submission platform that uses XP points and levelling up to encourage students to participate actively.

Our project should improve on and combine the benefits of a real-time quiz with that of a forum. We aim to achieve a good mix of lengthy discussions and short answer replies to fast questions, both during the lecture and offline for revision. Lecturers will be able to receive real-time feedback on the lesson, test the students' understanding of the lecture content, answer students’ questions and also promote interaction and participation in the class through gamification of the platform.

## Motivation 

CS2040S uses Archipelago for almost every lecture, but we find it lacking in features which might be useful as a classroom poll application. For example: 

Students do not have access to real-time statistics on other students’ responses.
The session closes once the lecture is over, but students might want to refer back to questions that were being posed.
The interface is too basic, only allowing students to submit short-answer responses, select an MCQ response, or upvote questions by other students.
Some questions asked are repetitive, or have already been answered before
Students are also unable to answer questions posed by other students. The interface should provide for such a functionality, especially if the lecturer is unable to go through all the questions, so that the students can help to clarify each other's doubts for fast/random questions.

## User Stories

### Students’ perspective

1. As a student, I want to be able to ask questions during the lecture and get quick replies from either the lecturer or other students. I also want to indicate that I have a similar question to another student so that the lecturer can prioritise the common questions. I want to indicate that someone's answer is good because it answered my queries.

2. As a student, I want to be able to indicate to the lecturer in real time that they are going too fast or too slow, or that I am unable to understand what has been taught in the past ten minutes.

3. As a student, I want to feel appreciated when I answer another student’s questions.

### Lecturer’s perspective

1. As a lecturer, I want to make sure my students are following the lecture content so that I know when to stop and clarify doubts before moving on. I hope this can be done by surveying students passively (in the background) without the need to open a new poll during the lecture. 

2. As a lecturer, I hope to be able to quantify my students’ participation without having to micromanage the chat. I want a platform which can store students’ responses and report them to me after the lecture so I can award participation points in a hassle-free manner.

3. As a lecturer, it is stressful to answer the students’ questions while conducting the lecture. I hope to be able to refer to these questions after the lecture and answer them offline. 

4. As a lecturer, I also hope that students can aid in answering the questions submitted by other students because I value their input as well. I hope to be able to remove erroneous responses and endorse good responses.

## Features

### Proposed

- Accounts
    - There will be 2 types of accounts that can be created on Snail Express, which determines the set of functionality provided. Details are provided further below.
        - Student account
        - Lecturer account
    - Both users can create account and log in to ensure their progress and contributions are saved on the web. 

- [Forum](/images/ss_forums.png):
    - Both students and lecturers can:
        - Create discussion threads
        - Post in discussion threads
        - Reply to posts
        - Upvote or downvote posts
        - See each other's posts, replies, upvotes, downvotes as well as posts marked as endorsed by lecturers
    - Lecturers can:
        - Mark a post or reply as endorsed answer

- [Quiz](/images/ss_quiz.png):
    - lecturers can:
        - Hold real-time quiz during lecture
        - See students' participation and answer
    - Students can:
        - Participate in the quiz
    - Quiz types:
        - Multiple Choice Questions (MCQ): Given a question, students choose 1 correct answer out of several choices

- [Lecture Feedback](/images/ss_feedback.png):
    - Students can provide feedback to the lecturer:
        - Too Fast: Indicate that the lecturer is going too fast
        - Too Slow: Indicate that the lecturer is going too sloe
        - Confused: Indicate to the lecturer that the student is confused and require further explanation or rephrasing by lecturer
        - Good Pace: Indicate to the lecturer that the lesson is going well and there are no issues

### Current Progress

- Account creation
- Log in and log out system
- View profile 

### Additional Features

- Forum
    - Both students and lecturers can:
        - React to posts and replies with emojis
        - See each other's reactions
        - Format their text (bold, italics, underline and format as code)

- Quiz
    - Students can:
        - Check whether their answer is correct and see their ranking among the class
    - Quiz types:
        - Multiple Response Questions (MRQ): Given a question, students choose several correct answers out of several choices
        - Open Ended Questions: Given a question, students type in their answer in text form.

## Plan

1st month:
Basic interface to create account, log in system, invite class of students via email, separate interfaces for lecturers and students
Basic forum: text-based question and answer system visible to the entire class

2nd month:
More custom functions to allow lecturer to give MCQ quizzes in real-time to quickly assess whether the class is following
Real-time feedback from students: Students can click a button to let lecturer know that they are lost / or are going too fast

3rd month:
React to other students’ questions and answers by upvoting or reacting with an emoji
Lecturers can endorse student’s answers so that there is an indication beside the answer that this answer is correct
Encourage participation (asking and answering questions, participating in quizzes) will award exp points to the student, and students rank up after collecting enough experience points. Higher ranking students gain more cosmetic features such as coloured names, new titles that appear beside their name (apprentice / expert / grandmaster etc.), more emoji reactions for other students’ questions and answers.

4th month:
Final touches: allowing lecturers to fully customise the rank titles of students, number of questions each student can ask to prevent spam, experience points awarded per question, maximum upvotes per day etc.

## Tech Stack

Database: Firebase Realtime Database

Frontend: HTML/CSS/Javascript (Bootstrap, ReactJS)

Backend: Firebase (Backend-as-a-Service)

## Github Repository
https://github.com/gohyongjing/snail-express

## Project Log
https://docs.google.com/spreadsheets/d/1FVq-X5LiwxegWNH8CFDZG4TTdpNZskBeQjSvQOi2WE4/edit?usp=sharing

## Project Poster
https://drive.google.com/file/d/1FNZ5tc_ZzDNdcdMH6RDpL5Udgjm-6KCq/view?usp=sharing

## Project Video
https://drive.google.com/file/d/1MeOF-cnqC1AzoXoX8e65BPDw3wjIi8M0/view?usp=sharing

## Technical Proof of Concept
https://drive.google.com/file/d/1K_oX5cx4eZyCk_Dpc7ExWVLJ8bfCAiAD/view?usp=sharing