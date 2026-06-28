export interface CollagePhoto {
  src: string;
  alt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  email?: string;
  image?: string | null;
  /**
   * When set, the card renders a matted photo collage instead of a single
   * image. The first photo is the wide top banner; the rest fill a 2×2 grid
   * below. Use for team "members" whose lineup changes week to week.
   */
  collage?: CollagePhoto[];
  order: number;
}

export const staffMembers: StaffMember[] = [
  {
    id: 'wayne-holcomb',
    name: 'Pastor Wayne Holcomb',
    title: 'Senior Pastor',
    bio: "Pastor Wayne came to Elko Baptist in August 2014 alongside his wife Debbie, answering a call to revitalize a historic congregation that had gone quiet after more than a century of faithful ministry. With nearly two decades of experience in ministry, he brings a shepherd's heart to the pulpit, the hospital room, and the kitchen table alike. His preaching is grounded in Scripture, honest about the challenges of life, and always pointing toward the hope found in Jesus Christ. Pastor Wayne believes that every person who walks through these doors is known by name in heaven — and he aims to make sure they're known by name here, too.",
    image: '/images/pastor_headshot.jpg',
    order: 1,
  },
  {
    id: 'congregation',
    name: 'You',
    title: 'The Most Essential Team Member',
    bio: "Every team has a most valuable player, and at Elko Baptist, that's you. Scripture tells us the church is a body, and every part has a purpose (1 Corinthians 12:7-11) — there's no bench, no sidelines, no spectators. Whether you've been here for decades or you're reading this before your very first Sunday, you belong here, and this church needs you. Everybody really is somebody in His Body.",
    image: null,
    order: 2,
  },
  {
    id: 'worship-leader',
    name: 'Worship Team',
    title: 'Worship & Music',
    bio: "Our worship is led by a rotating team of gifted musicians who love the Lord and love this church. The lineup changes from week to week — guitar, mandolin, upright bass, and voices lifted in praise — but the heart stays the same. Our worship team doesn't perform; they lead. Their goal each week is simple: help every person in that sanctuary draw a little closer to God.",
    image: '/images/hymnal-lead.png',
    collage: [
      {
        src: '/images/music-ministry-1.png',
        alt: 'A quartet singing together with acoustic guitar accompaniment',
      },
      {
        src: '/images/music-ministry-6.png',
        alt: 'A young woman singing from a hymnal at the microphone',
      },
      {
        src: '/images/hymnal-lead.png',
        alt: 'A vocalist leading the congregation in song',
      },
    ],
    order: 3,
  },
];

export const getStaffById = (id: string): StaffMember | undefined =>
  staffMembers.find((s) => s.id === id);
