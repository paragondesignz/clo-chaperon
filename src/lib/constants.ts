export const SITE = {
  name: "Clo Chaperon",
  tagline: "Jazz Vocalist",
  description:
    "Clo Chaperon — Auckland-based jazz vocalist blending Mauritian heritage with the freedom of jazz.",
  copyright: "© 2025 Clo Chaperon",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/videos", label: "Videos" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/clochaperon",
    icon: "instagram" as const,
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com",
    icon: "music" as const,
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com",
    icon: "headphones" as const,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/clochaperon",
    icon: "facebook" as const,
  },
];

export const BIO_PARAGRAPHS = [
  `There's an old Creole proverb; it's the old pot that makes the good soup – in other words, our history defines us. Growing up with Mauritian parents, Clo Chaperon's musical journey was one that began steeped in the songs of her history: memories of when her extended family would reunite and revisit traditional Mauritian sega music on guitar and the ravanne drum, singing in French and Creole.`,

  `Alongside childhood memories of sega's flair and style, Chaperon also fell in love with the evocative movements of classical music. She remembers hearing Debussy's Clair de Lune for the first time at age 10, a tune that seems to transcend the very palette of the piano. "I loved how expressive it was," Chaperon explains, "It was like hearing colours pieced together to create this intangible mood. Even to this day, it reminds me of the power of music to summon colour and feeling."`,

  `It was that freedom of expression that would ultimately lead her to jazz, a genre known for its interplay between form and exploration. She discovered scatting from a borrowed copy of Ella Fitzgerald's It I Don't Mean a Thing. She devoured the instrumentalists; Chet Baker, Stan Getz and Miles Davis transcribing their horn lines and emulating them through voice. As a teenager, she fell in love with transcendent jazz-inspired artists like Alicia Keys, Jill Scott, D'Angelo and Prince, the man of a thousand genres.`,

  `For Chaperon, the key ingredient has always been genuineness. "I love music that makes me feel something, whether it's through groove, harmony, lyrics, or melody." Of course, a little danger helps too; an element that keeps bringing Chaperon back to jazz, where she leans on her classical piano training and music degree, performing regularly with a variety of local outfits.`,

  `"I love the freedom that comes with jazz. I love that it'll never be exactly the same on the band stand night after night. It gives the musicians a platform to express what they are feeling in that moment through the music. Every jazz singer brings their own personality to a song, which means on any given night, you're reinterpreting and delivering a different version of an old standard, breathing something new into it."`,

  `It's from this brew of influences that Chaperon's original tunes spring, combining family with history and a rich range of musical influences. <em>One More Day</em> is a lingering ode to her grandmother, a wish for borrowed time with one of her biggest supporters. In <em>Amadoose</em> she sees the world through the eyes of her new nephew, returning to the magic and curiosity of a child.`,

  `"I want people to hear a story they can relate to", Chaperon says of her music, "Whether it's from the standards that I choose or the originals that I write, I want to take my listener on a journey. Music has a power to connect us all; it's through songs that we share our history – hopefully, I'm doing my part by adding my voice to the mix."`,
];

export const PULL_QUOTES = [
  `"I loved how expressive it was. It was like hearing colours pieced together to create this intangible mood."`,
  `"I love the freedom that comes with jazz. I love that it'll never be exactly the same on the band stand night after night."`,
  `"I want people to hear a story they can relate to. I want to take my listener on a journey."`,
];

export const VIDEOS = [
  { title: "Peel Me a Grape", duration: "0:57", id: "1" },
  { title: "Bye Bye Blackbird", duration: "1:16", id: "2" },
  { title: "La Vie En Rose", duration: "0:48", id: "3" },
  { title: "Dat Dere", duration: "0:55", id: "4" },
  { title: "Shimmy Like My Sister Kate", duration: "0:40", id: "5" },
];

export const GALLERY_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  id: `img-${i + 1}`,
  src: `https://images.unsplash.com/photo-${
    [
      "1511192336509-5f7ea1a38700",
      "1514320291840-2e0a9bf2a9ae",
      "1493225457124-a3eb161ffa5f",
      "1415201364774-f6f0bb35f28f",
      "1516450360452-9312f5e86fc7",
      "1508700929-4d16e47c60a3",
      "1504898770365-5cfe5a1e19d3",
      "1460723237483-7a6dc9d0b212",
      "1485579149621-3123dd979885",
      "1571330735066-03aaa9429d89",
    ][i]
  }?auto=format&fit=crop&w=600&q=80`,
  alt: `Jazz performance ${i + 1}`,
  width: [400, 600, 500, 400, 600, 500, 400, 600, 500, 400][i],
  height: [600, 400, 500, 500, 400, 600, 500, 400, 600, 500][i],
}));
