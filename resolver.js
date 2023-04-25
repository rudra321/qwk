const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function user(_, { id }, { prisma }) {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
}

async function login(_, { email, password }, { prisma }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      successful: true,
    },
  });

  return {
    user,
    token,
  };
}

async function updateUser(
  _,
  { id, firstName, email, gender, city },
  { prisma }
) {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      firstName,
      email,
      gender,
      city,
    },
  });
}

module.exports = {
  Query: {
    user,
    login,
  },
  Mutation: {
    updateUser,
  },
};
