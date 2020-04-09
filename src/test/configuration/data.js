const TEST_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

module.exports = {

  TEST_CANDIDATES: {
    CREATED: {
      id: 0,
      name: 'Jon Snow',
      occupation: 'Mentor',
      birthday: '1990-02-02',
      ethnicity: JSON.stringify(['Nigeria', 'Togo']),
      socials: JSON.stringify({ instagram: 'madting' }),
      description: 'An added candidate through service tests.',
      authorId: 1,
      dateWritten: '1990-02-02',
      image: TEST_IMAGE,
    },
    UPDATED: {
      id: 0,
      name: 'Jon Snow',
      occupation: 'Teacher',
      birthday: '1990-02-02',
      ethnicity: JSON.stringify(['Ghana', 'France']),
      socials: JSON.stringify({ twitter: 'madting', instagram: 'madting' }),
      description: 'An updated candidate through service tests.',
      authorId: 1,
      dateWritten: '2020-02-02',
      image: TEST_IMAGE,
    }
  },

  TEST_MEMBERS: {
    CREATED: {
      firstname: "Sally",
      lastname: "Wenderson",
      birthday: "1996-12-20",
      ethnicity: JSON.stringify(['South Africa', 'Poland']),
      sex: "F",
      level: "Coordinator",
      role: "Researcher",
      image: TEST_IMAGE,
      socials: JSON.stringify({
        instagram: 'sallyw'
      }),
      description: "An added member through service tests.",
      verified: 1,
      slackID: null
    },
    UPDATED: {
      firstname: "Lolly",
      lastname: "Bepop",
      birthday: "1996-12-20",
      ethnicity: JSON.stringify(['Tanzania', 'Poland']),
      sex: "F",
      level: "Manager",
      role: "Social Media Manager",
      image: TEST_IMAGE,
      socials: JSON.stringify({
        twitter: 'sallyw',
        instagram: 'sallyw'
      }),
      description: "An updated member through service tests.",
      verified: 1,
      slackID: null
    }
  },

  TEST_REVIEWS: {
    CREATED: {
      referee: "Tom McDowell",
      position: "Founder of McDowell Ministries",
      rating: 2,
      description: "This is an added review via service tests.",
      image: TEST_IMAGE,
    },
    UPDATED: {
      referee: "Nonso Chukwuemeka",
      position: "Director of Emeka Tanks",
      rating: 5,
      description: "This is an updated review via service tests.",
      image: TEST_IMAGE,
    }
  },

  TEST_SESSIONS: {
    CREATED: {
      title: 'Manchester 2020',
      dateHeld: '2020-03-01',
      timeHeld: '23:59',
      description: 'An added session from service tests.',
      image: TEST_IMAGE
    },
    UPDATED: {
      title: 'New Manchester 2021',
      dateHeld: '2021-09-22',
      timeHeld: '11:00',
      description: 'An updated session from service tests.',
      image: TEST_IMAGE
    }
  },

  TEST_TOPICS: {
    CREATED: {
      headline: "Coding",
      question: "Is this a development environment?",
      category: "Society & Stereotypes",
      description: "This is an added topic via service tests.",
      type: "Discussion",
      polarity: true,
      validated: false,
      sensitivity: false,
      option1: "Yes",
      option2: "No",
      user_id: 1
    },
    UPDATED: {
      headline: "NHS",
      question: "Does the government support them well?",
      category: "Philosophy & Ethics",
      description: "This is an updated topic via service tests.",
      type: "Debate",
      polarity: true,
      validated: false,
      sensitivity: true,
      option1: "Yes",
      option2: "No",
      user_id: 1
    }
  },

  TEST_USERS: {
    NINE: {
      id: 1,
      firstname: 'Admin',
      lastname: 'Istrator',
      clearance: 9
    },
    FIVE: {
      id: 2,
      firstname: 'Test',
      lastname: 'Subject',
      clearance: 5
    },
    CREATED: {
      firstname: "Practice",
      lastname: "User",
      email: "wokeweeklyuk@gmail.com",
      username: "wokew",
      password1: "Marchsurrey20",
      password2: "Marchsurrey20",
      subscribe: false
    }
  }
}