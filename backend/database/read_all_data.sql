-- Just_quizzDB: Read all core data in one file
-- Usage:
-- 1) Open phpMyAdmin / MySQL client
-- 2) Select database: Just_quizzDB
-- 3) Run this file

USE Just_quizzDB;

-- Core auth
SELECT * FROM roles;
SELECT * FROM users;
SELECT * FROM auth_tokens;
SELECT * FROM permissions;
SELECT * FROM role_permissions;

-- Academic
SELECT * FROM courses;
SELECT * FROM course_enrollments;
SELECT * FROM rooms;
SELECT * FROM room_members;

-- Quiz setup
SELECT * FROM quizzes;
SELECT * FROM quiz_settings;
SELECT * FROM questions;
SELECT * FROM question_options;
SELECT * FROM question_tags;

-- Sessions and attempts
SELECT * FROM quiz_sessions;
SELECT * FROM attempts;
SELECT * FROM attempt_answers;
SELECT * FROM attempt_answer_options;

-- Anti-cheating
SELECT * FROM proctor_events;
SELECT * FROM risk_assessments;
SELECT * FROM cheating_logs;
SELECT * FROM reviews;

-- Notifications
SELECT * FROM notifications;
SELECT * FROM notification_logs;

-- System/audit logs
SELECT * FROM system_logs;
SELECT * FROM audit_trails;
SELECT * FROM instructor_actions;
SELECT * FROM device_logs;
SELECT * FROM login_history;
SELECT * FROM security_alerts;

-- Results/analytics
SELECT * FROM quiz_results;
SELECT * FROM quiz_analytics;
