# TODO: Course Management System

## Frontend Updates
1. [x] Modify CourseUploadForm.jsx to include new fields:
   - Course name (text input)
   - Level (select dropdown: Beginner, Intermediate, Advanced)
   - Price (number input for Indian Rs)
   - Thumbnail upload (file input accepting images and videos)
   - Lessons section: dynamic addition with plus button, each lesson has name, url, description

2. [x] Update state management for all new fields

3. [x] Update form JSX to render new inputs

4. [x] Update handleSubmit to handle all data

5. [x] Rename admin tab to "Course Management"

6. [x] Update Dashboard to fetch and display courses in a table with view and delete actions

## Backend Updates
7. [x] Create Course model with schema for courseName, level, price, thumbnail, lessons array, createdBy

8. [x] Add course CRUD routes in admin.js (GET, POST, PUT, DELETE /api/admin/courses)

9. [x] Install multer for file upload handling

10. [x] Update CourseUploadForm to POST data to backend API with FormData for file upload

11. [x] Update Dashboard to fetch and display courses with view and delete functionality

12. [x] Test the full functionality - Added thumbnail display in course management table
