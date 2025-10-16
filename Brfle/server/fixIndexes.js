const mongoose = require('mongoose');
require('dotenv').config();

async function fixEnrollmentIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // First, check what indexes exist - use listIndexes() instead
    const indexes = await db.collection('enrollments').listIndexes().toArray();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}:`, index.key);
    });
    
    // Clean up any enrollments with null student (if they exist)
    const deleteResult = await db.collection('enrollments').deleteMany({ student: null });
    console.log(`Cleaned up ${deleteResult.deletedCount} enrollments with null student`);
    
    // Try to drop problematic indexes if they exist
    const indexNames = indexes.map(index => index.name);
    
    if (indexNames.includes('user_1_course_1')) {
      await db.collection('enrollments').dropIndex('user_1_course_1');
      console.log('Dropped user_1_course_1 index');
    } else {
      console.log('user_1_course_1 index not found');
    }
    
    if (indexNames.includes('student_1_course_1')) {
      await db.collection('enrollments').dropIndex('student_1_course_1');
      console.log('Dropped student_1_course_1 index');
    } else {
      console.log('student_1_course_1 index not found');
    }
    
    // Create the proper unique index on the correct field name
    await db.collection('enrollments').createIndex(
      { student: 1, course: 1 },  // ← Use "student" not "user"
      { 
        unique: true,
        name: 'student_course_unique'
      }
    );
    console.log('Created unique index on student + course');
    
    // Verify the new index
    const newIndexes = await db.collection('enrollments').listIndexes().toArray();
    console.log('Final indexes:');
    newIndexes.forEach(index => {
      console.log(`- ${index.name}:`, index.key);
    });
    
    console.log('✅ Index fix completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixEnrollmentIndex();