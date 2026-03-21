require("dotenv").config();
const mongoose = require("mongoose");
const SHG = require("./src/models/SHG");

const dummySHGs = [
    {
        name: "Udyogita, Sangli",
        location: "Sangli"
    },
    {
        name: "Surajya Sarvangin Vikas Prakalp",
        location: "Pune",
        email: "info@surajyaprakalp.org"
    },
    {
        name: "Sevavardhini",
        location: "Pune",
        website: "https://www.sevavardhini.org/Encyc/2020/9/21/About-Sevavardhini.html"
    },
    {
        name: "Hope Pune",
        location: "Pune",
        website: "http://www.hopepune.org/?q=what_we_do/facilitate/self_help_groups",
        email: "hopepune2010@gmail.com",
        contactPhone: "75884335"
    },
    {
        name: "Jnanaprabodhini foundation",
        location: "Pune",
        website: "https://www.jnanaprabodhinifoundation.org/self-help-groups"
    },
    {
        name: "Odser, Pune",
        location: "Pune",
        website: "https://odser.org/",
        email: "president@odser.org",
        contactPhone: "7666777075"
    },
    {
        name: "Badlaav Foundation, Pune",
        location: "Pune",
        website: "https://badlaavsrfoundation.org",
        email: "badlaav.srfoundation@gmail.com"
    },
    {
        name: "Deepastambha Charitable Trust, Pune",
        location: "Pune",
        website: "http://deepastambha.com",
        email: "info@deepstambha.com",
        contactPhone: "9970704444"
    },
    {
        name: "Borderless World Foundation, Pune, Jammu and Kashmir",
        location: "Pune",
        website: "https://www.borderlessworldfoundation.org/",
        email: "adhik@borderlessworldfoundation.org",
        contactPhone: "94223 23569"
    },
    {
        name: "Mahila Arthik Vikas Mahamandal (MAVIM)",
        location: "Mumbai",
        website: "https://mavim.maharashtra.gov.in",
        email: "mavim@vsnl.net",
        contactPhone: "2226590607"
    },
    {
        name: "Mahila Shakti Prathishthan",
        location: "Pune",
        website: "https://mahilashakti.org/",
        email: "info@mahilashakti.org",
        contactPhone: "7776978998"
    },
    {
        name: "Womenite",
        location: "New Delhi",
        website: "www.womenite.org",
        contactPhone: "9717973658"
    },
    {
        name: "Self Employed Women’s Association",
        location: "Ahmedabad",
        website: "https://www.sewa.org",
        email: "info@sewa.org",
        contactPhone: "7925506477"
    },
    {
        name: "Mann Deshi Foundation",
        location: "Satara",
        website: "https://manndeshi.org",
        email: "info@manndeshi.org",
        contactPhone: "2164225473"
    },
    {
        name: "Snehalaya",
        location: "Ahmednagar",
        website: "https://www.snehalaya.org",
        email: "info@snehalaya.org",
        contactPhone: "2412329145"
    },
    {
        name: "Swayam Shikshan Prayog",
        location: "Pune",
        website: "http://www.swayamshikshanprayog.org",
        email: "info@sspindia.org",
        contactPhone: "2025303166"
    },
    {
        name: "Jagori",
        location: "New Delhi",
        website: "https://www.jagori.org",
        email: "jagori@jagori.org",
        contactPhone: "1126692700"
    },
    {
        name: "Azad Foundation",
        location: "New Delhi",
        website: "https://www.azadfoundation.com",
        email: "info@azadfoundation.com",
        contactPhone: "1140601878"
    },
    {
        name: "Annapurna Mahila Mandal",
        location: "Mumbai",
        website: "http://annapurnamahilamandal.org",
        email: "ammmahila@yahoo.com",
        contactPhone: "2223081150"
    },
    {
        name: "YUVA",
        location: "Mumbai",
        website: "https://www.yuvaindia.org",
        email: "info@yuvaindia.org",
        contactPhone: "2224150455"
    },
    {
        name: "CORO India",
        location: "Mumbai",
        website: "https://www.coroindia.org",
        email: "info@coroindia.org",
        contactPhone: "2223563452"
    },
    {
        name: "Majlis Legal Centre",
        location: "Mumbai",
        website: "https://www.majlislaw.com",
        email: "majlis@majlislaw.com",
        contactPhone: "2226666120"
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("🟢 Connected to MongoDB. Seeding data...");

        // Clear existing to avoid duplicates if run multiple times
        await SHG.deleteMany({});
        console.log("🧹 Cleared existing SHGs.");

        // Insert new dummy data
        await SHG.insertMany(dummySHGs);
        console.log(`✅ Successfully seeded ${dummySHGs.length} SHGs into the database!`);

        mongoose.connection.close();
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    });
