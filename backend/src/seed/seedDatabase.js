import Asset from "../models/Asset.js";
import User from "../models/User.js";

const dummyAssets = [
  {
    name: "MacBook Pro 14",
    serialNumber: "MBP14-2026-001",
    category: "Laptop",
    status: "Assigned",
    specifications: "Apple M3 Pro, 18GB RAM, 512GB SSD",
    assignmentHistory: [
      {
        assigneeName: "Alex Morgan",
        assignedAt: new Date("2026-01-10T09:00:00.000Z"),
        returnedAt: null
      }
    ]
  },
  {
    name: "Dell 27 4K Monitor",
    serialNumber: "MON-4K-027-011",
    category: "Monitor",
    status: "Available",
    specifications: "3840x2160, USB-C Hub"
  },
  {
    name: "Logitech MX Keys",
    serialNumber: "KB-MXK-1003",
    category: "Peripheral",
    status: "Maintenance",
    specifications: "Wireless keyboard, backlit keys"
  }
];

const seededUser = {
  email: "test.user@assetflow.local",
  password: "Password123!",
  name: "Test User"
};

export const ensureSeedData = async () => {
  const existingAssets = await Asset.countDocuments();
  if (existingAssets === 0) {
    await Asset.insertMany(dummyAssets);
    console.log(`Seeded ${dummyAssets.length} assets`);
  }

  const existingUser = await User.findOne({ email: seededUser.email });
  if (!existingUser) {
    await User.create(seededUser);
    console.log(`Seeded test user: ${seededUser.email}`);
  }

  return {
    testUser: {
      email: seededUser.email,
      password: seededUser.password
    }
  };
};
