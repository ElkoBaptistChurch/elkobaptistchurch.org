export const siteConfig = {
  name: 'Elko Baptist Church',
  tagline: 'Where Everybody is Somebody in His Body!',
  shortName: 'Elko Baptist',
  url: 'https://elkobaptistchurch.org',
  description:
    'Elko Baptist Church is a warm, historic congregation in Elko, Georgia — serving families, first-time visitors, and long-time members in Houston County since 1891.',
  locale: 'en_US',
  themeColor: '#5c1f2e',

  contact: {
    address: {
      street: '112 Oak Street',
      city: 'Elko',
      state: 'GA',
      zip: '31025',
      county: 'Houston County',
      full: '112 Oak Street, Elko, GA 31025',
    },
    email: 'elkobaptistchurch@gmail.com',
    mapsUrl: 'https://maps.app.goo.gl/PRmrZrpmdut3XkN4A',
  },

  serviceTimes: [
    {
      name: 'Morning Worship',
      time: '11:00 AM',
      day: 'Sunday',
      description: 'Our main weekly worship service',
    },
    {
      name: "Children's Church",
      time: '11:30 AM',
      day: 'Sunday',
      description: 'Faith-building lessons for kids, right after announcements and worship hymns',
    },
  ],

  social: {
    facebook: 'https://www.facebook.com/ElkoBaptistChurchGA/',
    youtube: 'https://www.youtube.com/c/ElkoBaptistChurch',
  },

  founding: {
    year: 1891,
    revivalYear: 2014,
    foundingMembers: 9,
  },

  denomination: 'Southern Baptist Convention',

  pastor: {
    name: 'Wayne Holcomb',
    spouseName: 'Debbie Holcomb',
    title: 'Senior Pastor',
    bio: 'Pastor Wayne and Debbie Holcomb answered the call to revitalize Elko Baptist Church in August 2014, breathing new life into a historic congregation that had been dormant since 2010. With nearly two decades of ministry experience, Pastor Wayne brings a shepherd\'s heart to every sermon, every visit, and every conversation. He and Debbie have poured their lives into this little church — and it shows.',
    image: null,
  },

  seo: {
    localKeywords: [
      'Elko GA church',
      'Elko Baptist Church',
      'church in Elko Georgia',
      'Houston County church',
      'Baptist church Perry GA',
      'Baptist church Warner Robins GA',
      'Southern Baptist church Georgia',
      'church near Perry Georgia',
      'church near Warner Robins',
      'Houston County Baptist church',
      'family church Houston County GA',
      'Sunday worship Elko Georgia',
    ],
  },
};

export type SiteConfig = typeof siteConfig;
