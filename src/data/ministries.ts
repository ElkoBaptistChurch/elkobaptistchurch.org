export interface Ministry {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string; // SVG path or inline SVG string
  audience: string;
  meetingTime?: string;
  leader?: string;
  image?: string | null;
  images?: string[];
  featured: boolean;
}

export const ministries: Ministry[] = [
  {
    id: 'worship',
    name: 'Worship & Music',
    shortDescription: 'There is a freedom to worship here — acoustic worship that draws hearts toward heaven.',
    description:
      'There is a freedom to worship here. Our worship at Elko Baptist is something you have to experience. Guitar, mandolin, and piano fill our historic sanctuary each Sunday with a sound that feels like home. We blend timeless hymns with heartfelt contemporary worship songs — always focused on lifting our eyes to Christ, not performing a show.',
    icon: 'music',
    audience: 'All ages',
    meetingTime: 'Sunday 11:00 AM',
    featured: true,
    image: '/images/music-ministry-5.jpg',
    images: ['/images/music-ministry-1.png', '/images/music-ministry-4.jpg'],
  },
  {
    id: 'childrens',
    name: "Children's Church",
    shortDescription: 'Planting seeds of faith in the hearts of our youngest members.',
    description:
      "We believe that children are a gift from God — and that the faith they develop in their earliest years will carry them for a lifetime. Right after announcements and worship hymns, kids head to Children's Church, where they discover God's Word through stories, crafts, music, and community in a safe, joyful environment built just for them.",
    icon: 'children',
    audience: 'All Kids',
    meetingTime: "Sunday 11:30 AM",
    featured: true,
    image: '/images/church-children-2.jpg',
  },
  {
    id: 'outreach',
    name: 'Community Outreach',
    shortDescription: 'Loving our neighbors the way Jesus taught us to.',
    description:
      "Elko Baptist has been part of this community for over 130 years, and we take that responsibility seriously. We partner with local families, support community needs, and look for everyday opportunities to be the hands and feet of Christ — right here in Houston County, Georgia.",
    icon: 'outreach',
    audience: 'Everyone',
    featured: false,
    image: null,
  },
  {
    id: 'prayer',
    name: 'Prayer Ministry',
    shortDescription: 'Bringing every burden and blessing before our heavenly Father.',
    description:
      "We believe prayer changes things. Our prayer ministry keeps an active prayer list and intercedes for our congregation, our community, and our world. We also accept prayer requests at any time — because we believe no burden is too small to bring before God.",
    icon: 'prayer',
    audience: 'All',
    featured: false,
    image: null,
  },
  {
    id: 'online',
    name: 'Online Ministry',
    shortDescription: 'Worship with us from anywhere — live every Sunday on Facebook and YouTube.',
    description:
      "Whether you're part of our church family or just visiting online, we're glad you're here. We livestream our Sunday morning worship service on Facebook and YouTube, so homebound members, traveling families, and curious first-timers can join us from anywhere. Past messages stay up afterward, so you can always catch up on what you missed.",
    icon: 'online',
    audience: 'Everyone',
    meetingTime: 'Sunday 11:00 AM (Live)',
    featured: false,
    image: null,
  },
];

export const featuredMinistries = ministries.filter((m) => m.featured);
