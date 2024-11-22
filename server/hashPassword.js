import bcrypt from "bcrypt";

const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log("Hashed Password:", hashedPassword);
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};

// Replace 'your_plain_password' with the password you want to hash
hashPassword("a");
