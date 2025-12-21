const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/* HOME PAGE DATA (MUST BE ON TOP) */
router.get("/home", async (req, res) => {
  try {
    const topStory = await Post.findOne({
      category: "Home > Top Story",
      status: "published"
    }).sort({ createdAt: -1 });

    const featuredPosts = await Post.find({
      category: "Home > Featured",
      status: "published"
    }).sort({ createdAt: -1 });

    const popularPosts = await Post.find({
      category: "Home > Popular Stories",
      status: "published"
    }).sort({ createdAt: -1 });

    const latestPosts = await Post.find({
      category: "Home > Latest",
      status: "published"
    }).sort({ createdAt: -1 });

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Route: GET /api/posts/pakistan
router.get("/pakistan", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let subFilter = { category: "Pakistan", status: "published" };
    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      subFilter.category = `Pakistan > ${formattedSub}`;
    }

    let subPosts = await Post.find(subFilter)
      .sort({ createdAt: -1 })
      .limit(50);

    let mainPosts = [];
    if (subPosts.length < 20) {
      const mainFilter = { category: "Pakistan", status: "published" };
      mainPosts = await Post.find(mainFilter)
        .sort({ createdAt: -1 })
        .limit(50 - subPosts.length);
    }

    const allPosts = [...subPosts, ...mainPosts];

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: [] // hamesha empty
      });
    }

    const topStory = allPosts[0];

    // Featured aur Popular dono mein same posts daal do (e.g. next 6-10 posts)
    const sharedPosts = allPosts.slice(1, 10); // 9 posts dono sections mein

    const featuredPosts = sharedPosts; // same as popular
    const popularPosts = sharedPosts;  // same as featured

    // Latest ko empty rakho
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /pakistan route:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Route: GET /api/posts/latest
router.get("/latest", async (req, res) => {
  try {
    const filter = {
      category: "Latest News",
      status: "published"
    };

    const allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: [] // empty
      });
    }

    const topStory = allPosts[0];

    // Featured aur Popular mein same posts
    const sharedPosts = allPosts.slice(1, 10); // ya jitne chahiye (e.g. 9 posts)

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = []; // empty

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /latest route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: GET /api/posts/money
router.get("/money", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let filter = {
      category: "Money",
      status: "published"
    };

    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      filter.category = `Money > ${formattedSub}`;
    }

    let allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    // Fallback to main Money if no posts in subcategory
    if (allPosts.length === 0 && subcategory) {
      filter.category = "Money";
      allPosts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: []
      });
    }

    const topStory = allPosts[0];

    // Featured aur Popular same posts
    const sharedPosts = allPosts.slice(1, 10);

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /money route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: GET /api/posts/sports
router.get("/sports", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let filter = {
      category: "Sports",
      status: "published"
    };

    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      filter.category = `Sports > ${formattedSub}`;
    }

    let allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    if (allPosts.length === 0 && subcategory) {
      filter.category = "Sports";
      allPosts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: []
      });
    }

    const topStory = allPosts[0];

    const sharedPosts = allPosts.slice(1, 10);

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /sports route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: GET /api/posts/lifestyle
router.get("/lifestyle", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let filter = {
      category: "Lifestyle",
      status: "published"
    };

    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      filter.category = `Lifestyle > ${formattedSub}`;
    }

    let allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    if (allPosts.length === 0 && subcategory) {
      filter.category = "Lifestyle";
      allPosts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: []
      });
    }

    const topStory = allPosts[0];

    const sharedPosts = allPosts.slice(1, 10);

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /lifestyle route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: GET /api/posts/tech
router.get("/tech", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let filter = {
      category: "Tech",
      status: "published"
    };

    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      filter.category = `Tech > ${formattedSub}`;
    }

    let allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    if (allPosts.length === 0 && subcategory) {
      filter.category = "Tech";
      allPosts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: []
      });
    }

    const topStory = allPosts[0];

    const sharedPosts = allPosts.slice(1, 10);

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /tech route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: GET /api/posts/global
router.get("/global", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let filter = {
      category: "Global",
      status: "published"
    };

    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      filter.category = `Global > ${formattedSub}`;
    }

    let allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    if (allPosts.length === 0 && subcategory) {
      filter.category = "Global";
      allPosts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: []
      });
    }

    const topStory = allPosts[0];

    const sharedPosts = allPosts.slice(1, 10);

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /global route:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route: GET /api/posts/health
router.get("/health", async (req, res) => {
  try {
    const subcategory = req.query.subcategory;

    let filter = {
      category: "Health",
      status: "published"
    };

    if (subcategory) {
      const formattedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase();
      filter.category = `Health > ${formattedSub}`;
    }

    let allPosts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    if (allPosts.length === 0 && subcategory) {
      filter.category = "Health";
      allPosts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);
    }

    if (allPosts.length === 0) {
      return res.json({
        topStory: null,
        featuredPosts: [],
        popularPosts: [],
        latestPosts: []
      });
    }

    const topStory = allPosts[0];

    const sharedPosts = allPosts.slice(1, 10);

    const featuredPosts = sharedPosts;
    const popularPosts = sharedPosts;
    const latestPosts = [];

    res.json({
      topStory,
      featuredPosts,
      popularPosts,
      latestPosts
    });
  } catch (err) {
    console.error("Error in /health route:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* GET all posts */
// GET all posts (exactly for /posts)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

/* GET posts by category */
router.get("/category/:cat", async (req, res) => {
  const posts = await Post.find({
    category: req.params.cat,
    status: "published"
  });
  res.json(posts);
});

/* GET single post by ID (KEEP THIS LAST) */
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid post ID" });
  }
});

/* CREATE */
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(post);
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;


