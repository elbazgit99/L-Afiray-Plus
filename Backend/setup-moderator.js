import dotenv from 'dotenv';
import { connectDB } from './Config/database.js';
import User from './Models/User.js';
import bcrypt from 'bcryptjs';
import ROLES from './Constants/UserRoles.js';

// Load environment variables
dotenv.config();

const setupModerator = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log(' Database connected successfully');

    const moderatorEmail = process.env.MODERATOR_EMAIL || 'admin@lafiray.ma';
    const moderatorPassword = process.env.MODERATOR_PASSWORD || 'admin123';
    const moderatorName = process.env.MODERATOR_NAME || 'L\'Afiray Moderator';
    const moderatorPhone = process.env.MODERATOR_PHONE || '+2125 000 00000';

    console.log(' Setting up moderator account with:');
    console.log(`   Email: ${moderatorEmail}`);
    console.log(`   Name: ${moderatorName}`);
    console.log(`   Phone: ${moderatorPhone}`);

    // Check if moderator already exists
    const existingModerator = await User.findOne({ email: moderatorEmail });
    if (existingModerator) {
      console.log('⚠️  Moderator already exists!');
      console.log(`   Existing moderator: ${existingModerator.name} (${existingModerator.email})`);
      console.log('   You can use these credentials to log in.');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(moderatorPassword, salt);

    // Create moderator user
    const moderatorUser = new User({
      name: moderatorName,
      email: moderatorEmail,
      password: hashedPassword,
      role: ROLES.MODERATOR,
      phone: moderatorPhone,
      isApproved: true
    });

    await moderatorUser.save();

    console.log('Moderator account created successfully!');
    console.log(' Login credentials:');
    console.log(`   Email: ${moderatorEmail}`);
    console.log(`   Password: ${moderatorPassword}`);
    console.log('\n Please change the password after first login for security.');
    console.log(' You can update these credentials in your .env file.');

  } catch (error) {
    console.error('Error setting up moderator:', error.message);
    process.exit(1);
  }
};

// Run the setup
setupModerator(); 