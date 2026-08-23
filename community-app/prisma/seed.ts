import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
const adapter = new PrismaPg(process.env.DATABASE_URL);
const db = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "ally@rootedinbloom.com";
  const adminName = process.env.ADMIN_NAME ?? "Ally";
  const adminPassword = process.env.ADMIN_PASSWORD ?? randomBytes(6).toString("hex");

  const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
  if (existingAdmin) {
    console.log(`Admin already exists: ${adminEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.user.create({
      data: { email: adminEmail, displayName: adminName, passwordHash, role: "ADMIN" },
    });
    console.log("Created admin account:");
    console.log(`  email:    ${adminEmail}`);
    console.log(`  password: ${adminPassword}`);
  }

  const admin = await db.user.findUniqueOrThrow({ where: { email: adminEmail } });

  const inviteCount = await db.inviteCode.count();
  if (inviteCount === 0) {
    const code = randomBytes(4).toString("hex");
    await db.inviteCode.create({
      data: { code, note: "First member", createdById: admin.id },
    });
    console.log(`Created a starter invite code: ${code}`);
  }

  console.log("\nSign in at /login with the admin credentials above,");
  console.log("or use the invite code at /signup to create a member account.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
