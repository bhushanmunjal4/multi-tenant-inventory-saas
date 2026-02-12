import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";
import { Tenant } from "./modules/tenant/tenant.model";
import { User } from "./modules/user/user.model";

const seed = async () => {
  try {
    await connectDB();

    // Clear old data
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // Create Tenant 1
    const tenant1 = await Tenant.create({
      name: "Alpha Store"
    });

    // Create Tenant 2
    const tenant2 = await Tenant.create({
      name: "Beta Mart"
    });

    // Users for Tenant 1
    await User.create([
      {
        name: "Alpha Owner",
        email: "owner@alpha.com",
        password: "password123",
        role: "OWNER",
        tenantId: tenant1._id
      },
      {
        name: "Alpha Manager",
        email: "manager@alpha.com",
        password: "password123",
        role: "MANAGER",
        tenantId: tenant1._id
      },
       {
        name: "Alpha Staff",
        email: "staff@alpha.com",
        password: "password123",
        role: "STAFF",
        tenantId: tenant1._id
      }
    ]);

    // Users for Tenant 2
    await User.create([
      {
        name: "Beta Owner",
        email: "owner@beta.com",
        password: "password123",
        role: "OWNER",
        tenantId: tenant2._id
      },
      {
        name: "Beta Staff",
        email: "staff@beta.com",
        password: "password123",
        role: "STAFF",
        tenantId: tenant2._id
      }
    ]);

    console.log("✅ Database seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seed failed", error);
    process.exit(1);
  }
};

seed();
