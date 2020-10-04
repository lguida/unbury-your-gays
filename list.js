const genres ={
  ids: [
    {
      id: 28,
      name: "Action"
    },
    {
      id: 12,
      name: "Adventure"
    },
    {
      id: 16,
      name: "Animation"
    },
    {
      id: 35,
      name: "Comedy"
    },
    {
      id: 80,
      name: "Crime"
    },
    {
      id: 99,
      name: "Documentary"
    },
    {
      id: 18,
      name: "Drama"
    },
    {
      id: 10751,
      name: "Family"
    },
    {
      id: 14,
      name: "Fantasy"
    },
    {
      id: 36,
      name: "History"
    },
    {
      id: 27,
      name: "Horror"
    },
    {
      id: 10402,
      name: "Music"
    },
    {
      id: 9648,
      name: "Mystery"
    },
    {
      id: 10749,
      name: "Romance"
    },
    {
      id: 878,
      name: "Science Fiction"
    },
    {
      id: 10770,
      name: "TV Movie"
    },
    {
      id: 53,
      name: "Thriller"
    },
    {
      id: 10752,
      name: "War"
    },
    {
      id: 37,
      name: "Western"
    }
  ]
}



const store = {
  media: [
    {
      title: 'Imagine Me and You',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'D.E.B.S.',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Carol',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Domestic Violence']
    },
    {
      title: 'Aimee and Jaguar',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Holocaust']
    },
    {
      title: 'Saving Face',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Fingersmith',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Thelma',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['Domestic Violence']
    },
    {
      title: 'The Feels',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Disobedience',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'But I’m A Cheerleader',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'The Miseducation of Cameron Post',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Professor Marsten and the Wonder Women',//fix
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Desert Hearts',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Kyss Mig',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'The Favourite',
      format: 'movie',
      ending: 'Neutral',
      occasions: [],
      triggers: ['Medical Gore']
    },
    {
      title: 'Black Swan',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Gratuitous Violence','Self-Harm','Suicide']
    },
    {
      title: 'Duck Butter',
      format: 'movie',
      ending: 'Neutral',
      occasions: [],
      triggers: ['Gratuitous Violence','Self-Harm','Suicide']
    },
    {
      title: 'Circumstance',
      format: 'movie',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Young and Wild',
      format: 'movie',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Liz in September',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Breaking the Girls',
      format: 'movie',
      ending: '?',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Cracks',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Child Abuse?']
    },
    {
      title: 'Heavenly Creatures',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Bloomington',
      format: 'movie',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Heartland Movie',
      format: 'movie',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'My Summer of Love',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Religion', 'Suicide']
    },
    {
      title: 'AWOL',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Lost and Delirious',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Almost Adults',
      format: 'movie',
      ending: 'Neutral',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'The Carmilla Movie',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Can’t Think Straight',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'The Summer of Sangaile',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Self-Harm']
    },
    {
      title: 'L’amore è Imperfetto',
      format: 'movie',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Sor Juana',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Jennifer’s Body',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['Gratuitous Violence']
    },
    {
      title: 'De Chica en Chica',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Carmen y Lola',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['Religion']
    },
    {
      title: 'Collette',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Tell It To The Bees',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Portrait Of A Lady On Fire',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Vita and Virginia',
      format: 'movie',
      ending: 'Sad',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'The Half Of It',
      format: 'movie',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Orphan Black',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['Gratuitous Violence']
    },
    {
      title: 'Skins',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['Gratuitous Violence']
    },
    {
      title: 'Faking It',
      format: 'tv-show',
      ending: 'Neither sad nor happy (lol)',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Orange Is the New Black',
      format: 'tv-show',
      ending: 'Neutral',
      occasions: [],
      triggers: ['Drugs', 'Sexual Abuse', 'Suicide']
    },
    {
      title: 'Lost Girl',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Wynonna Earp',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Legends Of Tomorrow',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Riverdale',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Cable Girls',
      format: 'tv-show',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Brooklyn 99',
      format: 'tv-show',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Supergirl',
      format: 'tv-show',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Glee',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Killing Eve',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['Gratuitous Violence']
    },
    {
      title: 'Gypsy',
      format: 'tv-show',
      ending: 'Neutral',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Pretty Little Liars',
      format: 'tv-show',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Everything Sucks',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Atypical',
      format: 'tv-show',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Sense 8',
      format: 'tv-show',
      ending: '?',
      occasions: [],
      triggers: ['?']
    },
    {
      title: 'Skam España',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['none']
    },
    {
      title: 'Gentleman Jack',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['Self-Harm']
    },
    {
      title: 'Euphoria',
      format: 'tv-show',
      ending: 'Neutral',
      occasions: [],
      triggers: ['Addiction','Domestic Abuse', 'Gratuitous Violence','Sexual Violence']
    },
    {
      title: 'Ratched',
      format: 'tv-show',
      ending: 'Happy',
      occasions: [],
      triggers: ['Suicide','Sexual Violence', 'Gratuitous Violence']
    },
  ]
}
