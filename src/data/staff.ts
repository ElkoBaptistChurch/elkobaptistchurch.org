export interface StaffMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  email?: string;
  image?: string | null;
  order: number;
}

export const staffMembers: StaffMember[] = [
  {
    id: 'wayne-holcomb',
    name: 'Pastor Wayne Holcomb',
    title: 'Senior Pastor',
    bio: "Pastor Wayne came to Elko Baptist in August 2014 alongside his wife Debbie, answering a call to revitalize a historic congregation that had gone quiet after more than a century of faithful ministry. With nearly two decades of experience in ministry, he brings a shepherd's heart to the pulpit, the hospital room, and the kitchen table alike. His preaching is grounded in Scripture, honest about the challenges of life, and always pointing toward the hope found in Jesus Christ. Pastor Wayne believes that every person who walks through these doors is known by name in heaven — and he aims to make sure they're known by name here, too.",
    image: '/images/Wayne-John3-16-Staff.jpg',
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
    bio: "Our worship is led by a dedicated team of gifted musicians who love the Lord and love this church. Guitar, mandolin, and piano weave together with voices lifted in praise each Sunday — creating a sound that is uniquely ours. Our worship team doesn't perform; they lead. Their goal each week is simple: help every person in that sanctuary draw a little closer to God.",
    image: '/images/hymnal-lead.png',
    order: 3,
  },
];

export const getStaffById = (id: string): StaffMember | undefined =>
  staffMembers.find((s) => s.id === id);
