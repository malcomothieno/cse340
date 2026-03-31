const baseController = {}

baseController.buildHome = async function (req, res) {
  res.render("index", {
    title: "CSE Motors | Home",
    vehicle: {
      name: "DMC Delorean",
      features: ["3 Cup holders", "Superman doors", "Fuzzy dice!"],
      image: "/images/vehicles/delorean.png",
      link: "/inv/detail/1",
    },
    upgrades: [
      { name: "Flux Capacitor", image: "/images/upgrades/flux-capacitor.jpg", link: "/inv/upgrade/flux-capacitor" },
      { name: "Flame Decals",   image: "/images/upgrades/flame-decals.jpg",   link: "/inv/upgrade/flame-decals" },
      { name: "Bumper Stickers",image: "/images/upgrades/bumper-stickers.jpg",link: "/inv/upgrade/bumper-stickers" },
      { name: "Hub Caps",       image: "/images/upgrades/hub-caps.jpg",       link: "/inv/upgrade/hub-caps" },
    ],
    reviews: [
      { text: "So fast it's almost like traveling in time.", rating: "4/5" },
      { text: "Coolest ride on the road.",                  rating: "4/5" },
      { text: "I'm feeling McFly!",                        rating: "5/5" },
      { text: "The most futuristic ride of our day.",       rating: "4.5/5" },
      { text: "80's livin and I love it!",                  rating: "5/5" },
    ],
  })
}

module.exports = baseController
