# Memory Palace Project Structure

```
memory-palace/
├── frontend/
│   ├── __tests__/                    # Test files with Vitest
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/                       # Static files
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   └── templates/                # Memory palace map templates
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── auth/
│   │   │   ├── common/              # Shared components
│   │   │   ├── home/
│   │   │   └── memory-palace/       # Memory palace step components
│   │   │       ├── select-info/
│   │   │       ├── chunk-info/
│   │   │       ├── create-images/
│   │   │       ├── create-map/
│   │   │       ├── map-images/
│   │   │       └── test-memory/
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   │   ├── auth/
│   │   │   ├── supabase/
│   │   │   ├── replicate/
│   │   │   └── cheerio/
│   │   ├── store/                   # State management
│   │   │   ├── actions/
│   │   │   ├── reducers/
│   │   │   └── types/
│   │   ├── styles/                  # Global styles
│   │   ├── types/                   # TypeScript types
│   │   └── utils/                   # Utility functions
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── __tests__/                   # Test files
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   ├── controllers/             # Route controllers
│   │   ├── middleware/              # Custom middleware
│   │   ├── models/                  # Database models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   └── utils/                   # Utility functions
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                            # Documentation
├── .gitignore
├── README.md
└── docker-compose.yml               # Docker configuration
