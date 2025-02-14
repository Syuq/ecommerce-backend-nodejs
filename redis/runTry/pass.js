const bcrypt = require('bcrypt');

async function hashPassword(password) {
  try {
    // Generate a salt with 128-bit strength
    const saltRounds = 10;
    const salt = '$2b$10$I3dRHUpcOZb/4ZM5fLCH.u'// await bcrypt.genSalt(saltRounds);
    console.log(`::salt:`, salt)

    // Hash the password using the generated salt
    const hash = await bcrypt.hash(password, salt);

    // Store the hashed password in your database
    console.log('Hashed password', hash);
    
    // At this point, you can store the hash in your database
    // When verifying password, you'll compare the stored hash with the newly generated hash using bcrypt,compare()

  } catch (error) {
    console.error("Error hashing password:", error);
  }
}


// Call the async function
const password = 'abc123';
hashPassword(password);